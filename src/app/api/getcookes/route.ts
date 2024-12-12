import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "../../../utils/prisma";

export async function GET(request: NextRequest) {
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

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
