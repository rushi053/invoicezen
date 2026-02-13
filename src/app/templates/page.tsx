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
  const [paymentError, setPaymentError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setIsPro(isProUnlocked());
  }, []);

  const handleUpgrade = () => {
    setPaymentError("");
    setIsProcessing(true);
    openPayment({
      currency: pricing.currency,
      amount: toSmallestUnit(pricing.price, pricing.currency),
      onSuccess: () => {
        setIsProcessing(false);
        setIsPro(true);
        setTimeout(() => window.location.reload(), 500);
      },
      onFailure: (err) => {
        setIsProcessing(false);
        if (err !== "Payment cancelled") {
          setPaymentError("Payment failed. Please try again.");
          setTimeout(() => setPaymentError(""), 5000);
        }
      },
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

      {paymentError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
          {paymentError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {templates.map((t) => (
          <div key={t.id} className="glass rounded-2xl overflow-hidden group transition-all duration-300 hover:scale-[1.02]">
            {/* Enhanced Preview */}
            <div
              className="h-64 relative flex items-center justify-center p-4 overflow-hidden"
              style={{ background: t.preview }}
            >
              {/* Template-specific Invoice Mockup */}
              {t.id === "clean" && (
                <div className="w-full max-w-[220px] bg-white rounded-lg shadow-2xl p-4 transform group-hover:scale-105 transition-transform duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="w-8 h-8 rounded bg-gray-100 mb-1" />
                      <div className="text-[9px] font-bold text-gray-900">INVOICE</div>
                      <div className="text-[6px] text-gray-500">#INV-001</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[8px] font-semibold text-gray-700">Acme Studio</div>
                      <div className="text-[6px] text-gray-400">Jan 15, 2024</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded p-2 mb-2">
                    <div className="grid grid-cols-12 gap-1 text-[6px] text-gray-400 uppercase mb-1">
                      <div className="col-span-6">Item</div><div className="col-span-3 text-right">Qty</div><div className="col-span-3 text-right">Amount</div>
                    </div>
                    <div className="grid grid-cols-12 gap-1 text-[7px] text-gray-700"><div className="col-span-6">Design</div><div className="col-span-3 text-right">1</div><div className="col-span-3 text-right">$1,000</div></div>
                    <div className="grid grid-cols-12 gap-1 text-[7px] text-gray-700"><div className="col-span-6">Development</div><div className="col-span-3 text-right">1</div><div className="col-span-3 text-right">$2,500</div></div>
                  </div>
                  <div className="flex justify-between text-[9px] font-bold pt-1 border-t border-gray-200">
                    <span>TOTAL</span><span className="text-emerald-600">$3,850</span>
                  </div>
                </div>
              )}
              {t.id === "professional" && (
                <div className="w-full max-w-[220px] rounded-lg shadow-2xl overflow-hidden transform group-hover:scale-105 transition-transform duration-300">
                  <div className="bg-emerald-600 p-3">
                    <div className="flex justify-between items-center">
                      <div className="text-[10px] font-bold text-white">INVOICE</div>
                      <div className="text-[7px] text-emerald-100">#INV-001</div>
                    </div>
                    <div className="text-[6px] text-emerald-200 mt-1">Acme Studio → Client Corp</div>
                  </div>
                  <div className="bg-white p-3">
                    <div className="space-y-1 text-[7px] mb-2">
                      <div className="flex justify-between text-gray-600"><span>Design Services</span><span>$1,000</span></div>
                      <div className="flex justify-between text-gray-600"><span>Development</span><span>$2,500</span></div>
                    </div>
                    <div className="flex justify-between text-[9px] font-bold pt-1 border-t border-gray-200">
                      <span>TOTAL</span><span className="text-emerald-600">$3,850</span>
                    </div>
                  </div>
                </div>
              )}
              {t.id === "bold" && (
                <div className="w-full max-w-[220px] bg-white rounded-lg shadow-2xl p-4 transform group-hover:scale-105 transition-transform duration-300">
                  <div className="text-[28px] font-black text-emerald-600 leading-none mb-1">INV</div>
                  <div className="text-[7px] text-gray-400 mb-3">#INV-001 · Jan 15, 2024</div>
                  <div className="flex gap-2 mb-3">
                    <div className="flex-1 bg-gray-50 rounded p-2">
                      <div className="text-[6px] text-gray-400 uppercase">From</div>
                      <div className="text-[7px] font-semibold">Acme Studio</div>
                    </div>
                    <div className="flex-1 bg-gray-50 rounded p-2">
                      <div className="text-[6px] text-gray-400 uppercase">To</div>
                      <div className="text-[7px] font-semibold">Client Corp</div>
                    </div>
                  </div>
                  <div className="flex justify-between text-[9px] font-bold pt-1 border-t-2 border-emerald-600">
                    <span>TOTAL</span><span className="text-emerald-600">$3,850</span>
                  </div>
                </div>
              )}
              {t.id === "executive" && (
                <div className="w-full max-w-[220px] rounded-lg shadow-2xl overflow-hidden transform group-hover:scale-105 transition-transform duration-300">
                  <div className="bg-[#1e3a5f] p-3 border-b-2 border-[#D4AF37]">
                    <div className="flex justify-between items-center">
                      <div className="text-[10px] font-bold text-white">INVOICE</div>
                      <div className="text-[7px] text-[#D4AF37]">#INV-001</div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <div><div className="text-[6px] text-[#D4AF37] uppercase">From</div><div className="text-[7px] text-white">Acme Studio</div></div>
                      <div className="text-right"><div className="text-[6px] text-[#D4AF37] uppercase">Date</div><div className="text-[7px] text-white">Jan 15, 2024</div></div>
                    </div>
                  </div>
                  <div className="bg-white p-3">
                    <div className="space-y-1 text-[7px] mb-2">
                      <div className="flex justify-between text-gray-600"><span>Design Services</span><span>$1,000</span></div>
                      <div className="flex justify-between text-gray-600"><span>Development</span><span>$2,500</span></div>
                    </div>
                    <div className="flex justify-between text-[9px] font-bold pt-1 border-t border-gray-200">
                      <span>TOTAL</span><span className="text-[#D4AF37]">$3,850</span>
                    </div>
                  </div>
                </div>
              )}
              {t.id === "creative" && (
                <div className="w-full max-w-[220px] bg-white rounded-lg shadow-2xl overflow-hidden flex transform group-hover:scale-105 transition-transform duration-300">
                  <div className="w-[30px] bg-emerald-700 flex flex-col items-center pt-3">
                    <div className="text-[6px] text-white font-bold [writing-mode:vertical-lr] rotate-180">INVOICE</div>
                  </div>
                  <div className="flex-1 p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-[8px] font-bold text-gray-900">Acme Studio</div>
                      <div className="text-[6px] text-gray-400">#INV-001</div>
                    </div>
                    <div className="space-y-1 text-[7px] mb-2">
                      <div className="flex justify-between text-gray-600"><span>Design</span><span>$1,000</span></div>
                      <div className="flex justify-between text-gray-600"><span>Development</span><span>$2,500</span></div>
                    </div>
                    <div className="flex justify-between text-[9px] font-bold pt-1 border-t border-gray-200">
                      <span>TOTAL</span><span className="text-teal-500">$3,850</span>
                    </div>
                  </div>
                </div>
              )}
              {t.id === "stripe" && (
                <div className="w-full max-w-[220px] bg-white rounded-lg shadow-2xl p-4 transform group-hover:scale-105 transition-transform duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <div className="text-[10px] font-bold text-gray-900">Invoice</div>
                    <div className="text-[7px] text-[#635BFF] font-semibold">#INV-001</div>
                  </div>
                  <div className="space-y-0 text-[7px] mb-2">
                    <div className="flex justify-between py-1.5 border-b border-gray-100 text-gray-600"><span>Design Services</span><span>$1,000</span></div>
                    <div className="flex justify-between py-1.5 border-b border-gray-100 text-gray-600"><span>Development</span><span>$2,500</span></div>
                    <div className="flex justify-between py-1.5 border-b border-gray-100 text-gray-600"><span>Consulting</span><span>$500</span></div>
                  </div>
                  <div className="flex justify-between text-[9px] font-bold pt-1">
                    <span>TOTAL</span><span className="text-[#635BFF]">$4,350</span>
                  </div>
                </div>
              )}
              {t.id === "contrast" && (
                <div className="w-full max-w-[220px] rounded-lg shadow-2xl overflow-hidden transform group-hover:scale-105 transition-transform duration-300">
                  <div className="bg-black p-3">
                    <div className="text-[11px] font-black text-white">INVOICE</div>
                    <div className="text-[6px] text-gray-400">#INV-001 · Acme Studio</div>
                  </div>
                  <div className="bg-white p-3">
                    <div className="space-y-1 text-[7px] mb-2">
                      <div className="flex justify-between text-gray-600"><span>Design Services</span><span>$1,000</span></div>
                      <div className="flex justify-between text-gray-600"><span>Development</span><span>$2,500</span></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-black pt-1 border-t-2 border-black">
                      <span>TOTAL</span><span className="text-red-500">$3,850</span>
                    </div>
                  </div>
                </div>
              )}

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
                  disabled={isProcessing}
                  className="btn-secondary text-sm !py-2 !px-4 w-full text-center hover:border-emerald-500 transition-all disabled:opacity-50"
                >
                  {isProcessing ? "Processing..." : `🔒 Unlock with Pro — ${pricing.display}`}
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
