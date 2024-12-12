import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();
    const { sponsorshipId, planType, isAutoRenewal } = body;

    let priceId;

    if (planType === "monthly") {
      if (isAutoRenewal) {
        // Create a custom price for the 3-month upfront + monthly subscription
        const price = await stripe.prices.create({
          unit_amount: 25500, // $255 for first 3 months
          currency: "usd",
          recurring: {
            interval: "month",
            interval_count: 3, // Bill every 3 months
          },
          product_data: {
            name: "3 Months Sponsorship + Monthly Subscription",
          },
        });
        priceId = price.id;
      } else {
        // Create a one-time price for non-recurring 3-month sponsorship
        const price = await stripe.prices.create({
          unit_amount: 25500, // $255 for 3 months
          currency: "usd",
          product_data: {
            name: "3 Months Sponsorship (Non-recurring)",
          },
        });
        priceId = price.id;
      }
    } else if (planType === "annual") {
      // Create or retrieve the annual price
      const price = await stripe.prices.create({
        unit_amount: 78000, // $780 per year
        currency: "usd",
        recurring: isAutoRenewal ? { interval: "year" } : undefined,
        product_data: {
          name: isAutoRenewal
            ? "Annual Sponsorship Subscription"
            : "Annual Sponsorship (Non-recurring)",
        },
      });
      priceId = price.id;
    } else {
      throw new Error("Invalid plan type");
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: isAutoRenewal ? "subscription" : "payment",
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/cancel`,
      metadata: {
        sponsorshipId: sponsorshipId.toString(),
        planType: planType,
        isAutoRenewal: isAutoRenewal.toString(),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
