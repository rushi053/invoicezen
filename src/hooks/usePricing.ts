"use client";

import { useState, useEffect } from "react";

interface PricingInfo {
  price: string;
  currency: string;
  amount: number;
}

const INDIA_PRICING: PricingInfo = {
  price: "₹1,599",
  currency: "INR",
  amount: 159900,
};

const DEFAULT_PRICING: PricingInfo = {
  price: "$19",
  currency: "USD",
  amount: 1900,
};

const STORAGE_KEY = "invoicezen_detected_region";

function detectIndiaFromTimezone(): boolean {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // Check for Indian timezones
    return timezone.includes("Calcutta") || 
           timezone.includes("Kolkata") || 
           timezone.includes("Asia/Colombo");
  } catch {
    return false;
  }
}

function detectIndiaFromLanguage(): boolean {
  try {
    const lang = navigator.language.toLowerCase();
    return lang === "hi" || lang === "en-in";
  } catch {
    return false;
  }
}

async function detectIndiaFromIP(): Promise<boolean> {
  try {
    const response = await fetch("https://ipapi.co/json/", {
      signal: AbortSignal.timeout(3000), // 3s timeout
    });
    const data = await response.json();
    return data.country_code === "IN";
  } catch {
    return false;
  }
}

export function usePricing(): PricingInfo {
  const [pricing, setPricing] = useState<PricingInfo>(DEFAULT_PRICING);

  useEffect(() => {
    async function detectRegion() {
      // Check sessionStorage cache first
      const cached = sessionStorage.getItem(STORAGE_KEY);
      if (cached) {
        setPricing(cached === "IN" ? INDIA_PRICING : DEFAULT_PRICING);
        return;
      }

      // Primary detection: timezone (instant, no network call)
      if (detectIndiaFromTimezone()) {
        sessionStorage.setItem(STORAGE_KEY, "IN");
        setPricing(INDIA_PRICING);
        return;
      }

      // Secondary detection: navigator language
      if (detectIndiaFromLanguage()) {
        sessionStorage.setItem(STORAGE_KEY, "IN");
        setPricing(INDIA_PRICING);
        return;
      }

      // Fallback: IP geolocation (network call)
      const isIndia = await detectIndiaFromIP();
      const region = isIndia ? "IN" : "OTHER";
      sessionStorage.setItem(STORAGE_KEY, region);
      setPricing(isIndia ? INDIA_PRICING : DEFAULT_PRICING);
    }

    detectRegion();
  }, []);

  return pricing;
}
