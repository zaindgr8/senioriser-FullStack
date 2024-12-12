import prisma from "../../../utils/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const businessInfoId = parseInt(searchParams.get("businessInfoId"), 10);

    if (isNaN(businessInfoId)) {
      return NextResponse.json(
        { error: "Invalid businessInfoId" },
        { status: 400 }
      );
    }

    const communityPricing = await prisma.communityPricing.findFirst({
      where: { businessInfoId },
    });

    if (!communityPricing) {
      return NextResponse.json(
        { error: "Community pricing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: communityPricing });
  } catch (error) {
    console.error("Error fetching community pricing:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function POST(request) {
  try {
    const { pricing, payments, businessInfoId } = await request.json();

    if (!businessInfoId) {
      throw new Error("Invalid businessInfoId");
    }

    const newCommunityPricing = await prisma.communityPricing.create({
      data: {
        pricing,
        payments,
        businessInfo: {
          connect: { id: parseInt(businessInfoId, 10) },
        },
      },
    });

    return NextResponse.json({ data: newCommunityPricing }, { status: 201 });
  } catch (error) {
    console.error("Error creating community pricing:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function PUT(request) {
  try {
    const { pricing, payments, businessInfoId } = await request.json();

    if (!businessInfoId) {
      throw new Error("Invalid businessInfoId");
    }

    // Find the existing record using businessInfoId
    const existingPricing = await prisma.communityPricing.findFirst({
      where: { businessInfoId: parseInt(businessInfoId, 10) },
    });

    if (!existingPricing) {
      return NextResponse.json(
        { error: "Community pricing not found" },
        { status: 404 }
      );
    }

    // Perform the update using the unique `id`
    const updatedCommunityPricing = await prisma.communityPricing.update({
      where: { id: existingPricing.id },
      data: {
        pricing,
        payments,
      },
    });

    return NextResponse.json({ data: updatedCommunityPricing });
  } catch (error) {
    console.error("Error updating community pricing:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
