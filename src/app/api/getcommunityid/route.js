import prisma from "../../../utils/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    // Extract the token from cookies
    const token = request.cookies.get("token")?.value;

    // If no token is found, return an unauthorized response
    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "No token found or invalid token" },
        { status: 401 }
      );
    }

    // Verify and decode the JWT token
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    // Extract the userId from the decoded token
    const userauthId = decoded.userId; // Assuming userId is stored in the token

    // Fetch the user from the database using Prisma
    const existingUser = await prisma.userauth.findUnique({
      where: { id: userauthId },
    });

    // If the user is not found, return a 404 error
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch only the community businesses owned by the logged-in user
    const communityBusinesses = await prisma.communityBusinessinfo.findMany({
      where: { userauthId: userauthId }, // Filter by logged-in user's ID
      include: {
        amenities: true,
        businessDetails: true,
        specialties: true,
        pricing: true,
        propertyImages: true,
        userauth: true, // Include the userauth relation if needed
      },
    });

    return NextResponse.json({ data: communityBusinesses });
  } catch (error) {
    console.error("Error fetching community businesses:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
