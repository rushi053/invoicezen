"use client";

import { useCallback, useEffect, useRef } from "react";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

interface PaymentOptions {
  currency?: string;
  onSuccess: (licenseKey?: string) => void;
  onFailure: (error: string) => void;
}

export function useRazorpay() {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current || document.querySelector('script[src*="checkout.razorpay.com"]')) {
      scriptLoaded.current = true;
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => { scriptLoaded.current = true; };
    document.body.appendChild(script);
  }, []);

  const openPayment = useCallback(async ({ currency = "USD", onSuccess, onFailure }: PaymentOptions) => {
    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create order");

      if (!window.Razorpay) {
        onFailure("Payment system not loaded. Please refresh and try again.");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "InvoiceZen",
        description: "Pro — Lifetime Access",
        order_id: data.orderId,
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.verified) {
              localStorage.setItem("invoicezen_pro", "true");
              if (verifyData.licenseKey) {
                localStorage.setItem("invoicezen_license", verifyData.licenseKey);
              }
              onSuccess(verifyData.licenseKey);
            } else {
              onFailure("Payment verification failed");
            }
          } catch {
            onFailure("Payment verification error");
          }
        },
        theme: { color: "#10b981" },
        modal: { ondismiss: () => onFailure("Payment cancelled") },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      onFailure(error instanceof Error ? error.message : "Payment failed");
    }
  }, []);

  return { openPayment };
}

export function isProUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("invoicezen_pro") === "true";
}
