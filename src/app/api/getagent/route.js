import prisma from "../../../utils/prisma";
import { NextResponse } from "next/server";
export async function GET(request) {
  try {
    // Fetch all AgentBusinessinfo entries along with their related Userauth data
    const agentBusinessinfoList = await prisma.agentBusinessinfo.findMany({
      include: {
        agentBusiness: true,
        userauth: true,
      },
    });

    return NextResponse.json(agentBusinessinfoList);
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
