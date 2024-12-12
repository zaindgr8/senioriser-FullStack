import prisma from "../../../utils/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 15;
  const offset = (page - 1) * limit;

  const filters = {
    zip: searchParams.get("zip") || "",
    city: searchParams.get("city") || "",
    state: searchParams.get("state") || "",
    businessName: searchParams.get("businessName") || "",
  };

  const whereConditions = {};

  if (filters.zip) {
    whereConditions["businessDetails"] = {
      some: {
        zip: {
          contains: filters.zip,
        },
      },
    };
  }

  if (filters.city) {
    whereConditions["businessDetails"] = {
      some: {
        city: {
          contains: filters.city,
        },
      },
    };
  }

  if (filters.state) {
    whereConditions["businessDetails"] = {
      some: {
        state: {
          contains: filters.state,
        },
      },
    };
  }

  if (filters.businessName) {
    whereConditions["CommunityName"] = {
      contains: filters.businessName,
      mode: "insensitive",
    };
  }

  try {
    const communityBusinesses = await prisma.communityBusinessinfo.findMany({
      skip: offset,
      take: limit,
      where: whereConditions,
      include: {
        amenities: true,
        businessDetails: true,
        specialties: true,
        pricing: true,
        propertyImages: true,
        userauth: true,
      },
    });

    const total = await prisma.communityBusinessinfo.count({
      where: whereConditions,
    });

    return NextResponse.json({
      data: communityBusinesses,
      total,
      page,
      limit,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
