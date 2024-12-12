import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
const gmailUser = process.env.GMAIL_USER as string;
const gmailPassword = process.env.GMAIL_PASSWORD as string;
if (!gmailUser || !gmailPassword) {
  throw new Error(
    "Required environment variables GMAIL_USER or GMAIL_PASSWORD are not set."
  );
}
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailUser,
    pass: gmailPassword,
  },
});
function loadTemplate(templateName: string, data: any): string {
  const templatePath = path.join(
    process.cwd(),
    "public/email-templates",
    `${templateName}`
  );
  let templateContent = fs.readFileSync(templatePath, "utf8");
  Object.keys(data).forEach((key) => {
    templateContent = templateContent.replace(
      new RegExp(`{${key}}`, "g"),
      data[key]
    );
  });

  return templateContent;
}
export async function sendEmail(
  recipientEmail: string,
  subject: string,
  data: any,
  templateName: string
) {
  const htmlContent = loadTemplate(templateName, data);
  if (!transporter) {
    throw new Error("Transporter is not defined.");
  }
  try {
    const info = await transporter.sendMail({
      from: `"Seniorisers" <${gmailUser}>`,
      to: recipientEmail,
      subject: subject,
      html: htmlContent,
    });
  } catch (error) {
    console.error("Error sending email", error);
    throw error;
  }
}

const messageFromClient = (data: any) => {
  return `
    <html>
      <body>
        <h2>Contact Us</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone Number:</strong> ${data.phoneNo}</p>
        <p><strong>Address:</strong> ${data.address}</p>
        <p><strong>Country:</strong> ${data.country}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
      </body>
    </html>
  `;
};

export async function ContactUsEmailSend(
  fromEmail: string,
  data: any
  // templateName: string
) {
  const htmlContent = messageFromClient(data);
  if (!transporter) {
    throw new Error("Transporter is not defined.");
  }
  try {
    const info = await transporter.sendMail({
      from: `"manningcompany" <${fromEmail}>`,
      to: process.env.CONTACT_EMAIL,
      subject: `Message from <${data.name}> Client`,
      html: htmlContent,
    });
  } catch (error) {
    console.error("Error sending email", error);
    throw error;
  }
}

const messageFromAppointment = (data: any) => {
  return `
    <html>
      <body>
        <h2>${data.heading}</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone Number:</strong> ${data.phoneNo}</p>
        <p><strong>Date:</strong> ${data.date}</p>
        <p><strong>Time:</strong> ${data.time}</p>
        <p><strong>Hear About Us:</strong> ${data.hearAboutUs}</p>
        <p><strong>Location:</strong> ${data.location}</p>
        <p><strong>Address:</strong> ${data.address}</p>
        <p><strong>Comment:</strong>${data.comment ? data.comment : ""}</p>
      </body>
    </html>
  `;
};

export async function AppointmentEmailSend(
  fromEmail: string,
  data: any
  // templateName: string
) {
  const htmlContent = messageFromAppointment(data);
  if (!transporter) {
    throw new Error("Transporter is not defined.");
  }
  try {
    const info = await transporter.sendMail({
      from: `"manningcompany" <${fromEmail}>`,
      to: process.env.CONTACT_EMAIL,
      subject: `Message from <${data.name}> Client`,
      html: htmlContent,
    });
  } catch (error) {
    console.error("Error sending email", error);
    throw error;
  }
}
