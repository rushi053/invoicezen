import { NextRequest, NextResponse } from "next/server";
import { generatePdf } from "@/lib/pdfGenerator";
import { InvoiceData } from "@/lib/types";

const sampleInvoice: Omit<InvoiceData, "template"> = {
  businessName: "Acme Design Co.",
  businessAddress: "123 Creative Blvd, San Francisco, CA 94102",
  businessEmail: "hello@acmedesign.co",
  businessPhone: "+1 (415) 555-0123",
  businessLogo: "",
  clientName: "TechStart Inc.",
  clientAddress: "456 Innovation Way, New York, NY 10001",
  clientEmail: "billing@techstart.io",
  invoiceNumber: "INV-2025-042",
  invoiceDate: "2025-02-11",
  dueDate: "2025-03-11",
  currency: "USD",
  items: [
    { id: "1", description: "Website Redesign", quantity: 1, rate: 4500 },
    { id: "2", description: "Brand Identity Package", quantity: 1, rate: 2800 },
    { id: "3", description: "SEO Optimization", quantity: 3, rate: 600 },
    { id: "4", description: "Content Strategy", quantity: 1, rate: 1200 },
  ],
  taxRate: 8.5,
  discount: 500,
  notes: "Thank you for your business! Payment is due within 30 days.\nPlease include the invoice number in your payment reference.\nBank: Chase | Acct: 1234567890 | Routing: 021000021",
};

export async function GET(req: NextRequest) {
  const template = (req.nextUrl.searchParams.get("template") || "clean") as InvoiceData["template"];
  
  const invoice: InvoiceData = {
    ...sampleInvoice,
    template,
  };

  try {
    const blob = await generatePdf(invoice);
    const buffer = Buffer.from(await blob.arrayBuffer());
    
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="invoicezen-${template}-sample.pdf"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
