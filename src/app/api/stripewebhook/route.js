import Stripe from "stripe";
import { NextResponse } from "next/server";
import prisma from "../../../utils/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const dynamic = "force-dynamic";

export async function POST(req) {
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("⚠️  Webhook signature verification failed.", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const sponsorshipId = session.metadata?.sponsorshipId;
    const planType = session.metadata?.planType;

    if (!sponsorshipId) {
      console.error("sponsorshipId is missing in the Stripe metadata.");
      return NextResponse.json(
        { error: "sponsorshipId is missing." },
        { status: 400 }
      );
    }

    try {
      const updatedSponsorship = await prisma.sponsorConnectionRequest.update({
        where: { id: parseInt(sponsorshipId) },
        data: { status: "SPONSOR" },
      });

      return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
      console.error("Error updating sponsorship status:", error);
      return NextResponse.json(
        { error: "Failed to update sponsorship status" },
        { status: 500 }
      );
    }
  } else {
    console.log(`Unhandled event type: ${event.type}`);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
