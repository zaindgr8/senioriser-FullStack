import { NextResponse } from "next/server";
import prisma from "../../../utils/prisma";

export async function POST(request) {
  try {
    const data = await request.json();

    const createdSpecialty = await prisma.communitySpecialties.create({
      data: {
        specialties: data.specialties,
        businessInfoId: parseInt(data.businessInfoId),
      },
    });

    return NextResponse.json({
      message: "Specialty added successfully!",
      createdSpecialty,
    });
  } catch (error) {
    console.error("Error creating specialty:", error);
    return NextResponse.json(
      { message: "Error creating specialty", error },
      { status: 500 }
    );
  }
}
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const businessInfoId = parseInt(searchParams.get("businessInfoId"), 10);

    if (isNaN(businessInfoId)) {
      return NextResponse.json(
        { message: "Invalid businessInfoId" },
        { status: 400 }
      );
    }

    const existingSpecialties = await prisma.communitySpecialties.findFirst({
      where: {
        businessInfoId: businessInfoId,
      },
    });

    if (!existingSpecialties) {
      return NextResponse.json(
        { message: "Specialties not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: existingSpecialties });
  } catch (error) {
    console.error("Error fetching specialties:", error);
    return NextResponse.json(
      { message: "Error fetching specialties", error },
      { status: 500 }
    );
  }
}
export async function PUT(request) {
  try {
    const data = await request.json();

    // Fetch the record's id using businessInfoId
    const existingSpecialty = await prisma.communitySpecialties.findFirst({
      where: {
        businessInfoId: parseInt(data.businessInfoId),
      },
    });

    if (!existingSpecialty) {
      return NextResponse.json(
        { message: "Specialty not found" },
        { status: 404 }
      );
    }

    // Now update the record using the id
    const updatedSpecialty = await prisma.communitySpecialties.update({
      where: {
        id: existingSpecialty.id,
      },
      data: {
        specialties: data.specialties,
      },
    });

    return NextResponse.json({
      message: "Specialty updated successfully!",
      updatedSpecialty,
    });
  } catch (error) {
    console.error("Error updating specialty:", error);
    return NextResponse.json(
      { message: "Error updating specialty", error },
      { status: 500 }
    );
  }
}
