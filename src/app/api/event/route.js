// pages/api/events/add.js

import { NextResponse } from "next/server";
import prisma from "../../../utils/prisma";

export async function POST(request) {
  try {
    const data = await request.json();

    const {
      eventName,
      eventDate,
      startTime,
      endTime,
      repeatEvent,
      eventDetails,
      eventUrl,
    } = data;

    if (!eventName || !eventDate || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        eventName,
        eventDate: new Date(eventDate),
        startTime,
        endTime,
        repeatEvent,
        eventDetails,
        eventUrl,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the event" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const events = await prisma.event.findMany();
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the events" },
      { status: 500 }
    );
  }
}
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Delete the event by its ID
    await prisma.event.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
