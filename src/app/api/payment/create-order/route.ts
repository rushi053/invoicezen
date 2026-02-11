import { NextRequest, NextResponse } from "next/server";

// Prices in smallest currency unit (cents/paise)
const PRICES: Record<string, number> = {
  USD: 1900,
  INR: 159900,
  EUR: 1799,
  GBP: 1499,
};

export async function POST(req: NextRequest) {
  try {
    const { currency = "USD", amount } = await req.json();

    // Use provided amount (from client pricing) or fall back to server prices
    const finalAmount = amount || PRICES[currency] || PRICES.USD;
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
        amount: finalAmount,
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
    return NextResponse.json({ orderId: order.id, amount: finalAmount, currency: cur });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
