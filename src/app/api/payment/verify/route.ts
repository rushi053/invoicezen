import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

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

    return NextResponse.json({ verified: true, licenseKey });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json({ verified: false, error: "Verification failed" }, { status: 500 });
  }
}
