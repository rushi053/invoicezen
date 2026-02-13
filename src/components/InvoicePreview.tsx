"use client";

import { InvoiceData, calcSubtotal, calcTotal } from "@/lib/types";
import { getCurrency } from "@/lib/currencies";

export function InvoicePreview({ invoice }: { invoice: InvoiceData }) {
  const cur = getCurrency(invoice.currency);
  const subtotal = calcSubtotal(invoice.items);
  const total = calcTotal(invoice.items, invoice.taxRate, invoice.discount);

  if (invoice.template === "professional") return <ProfessionalTemplate invoice={invoice} cur={cur} subtotal={subtotal} total={total} />;
  if (invoice.template === "bold") return <BoldTemplate invoice={invoice} cur={cur} subtotal={subtotal} total={total} />;
  if (invoice.template === "executive") return <ExecutiveTemplate invoice={invoice} cur={cur} subtotal={subtotal} total={total} />;
  if (invoice.template === "creative") return <CreativeTemplate invoice={invoice} cur={cur} subtotal={subtotal} total={total} />;
  if (invoice.template === "stripe") return <StripeTemplate invoice={invoice} cur={cur} subtotal={subtotal} total={total} />;
  if (invoice.template === "contrast") return <ContrastTemplate invoice={invoice} cur={cur} subtotal={subtotal} total={total} />;
  return <CleanTemplate invoice={invoice} cur={cur} subtotal={subtotal} total={total} />;
}

interface TplProps {
  invoice: InvoiceData;
  cur: { symbol: string; code: string };
  subtotal: number;
  total: number;
}

function CleanTemplate({ invoice, cur, subtotal, total }: TplProps) {
  return (
    <div className="p-8 text-black text-sm min-h-[600px]" style={{ fontFamily: "system-ui, sans-serif" }}>
      <div className="flex justify-between items-start mb-10">
        <div>
          {invoice.businessLogo && <img src={invoice.businessLogo} alt="" className="h-10 mb-2" />}
          <h1 className="text-xl font-bold text-gray-900">{invoice.businessName || "Your Business"}</h1>
          <p className="text-gray-500 text-xs whitespace-pre-line">{invoice.businessAddress}</p>
          <p className="text-gray-500 text-xs">{invoice.businessEmail}</p>
          <p className="text-gray-500 text-xs">{invoice.businessPhone}</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
          <p className="text-gray-500 text-xs mt-1">{invoice.invoiceNumber}</p>
          <p className="text-gray-500 text-xs">Date: {invoice.invoiceDate}</p>
          <p className="text-gray-500 text-xs">Due: {invoice.dueDate}</p>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Bill To</p>
        <p className="font-semibold text-gray-900">{invoice.clientName || "Client Name"}</p>
        <p className="text-gray-500 text-xs whitespace-pre-line">{invoice.clientAddress}</p>
        <p className="text-gray-500 text-xs">{invoice.clientEmail}</p>
      </div>

      <ItemsTable invoice={invoice} cur={cur} />

      <div className="flex justify-end mt-6">
        <SummaryBlock invoice={invoice} cur={cur} subtotal={subtotal} total={total} />
      </div>

      {invoice.notes && (
        <div className="mt-8 pt-4 border-t border-gray-200">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Notes</p>
          <p className="text-gray-600 text-xs whitespace-pre-line">{invoice.notes}</p>
        </div>
      )}
    </div>
  );
}

function ProfessionalTemplate({ invoice, cur, subtotal, total }: TplProps) {
  return (
    <div className="text-black text-sm min-h-[600px]" style={{ fontFamily: "system-ui, sans-serif" }}>
      <div className="bg-emerald-600 text-white p-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {invoice.businessLogo && <img src={invoice.businessLogo} alt="" className="h-10 rounded" />}
          <div>
            <h1 className="text-xl font-bold">{invoice.businessName || "Your Business"}</h1>
            <p className="text-emerald-100 text-xs">{invoice.businessEmail} · {invoice.businessPhone}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold">INVOICE</h2>
          <p className="text-emerald-100 text-xs">{invoice.invoiceNumber}</p>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-1">From</p>
            <p className="text-gray-500 text-xs whitespace-pre-line">{invoice.businessAddress}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Bill To</p>
            <p className="font-semibold text-gray-900">{invoice.clientName || "Client Name"}</p>
            <p className="text-gray-500 text-xs whitespace-pre-line">{invoice.clientAddress}</p>
            <p className="text-gray-500 text-xs">{invoice.clientEmail}</p>
          </div>
        </div>

        <div className="flex gap-6 mb-8 text-xs">
          <div><span className="text-gray-400">Date:</span> {invoice.invoiceDate}</div>
          <div><span className="text-gray-400">Due:</span> {invoice.dueDate}</div>
          <div><span className="text-gray-400">Currency:</span> {cur.code}</div>
        </div>

        <ItemsTable invoice={invoice} cur={cur} accent />

        <div className="flex justify-end mt-6">
          <SummaryBlock invoice={invoice} cur={cur} subtotal={subtotal} total={total} accent />
        </div>

        {invoice.notes && (
          <div className="mt-8 pt-4 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Notes</p>
            <p className="text-gray-600 text-xs whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function BoldTemplate({ invoice, cur, subtotal, total }: TplProps) {
  return (
    <div className="p-8 text-black text-sm min-h-[600px]" style={{ fontFamily: "system-ui, sans-serif" }}>
      <div className="flex justify-between items-start mb-6">
        <div>
          {invoice.businessLogo && <img src={invoice.businessLogo} alt="" className="h-12 mb-3" />}
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">{invoice.businessName || "Your Business"}</h1>
        </div>
        <div className="text-right">
          <div className="text-5xl font-black text-emerald-600 leading-none mb-1">INV</div>
          <p className="text-gray-500 text-sm font-mono">{invoice.invoiceNumber}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8 bg-gray-50 rounded-lg p-4">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase">From</p>
          <p className="text-xs text-gray-600 whitespace-pre-line">{invoice.businessAddress}</p>
          <p className="text-xs text-gray-600">{invoice.businessEmail}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase">To</p>
          <p className="text-xs font-bold text-gray-900">{invoice.clientName || "Client"}</p>
          <p className="text-xs text-gray-600 whitespace-pre-line">{invoice.clientAddress}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase">Details</p>
          <p className="text-xs text-gray-600">Date: {invoice.invoiceDate}</p>
          <p className="text-xs text-gray-600">Due: {invoice.dueDate}</p>
          <p className="text-xs text-gray-600">Currency: {cur.code}</p>
        </div>
      </div>

      <ItemsTable invoice={invoice} cur={cur} accent bold />

      <div className="flex justify-end mt-6">
        <SummaryBlock invoice={invoice} cur={cur} subtotal={subtotal} total={total} accent bold />
      </div>

      {invoice.notes && (
        <div className="mt-8 pt-4 border-t-2 border-gray-900">
          <p className="text-xs font-black text-gray-400 uppercase mb-1">Notes</p>
          <p className="text-gray-600 text-xs whitespace-pre-line">{invoice.notes}</p>
        </div>
      )}
    </div>
  );
}

function ExecutiveTemplate({ invoice, cur, subtotal, total }: TplProps) {
  const accent = invoice.accentColor || "#D4AF37";
  return (
    <div className="text-black text-sm min-h-[600px]" style={{ fontFamily: "system-ui, sans-serif" }}>
      <div className="p-8 text-white" style={{ backgroundColor: "#1e3a5f", borderBottom: `3px solid ${accent}` }}>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">INVOICE</h2>
            <p className="text-sm" style={{ color: accent }}>{invoice.invoiceNumber}</p>
          </div>
          {invoice.businessLogo && <img src={invoice.businessLogo} alt="" className="h-10" />}
        </div>
      </div>
      <div className="p-8">
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <p className="text-[10px] font-bold uppercase mb-1" style={{ color: accent }}>From</p>
            <p className="font-bold text-gray-900">{invoice.businessName || "Your Business"}</p>
            <p className="text-xs text-gray-500 whitespace-pre-line">{invoice.businessAddress}</p>
            <p className="text-xs text-gray-500">{invoice.businessEmail}</p>
            <p className="text-xs text-gray-500">{invoice.businessPhone}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase mb-1" style={{ color: accent }}>Invoice Details</p>
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex justify-between"><span className="text-gray-400">Date:</span><span className="font-semibold">{invoice.invoiceDate}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Due Date:</span><span className="font-semibold">{invoice.dueDate}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Currency:</span><span className="font-semibold">{cur.code}</span></div>
            </div>
          </div>
        </div>
        <div className="pt-4 mb-6" style={{ borderTop: `2px solid ${accent}` }}>
          <p className="text-[10px] font-bold uppercase mb-1" style={{ color: accent }}>Bill To</p>
          <p className="font-semibold text-gray-900">{invoice.clientName || "Client"}</p>
          <p className="text-xs text-gray-500 whitespace-pre-line">{invoice.clientAddress}</p>
          <p className="text-xs text-gray-500">{invoice.clientEmail}</p>
        </div>
        <ItemsTable invoice={invoice} cur={cur} accentColor={accent} />
        <div className="flex justify-end mt-6">
          <SummaryBlock invoice={invoice} cur={cur} subtotal={subtotal} total={total} accentColor={accent} />
        </div>
        {invoice.notes && (
          <div className="mt-8 pt-4 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Notes</p>
            <p className="text-gray-600 text-xs whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CreativeTemplate({ invoice, cur, subtotal, total }: TplProps) {
  const accent = invoice.accentColor || "#14b8a6";
  const sidebarColor = invoice.accentColor || "#047857";
  return (
    <div className="text-black text-sm min-h-[600px] flex" style={{ fontFamily: "system-ui, sans-serif" }}>
      <div className="w-16 flex-shrink-0 flex items-start justify-center pt-20" style={{ backgroundColor: sidebarColor }}>
        <span className="text-white text-[10px] font-bold tracking-widest" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
          {invoice.invoiceNumber}
        </span>
      </div>
      <div className="flex-1 p-8">
        {invoice.businessLogo && <img src={invoice.businessLogo} alt="" className="h-9 mb-3" />}
        <div className="mb-6 pl-3" style={{ borderLeft: `4px solid ${accent}` }}>
          <h2 className="text-xl font-bold" style={{ color: sidebarColor }}>INVOICE</h2>
          <p className="text-[10px] text-gray-500">Date: {invoice.invoiceDate} · Due: {invoice.dueDate}</p>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-[10px] font-bold uppercase mb-1" style={{ color: accent }}>From</p>
            <p className="text-xs font-bold">{invoice.businessName || "Your Business"}</p>
            <p className="text-[10px] text-gray-500">{invoice.businessAddress}</p>
            <p className="text-[10px] text-gray-500">{invoice.businessEmail}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase mb-1" style={{ color: accent }}>To</p>
            <p className="text-xs font-bold">{invoice.clientName || "Client"}</p>
            <p className="text-[10px] text-gray-500">{invoice.clientAddress}</p>
            <p className="text-[10px] text-gray-500">{invoice.clientEmail}</p>
          </div>
        </div>
        <ItemsTable invoice={invoice} cur={cur} accentColor={accent} />
        <div className="flex justify-end mt-6">
          <SummaryBlock invoice={invoice} cur={cur} subtotal={subtotal} total={total} accentColor={accent} />
        </div>
        {invoice.notes && (
          <div className="mt-8 pt-4 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Notes</p>
            <p className="text-gray-600 text-xs whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StripeTemplate({ invoice, cur, subtotal, total }: TplProps) {
  const accent = invoice.accentColor || "#635BFF";
  return (
    <div className="p-10 text-black text-sm min-h-[600px]" style={{ fontFamily: "system-ui, sans-serif" }}>
      <div className="flex justify-between items-end pb-4 mb-6 border-b border-gray-200">
        <div>
          {invoice.businessLogo && <img src={invoice.businessLogo} alt="" className="h-8 mb-2" />}
          <h1 className="text-lg font-bold text-gray-900">{invoice.businessName || "Your Business"}</h1>
          <p className="text-xs text-gray-500">{invoice.businessAddress}</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold" style={{ color: accent }}>INVOICE</h2>
          <p className="text-xs text-gray-500">{invoice.invoiceNumber}</p>
        </div>
      </div>
      <div className="flex gap-8 mb-6">
        <div className="flex-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Bill To</p>
          <p className="text-xs font-bold">{invoice.clientName || "Client"}</p>
          <p className="text-[10px] text-gray-500">{invoice.clientAddress}</p>
          <p className="text-[10px] text-gray-500">{invoice.clientEmail}</p>
        </div>
        <div className="w-36 text-xs text-gray-600 space-y-1">
          <div className="flex justify-between"><span className="text-gray-400">Date:</span><span>{invoice.invoiceDate}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Due:</span><span>{invoice.dueDate}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Currency:</span><span>{cur.code}</span></div>
        </div>
      </div>
      {/* Stripe-style table with alternating rows */}
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-gray-100 font-semibold" style={{ color: accent }}>
            <td className="py-2 px-3 rounded-l-lg">Description</td>
            <td className="py-2 px-3 text-right">Qty</td>
            <td className="py-2 px-3 text-right">Rate</td>
            <td className="py-2 px-3 text-right rounded-r-lg">Amount</td>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, idx) => (
            <tr key={item.id} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
              <td className="py-2 px-3 text-gray-900">{item.description || "—"}</td>
              <td className="py-2 px-3 text-right text-gray-600">{item.quantity}</td>
              <td className="py-2 px-3 text-right text-gray-600">{cur.symbol}{item.rate.toFixed(2)}</td>
              <td className="py-2 px-3 text-right text-gray-900 font-medium">{cur.symbol}{(item.quantity * item.rate).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end mt-6">
        <SummaryBlock invoice={invoice} cur={cur} subtotal={subtotal} total={total} accentColor={accent} />
      </div>
      {invoice.notes && (
        <div className="mt-8 pt-4 border-t border-gray-200">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Notes</p>
          <p className="text-gray-600 text-xs whitespace-pre-line">{invoice.notes}</p>
        </div>
      )}
    </div>
  );
}

function ContrastTemplate({ invoice, cur, subtotal, total }: TplProps) {
  const accent = invoice.accentColor || "#EF4444";
  return (
    <div className="text-black text-sm min-h-[600px]" style={{ fontFamily: "system-ui, sans-serif" }}>
      <div className="bg-black p-8">
        <div className="flex justify-between items-center">
          <div>
            {invoice.businessLogo && <img src={invoice.businessLogo} alt="" className="h-11 mb-2" />}
            <h2 className="text-3xl font-bold text-white">INVOICE</h2>
            <p className="text-gray-400 text-xs mt-1">{invoice.invoiceNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-white text-sm">{invoice.businessName || "Your Business"}</p>
            <p className="text-gray-400 text-[10px]">{invoice.businessEmail}</p>
            <p className="text-gray-400 text-[10px]">{invoice.businessPhone}</p>
          </div>
        </div>
      </div>
      <div className="p-8">
        <div className="flex gap-8 mb-6">
          <div className="flex-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Bill To</p>
            <p className="font-semibold text-gray-900">{invoice.clientName || "Client"}</p>
            <p className="text-xs text-gray-500 whitespace-pre-line">{invoice.clientAddress}</p>
            <p className="text-xs text-gray-500">{invoice.clientEmail}</p>
          </div>
          <div className="w-36">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Details</p>
            <p className="text-xs text-gray-500">Date: {invoice.invoiceDate}</p>
            <p className="text-xs text-gray-500">Due: {invoice.dueDate}</p>
            <p className="text-xs text-gray-500">Currency: {cur.code}</p>
          </div>
        </div>
        <ItemsTable invoice={invoice} cur={cur} accentColor={accent} />
        <div className="flex justify-end mt-6">
          <div className="w-56 text-xs space-y-1">
            <div className="flex justify-between"><span className="text-gray-400">Subtotal</span><span>{cur.symbol}{subtotal.toFixed(2)}</span></div>
            {invoice.taxRate > 0 && <div className="flex justify-between"><span className="text-gray-400">Tax ({invoice.taxRate}%)</span><span>{cur.symbol}{(subtotal * invoice.taxRate / 100).toFixed(2)}</span></div>}
            {invoice.discount > 0 && <div className="flex justify-between"><span className="text-gray-400">Discount</span><span className="text-red-500">-{cur.symbol}{invoice.discount.toFixed(2)}</span></div>}
            <div className="flex justify-between font-bold text-base pt-2" style={{ borderTop: "2px solid #000" }}>
              <span>Total Due</span><span style={{ color: accent }}>{cur.symbol}{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        {invoice.notes && (
          <div className="mt-8 pt-4 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Notes</p>
            <p className="text-gray-600 text-xs whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ItemsTable({ invoice, cur, accent, bold, accentColor }: { invoice: InvoiceData; cur: { symbol: string }; accent?: boolean; bold?: boolean; accentColor?: string }) {
  const headerBg = accent ? "bg-emerald-50" : "bg-gray-50";
  return (
    <table className="w-full text-xs">
      <thead>
        <tr className={`${headerBg} ${bold ? "font-black" : "font-semibold"} text-gray-600`}>
          <td className="py-2 px-3 rounded-l-lg">Description</td>
          <td className="py-2 px-3 text-right">Qty</td>
          <td className="py-2 px-3 text-right">Rate</td>
          <td className="py-2 px-3 text-right rounded-r-lg">Amount</td>
        </tr>
      </thead>
      <tbody>
        {invoice.items.map((item) => (
          <tr key={item.id} className="border-b border-gray-100">
            <td className="py-2 px-3 text-gray-900">{item.description || "—"}</td>
            <td className="py-2 px-3 text-right text-gray-600">{item.quantity}</td>
            <td className="py-2 px-3 text-right text-gray-600">{cur.symbol}{item.rate.toFixed(2)}</td>
            <td className="py-2 px-3 text-right text-gray-900 font-medium">{cur.symbol}{(item.quantity * item.rate).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SummaryBlock({ invoice, cur, subtotal, total, accent, bold, accentColor }: TplProps & { accent?: boolean; bold?: boolean; accentColor?: string }) {
  const totalColor = accentColor ? "" : accent ? "text-emerald-600" : "text-gray-900";
  return (
    <div className="w-56 text-xs space-y-1">
      <div className="flex justify-between"><span className="text-gray-400">Subtotal</span><span>{cur.symbol}{subtotal.toFixed(2)}</span></div>
      {invoice.taxRate > 0 && <div className="flex justify-between"><span className="text-gray-400">Tax ({invoice.taxRate}%)</span><span>{cur.symbol}{(subtotal * invoice.taxRate / 100).toFixed(2)}</span></div>}
      {invoice.discount > 0 && <div className="flex justify-between"><span className="text-gray-400">Discount</span><span className="text-red-500">-{cur.symbol}{invoice.discount.toFixed(2)}</span></div>}
      <div className={`flex justify-between font-${bold ? "black" : "bold"} text-base border-t border-gray-200 pt-2`}>
        <span>Total</span><span className={totalColor} style={accentColor ? { color: accentColor } : undefined}>{cur.symbol}{total.toFixed(2)}</span>
      </div>
    </div>
  );
}
