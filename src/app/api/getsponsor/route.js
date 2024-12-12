import prisma from "../../../utils/prisma"; // Adjust the import path based on your project structure
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    // Retrieve the token from cookies
    const token = request.cookies.get("token")?.value;
    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "No token found or invalid token" },
        { status: 401 }
      );
    }

    // Decode the token to get the user ID
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decoded.userId; // Assuming `userId` is stored in the token

    // Fetch sponsor connections where the sponsorId matches the logged-in user
    const sponsorConnections = await prisma.sponsorConnectionRequest.findMany({
      where: {
        sponsorId: userId, // Filter by the logged-in user's ID
      },
      include: {
        receiver: {
          include: {
            communityBusinessinfos: true, // Include community info for the receiver
          },
        },
      },
    });

    // Return the filtered sponsor connections
    return NextResponse.json({ sponsorConnections }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving sponsor connection requests:", error);
    return NextResponse.json(
      { error: "Failed to retrieve sponsor connection requests" },
      { status: 500 }
    );
  }
}
