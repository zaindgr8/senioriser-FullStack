import prisma from "../../../../../utils/prisma"; // Adjust the path based on your project structure
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { agentId, userauthId } = params; // Extract agentId and userauthId from params

  try {
    // Fetch the agent business info from the database including UserProfile
    const agentBusiness = await prisma.agentBusinessinfo.findFirst({
      where: {
        id: parseInt(agentId), // Convert agentId to an integer
        userauthId: parseInt(userauthId), // Match with userauthId
      },
      include: {
        agentBusiness: true, // Include AgentBusinessDetails relation
        images: true, // Include AgentImage relation
        insurance: true, // Include InsuranceOptions relation
        paymentOptions: true, // Include PaymentOptions relation
        userauth: {
          include: {
            UserProfile: true, // Include the user's profile with profilePhoto
          },
        },
      },
    });

    // If no data is found, return a 404 response
    if (!agentBusiness) {
      return NextResponse.json({ error: "No data found" }, { status: 404 });
    }

    // Return the data in a successful response
    return NextResponse.json({ data: agentBusiness });
  } catch (error) {
    // If an error occurs, return a 500 response with the error message
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
