import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { licenseKey, email } = await req.json();

    if (!licenseKey && !email) {
      return NextResponse.json({ error: "License key or email required" }, { status: 400 });
    }

    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_ANON_KEY!;

    let url = `${supabaseUrl}/rest/v1/invoicezen_purchases?select=*`;
    if (licenseKey) {
      url += `&license_key=eq.${encodeURIComponent(licenseKey)}`;
    } else {
      url += `&email=eq.${encodeURIComponent(email)}&order=created_at.desc`;
    }

    const res = await fetch(url, {
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
      },
    });

    const purchases = await res.json();

    if (!Array.isArray(purchases) || purchases.length === 0) {
      return NextResponse.json({ found: false, error: "No purchase found" }, { status: 404 });
    }

    // Return the most recent purchase
    const purchase = purchases[0];

    return NextResponse.json({
      found: true,
      licenseKey: purchase.license_key,
      email: purchase.email,
      createdAt: purchase.created_at,
    });
  } catch (error) {
    console.error("License verify error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
