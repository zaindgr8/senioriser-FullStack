import prisma from "../../../utils/prisma"; // Adjust the import path based on your project structure
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request) {
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
    const senderId = decoded.userId;

    // Get the receiverId and status from the request body
    const { receiverId, status } = await request.json();

    // Prevent sending a connection request to oneself
    if (senderId === receiverId) {
      return NextResponse.json(
        { error: "You cannot send a connection request to yourself." },
        { status: 400 }
      );
    }

    // Create the new connection request
    const newConnectionRequest = await prisma.agentConnectionRequest.create({
      data: {
        senderId,
        receiverId,
        status: status || "PENDING", // Default status to 'PENDING' if not provided
      },
    });

    return NextResponse.json(newConnectionRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating connection request:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
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

    // Query the Prisma client for received connections
    const receivedConnections = await prisma.agentConnectionRequest.findMany({
      where: {
        receiverId: userId, // Fetch only where the logged-in user is the receiver
      },
      include: {
        sender: true, // Include the sender's details
      },
    });

    return NextResponse.json(receivedConnections, { status: 200 });
  } catch (error) {
    console.error("Error retrieving received connection requests:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
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

    // Extract connectionId and new status from the request body
    const { connectionId, newStatus } = await request.json();

    // Validate that newStatus is one of the allowed values
    if (!["PENDING", "ACCEPTED", "DECLINED"].includes(newStatus)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    // Update the connection request status in the database
    const updatedConnection = await prisma.agentConnectionRequest.update({
      where: { id: connectionId },
      data: {
        status: newStatus,
        updatedAt: new Date(), // Update the updatedAt field
      },
    });

    return NextResponse.json(updatedConnection, { status: 200 });
  } catch (error) {
    console.error("Error updating connection request status:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
