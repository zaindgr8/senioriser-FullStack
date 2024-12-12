import { NextResponse } from "next/server";
import prisma from "../../../utils/prisma"; // Adjust the path based on your project structure

export async function POST(request) {
  try {
    const {
      agentbusinessInfoId,
      allInsurance,
      dentalInsurance,
      longTermInsurance,
      medicaid,
      medicaidManaged,
      medicare,
      supplemental,
      visionInsurance,
      workersComp,
    } = await request.json();

    const newInsuranceOptions = await prisma.insuranceOptions.create({
      data: {
        agentbusinessInfoId,
        allInsurance,
        dentalInsurance,
        longTermInsurance,
        medicaid,
        medicaidManaged,
        medicare,
        supplemental,
        visionInsurance,
        workersComp,
      },
    });

    return NextResponse.json(newInsuranceOptions, { status: 201 });
  } catch (error) {
    console.error("Error creating insurance options:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const agentbusinessInfoId = searchParams.get("agentbusinessInfoId");

    if (!agentbusinessInfoId) {
      return NextResponse.json(
        { error: "agentbusinessInfoId is required" },
        { status: 400 }
      );
    }

    const insuranceOptions = await prisma.insuranceOptions.findFirst({
      where: { agentbusinessInfoId: parseInt(agentbusinessInfoId) },
    });

    if (!insuranceOptions) {
      return NextResponse.json(
        { error: "Insurance options not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(insuranceOptions);
  } catch (error) {
    console.error("Error fetching insurance options:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const {
      id,
      allInsurance,
      dentalInsurance,
      longTermInsurance,
      medicaid,
      medicaidManaged,
      medicare,
      supplemental,
      visionInsurance,
      workersComp,
    } = await request.json();

    const updatedInsuranceOptions = await prisma.insuranceOptions.update({
      where: { id: parseInt(id) },
      data: {
        allInsurance,
        dentalInsurance,
        longTermInsurance,
        medicaid,
        medicaidManaged,
        medicare,
        supplemental,
        visionInsurance,
        workersComp,
      },
    });

    return NextResponse.json(updatedInsuranceOptions);
  } catch (error) {
    console.error("Error updating insurance options:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
