// app/api/getUserProfile/route.js
import { NextResponse } from "next/server";
import prisma from "../../../utils/prisma"; // Adjust the path according to your project structure

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get("id")); // Assuming you're passing the user ID as a query parameter

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await prisma.userauth.findUnique({
      where: { id: userId }, // Add the where clause to find the user by ID
      include: {
        agentBusinessInfos: {
          select: { id: true }, // Only select the id from agentBusinessInfos
        },
        communityBusinessinfos: {
          select: { id: true }, // Only select the id from communityBusinessinfos
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Extracting only the necessary IDs
    const responseData = {
      agentBusinessInfos: user.agentBusinessInfos,
      communityBusinessinfos: user.communityBusinessinfos,
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
