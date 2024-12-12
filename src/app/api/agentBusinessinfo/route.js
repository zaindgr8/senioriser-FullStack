import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import prisma from "../../../utils/prisma"; // Ensure correct path

// Utility function to verify token and get user ID
const getUserFromToken = async (request) => {
  const token = request.cookies.get("token")?.value;

  if (!token || typeof token !== "string") {
    throw new Error("Invalid or missing token");
  }

  // Decode and verify the JWT token
  const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
  if (!decoded || !decoded.userId) {
    throw new Error("Invalid token");
  }

  // Check if the user exists in the database
  const user = await prisma.userauth.findUnique({
    where: { id: decoded.userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return decoded.userId;
};

// Create a new agent business entry (POST)
export async function POST(request) {
  try {
    const userauthId = await getUserFromToken(request);

    const { agentName, address, businessType, services } = await request.json();

    const agentBusinessinfo = await prisma.agentBusinessinfo.create({
      data: { agentName, address, businessType, services, userauthId },
    });

    return NextResponse.json(agentBusinessinfo);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Fetch the existing agent business data (GET)
export async function GET(request) {
  try {
    const userauthId = await getUserFromToken(request);

    // Find the logged-in user's agent business info
    const agentBusinessinfoList = await prisma.agentBusinessinfo.findMany({
      where: { userauthId }, // Only fetch data belonging to the logged-in user
      include: { userauth: true },
    });

    return NextResponse.json(agentBusinessinfoList);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Update the existing agent business info (PUT)
export async function PUT(request) {
  try {
    const userauthId = await getUserFromToken(request);

    // Extract the fields from the request body, including the ID for updating
    const { agentName, address, businessType, services, agentbusinessInfoId } =
      await request.json();

    if (!agentbusinessInfoId) {
      return NextResponse.json(
        { error: "agentbusinessInfoId is required" },
        { status: 400 }
      );
    }

    // Update the existing AgentBusinessinfo entry
    const updatedAgentBusinessinfo = await prisma.agentBusinessinfo.update({
      where: { id: agentbusinessInfoId },
      data: { agentName, address, businessType, services, userauthId },
    });

    return NextResponse.json(updatedAgentBusinessinfo);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
