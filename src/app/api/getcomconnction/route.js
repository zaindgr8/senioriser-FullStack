import prisma from "../../../utils/prisma"; // Adjust the import path based on your project structure
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    // Extract the token from cookies
    const token = request.cookies.get("token")?.value;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "No token found or invalid token" },
        { status: 401 }
      );
    }

    // Decode the token to get the logged-in user's ID
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decoded.userId;

    // Query the Prisma client for sent connections
    const sentConnections = await prisma.communityConnectionRequest.findMany({
      where: {
        senderId: userId, // Fetch only where the logged-in user is the sender
      },
      include: {
        receiver: true, // Include the receiver's details
      },
    });

    return NextResponse.json(sentConnections, { status: 200 });
  } catch (error) {
    console.error("Error retrieving sent connection requests:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
