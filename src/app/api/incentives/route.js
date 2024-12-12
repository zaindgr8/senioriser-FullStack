import { NextResponse } from "next/server";
import prisma from "../../../utils/prisma";

export async function POST(request) {
  try {
    const data = await request.json();
    const newIncentive = await prisma.incentive.create({
      data: {
        incentiveName: data.incentiveName,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        valueOfIncentive: data.valueOfIncentive,
        inPercent: data.inPercent,
        description: data.description || "",
        legalDisclaimer: data.legalDisclaimer || "",
      },
    });
    return NextResponse.json(newIncentive, { status: 201 });
  } catch (error) {
    console.error("Error creating incentive:", error);
    return NextResponse.json(
      { error: "Failed to create incentive" },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    const currentDate = new Date();

    const incentives = await prisma.incentive.findMany();

    const currentIncentives = incentives.filter(
      (incentive) =>
        new Date(incentive.startDate) <= currentDate &&
        new Date(incentive.endDate) >= currentDate
    );

    const upcomingIncentives = incentives.filter(
      (incentive) => new Date(incentive.startDate) > currentDate
    );

    const expiredIncentives = incentives.filter(
      (incentive) => new Date(incentive.endDate) < currentDate
    );

    return NextResponse.json(
      { currentIncentives, upcomingIncentives, expiredIncentives },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching incentives:", error);
    return NextResponse.json(
      { error: "Failed to fetch incentives" },
      { status: 500 }
    );
  }
}
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Delete the incentive by its ID
    const deletedIncentive = await prisma.incentive.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({
      message: "Incentive deleted successfully",
      deletedIncentive,
    });
  } catch (error) {
    console.error("Error deleting incentive:", error);
    return NextResponse.json(
      { error: "Failed to delete incentive" },
      { status: 500 }
    );
  }
}
