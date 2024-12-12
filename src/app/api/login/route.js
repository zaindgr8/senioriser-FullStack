import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "../../../utils/prisma";

export async function POST(request) {
  try {
    const requestBody = await request.json();
    const { email, password, userType } = requestBody; // Get the userType from the request

    // Check if the user exists and retrieve the userType
    const user = await prisma.userauth.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true, // Select password for comparison
        userType: true, // Include userType for validation
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    // Check if the provided password matches the stored password
    if (password !== user.password) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    // Check if the provided userType matches the stored userType
    if (userType !== user.userType) {
      return NextResponse.json({ error: "Invalid user type" }, { status: 400 });
    }

    // Create token data
    const tokenData = {
      userId: user.id,
      email: user.email,
      userType: user.userType, // Include userType in token data
    };

    // Create a JWT token
    const jwtToken = jwt.sign(tokenData, process.env.TOKEN_SECRET, {
      expiresIn: "30d",
    });

    // Create a response with the token
    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });

    // Set the JWT token in the cookies
    response.cookies.set("token", jwtToken, { httpOnly: true });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
