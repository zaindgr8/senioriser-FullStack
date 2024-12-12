import prisma from "../../../utils/prisma"; // Adjust the import path based on your project structure
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    // Get userauthId from query params
    const { searchParams } = new URL(request.url);
    const userauthId = searchParams.get("userauthId");

    if (!userauthId) {
      return NextResponse.json(
        { error: "userauthId is required" },
        { status: 400 }
      );
    }

    // Query the database for the number of accepted sponsor requests and the sponsor names
    const acceptedSponsors = await prisma.sponsorConnectionRequest.findMany({
      where: {
        receiverId: parseInt(userauthId),
        status: "SPONSORED",
      },
      select: {
        sponsor: {
          select: {
            communityBusinessinfos: {
              select: {
                CommunityName: true,
                businessDetails: {
                  select: {
                    image: true,
                  },
                },
              },
            },
            agentBusinessInfos: {
              select: {
                agentName: true,
                agentBusiness: {
                  select: {
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Map over the accepted sponsors to return the required fields
    const sponsors = acceptedSponsors.map((s) => {
      if (s.sponsor.communityBusinessinfos.length > 0) {
        return {
          name: s.sponsor.communityBusinessinfos[0]?.CommunityName || "N/A",
          image:
            s.sponsor.communityBusinessinfos[0]?.businessDetails[0]?.image ||
            null,
        };
      } else if (s.sponsor.agentBusinessInfos.length > 0) {
        return {
          name: s.sponsor.agentBusinessInfos[0]?.agentName || "N/A",
          image:
            s.sponsor.agentBusinessInfos[0]?.agentBusiness[0]?.image || null,
        };
      } else {
        return {
          name: "N/A",
          image: null,
        };
      }
    });

    return NextResponse.json({
      sponsors,
      count: acceptedSponsors.length,
    });
  } catch (error) {
    console.error("Error fetching SPONSOR sponsor count:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
