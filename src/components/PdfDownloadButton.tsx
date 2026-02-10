"use client";

import { useState } from "react";
import { InvoiceData } from "@/lib/types";

export function PdfDownloadButton({ invoice, onDownload }: { invoice: InvoiceData; onDownload: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      // Dynamic import to avoid SSR issues
      const { generatePdf } = await import("@/lib/pdfGenerator");
      const blob = await generatePdf(invoice);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${invoice.invoiceNumber || "invoice"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      onDownload();
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("PDF generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={loading} className="btn-primary w-full justify-center text-lg !py-4">
      {loading ? "Generating PDF…" : "⬇ Download PDF"}
    </button>
  );
}
