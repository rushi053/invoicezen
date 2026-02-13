"use client";

import { useState, useEffect, useCallback } from "react";
import { InvoiceData, defaultInvoice, LineItem, calcSubtotal, calcTotal } from "@/lib/types";
import { currencies, getCurrency } from "@/lib/currencies";
import { InvoicePreview } from "@/components/InvoicePreview";
import { PdfDownloadButton } from "@/components/PdfDownloadButton";
import { isProUnlocked } from "@/hooks/useRazorpay";

export default function CreatePage() {
  const [invoice, setInvoice] = useState<InvoiceData>(defaultInvoice);
  const [mounted, setMounted] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [showUpgradeFor, setShowUpgradeFor] = useState<string | null>(null);
  const [showColorUpgrade, setShowColorUpgrade] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsPro(isProUnlocked());
    
    // Load saved business details
    const saved = localStorage.getItem("invoicezen-business");
    if (saved) {
      try {
        const biz = JSON.parse(saved);
        setInvoice((prev) => ({ ...prev, ...biz }));
      } catch { /* ignore */ }
    }
    // Load template from URL params
    const params = new URLSearchParams(window.location.search);
    const tpl = params.get("template");
    if (tpl && ["clean", "professional", "bold", "executive", "creative", "stripe", "contrast"].includes(tpl)) {
      setInvoice((prev) => ({ ...prev, template: tpl as InvoiceData["template"] }));
    }
    // Auto-increment invoice number
    const counter = parseInt(localStorage.getItem("invoicezen-counter") || "1", 10);
    setInvoice((prev) => ({ ...prev, invoiceNumber: `INV-${String(counter).padStart(3, "0")}` }));
  }, []);

  const update = useCallback(<K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) => {
    setInvoice((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateItem = useCallback((id: string, field: keyof LineItem, value: string | number) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  }, []);

  const addItem = () => {
    setInvoice((prev) => ({
      ...prev,
      items: [...prev.items, { id: Date.now().toString(), description: "", quantity: 1, rate: 0 }],
    }));
  };

  const removeItem = (id: string) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.length > 1 ? prev.items.filter((i) => i.id !== id) : prev.items,
    }));
  };

  const saveBusinessDetails = () => {
    const biz = {
      businessName: invoice.businessName,
      businessAddress: invoice.businessAddress,
      businessEmail: invoice.businessEmail,
      businessPhone: invoice.businessPhone,
      businessLogo: invoice.businessLogo,
    };
    localStorage.setItem("invoicezen-business", JSON.stringify(biz));
    alert("Business details saved!");
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update("businessLogo", reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    // Increment counter for next invoice
    const counter = parseInt(localStorage.getItem("invoicezen-counter") || "1", 10);
    localStorage.setItem("invoicezen-counter", String(counter + 1));
  };

  const cur = getCurrency(invoice.currency);
  const subtotal = calcSubtotal(invoice.items);
  const total = calcTotal(invoice.items, invoice.taxRate, invoice.discount);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Form */}
      <div className="lg:w-1/2 p-6 lg:p-8 overflow-y-auto lg:h-[calc(100vh-4rem)]">
        <h1 className="text-2xl font-bold mb-6">
          Create Invoice
          {isPro && <span className="ml-2 text-sm bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full align-middle">✨ Pro</span>}
        </h1>

        {/* Your Details */}
        <Section title="Your Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Business Name" value={invoice.businessName} onChange={(v) => update("businessName", v)} />
            <Field label="Email" value={invoice.businessEmail} onChange={(v) => update("businessEmail", v)} type="email" />
            <Field label="Phone" value={invoice.businessPhone} onChange={(v) => update("businessPhone", v)} />
            <div>
              <label className="block text-sm text-muted mb-1">Logo</label>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="text-sm !p-2" />
            </div>
          </div>
          <Field label="Address" value={invoice.businessAddress} onChange={(v) => update("businessAddress", v)} textarea />
          {invoice.businessLogo && (
            <div className="flex items-center gap-3 mt-2">
              <img src={invoice.businessLogo} alt="Logo" className="h-12 rounded" />
              <button onClick={() => update("businessLogo", "")} className="text-xs text-red-400 hover:text-red-300">Remove</button>
            </div>
          )}
          <button onClick={saveBusinessDetails} className="mt-3 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
            💾 Save My Details
          </button>
        </Section>

        {/* Client Details */}
        <Section title="Client Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Client Name" value={invoice.clientName} onChange={(v) => update("clientName", v)} />
            <Field label="Client Email" value={invoice.clientEmail} onChange={(v) => update("clientEmail", v)} type="email" />
          </div>
          <Field label="Client Address" value={invoice.clientAddress} onChange={(v) => update("clientAddress", v)} textarea />
        </Section>

        {/* Invoice Info */}
        <Section title="Invoice Info">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Invoice Number" value={invoice.invoiceNumber} onChange={(v) => update("invoiceNumber", v)} />
            <div>
              <label className="block text-sm text-muted mb-1">Currency</label>
              <select value={invoice.currency} onChange={(e) => update("currency", e.target.value)}>
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>{c.code} — {c.symbol} {c.name}</option>
                ))}
              </select>
            </div>
            <Field label="Invoice Date" value={invoice.invoiceDate} onChange={(v) => update("invoiceDate", v)} type="date" />
            <Field label="Due Date" value={invoice.dueDate} onChange={(v) => update("dueDate", v)} type="date" />
          </div>

          {/* Template Selector */}
          <div className="mt-4">
            <label className="block text-sm text-muted mb-2">Template</label>
            <div className="flex flex-wrap gap-2">
              {(["clean", "professional", "bold", "executive", "creative", "stripe", "contrast"] as const).map((tpl) => {
                const isFreeTpl = tpl === "clean";
                const isLocked = !isFreeTpl && !isPro;
                const isActive = invoice.template === tpl;
                const tplColors: Record<string, string> = {
                  clean: "#059669", professional: "#059669", bold: "#059669",
                  executive: "#D4AF37", creative: "#14b8a6", stripe: "#635BFF", contrast: "#EF4444",
                };
                return (
                  <button
                    key={tpl}
                    onClick={() => {
                      if (isLocked) {
                        setShowUpgradeFor(tpl);
                        return;
                      }
                      update("template", tpl);
                    }}
                    className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      isActive
                        ? "border-emerald-400 bg-emerald-500/20 text-emerald-400"
                        : "border-glass-border glass text-muted hover:text-foreground hover:border-emerald-500/40"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      {isLocked && <span className="opacity-60">🔒</span>}
                      <span className="capitalize">{tpl}</span>
                      <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: tplColors[tpl] }} />
                    </span>
                  </button>
                );
              })}
            </div>
            {showUpgradeFor && !isPro && (
              <div className="mt-2 text-xs text-muted flex items-center gap-2 animate-fadeIn">
                <span>✨ <span className="capitalize">{showUpgradeFor}</span> is a Pro template.</span>
                <a href="/#pricing" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">Upgrade to Pro →</a>
                <button onClick={() => setShowUpgradeFor(null)} className="text-muted hover:text-foreground ml-1">✕</button>
              </div>
            )}
          </div>
          
          {/* Accent Color — visible to all, locked for free */}
          <div className="mt-4 glass rounded-xl p-4 relative">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm text-muted">Accent Color</label>
              {isPro && <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">✨ Pro</span>}
            </div>
            <div className={`flex items-center gap-3 ${!isPro ? "opacity-50 pointer-events-none select-none" : ""}`}>
              <input
                type="color"
                value={invoice.accentColor || "#059669"}
                onChange={(e) => update("accentColor", e.target.value)}
                className="w-16 h-10 rounded cursor-pointer"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={invoice.accentColor || "#059669"}
                  onChange={(e) => update("accentColor", e.target.value)}
                  placeholder="#059669"
                  className="w-full"
                />
              </div>
              <button
                onClick={() => update("accentColor", "#059669")}
                className="text-xs text-muted hover:text-foreground transition-colors"
              >
                Reset
              </button>
            </div>
            {!isPro && (
              <div
                className="absolute inset-0 rounded-xl cursor-pointer flex items-center justify-center"
                onClick={() => setShowColorUpgrade(true)}
              >
                {showColorUpgrade && (
                  <div className="glass rounded-lg px-3 py-2 text-xs text-center">
                    <a href="/#pricing" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
                      Upgrade to Pro to customize colors →
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Pro Features Callout */}
          {!isPro && (
            <div className="mt-4 glass rounded-xl p-5 border border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-transparent">
              <h3 className="text-sm font-semibold text-emerald-400 mb-3">Unlock the Full Experience</h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted mb-4">
                <span>✓ 6 premium templates</span>
                <span>✓ Custom accent colors</span>
                <span>✓ Watermark removal</span>
                <span>✓ Due date reminders</span>
              </div>
              <a
                href="/#pricing"
                className="inline-block px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-400 transition-colors"
              >
                Unlock Pro →
              </a>
            </div>
          )}
        </Section>

        {/* Line Items */}
        <Section title="Line Items">
          <div className="space-y-3">
            {invoice.items.map((item, idx) => (
              <div key={item.id} className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted">Item {idx + 1}</span>
                  {invoice.items.length > 1 && (
                    <button onClick={() => removeItem(item.id)} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                  )}
                </div>
                <input placeholder="Description" value={item.description} onChange={(e) => updateItem(item.id, "description", e.target.value)} className="mb-2" />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-muted mb-1">Quantity</label>
                    <input type="number" min="0" step="1" value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)} />
                  </div>
                  <div>
                    <label className="block text-xs text-muted mb-1">Rate ({cur.symbol})</label>
                    <input type="number" min="0" step="0.01" value={item.rate} onChange={(e) => updateItem(item.id, "rate", parseFloat(e.target.value) || 0)} />
                  </div>
                </div>
                <div className="text-right text-sm text-emerald-400 mt-2">
                  {cur.symbol}{(item.quantity * item.rate).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <button onClick={addItem} className="mt-3 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
            + Add Item
          </button>
        </Section>

        {/* Summary */}
        <Section title="Summary">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tax Rate (%)" value={String(invoice.taxRate)} onChange={(v) => update("taxRate", parseFloat(v) || 0)} type="number" />
            <Field label={`Discount (${cur.symbol})`} value={String(invoice.discount)} onChange={(v) => update("discount", parseFloat(v) || 0)} type="number" />
          </div>
          <div className="glass rounded-xl p-4 mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{cur.symbol}{subtotal.toFixed(2)}</span></div>
            {invoice.taxRate > 0 && <div className="flex justify-between"><span className="text-muted">Tax ({invoice.taxRate}%)</span><span>{cur.symbol}{(subtotal * invoice.taxRate / 100).toFixed(2)}</span></div>}
            {invoice.discount > 0 && <div className="flex justify-between"><span className="text-muted">Discount</span><span className="text-red-400">-{cur.symbol}{invoice.discount.toFixed(2)}</span></div>}
            <div className="flex justify-between font-bold text-lg border-t border-glass-border pt-2">
              <span>Total</span><span className="text-emerald-400">{cur.symbol}{total.toFixed(2)}</span>
            </div>
          </div>
        </Section>

        {/* Notes */}
        <Section title="Notes">
          <Field label="Payment terms, bank details, thank you message…" value={invoice.notes} onChange={(v) => update("notes", v)} textarea />
        </Section>

        <div className="mt-6 mb-12">
          <PdfDownloadButton invoice={invoice} onDownload={handleDownload} />
        </div>
      </div>

      {/* Preview */}
      <div className="lg:w-1/2 bg-surface border-l border-glass-border p-6 lg:p-8 overflow-y-auto lg:h-[calc(100vh-4rem)]">
        <h2 className="text-lg font-semibold mb-4 text-muted">Live Preview</h2>
        <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
          <InvoicePreview invoice={invoice} />
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", textarea }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; textarea?: boolean;
}) {
  if (textarea) {
    return (
      <div className="mt-3">
        <label className="block text-sm text-muted mb-1">{label}</label>
        <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }
  return (
    <div>
      <label className="block text-sm text-muted mb-1">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
