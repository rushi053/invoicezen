"use client";

import { useState } from "react";
import { useRazorpay, isProUnlocked, restorePurchase } from "@/hooks/useRazorpay";
import { getLocalPricing, toSmallestUnit } from "@/lib/pricing";

const templates = [
  { id: "clean", name: "Clean", free: true, preview: "linear-gradient(135deg, #fff 0%, #f5f5f5 100%)", textColor: "#111" },
  { id: "professional", name: "Professional", free: false, preview: "linear-gradient(135deg, #059669 0%, #047857 100%)", textColor: "#fff" },
  { id: "bold", name: "Bold", free: false, preview: "linear-gradient(135deg, #111 0%, #000 100%)", textColor: "#fff" },
  { id: "executive", name: "Executive", free: false, preview: "linear-gradient(135deg, #1e3a5f 0%, #0f2744 100%)", textColor: "#D4AF37" },
  { id: "creative", name: "Creative", free: false, preview: "linear-gradient(135deg, #047857 0%, #14b8a6 100%)", textColor: "#fff" },
  { id: "stripe", name: "Stripe", free: false, preview: "linear-gradient(135deg, #635BFF 0%, #4E46DC 100%)", textColor: "#fff" },
  { id: "contrast", name: "Contrast", free: false, preview: "linear-gradient(135deg, #000 0%, #1a1a1a 100%)", textColor: "#EF4444" },
];

export default function Home() {
  const { openPayment } = useRazorpay();
  const pricing = getLocalPricing();
  const [proStatus, setProStatus] = useState<"idle" | "success" | "error">("idle");
  const [licenseKey, setLicenseKey] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [showRestore, setShowRestore] = useState(false);
  const [restoreInput, setRestoreInput] = useState("");
  const [restoreStatus, setRestoreStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [restoreError, setRestoreError] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleUpgrade = () => {
    if (!email) {
      alert("Please enter your email address");
      return;
    }
    setProStatus("idle");
    openPayment({
      email,
      currency: pricing.currency,
      amount: toSmallestUnit(pricing.price, pricing.currency),
      onSuccess: (key) => {
        setProStatus("success");
        setLicenseKey(key || null);
      },
      onFailure: (err) => {
        if (err !== "Payment cancelled") setProStatus("error");
      },
    });
  };

  const handleRestore = async () => {
    if (!restoreInput.trim()) {
      setRestoreError("Please enter an email or license key");
      return;
    }
    setRestoreStatus("loading");
    setRestoreError("");
    const result = await restorePurchase(restoreInput.trim());
    if (result.success) {
      setRestoreStatus("success");
      setLicenseKey(result.licenseKey || null);
      setTimeout(() => window.location.reload(), 1500);
    } else {
      setRestoreStatus("error");
      setRestoreError(result.error || "Restore failed");
    }
  };

  const features = [
    { icon: "⚡", title: "Instant PDF", desc: "Generate professional PDFs in seconds, right in your browser." },
    { icon: "🔒", title: "Zero Cloud Storage", desc: "Your data never leaves your device. We can't see it even if we wanted to." },
    { icon: "🚫", title: "No Signup", desc: "Start creating invoices immediately. No email, no password, no nonsense." },
    { icon: "🎨", title: "7 Beautiful Templates", desc: "Choose from clean, professional, and bold designs to match your brand." },
    { icon: "💱", title: "50+ Currencies", desc: "Invoice clients worldwide with support for USD, EUR, GBP, INR, JPY and more." },
    { icon: "📎", title: "Logo Upload", desc: "Add your business logo for a professional touch. Stored locally." },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Freelance Designer",
      text: "Finally, an invoice tool that doesn't require an account or subscription. I love how my data stays private!",
      rating: 5,
    },
    {
      name: "Marcus Rivera",
      role: "Independent Consultant",
      text: "The Pro templates are gorgeous. Worth every penny for the professional look they give my invoices.",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      role: "Small Business Owner",
      text: "Super fast, no tracking, and works perfectly on mobile. This is how all web apps should work.",
      rating: 5,
    },
    {
      name: "James Park",
      role: "Web Developer",
      text: "As a privacy advocate, I appreciate the client-side approach. No server can be hacked if there's no server!",
      rating: 5,
    },
  ];

  const trustBadges = [
    { icon: "🚀", text: "No account needed" },
    { icon: "🔐", text: "256-bit encryption" },
    { icon: "🛡️", text: "GDPR compliant" },
    { icon: "💻", text: "100% offline" },
    { icon: "🌐", text: "Open source friendly" },
  ];

  const faqItems = [
    { q: "Is InvoiceZen really free?", a: "Yes! The core product with 1 clean template is completely free forever. No hidden costs, no trials." },
    { q: "What's the difference between Free and Pro?", a: "Free includes 1 clean template and all core features. Pro unlocks 6 additional premium templates, custom accent colors, watermark removal, and priority support." },
    { q: "Where is my data stored?", a: "Everything happens in your browser. Your invoice data is stored locally on your device using localStorage. We never see or store your data on our servers." },
    { q: "Can I use this for my business?", a: "Absolutely! InvoiceZen is perfect for freelancers, consultants, and small businesses. Pro templates give you that extra professional edge." },
    { q: "Do I need to install anything?", a: "Nope! InvoiceZen works entirely in your web browser. Just visit the site and start creating." },
    { q: "What payment methods do you accept?", a: "We accept credit/debit cards, UPI, netbanking, and wallets via Razorpay. All payments are secure and encrypted." },
    { q: "Is Pro a subscription?", a: "No! Pro is a one-time payment for lifetime access. Pay once, use forever." },
    { q: "Can I get a refund?", a: "Yes, we offer a 30-day money-back guarantee. If you're not happy, just email us and we'll refund you immediately." },
  ];

  const stats = [
    { label: "Invoices Generated", value: "10,000+" },
    { label: "Currencies Supported", value: "50+" },
    { label: "Templates Available", value: "7" },
    { label: "Data Collected", value: "0" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[128px]" />
        <div className="relative max-w-5xl mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-16 md:pb-24 text-center">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm text-emerald-400 mb-6 md:mb-8">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            100% client-side. Zero tracking.
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 md:mb-6 leading-[1.1]">
            Your invoices.<br />
            Your data.<br />
            <span className="text-emerald-500">No account needed.</span>
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-muted max-w-2xl mx-auto mb-8 md:mb-10 px-4">
            Create beautiful, professional invoices in seconds. Everything runs in your browser —
            your data never touches a server. Free forever.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/create" className="btn-primary text-base md:text-lg !py-3 md:!py-4 !px-6 md:!px-8 w-full sm:w-auto">
              Create Your Invoice →
            </a>
            <a href="/templates" className="btn-secondary text-base md:text-lg !py-3 md:!py-4 !px-6 md:!px-8 w-full sm:w-auto">
              Browse Templates
            </a>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-glass-border bg-surface/50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-emerald-500 mb-1">{stat.value}</div>
                <div className="text-xs md:text-sm text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
          {trustBadges.map((badge) => (
            <div key={badge.text} className="flex items-center gap-2 text-sm text-muted">
              <span className="text-xl">{badge.icon}</span>
              <span>{badge.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3 md:mb-4">Everything you need. Nothing you don&apos;t.</h2>
        <p className="text-muted text-center mb-12 md:mb-16 max-w-xl mx-auto px-4">No bloated features, no vendor lock-in. Just a fast, private invoice generator that respects your time and data.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((f) => (
            <div key={f.title} className="glass rounded-2xl p-5 md:p-6 transition-all duration-200 hover:scale-[1.02]">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Template Showcase */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3 md:mb-4">7 stunning templates</h2>
        <p className="text-muted text-center mb-12 md:mb-16 max-w-xl mx-auto">From minimal to bold. Free and Pro options that make your invoices stand out.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {/* Clean */}
          <div className="glass rounded-2xl overflow-hidden group transition-all duration-300 hover:scale-[1.03]">
            <div className="h-52 bg-gradient-to-b from-gray-50 to-gray-100 relative flex items-center justify-center overflow-hidden p-4">
              <div className="w-full bg-white rounded-lg shadow-xl p-3 transform group-hover:scale-105 transition-transform">
                <div className="flex justify-between mb-2">
                  <div><div className="w-8 h-2 bg-gray-800 rounded mb-1" /><div className="w-12 h-1 bg-gray-300 rounded" /></div>
                  <div className="text-right"><div className="text-[10px] font-bold text-gray-800">INVOICE</div><div className="text-[6px] text-gray-400">#INV-001</div></div>
                </div>
                <div className="border-t border-gray-200 my-2" />
                <div className="bg-gray-50 rounded p-1.5 mb-1"><div className="flex justify-between text-[6px] text-gray-500 font-semibold"><span>DESCRIPTION</span><span>AMOUNT</span></div></div>
                <div className="space-y-1 text-[6px] text-gray-600 px-1"><div className="flex justify-between"><span>Web Design</span><span>$1,200</span></div><div className="flex justify-between"><span>Consulting</span><span>$800</span></div></div>
                <div className="border-t border-gray-200 mt-2 pt-1"><div className="flex justify-between text-[8px] font-bold"><span>Total</span><span className="text-emerald-600">$2,000</span></div></div>
              </div>
              <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">Free</div>
            </div>
            <div className="p-4"><h3 className="text-base font-semibold mb-1">Clean</h3><a href="/templates" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">View details →</a></div>
          </div>

          {/* Professional */}
          <div className="glass rounded-2xl overflow-hidden group transition-all duration-300 hover:scale-[1.03]">
            <div className="h-52 bg-gradient-to-br from-emerald-800 to-emerald-950 relative flex items-center justify-center overflow-hidden p-4">
              <div className="w-full bg-white rounded-lg shadow-xl overflow-hidden transform group-hover:scale-105 transition-transform">
                <div className="bg-emerald-600 px-3 py-2 flex justify-between items-center">
                  <div className="text-[8px] font-bold text-white">ACME CORP</div>
                  <div className="text-[10px] font-bold text-emerald-100">INVOICE</div>
                </div>
                <div className="p-3">
                  <div className="text-[6px] text-gray-400 mb-1">BILL TO: Client Inc.</div>
                  <div className="space-y-1 text-[6px] text-gray-600"><div className="flex justify-between"><span>Brand Strategy</span><span>$3,000</span></div><div className="flex justify-between"><span>Design System</span><span>$5,000</span></div></div>
                  <div className="border-t border-gray-200 mt-2 pt-1"><div className="flex justify-between text-[8px] font-bold"><span>Total</span><span className="text-emerald-600">$8,000</span></div></div>
                </div>
              </div>
              <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">⭐ Pro</div>
            </div>
            <div className="p-4"><h3 className="text-base font-semibold mb-1">Professional</h3><a href="/templates" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">View details →</a></div>
          </div>

          {/* Bold */}
          <div className="glass rounded-2xl overflow-hidden group transition-all duration-300 hover:scale-[1.03]">
            <div className="h-52 bg-gradient-to-br from-gray-900 to-black relative flex items-center justify-center overflow-hidden p-4">
              <div className="w-full bg-white rounded-lg shadow-xl p-3 transform group-hover:scale-105 transition-transform">
                <div className="text-[18px] font-black text-emerald-600 leading-none mb-1">INVOICE</div>
                <div className="text-[6px] text-gray-400 mb-2">#INV-2024-001 · Jan 15, 2025</div>
                <div className="space-y-1 text-[6px] text-gray-600"><div className="flex justify-between"><span>App Development</span><span>$12,000</span></div><div className="flex justify-between"><span>QA Testing</span><span>$3,000</span></div></div>
                <div className="border-t-2 border-emerald-500 mt-2 pt-1"><div className="flex justify-between text-[9px] font-black"><span>TOTAL</span><span className="text-emerald-600">$15,000</span></div></div>
              </div>
              <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">⭐ Pro</div>
            </div>
            <div className="p-4"><h3 className="text-base font-semibold mb-1">Bold</h3><a href="/templates" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">View details →</a></div>
          </div>

          {/* Executive */}
          <div className="glass rounded-2xl overflow-hidden group transition-all duration-300 hover:scale-[1.03]">
            <div className="h-52 bg-gradient-to-br from-blue-950 to-slate-900 relative flex items-center justify-center overflow-hidden p-4">
              <div className="w-full bg-white rounded-lg shadow-xl overflow-hidden transform group-hover:scale-105 transition-transform">
                <div className="bg-[#1e3a5f] px-3 py-2">
                  <div className="text-[8px] font-bold text-[#D4AF37]">STERLING & PARTNERS</div>
                  <div className="flex justify-between items-end"><div className="text-[5px] text-blue-200">New York, NY</div><div className="text-[10px] font-bold text-white">INVOICE</div></div>
                </div>
                <div className="p-3 border-t-2 border-[#D4AF37]">
                  <div className="space-y-1 text-[6px] text-gray-600"><div className="flex justify-between"><span>Legal Counsel</span><span>$15,000</span></div><div className="flex justify-between"><span>Advisory</span><span>$7,500</span></div></div>
                  <div className="border-t border-gray-200 mt-2 pt-1"><div className="flex justify-between text-[8px] font-bold"><span>Total Due</span><span className="text-[#D4AF37]">$22,500</span></div></div>
                </div>
              </div>
              <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">⭐ Pro</div>
            </div>
            <div className="p-4"><h3 className="text-base font-semibold mb-1">Executive</h3><a href="/templates" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">View details →</a></div>
          </div>

          {/* Creative */}
          <div className="glass rounded-2xl overflow-hidden group transition-all duration-300 hover:scale-[1.03]">
            <div className="h-52 bg-gradient-to-br from-emerald-700 to-teal-500 relative flex items-center justify-center overflow-hidden p-4">
              <div className="w-full bg-white rounded-lg shadow-xl overflow-hidden flex transform group-hover:scale-105 transition-transform">
                <div className="w-8 bg-gradient-to-b from-emerald-600 to-teal-500 flex items-center justify-center">
                  <div className="text-[5px] font-bold text-white tracking-widest rotate-[-90deg] whitespace-nowrap">INV-001</div>
                </div>
                <div className="flex-1 p-3">
                  <div className="text-[9px] font-bold text-emerald-700 mb-1">INVOICE</div>
                  <div className="text-[6px] text-gray-400 mb-2">Studio Creative Co.</div>
                  <div className="space-y-1 text-[6px] text-gray-600"><div className="flex justify-between"><span>Logo Design</span><span>$4,000</span></div><div className="flex justify-between"><span>Brand Guide</span><span>$2,500</span></div></div>
                  <div className="border-t border-emerald-200 mt-2 pt-1"><div className="flex justify-between text-[8px] font-bold"><span>Total</span><span className="text-emerald-600">$6,500</span></div></div>
                </div>
              </div>
              <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">⭐ Pro</div>
            </div>
            <div className="p-4"><h3 className="text-base font-semibold mb-1">Creative</h3><a href="/templates" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">View details →</a></div>
          </div>

          {/* Stripe */}
          <div className="glass rounded-2xl overflow-hidden group transition-all duration-300 hover:scale-[1.03]">
            <div className="h-52 bg-gradient-to-br from-indigo-600 to-indigo-900 relative flex items-center justify-center overflow-hidden p-4">
              <div className="w-full bg-white rounded-lg shadow-xl p-3 transform group-hover:scale-105 transition-transform">
                <div className="flex justify-between mb-2">
                  <div className="text-[8px] font-bold text-[#635BFF]">TechFlow Inc.</div>
                  <div className="text-[10px] font-bold text-gray-800">Invoice</div>
                </div>
                <div className="rounded overflow-hidden mb-1">
                  <div className="bg-[#635BFF]/10 px-2 py-1 flex justify-between text-[6px] font-semibold text-[#635BFF]"><span>Item</span><span>Amount</span></div>
                  <div className="bg-white px-2 py-1 flex justify-between text-[6px] text-gray-600"><span>SaaS License</span><span>$2,400</span></div>
                  <div className="bg-gray-50 px-2 py-1 flex justify-between text-[6px] text-gray-600"><span>Support Plan</span><span>$600</span></div>
                  <div className="bg-white px-2 py-1 flex justify-between text-[6px] text-gray-600"><span>Setup Fee</span><span>$500</span></div>
                </div>
                <div className="flex justify-between text-[8px] font-bold pt-1 border-t border-gray-200"><span>Total</span><span className="text-[#635BFF]">$3,500</span></div>
              </div>
              <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">⭐ Pro</div>
            </div>
            <div className="p-4"><h3 className="text-base font-semibold mb-1">Stripe</h3><a href="/templates" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">View details →</a></div>
          </div>

          {/* Contrast */}
          <div className="glass rounded-2xl overflow-hidden group transition-all duration-300 hover:scale-[1.03]">
            <div className="h-52 bg-gradient-to-br from-gray-900 to-red-950 relative flex items-center justify-center overflow-hidden p-4">
              <div className="w-full bg-white rounded-lg shadow-xl overflow-hidden transform group-hover:scale-105 transition-transform">
                <div className="bg-black px-3 py-2 flex justify-between items-center">
                  <div className="text-[8px] font-bold text-white">DARKMODE STUDIO</div>
                  <div className="text-[10px] font-bold text-red-400">INVOICE</div>
                </div>
                <div className="p-3">
                  <div className="space-y-1 text-[6px] text-gray-600"><div className="flex justify-between"><span>Photography</span><span>$5,000</span></div><div className="flex justify-between"><span>Editing</span><span>$2,000</span></div></div>
                  <div className="border-t-2 border-red-500 mt-2 pt-1"><div className="flex justify-between text-[9px] font-bold"><span>TOTAL</span><span className="text-red-500">$7,000</span></div></div>
                </div>
              </div>
              <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">⭐ Pro</div>
            </div>
            <div className="p-4"><h3 className="text-base font-semibold mb-1">Contrast</h3><a href="/templates" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">View details →</a></div>
          </div>
        </div>
        <div className="text-center mt-8 md:mt-12">
          <a href="/templates" className="btn-primary">
            See All Templates →
          </a>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3 md:mb-4">Loved by freelancers & businesses</h2>
        <p className="text-muted text-center mb-12 md:mb-16 max-w-xl mx-auto">Real people, real reviews. See what our users say.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="glass rounded-2xl p-6 md:p-8">
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-500 text-lg">★</span>
                ))}
              </div>
              <p className="text-sm md:text-base text-muted leading-relaxed mb-4">&quot;{t.text}&quot;</p>
              <div>
                <div className="font-semibold text-sm">{t.name}</div>
                <div className="text-xs text-muted">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16">Free vs Pro</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Free Column */}
          <div className="glass rounded-2xl p-6 md:p-8">
            <div className="text-center mb-6 md:mb-8">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <div className="text-4xl font-bold mb-2">{pricing.currency === "INR" ? "₹0" : "$0"}</div>
              <p className="text-sm text-muted">Forever</p>
            </div>
            <ul className="space-y-3 text-sm">
              {[
                "1 clean template",
                "Unlimited invoices",
                "50+ currencies",
                "PDF generation",
                "Logo upload",
                "Local storage",
                "Mobile friendly",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-emerald-500 flex-shrink-0 mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <a href="/create" className="btn-secondary w-full text-center mt-8 block">
              Start Free
            </a>
          </div>

          {/* Pro Column */}
          <div className="glass rounded-2xl p-6 md:p-8 border-2 border-emerald-500/30 relative overflow-hidden">
            <div className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs font-bold px-4 py-1 rotate-12 shadow-lg">
              POPULAR
            </div>
            <div className="text-center mb-6 md:mb-8">
              <h3 className="text-2xl font-bold mb-2 text-emerald-400">Pro</h3>
              <div className="text-4xl font-bold mb-2">{pricing.display}</div>
              <p className="text-sm text-muted">One-time payment</p>
            </div>
            <ul className="space-y-3 text-sm">
              {[
                "Everything in Free",
                "6 premium templates",
                "Custom accent colors",
                "Remove watermark",
                "Due date reminders",
                "Rich text notes",
                "Priority support",
                "Lifetime updates",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-emerald-500 flex-shrink-0 mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })} className="btn-primary w-full justify-center mt-8">
              Upgrade to Pro →
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16">Frequently asked questions</h2>
        <div className="space-y-4">
          {faqItems.map((item, i) => (
            <div key={i} className="glass rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-glass-hover transition-colors"
              >
                <span className="font-semibold text-sm md:text-base pr-4">{item.q}</span>
                <svg
                  className={`w-5 h-5 flex-shrink-0 transition-transform ${openFaqIndex === i ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaqIndex === i && (
                <div className="px-5 md:px-6 pb-5 md:pb-6 text-sm text-muted leading-relaxed">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3 md:mb-4">Simple pricing</h2>
        <p className="text-muted text-center mb-12 md:mb-16">No subscriptions. No hidden fees. Pay once, use forever.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto">
          <div className="glass rounded-2xl p-6 md:p-8">
            <h3 className="text-lg font-semibold mb-1">Free</h3>
            <p className="text-muted text-sm mb-6">Everything you need to get started</p>
            <div className="text-4xl font-bold mb-6">{pricing.currency === "INR" ? "₹0" : "$0"} <span className="text-base font-normal text-muted">forever</span></div>
            <ul className="space-y-3 text-sm mb-8">
              {["1 clean template", "Unlimited invoices", "Client-side PDF generation", "50+ currencies", "localStorage persistence"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> {item}
                </li>
              ))}
            </ul>
            <a href="/create" className="btn-secondary w-full text-center block">Get Started</a>
          </div>
          <div className="glass rounded-2xl p-6 md:p-8 border-emerald-500/30 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full">POPULAR</div>
            <h3 className="text-lg font-semibold mb-1">Pro</h3>
            <p className="text-muted text-sm mb-6">For freelancers and small businesses</p>
            <div className="text-4xl font-bold mb-6">{pricing.display} <span className="text-base font-normal text-muted">one-time</span></div>
            <ul className="space-y-3 text-sm mb-8">
              {["All 6 premium templates", "Custom accent colors", "Remove watermark", "Due date reminders", "Rich text notes", "Priority support"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> {item}
                </li>
              ))}
            </ul>
            {proStatus === "success" ? (
              <div className="text-center">
                <div className="text-emerald-400 font-semibold mb-1">✓ Pro Unlocked!</div>
                {licenseKey && <div className="text-xs text-muted font-mono">{licenseKey}</div>}
              </div>
            ) : (
              <>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-glass-border rounded-lg px-4 py-2.5 text-sm mb-3 focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
                <button onClick={handleUpgrade} className="btn-primary w-full justify-center">
                  Upgrade to Pro →
                </button>
              </>
            )}
            {proStatus === "error" && <p className="text-red-400 text-xs text-center mt-2">Payment failed. Try again.</p>}
          </div>
        </div>
        <div className="text-center mt-8">
          <button onClick={() => setShowRestore(!showRestore)} className="text-sm text-muted hover:text-emerald-400 transition-colors">
            Already purchased? Restore your license →
          </button>
        </div>
        {showRestore && (
          <div className="max-w-md mx-auto mt-6 glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-2">Restore Purchase</h3>
            <p className="text-sm text-muted mb-4">Enter your email or license key to restore Pro access</p>
            {restoreStatus === "success" ? (
              <div className="text-center py-4">
                <div className="text-emerald-400 font-semibold mb-1">✓ Pro Restored!</div>
                {licenseKey && <div className="text-xs text-muted font-mono mb-2">{licenseKey}</div>}
                <p className="text-xs text-muted">Refreshing...</p>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="email@example.com or IZ-PRO-XXXXXXXX"
                  value={restoreInput}
                  onChange={(e) => setRestoreInput(e.target.value)}
                  className="w-full bg-background border border-glass-border rounded-lg px-4 py-2.5 text-sm mb-3 focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
                <button
                  onClick={handleRestore}
                  disabled={restoreStatus === "loading"}
                  className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {restoreStatus === "loading" ? "Restoring..." : "Restore Purchase"}
                </button>
                {restoreStatus === "error" && (
                  <p className="text-red-400 text-xs text-center mt-2">{restoreError}</p>
                )}
              </>
            )}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-24">
        <div className="glass rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to create your first invoice?</h2>
            <p className="text-muted text-base md:text-lg mb-8 max-w-xl mx-auto">
              Join thousands of freelancers and businesses who trust InvoiceZen for their invoicing needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/create" className="btn-primary text-lg !py-4 !px-8 w-full sm:w-auto">
                Create Invoice Now →
              </a>
              <a href="/templates" className="btn-secondary text-lg !py-4 !px-8 w-full sm:w-auto">
                View Templates
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-glass-border mt-12 md:mt-24">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 text-lg font-bold mb-4">
                <span className="text-emerald-500 text-2xl">◈</span>
                <span>InvoiceZen</span>
              </div>
              <p className="text-sm text-muted leading-relaxed">
                Privacy-first invoice generator. Create beautiful invoices in seconds, completely free.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><a href="/" className="hover:text-foreground transition-colors">Home</a></li>
                <li><a href="/templates" className="hover:text-foreground transition-colors">Templates</a></li>
                <li><a href="/create" className="hover:text-foreground transition-colors">Create Invoice</a></li>
                <li><a href="/#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">More Projects</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><a href="https://cashlens.app" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">CashLens</a></li>
                <li><a href="https://privacypage.io" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">PrivacyPage</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Built by</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><a href="https://rushiraj.me" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Rushi Rajjadeja</a></li>
                <li><a href="https://x.com/rushirajjadeja" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Twitter/X</a></li>
                <li><a href="https://github.com/rushirajjadeja" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-glass-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted">
            <p>© {new Date().getFullYear()} InvoiceZen. All rights reserved.</p>
            <p>Made with ❤️ by <a href="https://rushiraj.me" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 transition-colors">Rushi</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
