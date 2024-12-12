import { NextResponse } from "next/server";
import prisma from "../../../utils/prisma";

export async function POST(request) {
  try {
    const data = await request.json();
    const { amenities, businessInfoId } = data;

    if (!businessInfoId || !Array.isArray(amenities)) {
      return NextResponse.json(
        { error: "Invalid data provided" },
        { status: 400 }
      );
    }

    const newCommunityAmenities = await prisma.communityAmenities.create({
      data: {
        amenities: amenities,
        businessInfoId: businessInfoId,
      },
    });

    return NextResponse.json({ data: newCommunityAmenities }, { status: 201 });
  } catch (error) {
    console.error("Error creating community amenities:", error);
    return NextResponse.json(
      { error: "Failed to create community amenities" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const { businessInfoId, amenities } = data;

    // Find the community amenities record using businessInfoId
    const existingAmenities = await prisma.communityAmenities.findFirst({
      where: { businessInfoId },
    });

    if (!existingAmenities) {
      return NextResponse.json(
        { error: "Community amenities not found" },
        { status: 404 }
      );
    }

    // Perform the update using the retrieved record's id
    const updatedCommunityAmenities = await prisma.communityAmenities.update({
      where: { id: existingAmenities.id }, // Use the unique id here
      data: { amenities },
    });

    return NextResponse.json(
      { data: updatedCommunityAmenities },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating community amenities:", error);
    return NextResponse.json(
      { error: "Failed to update community amenities" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const businessInfoId = parseInt(searchParams.get("businessInfoId"));

  try {
    const communityAmenities = await prisma.communityAmenities.findFirst({
      where: {
        businessInfoId: businessInfoId,
      },
    });

    if (!communityAmenities) {
      return NextResponse.json({ data: null }, { status: 404 });
    }

    return NextResponse.json({ data: communityAmenities }, { status: 200 });
  } catch (error) {
    console.error("Error fetching community amenities:", error);
    return NextResponse.json(
      { error: "Failed to fetch community amenities" },
      { status: 500 }
    );
  }
}
