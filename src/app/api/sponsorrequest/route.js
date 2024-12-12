import prisma from "../../../utils/prisma"; // Adjust the import path based on your project structure
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request) {
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
    const sponsorId = decoded.userId; // Assuming `userId` is stored in the token

    // Validate that the user exists
    const user = await prisma.userauth.findUnique({
      where: { id: sponsorId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse the request body to get sponsor connection details
    const { receiverId, status } = await request.json();

    if (!receiverId) {
      return NextResponse.json(
        { error: "Receiver ID is required" },
        { status: 400 }
      );
    }

    // Check if the sponsor connection already exists
    const existingConnection = await prisma.sponsorConnectionRequest.findFirst({
      where: {
        sponsorId,
        receiverId,
      },
    });

    if (existingConnection) {
      return NextResponse.json(
        { error: "Sponsorship request already exists" },
        { status: 409 }
      );
    }

    // Create the sponsor connection request
    const newSponsorConnection = await prisma.sponsorConnectionRequest.create({
      data: {
        sponsorId,
        receiverId,
        status: status || "PENDING", // Default status to 'PENDING'
      },
    });

    // Return the created sponsor connection request as a response
    return NextResponse.json(newSponsorConnection, { status: 201 });
  } catch (error) {
    console.error("Error creating sponsor connection request:", error);
    return NextResponse.json(
      { error: "Failed to create sponsor connection request" },
      { status: 500 }
    );
  }
}

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

    // Validate that the user exists
    const user = await prisma.userauth.findUnique({
      where: { id: userauthId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch sponsor connection requests for the logged-in user
    const sponsorConnections = await prisma.sponsorConnectionRequest.findMany({
      where: {
        receiverId: userauthId, // Only get sponsor requests where current user is the receiver
      },
      include: {
        sponsor: true,
      },
    });

    // Return the current user and the sponsor connections
    return NextResponse.json({ user, sponsorConnections }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving sponsor connection requests:", error);
    return NextResponse.json(
      { error: "Failed to retrieve sponsor connection requests" },
      { status: 500 }
    );
  }
}
export async function PUT(request) {
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

    // Validate that the user exists
    const user = await prisma.userauth.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse the request body to get the sponsorship ID and new status
    const { sponsorshipId, status } = await request.json();

    if (!sponsorshipId || !["APPROVED", "DECLINED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid sponsorship ID or status" },
        { status: 400 }
      );
    }

    // Update the sponsor connection request status
    const updatedSponsorship = await prisma.sponsorConnectionRequest.update({
      where: { id: sponsorshipId },
      data: { status },
    });

    // Return the updated sponsor connection request as a response
    return NextResponse.json(updatedSponsorship, { status: 200 });
  } catch (error) {
    console.error("Error updating sponsor connection request:", error);
    return NextResponse.json(
      { error: "Failed to update sponsor connection request" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    // Parse the request to get sponsor connection ID directly from the URL
    const { searchParams } = new URL(request.url);
    const sponsorConnectionId = parseInt(searchParams.get("id"), 10); // Convert to Int

    if (!sponsorConnectionId) {
      return NextResponse.json(
        { error: "Sponsorship connection ID is required" },
        { status: 400 }
      );
    }

    // Attempt to delete the sponsor connection
    const deletedSponsorConnection =
      await prisma.sponsorConnectionRequest.delete({
        where: { id: sponsorConnectionId },
      });

    // Return success response if deletion was successful
    return NextResponse.json(deletedSponsorConnection, { status: 200 });
  } catch (error) {
    if (error.code === "P2025") {
      // Handle the case where the record doesn't exist
      return NextResponse.json(
        { error: "Record to delete does not exist" },
        { status: 404 }
      );
    }

    // Handle other errors
    console.error("Error deleting sponsor connection:", error);
    return NextResponse.json(
      { error: "Failed to delete sponsor connection" },
      { status: 500 }
    );
  }
}
