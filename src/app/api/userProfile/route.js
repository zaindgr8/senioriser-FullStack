import { NextResponse } from "next/server";
import prisma from "../../../utils/prisma";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    // Get the token from cookies
    const token = request.cookies.get("token")?.value;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "No token found or invalid token" },
        { status: 401 }
      );
    }

    // Decode the token to get the user ID
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    const userauthId = decoded.userId;

    // Parse request body
    const {
      jobTitle,
      startedInIndustry,
      aboutYou,
      education,
      fullName,
      profilePhoto,
      certificatesAndAwards,
    } = await request.json();

    // Create a new user profile with the provided data
    const newUserProfile = await prisma.userProfile.create({
      data: {
        UserauthId: userauthId,
        jobTitle,
        fullName,
        startedInIndustry: startedInIndustry
          ? new Date(startedInIndustry)
          : null,
        aboutYou,
        education,
        profilePhoto,
        certificatesAndAwards,
      },
    });

    // Return a successful response
    return NextResponse.json(newUserProfile, { status: 201 });
  } catch (error) {
    console.error("Error creating user profile:", error);
    return NextResponse.json(
      { error: "Failed to create user profile" },
      { status: 500 }
    );
  }
}
export async function GET(request) {
  try {
    // Fetching the data from the Prisma client
    const agentProfiles = await prisma.userauth.findMany({
      where: {
        userType: "AGENT", // Filtering to include only 'AGENT' users
      },
      select: {
        id: true,
        fullName: true,
        UserProfile: {
          select: {
            jobTitle: true,
            profilePhoto: true,
          },
        },
      },
    });

    // Returning the fetched data as a JSON response
    return NextResponse.json({ data: agentProfiles });
  } catch (error) {
    console.error("Error fetching agent profiles:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    // Get the token from cookies
    const token = request.cookies.get("token")?.value;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "No token found or invalid token" },
        { status: 401 }
      );
    }

    // Decode the token to get the user ID
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const userauthId = decoded.userId;

    // Parse request body to get updated profile data
    const {
      jobTitle,
      startedInIndustry,
      aboutYou,
      education,
      profilePhoto,
      certificatesAndAwards,
    } = await request.json();

    // Fetch the existing user profile
    const existingProfile = await prisma.userProfile.findFirst({
      where: { UserauthId: userauthId },
    });

    if (!existingProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Update the user profile
    const updatedProfile = await prisma.userProfile.update({
      where: { id: existingProfile.id }, // Use the unique 'id' field
      data: {
        jobTitle,
        startedInIndustry: startedInIndustry
          ? new Date(startedInIndustry)
          : null,
        aboutYou,
        education,
        profilePhoto,
        certificatesAndAwards,
      },
    });

    // Return the updated profile data
    return NextResponse.json(updatedProfile, { status: 200 });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update user profile" },
      { status: 500 }
    );
  }
}
