import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email, amount, currency } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ verified: false, error: "Invalid signature" }, { status: 400 });
    }

    // Generate a license key for the Pro purchase
    const licenseKey = `IZ-PRO-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    // Store in Supabase
    try {
      await fetch(`${process.env.SUPABASE_URL}/rest/v1/invoicezen_purchases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": process.env.SUPABASE_ANON_KEY!,
          "Authorization": `Bearer ${process.env.SUPABASE_ANON_KEY!}`,
        },
        body: JSON.stringify({
          email: email || "unknown",
          license_key: licenseKey,
          payment_id: razorpay_payment_id,
          order_id: razorpay_order_id,
          amount: amount || 0,
          currency: currency || "USD",
        }),
      });
    } catch (e) {
      console.error("Supabase insert error:", e);
      // Don't fail the verification if Supabase is down
    }

    return NextResponse.json({ verified: true, licenseKey });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json({ verified: false, error: "Verification failed" }, { status: 500 });
  }
}
