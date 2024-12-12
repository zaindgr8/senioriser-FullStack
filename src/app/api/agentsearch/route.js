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
    agentName: searchParams.get("agentName") || "",
  };

  const whereConditions = {};

  if (filters.zip) {
    whereConditions["agentBusiness"] = {
      some: {
        zip: {
          contains: filters.zip,
        },
      },
    };
  }

  if (filters.city) {
    whereConditions["agentBusiness"] = {
      some: {
        city: {
          contains: filters.city,
        },
      },
    };
  }

  if (filters.state) {
    whereConditions["agentBusiness"] = {
      some: {
        state: {
          contains: filters.state,
        },
      },
    };
  }

  if (filters.agentName) {
    whereConditions["agentName"] = {
      contains: filters.agentName,
      mode: "insensitive", // Case-insensitive search
    };
  }

  try {
    const agentBusinesses = await prisma.agentBusinessinfo.findMany({
      skip: offset,
      take: limit,
      where: whereConditions,
      include: {
        agentBusiness: true,
        images: true,
        insurance: true,
        paymentOptions: true,
        userauth: true,
      },
    });

    const total = await prisma.agentBusinessinfo.count({
      where: whereConditions,
    });

    return NextResponse.json({
      data: agentBusinesses,
      total,
      page,
      limit,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
