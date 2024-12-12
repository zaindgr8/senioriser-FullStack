import prisma from "../../../utils/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// GET API to fetch community business details based on user ID
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

    const businessDetails = await prisma.communityBusinessDetails.findMany({
      where: {
        businessInfo: {
          userauthId: userauthId,
        },
      },
      include: {
        businessInfo: true, // Include related CommunityBusinessinfo
      },
    });

    return NextResponse.json({ data: businessDetails });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST API to create new community business details
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

    const reqBody = await request.json();
    const {
      dba,
      yearFounded,
      license,
      country,
      city,
      state,
      zip,
      units,
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
      businessInfoId, // The ID of the related CommunityBusinessinfo
    } = reqBody;

    const newBusinessDetail = await prisma.communityBusinessDetails.create({
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
        units,
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
        businessInfo: {
          connect: { id: businessInfoId },
        },
      },
      include: {
        businessInfo: true, // Include related CommunityBusinessinfo
      },
    });

    return NextResponse.json({ data: newBusinessDetail });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT API to update existing community business details
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

    const reqBody = await request.json();
    const {
      id, // The ID of the business detail to update
      dba,
      yearFounded,
      license,
      country,
      city,
      state,
      zip,
      units,
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
      businessInfoId,
    } = reqBody;

    const existingBusinessDetail =
      await prisma.communityBusinessDetails.findUnique({
        where: { id },
      });

    if (!existingBusinessDetail) {
      return NextResponse.json(
        { error: "Business detail not found" },
        { status: 404 }
      );
    }

    const updatedBusinessDetail = await prisma.communityBusinessDetails.update({
      where: { id },
      data: {
        dba: dba || existingBusinessDetail.dba,
        yearFounded: yearFounded || existingBusinessDetail.yearFounded,
        license: license || existingBusinessDetail.license,
        country: country || existingBusinessDetail.country,
        city: city || existingBusinessDetail.city,
        state: state || existingBusinessDetail.state,
        zip: zip || existingBusinessDetail.zip,
        units: units || existingBusinessDetail.units,
        website: website || existingBusinessDetail.website,
        image: image || existingBusinessDetail.image,
        primaryPhone: primaryPhone || existingBusinessDetail.primaryPhone,
        ext: ext || existingBusinessDetail.ext,
        cellPhone: cellPhone || existingBusinessDetail.cellPhone,
        fax: fax || existingBusinessDetail.fax,
        link1: link1 || existingBusinessDetail.link1,
        link2: link2 || existingBusinessDetail.link2,
        link3: link3 || existingBusinessDetail.link3,
        link4: link4 || existingBusinessDetail.link4,
        Corporation:
          Corporation.length > 0
            ? Corporation
            : existingBusinessDetail.Corporation,
        Status: Status.length > 0 ? Status : existingBusinessDetail.Status,
        companyOverview:
          companyOverview || existingBusinessDetail.companyOverview,
        businessInfo: {
          connect: { id: businessInfoId },
        },
      },
      include: {
        businessInfo: true, // Include related CommunityBusinessinfo
      },
    });

    return NextResponse.json({ data: updatedBusinessDetail });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
