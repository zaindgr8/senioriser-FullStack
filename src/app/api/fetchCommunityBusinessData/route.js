import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "../../../utils/prisma"; // Adjust the import path based on your project structure

export async function GET(request) {
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

    // Fetch only CommunityName, address, and communityType for the authenticated user
    const communityBusinessInfo = await prisma.communityBusinessinfo.findFirst({
      where: { userauthId },
      select: {
        CommunityName: true,
        address: true,
        communityType: true,
      },
    });

    if (!communityBusinessInfo) {
      return NextResponse.json(
        { error: "No community business found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: communityBusinessInfo });
  } catch (error) {
    console.error("Error fetching community business:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
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

    // Get the request body data
    const reqBody = await request.json();
    const { CommunityName, address, communityType } = reqBody;

    // Find the community business to update
    const existingCommunityBusiness =
      await prisma.communityBusinessinfo.findFirst({
        where: {
          userauthId,
          CommunityName,
        },
      });

    if (!existingCommunityBusiness) {
      return NextResponse.json(
        { error: "Community business not found" },
        { status: 404 }
      );
    }

    // Update the community business info
    const updatedCommunityBusiness = await prisma.communityBusinessinfo.update({
      where: {
        id: existingCommunityBusiness.id,
      },
      data: {
        CommunityName,
        address,
        communityType,
      },
    });

    return NextResponse.json({ data: updatedCommunityBusiness });
  } catch (error) {
    console.error("Error updating community business:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
