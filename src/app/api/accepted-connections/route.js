import prisma from "../../../utils/prisma"; // Adjust the import path based on your project structure
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Get userauthId from request query parameters
    const { searchParams } = new URL(request.url);
    const userauthId = searchParams.get("userauthId");

    if (!userauthId) {
      return NextResponse.json(
        { error: "userauthId is required" },
        { status: 400 }
      );
    }

    // Query for the number of accepted connections
    const acceptedConnectionsCount = await prisma.agentConnectionRequest.count({
      where: {
        receiverId: parseInt(userauthId),
        status: "ACCEPTED",
      },
    });

    return NextResponse.json(
      { count: acceptedConnectionsCount },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving accepted connection count:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
