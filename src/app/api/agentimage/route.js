import { NextResponse } from "next/server";
import prisma from "../../../utils/prisma";

// POST: Create new agent images
export async function POST(request) {
  try {
    const { images, agentbusinessInfoId } = await request.json();

    // Ensure that the business info ID and images are valid
    if (!agentbusinessInfoId || !images || !images.length) {
      throw new Error("Invalid input data");
    }

    // Create new agent images
    const newAgentImages = await prisma.agentImage.create({
      data: {
        image: images, // Array of images (URLs or base64 strings)
        agentbusinessInfo: {
          connect: { id: agentbusinessInfoId },
        },
      },
    });

    return NextResponse.json({ data: newAgentImages });
  } catch (error) {
    console.error("Error creating agent images:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
// GET: Fetch agent images by agentbusinessInfoId
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const agentbusinessInfoId = parseInt(
      searchParams.get("agentbusinessInfoId"),
      10
    );

    if (!agentbusinessInfoId) {
      throw new Error("Invalid agentbusinessInfoId");
    }

    // Fetch all agent images for the given business info ID
    const agentImages = await prisma.agentImage.findMany({
      where: { agentbusinessInfoId },
    });

    return NextResponse.json({ data: agentImages });
  } catch (error) {
    console.error("Error fetching agent images:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
// PUT: Update agent images by agentbusinessInfoId
export async function PUT(request) {
  try {
    const { images, agentbusinessInfoId } = await request.json();

    if (!agentbusinessInfoId || !images || !images.length) {
      throw new Error("Invalid input data");
    }

    // Delete existing images associated with the business info ID
    await prisma.agentImage.deleteMany({
      where: { agentbusinessInfoId },
    });

    // Create new images
    const updatedAgentImages = await prisma.agentImage.create({
      data: {
        image: images,
        agentbusinessInfo: {
          connect: { id: agentbusinessInfoId },
        },
      },
    });

    return NextResponse.json({ data: updatedAgentImages });
  } catch (error) {
    console.error("Error updating agent images:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
// DELETE: Delete an agent image by imageId
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const imageId = parseInt(searchParams.get("imageId"), 10);

    if (!imageId) {
      throw new Error("Invalid imageId");
    }

    // Delete the agent image by its ID
    const deletedImage = await prisma.agentImage.delete({
      where: { id: imageId },
    });

    return NextResponse.json({ data: deletedImage });
  } catch (error) {
    console.error("Error deleting agent image:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
