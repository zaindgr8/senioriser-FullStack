import prisma from "../../../utils/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
export async function GET(request) {
  try {
    const communityBusinesses = await prisma.communityBusinessinfo.findMany({
      include: {
        amenities: true,
        businessDetails: true,
        specialties: true,
        pricing: true,
        propertyImages: true, // Ensure this is correctly populated
        userauth: true,
      },
    });

    // Log to verify the data structure

    return NextResponse.json({ data: communityBusinesses });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "No token found or invalid token" },
        { status: 401 }
      );
    }

    // Decode the token to get user ID
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    const userauthId = decoded.userId; // Assuming userId is stored in the token

    // Validate that the user exists
    const existingUser = await prisma.userauth.findUnique({
      where: { id: userauthId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const reqBody = await request.json();
    const {
      CommunityName,
      address,
      communityType,
      businessDetails,
      amenities,
      specialties,
      pricing,
      propertyImages,
    } = reqBody;

    const newCommunityBusiness = await prisma.communityBusinessinfo.create({
      data: {
        CommunityName,
        address,
        communityType,
        businessDetails: {
          create: businessDetails,
        },
        amenities: {
          create: amenities,
        },
        specialties: {
          create: specialties,
        },
        pricing: {
          create: pricing,
        },
        propertyImages: {
          create: propertyImages,
        },
        userauthId, // This should be within the data object
      },
      include: {
        amenities: true,
        businessDetails: true,
        specialties: true,
        pricing: true,
        propertyImages: true,
      },
    });

    return NextResponse.json({ data: newCommunityBusiness });
  } catch (error) {
    console.error("Error in creating community business:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
