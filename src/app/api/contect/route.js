import { NextResponse } from "next/server";
import { sendEmail } from "../../../utils/mailer";
export async function POST(request) {
  const { email, message, name, phone } = await request.json();
  const recipientEmail = process.env.CONTACT_EMAIL;
  const subject = `Message from ${email}`;
  const templateName = "contact.html";
  const data = { email, message, name, phone };
  try {
    await sendEmail(recipientEmail, subject, data, templateName);
    return NextResponse.json({ message: "Success!", status: 200 });
  } catch (err) {
    console.error("Error sending email", err);
    return NextResponse.json({ message: "Failed!", status: 500 });
  }
}
