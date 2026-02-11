import { NextRequest, NextResponse } from "next/server";

// $19 USD = 1900 cents. Razorpay uses smallest currency unit.
const PRICES: Record<string, number> = {
  USD: 1900,
  INR: 159900, // ~₹1599
};

export async function POST(req: NextRequest) {
  try {
    const { currency = "USD" } = await req.json();

    const amount = PRICES[currency] || PRICES.USD;
    const cur = PRICES[currency] ? currency : "USD";

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Payment not configured" }, { status: 500 });
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount,
        currency: cur,
        receipt: `invoicezen_pro_${Date.now()}`,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Razorpay API error:", res.status, err);
      return NextResponse.json({ error: "Razorpay API failed" }, { status: 500 });
    }

    const order = await res.json();
    return NextResponse.json({ orderId: order.id, amount, currency: cur });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
