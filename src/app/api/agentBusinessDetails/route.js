import { NextResponse } from "next/server";
import prisma from "../../../utils/prisma"; // Adjust the path based on your project structure
import jwt from "jsonwebtoken";

// POST API to create new agent business details
export async function POST(request) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "No token found or invalid token" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const userauthId = decoded.userId;

    const {
      dba,
      yearFounded,
      license,
      country,
      city,
      state,
      zip,
      website,
      image,
      primaryPhone,
      ext,
      cellPhone,
      fax,
      link1,
      link2,
      link3,
      link4,
      Corporation,
      Status,
      companyOverview,
      agentbusinessInfoId, // This should reference an existing AgentBusinessinfo record
    } = await request.json();

    if (!agentbusinessInfoId) {
      return NextResponse.json(
        { error: "agentbusinessInfoId is required" },
        { status: 400 }
      );
    }

    const agentBusinessDetails = await prisma.agentBusinessDetails.create({
      data: {
        dba,
        yearFounded,
        license,
        country,
        city,
        state,
        zip,
        website,
        image,
        primaryPhone,
        ext,
        cellPhone,
        fax,
        Corporation,
        Status,
        link1,
        link2,
        link3,
        link4,
        companyOverview,
        agentbusinessInfo: {
          connect: { id: parseInt(agentbusinessInfoId) }, // Ensure ID is passed as an integer
        },
        userauthId, // Store the user ID for tracking purposes
      },
    });

    return NextResponse.json(agentBusinessDetails, { status: 201 });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET API to fetch agent business details
export async function GET(request) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "No token found or invalid token" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const userauthId = decoded.userId;

    const { searchParams } = new URL(request.url);
    const agentbusinessInfoId = searchParams.get("agentbusinessInfoId");

    if (!agentbusinessInfoId) {
      return NextResponse.json(
        { error: "agentbusinessInfoId is required" },
        { status: 400 }
      );
    }

    const agentBusinessDetails = await prisma.agentBusinessDetails.findMany({
      where: { agentbusinessInfoId: parseInt(agentbusinessInfoId), userauthId }, // Ensure ID is passed as an integer
      include: { agentbusinessInfo: true },
    });

    return NextResponse.json({ data: agentBusinessDetails });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT API to update existing agent business details
export async function PUT(request) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "No token found or invalid token" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const userauthId = decoded.userId;

    const {
      id,
      dba,
      yearFounded,
      license,
      country,
      city,
      state,
      zip,
      website,
      image,
      primaryPhone,
      ext,
      cellPhone,
      fax,
      Corporation,
      Status,
      link1,
      link2,
      link3,
      link4,
      companyOverview,
      agentbusinessInfoId,
    } = await request.json();

    if (!id || !agentbusinessInfoId) {
      return NextResponse.json(
        { error: "Both id and agentbusinessInfoId are required" },
        { status: 400 }
      );
    }

    const existingBusinessDetails =
      await prisma.agentBusinessDetails.findUnique({
        where: { id: parseInt(id), userauthId },
      });

    if (!existingBusinessDetails) {
      return NextResponse.json(
        { error: "Business details not found" },
        { status: 404 }
      );
    }

    const updatedBusinessDetails = await prisma.agentBusinessDetails.update({
      where: { id: parseInt(id) },
      data: {
        dba: dba || existingBusinessDetails.dba,
        yearFounded: yearFounded || existingBusinessDetails.yearFounded,
        license: license || existingBusinessDetails.license,
        country: country || existingBusinessDetails.country,
        city: city || existingBusinessDetails.city,
        state: state || existingBusinessDetails.state,
        zip: zip || existingBusinessDetails.zip,
        website: website || existingBusinessDetails.website,
        image: image || existingBusinessDetails.image,
        primaryPhone: primaryPhone || existingBusinessDetails.primaryPhone,
        ext: ext || existingBusinessDetails.ext,
        cellPhone: cellPhone || existingBusinessDetails.cellPhone,
        fax: fax || existingBusinessDetails.fax,
        link1: link1 || existingBusinessDetails.link1,
        link2: link2 || existingBusinessDetails.link2,
        link3: link3 || existingBusinessDetails.link3,
        link4: link4 || existingBusinessDetails.link4,
        Corporation:
          Corporation.length > 0
            ? Corporation
            : existingBusinessDetails.Corporation,
        Status: Status.length > 0 ? Status : existingBusinessDetails.Status,
        companyOverview:
          companyOverview || existingBusinessDetails.companyOverview,
        agentbusinessInfo: {
          connect: { id: parseInt(agentbusinessInfoId) }, // Ensure ID is passed as an integer
        },
      },
    });

    return NextResponse.json(updatedBusinessDetails);
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
