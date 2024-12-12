import prisma from "../../../utils/prisma"; // Adjust the import path if necessary
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { fullName, email, password, userType } = reqBody;

    // Check if user already exists
    const existingUser = await prisma.userauth.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Create new user without hashing the password
    const newUser = await prisma.userauth.create({
      data: {
        fullName,
        email,
        password, // Password is stored as plain text
        userType,
      },
    });

    // Send verification email (this part is assumed and not shown)

    return NextResponse.json({
      message: "User created successfully",
      success: true,
      user: newUser,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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

    // Verify and decode the token to get the user ID
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const userauthId = decoded.userId;

    // Fetch the logged-in user's data
    const user = await prisma.userauth.findUnique({
      where: { id: userauthId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return the logged-in user's data
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "No token found or invalid token" },
        { status: 401 }
      );
    }

    // Verify and decode the token to get the user ID
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const userauthId = decoded.userId;

    // Get the request body data
    const reqBody = await request.json();
    const { fullName, email, password, userType } = reqBody;

    // Check if user exists
    const existingUser = await prisma.userauth.findUnique({
      where: { id: userauthId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update the user's data
    const updatedUser = await prisma.userauth.update({
      where: { id: userauthId },
      data: {
        fullName: fullName || existingUser.fullName,
        email: email || existingUser.email,
        password: password || existingUser.password, // Ideally, the password should be hashed here
        userType: userType || existingUser.userType,
      },
    });

    return NextResponse.json({
      message: "User updated successfully",
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
