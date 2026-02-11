export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export interface InvoiceData {
  // Business details
  businessName: string;
  businessAddress: string;
  businessEmail: string;
  businessPhone: string;
  businessLogo: string; // base64

  // Client details
  clientName: string;
  clientAddress: string;
  clientEmail: string;

  // Invoice info
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;

  // Line items
  items: LineItem[];

  // Summary
  taxRate: number;
  discount: number;

  // Notes
  notes: string;

  // Template
  template: "clean" | "professional" | "bold" | "executive" | "creative" | "stripe" | "contrast";
  
  // Pro features
  accentColor?: string; // Custom accent color for Pro users
}

export const defaultInvoice: InvoiceData = {
  businessName: "",
  businessAddress: "",
  businessEmail: "",
  businessPhone: "",
  businessLogo: "",
  clientName: "",
  clientAddress: "",
  clientEmail: "",
  invoiceNumber: "INV-001",
  invoiceDate: new Date().toISOString().split("T")[0],
  dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
  currency: "USD",
  items: [{ id: "1", description: "", quantity: 1, rate: 0 }],
  taxRate: 0,
  discount: 0,
  notes: "",
  template: "clean",
  accentColor: "#059669",
};

export function getDaysUntilDue(invoiceDate: string, dueDate: string): number {
  const invoice = new Date(invoiceDate);
  const due = new Date(dueDate);
  const diff = due.getTime() - invoice.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function calcSubtotal(items: LineItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity * i.rate, 0);
}

export function calcTotal(items: LineItem[], taxRate: number, discount: number): number {
  const sub = calcSubtotal(items);
  const tax = sub * (taxRate / 100);
  return sub + tax - discount;
}
