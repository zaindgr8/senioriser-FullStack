import prisma from "../../../../../utils/prisma"; // Adjust the path based on your project structure
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { communityId, userauthId } = params; // Extract communityId and userauthId from params

  try {
    // Fetch the community business info from the database
    const communityBusiness = await prisma.communityBusinessinfo.findFirst({
      where: {
        id: parseInt(communityId), // Convert communityId to an integer
        userauthId: parseInt(userauthId), // Match with userauthId
      },
      include: {
        amenities: true,
        businessDetails: true,
        specialties: true,
        pricing: true,
        propertyImages: true,
        userauth: {
          include: {
            UserProfile: true, // Include the user's profile with profilePhoto
          },
        },
      },
    });

    // Log the fetched data to verify

    // If no data is found, return a 404 response
    if (!communityBusiness) {
      return NextResponse.json({ error: "No data found" }, { status: 404 });
    }

    // Return the data in a successful response
    return NextResponse.json({ data: communityBusiness });
  } catch (error) {
    // If an error occurs, return a 500 response with the error message
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
