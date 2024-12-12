import prisma from "../../../utils/prisma";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../../utils/mailer";

import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { email } = reqBody;

    const user = await prisma.userauth.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }

    // Generate token
    const token = await jwt.sign(
      { userId: user.id },
      process.env.TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const templateName = "password_reset_email_template.html";
    const subject = "Password Reset"; // Provide a subject for the email

    // Send password reset email
    await sendEmail(
      email,
      subject,
      { domsn: process.env.DOMAIN, token },
      templateName
    );

    return NextResponse.json({
      message: "Password set email sent successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
