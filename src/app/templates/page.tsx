"use client";

import { useState, useEffect } from "react";
import { useRazorpay, isProUnlocked } from "@/hooks/useRazorpay";
import { getLocalPricing, toSmallestUnit } from "@/lib/pricing";

const templates = [
  {
    id: "clean",
    name: "Clean",
    desc: "Minimal and modern. Lots of whitespace, easy to read. Perfect for straightforward, professional invoices.",
    free: true,
    preview: "linear-gradient(135deg, #fff 0%, #f9f9f9 100%)",
    textColor: "#111",
    accentColor: "#059669",
  },
  {
    id: "professional",
    name: "Professional",
    desc: "Corporate feel with a colored header banner. Perfect for established businesses and consultants.",
    free: false,
    preview: "linear-gradient(135deg, #059669 0%, #047857 100%)",
    textColor: "#fff",
    accentColor: "#059669",
  },
  {
    id: "bold",
    name: "Bold",
    desc: "Large typography, accent colors. Makes a statement. Great for creative agencies and designers.",
    free: false,
    preview: "linear-gradient(135deg, #111 0%, #000 100%)",
    textColor: "#fff",
    accentColor: "#059669",
  },
  {
    id: "executive",
    name: "Executive",
    desc: "Dark navy with gold accents. Luxury corporate design that commands attention and respect.",
    free: false,
    preview: "linear-gradient(135deg, #1e3a5f 0%, #0f2744 100%)",
    textColor: "#D4AF37",
    accentColor: "#D4AF37",
  },
  {
    id: "creative",
    name: "Creative",
    desc: "Asymmetric emerald sidebar layout. Modern and memorable for agencies and creative professionals.",
    free: false,
    preview: "linear-gradient(135deg, #047857 0%, #14b8a6 100%)",
    textColor: "#fff",
    accentColor: "#14b8a6",
  },
  {
    id: "stripe",
    name: "Stripe",
    desc: "Clean rows with subtle blue accents. Inspired by tech's best design. Perfect for SaaS and tech companies.",
    free: false,
    preview: "linear-gradient(135deg, #635BFF 0%, #4E46DC 100%)",
    textColor: "#fff",
    accentColor: "#635BFF",
  },
  {
    id: "contrast",
    name: "Contrast",
    desc: "Bold black header with red totals. High contrast that gets noticed. Ideal for making bold statements.",
    free: false,
    preview: "linear-gradient(135deg, #000 0%, #1a1a1a 100%)",
    textColor: "#EF4444",
    accentColor: "#EF4444",
  },
];

export default function TemplatesPage() {
  const { openPayment } = useRazorpay();
  const pricing = getLocalPricing();
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    setIsPro(isProUnlocked());
  }, []);

  const handleUpgrade = () => {
    openPayment({
      currency: pricing.currency,
      amount: toSmallestUnit(pricing.price, pricing.currency),
      onSuccess: () => {
        setIsPro(true);
        setTimeout(() => window.location.reload(), 500);
      },
      onFailure: () => {},
    });
  };

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">Invoice Templates</h1>
        <p className="text-muted text-base md:text-lg max-w-2xl mx-auto">
          Choose a template that matches your brand. All templates generate clean, professional PDFs
          with full customization support.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {templates.map((t) => (
          <div key={t.id} className="glass rounded-2xl overflow-hidden group transition-all duration-300 hover:scale-[1.02]">
            {/* Enhanced Preview */}
            <div
              className="h-64 relative flex items-center justify-center p-4 overflow-hidden"
              style={{ background: t.preview }}
            >
              {/* Detailed Invoice Mockup */}
              <div className="w-full max-w-[220px] bg-white rounded-lg shadow-2xl p-4 transform group-hover:scale-105 transition-transform duration-300">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="w-8 h-8 rounded bg-gray-200 mb-1" />
                    <div className="text-[9px] font-bold text-gray-900">YOUR COMPANY</div>
                    <div className="text-[6px] text-gray-500">123 Business St</div>
                    <div className="text-[6px] text-gray-500">hello@company.com</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[12px] font-bold text-gray-900">INVOICE</div>
                    <div className="text-[7px] text-gray-500">#INV-001</div>
                    <div className="text-[6px] text-gray-400 mt-1">Date: Jan 15, 2024</div>
                    <div className="text-[6px] text-gray-400">Due: Feb 15, 2024</div>
                  </div>
                </div>

                {/* Bill To */}
                <div className="border-t border-gray-200 pt-2 mb-2">
                  <div className="text-[6px] text-gray-400 uppercase mb-1">Bill To</div>
                  <div className="text-[8px] font-semibold text-gray-900">Client Name</div>
                  <div className="text-[6px] text-gray-500">456 Client Ave</div>
                </div>

                {/* Line Items */}
                <div className="border-t border-gray-200 pt-2 mb-2">
                  <div className="grid grid-cols-12 gap-1 text-[6px] text-gray-400 uppercase mb-1">
                    <div className="col-span-6">Item</div>
                    <div className="col-span-2 text-right">Qty</div>
                    <div className="col-span-2 text-right">Rate</div>
                    <div className="col-span-2 text-right">Amount</div>
                  </div>
                  <div className="space-y-1 text-[7px]">
                    <div className="grid grid-cols-12 gap-1 text-gray-700">
                      <div className="col-span-6">Design Services</div>
                      <div className="col-span-2 text-right">1</div>
                      <div className="col-span-2 text-right">$1,000</div>
                      <div className="col-span-2 text-right">$1,000</div>
                    </div>
                    <div className="grid grid-cols-12 gap-1 text-gray-700">
                      <div className="col-span-6">Development</div>
                      <div className="col-span-2 text-right">1</div>
                      <div className="col-span-2 text-right">$2,500</div>
                      <div className="col-span-2 text-right">$2,500</div>
                    </div>
                  </div>
                </div>

                {/* Totals */}
                <div className="border-t border-gray-300 pt-2 space-y-1">
                  <div className="flex justify-between text-[7px] text-gray-600">
                    <span>Subtotal</span>
                    <span>$3,500</span>
                  </div>
                  <div className="flex justify-between text-[7px] text-gray-600">
                    <span>Tax (10%)</span>
                    <span>$350</span>
                  </div>
                  <div className="flex justify-between text-[9px] font-bold border-t border-gray-300 pt-1">
                    <span>TOTAL</span>
                    <span style={{ color: t.accentColor }}>$3,850</span>
                  </div>
                </div>
              </div>

              {/* Badge */}
              {!t.free ? (
                <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                  ⭐ Pro
                </div>
              ) : (
                <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                  Free
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-5 md:p-6">
              <h3 className="text-lg font-semibold mb-2">{t.name}</h3>
              <p className="text-muted text-sm mb-4 leading-relaxed">{t.desc}</p>
              {t.free || isPro ? (
                <a
                  href={`/create?template=${t.id}`}
                  className="btn-primary text-sm !py-2 !px-4 w-full text-center block"
                >
                  Use Template →
                </a>
              ) : (
                <button
                  onClick={handleUpgrade}
                  className="btn-secondary text-sm !py-2 !px-4 w-full text-center hover:border-emerald-500 transition-all"
                >
                  🔒 Unlock with Pro — {pricing.display}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pro Unlock Section */}
      {!isPro && (
        <div className="mt-12 md:mt-16 glass rounded-3xl p-6 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Unlock all templates with Pro</h2>
          <p className="text-muted mb-8 max-w-xl mx-auto">
            Get access to all 6 premium templates, custom accent colors, watermark removal, and more.
            One-time payment, lifetime access.
          </p>
          <button onClick={handleUpgrade} className="btn-primary text-lg !py-4 !px-8">
            Upgrade to Pro for {pricing.display} →
          </button>
        </div>
      )}
    </div>
  );
}
