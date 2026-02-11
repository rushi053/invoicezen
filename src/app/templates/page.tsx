"use client";

import { useState, useEffect } from "react";
import { useRazorpay, isProUnlocked } from "@/hooks/useRazorpay";

const templates = [
  {
    id: "clean",
    name: "Clean",
    desc: "Minimal and modern. Lots of whitespace, easy to read.",
    free: true,
    preview: "bg-white",
  },
  {
    id: "professional",
    name: "Professional",
    desc: "Corporate feel with a colored header banner. Perfect for businesses.",
    free: false,
    preview: "bg-emerald-600",
  },
  {
    id: "bold",
    name: "Bold",
    desc: "Large typography, accent colors. Makes a statement.",
    free: false,
    preview: "bg-gray-900",
  },
  {
    id: "executive",
    name: "Executive",
    desc: "Dark navy with gold accents. Luxury corporate design that commands attention.",
    free: false,
    preview: "bg-gradient-to-br from-blue-950 to-blue-900",
  },
  {
    id: "creative",
    name: "Creative",
    desc: "Asymmetric emerald sidebar layout. Modern and memorable for agencies.",
    free: false,
    preview: "bg-gradient-to-br from-emerald-700 to-teal-600",
  },
  {
    id: "stripe",
    name: "Stripe",
    desc: "Clean rows with subtle blue accents. Inspired by tech's best design.",
    free: false,
    preview: "bg-indigo-600",
  },
  {
    id: "contrast",
    name: "Contrast",
    desc: "Bold black header with red totals. High contrast that gets noticed.",
    free: false,
    preview: "bg-black",
  },
];

export default function TemplatesPage() {
  const { openPayment } = useRazorpay();
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    setIsPro(isProUnlocked());
  }, []);

  const handleUpgrade = () => {
    openPayment({
      currency: "USD",
      onSuccess: () => {
        setIsPro(true);
      },
      onFailure: () => {},
    });
  };

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-3">Invoice Templates</h1>
      <p className="text-muted mb-12 max-w-xl">
        Choose a template that matches your brand. All templates generate clean, professional PDFs.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((t) => (
          <div key={t.id} className="glass rounded-2xl overflow-hidden group transition-all duration-200">
            {/* Preview */}
            <div className={`h-48 ${t.preview} relative flex items-center justify-center`}>
              <div className={`${t.id === "clean" ? "text-gray-900" : "text-white"} text-center`}>
                <div className="text-3xl font-bold mb-1">INVOICE</div>
                <div className="text-xs opacity-60">INV-001</div>
              </div>
              {!t.free && (
                <div className="absolute top-3 right-3 bg-black/50 text-yellow-400 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                  🔒 Pro
                </div>
              )}
              {t.free && (
                <div className="absolute top-3 right-3 bg-emerald-500/90 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  Free
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-1">{t.name}</h3>
              <p className="text-muted text-sm mb-4">{t.desc}</p>
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
                  className="btn-secondary text-sm !py-2 !px-4 w-full text-center hover:opacity-100 transition-opacity"
                >
                  🔒 Unlock Pro — $19
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
