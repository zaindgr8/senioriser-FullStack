import prisma from "../../../utils/prisma";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(request) {
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

    // Fetch the user profile using `findFirst` instead of `findUnique`
    const userProfile = await prisma.userProfile.findFirst({
      where: { UserauthId: userauthId }, // Use findFirst for non-unique fields
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Return the user profile data
    return NextResponse.json(userProfile, { status: 200 });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
