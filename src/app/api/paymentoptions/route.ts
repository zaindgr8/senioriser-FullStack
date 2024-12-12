import { NextResponse } from "next/server";
import prisma from "../../../utils/prisma";

export async function POST(request) {
  try {
    const {
      agentBusinessInfoId,
      visa,
      mastercard,
      amex,
      discover,
      paypal,
      applepay,
      skrill,
      venmo,
      googlepay,
      cash,
      checks,
      moneyorder,
    } = await request.json();

    const newPaymentOptions = await prisma.paymentOptions.create({
      data: {
        agentBusinessInfoId,
        visa,
        mastercard,
        amex,
        discover,
        paypal,
        applepay,
        skrill,
        venmo,
        googlepay,
        cash,
        checks,
        moneyorder,
      },
    });

    return NextResponse.json(newPaymentOptions, { status: 201 });
  } catch (error) {
    console.error("Error creating payment options:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const agentBusinessInfoId = searchParams.get("agentBusinessInfoId");

    if (!agentBusinessInfoId) {
      return NextResponse.json(
        { error: "agentBusinessInfoId is required" },
        { status: 400 }
      );
    }

    const paymentOptions = await prisma.paymentOptions.findFirst({
      where: { agentBusinessInfoId: parseInt(agentBusinessInfoId) },
    });

    if (!paymentOptions) {
      return NextResponse.json(
        { error: "Payment options not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(paymentOptions);
  } catch (error) {
    console.error("Error fetching payment options:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const {
      id,
      visa,
      mastercard,
      amex,
      discover,
      paypal,
      applepay,
      skrill,
      venmo,
      googlepay,
      cash,
      checks,
      moneyorder,
    } = await request.json();

    const updatedPaymentOptions = await prisma.paymentOptions.update({
      where: { id: parseInt(id) },
      data: {
        visa,
        mastercard,
        amex,
        discover,
        paypal,
        applepay,
        skrill,
        venmo,
        googlepay,
        cash,
        checks,
        moneyorder,
      },
    });

    return NextResponse.json(updatedPaymentOptions);
  } catch (error) {
    console.error("Error updating payment options:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
