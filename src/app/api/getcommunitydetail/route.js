import prisma from "../../../utils/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const communityBusiness = await prisma.communityBusinessinfo.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        amenities: true,
        businessDetails: true,
        specialties: true,
        pricing: true,
        propertyImages: true,
        userauth: true,
      },
    });

    if (!communityBusiness) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: communityBusiness });
  } catch (error) {
    console.error("Error fetching community details:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
