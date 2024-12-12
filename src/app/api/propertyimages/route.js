import { NextResponse } from "next/server";
import prisma from "../../../utils/prisma";

export async function POST(request) {
  try {
    const { images, businessInfoId } = await request.json();

    const newPropertyImage = await prisma.propertyImages.create({
      data: {
        image: images,
        businessInfo: {
          connect: { id: businessInfoId },
        },
      },
    });

    return NextResponse.json({ data: newPropertyImage });
  } catch (error) {
    console.error("Error creating property images:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { images, businessInfoId } = await request.json();

    if (!businessInfoId || !images || !images.length) {
      throw new Error("Invalid input data");
    }

    // Delete existing images associated with the businessInfoId
    await prisma.propertyImages.deleteMany({
      where: { businessInfoId },
    });

    // Create new images
    const updatedPropertyImages = await prisma.propertyImages.create({
      data: {
        image: images,
        businessInfo: {
          connect: { id: businessInfoId },
        },
      },
    });

    return NextResponse.json({ data: updatedPropertyImages });
  } catch (error) {
    console.error("Error updating property images:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const businessInfoId = parseInt(searchParams.get("businessInfoId"), 10);

    if (!businessInfoId) {
      throw new Error("Invalid businessInfoId");
    }

    const propertyImages = await prisma.propertyImages.findMany({
      where: { businessInfoId },
    });

    return NextResponse.json({ data: propertyImages });
  } catch (error) {
    console.error("Error fetching property images:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const imageId = parseInt(searchParams.get("imageId"), 10);

    if (!imageId) {
      throw new Error("Invalid imageId");
    }

    const deletedImage = await prisma.propertyImages.delete({
      where: { id: imageId },
    });

    return NextResponse.json({ data: deletedImage });
  } catch (error) {
    console.error("Error deleting property image:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
