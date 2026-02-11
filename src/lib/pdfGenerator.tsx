import { Document, Page, Text, View, StyleSheet, pdf, Image, Link } from "@react-pdf/renderer";
import { InvoiceData, calcSubtotal, calcTotal, getDaysUntilDue } from "./types";
import { getCurrency } from "./currencies";

// Check if Pro is unlocked (client-side only)
const isProUnlocked = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("invoicezen_pro") === "true";
};

const createStyles = (accentColor: string = "#059669") => StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#111" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  title: { fontSize: 22, fontFamily: "Helvetica-Bold", color: "#111" },
  subtitle: { fontSize: 9, color: "#888", marginTop: 2 },
  logo: { height: 40, marginBottom: 6 },
  sectionLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#999", textTransform: "uppercase", marginBottom: 4, letterSpacing: 1 },
  clientName: { fontSize: 12, fontFamily: "Helvetica-Bold" },
  tableHeader: { flexDirection: "row", backgroundColor: "#f5f5f5", borderRadius: 4, padding: 8, marginBottom: 4 },
  tableRow: { flexDirection: "row", padding: 8, borderBottomWidth: 1, borderBottomColor: "#eee" },
  colDesc: { flex: 3 },
  colQty: { flex: 1, textAlign: "right" },
  colRate: { flex: 1, textAlign: "right" },
  colAmt: { flex: 1, textAlign: "right" },
  th: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#666" },
  summaryRow: { flexDirection: "row", justifyContent: "flex-end", paddingVertical: 2 },
  summaryLabel: { width: 100, textAlign: "right", color: "#888", fontSize: 9 },
  summaryValue: { width: 80, textAlign: "right", fontSize: 9 },
  totalRow: { flexDirection: "row", justifyContent: "flex-end", borderTopWidth: 1, borderTopColor: "#ddd", paddingTop: 6, marginTop: 4 },
  totalLabel: { width: 100, textAlign: "right", fontFamily: "Helvetica-Bold", fontSize: 13 },
  totalValue: { width: 80, textAlign: "right", fontFamily: "Helvetica-Bold", fontSize: 13, color: accentColor },
  notes: { marginTop: 24, borderTopWidth: 1, borderTopColor: "#eee", paddingTop: 12 },
  notesText: { fontSize: 9, color: "#555", lineHeight: 1.5 },
  watermark: { fontSize: 7, color: "#aaa", textAlign: "center", marginTop: 20 },
  watermarkLink: { color: "#aaa", textDecoration: "none" },
  dueReminder: { fontSize: 9, color: accentColor, fontFamily: "Helvetica-Bold", marginTop: 8 },
  // Professional template
  proHeader: { backgroundColor: accentColor, padding: 24, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  proHeaderText: { color: "white" },
  proTitle: { fontSize: 22, fontFamily: "Helvetica-Bold", color: "white" },
  proSub: { fontSize: 9, color: "#fff", opacity: 0.8 },
  proBody: { padding: 40 },
});

interface PdfProps {
  invoice: InvoiceData;
  cur: { symbol: string; code: string };
  subtotal: number;
  total: number;
  isPro: boolean;
}

function DueReminderPdf({ invoice, isPro, accentColor }: { invoice: InvoiceData; isPro: boolean; accentColor: string }) {
  if (!isPro) return null;
  const days = getDaysUntilDue(invoice.invoiceDate, invoice.dueDate);
  if (days <= 0) return null;
  
  return (
    <View style={{ marginTop: 12, padding: 8, backgroundColor: `${accentColor}15`, borderRadius: 4, borderLeftWidth: 3, borderLeftColor: accentColor }}>
      <Text style={{ fontSize: 9, color: accentColor, fontFamily: "Helvetica-Bold" }}>
        ⏰ Payment due in {days} {days === 1 ? "day" : "days"}
      </Text>
    </View>
  );
}

function WatermarkPdf({ isPro }: { isPro: boolean }) {
  if (isPro) return null;
  return (
    <View style={{ marginTop: 24, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#eee" }}>
      <Text style={{ fontSize: 7, color: "#bbb", textAlign: "center" }}>
        Created with <Link src="https://invoice.rushiraj.me" style={{ color: "#059669", textDecoration: "none" }}>InvoiceZen</Link> — Privacy-first invoice generator
      </Text>
    </View>
  );
}

function CleanPdf({ invoice, cur, subtotal, total, isPro }: PdfProps) {
  const accentColor = invoice.accentColor || "#059669";
  const s = createStyles(accentColor);
  
  return (
    <Page size="A4" style={s.page}>
      <View style={s.header}>
        <View>
          {invoice.businessLogo ? <Image src={invoice.businessLogo} style={s.logo} /> : null}
          <Text style={{ fontSize: 16, fontFamily: "Helvetica-Bold" }}>{invoice.businessName || "Your Business"}</Text>
          <Text style={s.subtitle}>{invoice.businessAddress}</Text>
          <Text style={s.subtitle}>{invoice.businessEmail}</Text>
          <Text style={s.subtitle}>{invoice.businessPhone}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={s.title}>INVOICE</Text>
          <Text style={s.subtitle}>{invoice.invoiceNumber}</Text>
          <Text style={s.subtitle}>Date: {invoice.invoiceDate}</Text>
          <Text style={s.subtitle}>Due: {invoice.dueDate}</Text>
        </View>
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={s.sectionLabel}>Bill To</Text>
        <Text style={s.clientName}>{invoice.clientName || "Client Name"}</Text>
        <Text style={s.subtitle}>{invoice.clientAddress}</Text>
        <Text style={s.subtitle}>{invoice.clientEmail}</Text>
      </View>

      <DueReminderPdf invoice={invoice} isPro={isPro} accentColor={accentColor} />

      <ItemsTablePdf invoice={invoice} cur={cur} accentColor={accentColor} />
      <SummaryPdf invoice={invoice} cur={cur} subtotal={subtotal} total={total} accentColor={accentColor} />
      <NotesPdf notes={invoice.notes} />
      <WatermarkPdf isPro={isPro} />
    </Page>
  );
}

function ProfessionalPdf({ invoice, cur, subtotal, total, isPro }: PdfProps) {
  const accentColor = invoice.accentColor || "#059669";
  const s = createStyles(accentColor);
  
  return (
    <Page size="A4" style={{ fontSize: 10, fontFamily: "Helvetica", color: "#111" }}>
      <View style={s.proHeader}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          {invoice.businessLogo ? <Image src={invoice.businessLogo} style={{ height: 36 }} /> : null}
          <View>
            <Text style={s.proTitle}>{invoice.businessName || "Your Business"}</Text>
            <Text style={s.proSub}>{invoice.businessEmail} · {invoice.businessPhone}</Text>
          </View>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ ...s.proTitle }}>INVOICE</Text>
          <Text style={s.proSub}>{invoice.invoiceNumber}</Text>
        </View>
      </View>
      <View style={s.proBody}>
        <View style={{ flexDirection: "row", marginBottom: 20 }}>
          <View style={{ flex: 1 }}>
            <Text style={s.sectionLabel}>From</Text>
            <Text style={s.subtitle}>{invoice.businessAddress}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.sectionLabel}>Bill To</Text>
            <Text style={s.clientName}>{invoice.clientName || "Client"}</Text>
            <Text style={s.subtitle}>{invoice.clientAddress}</Text>
            <Text style={s.subtitle}>{invoice.clientEmail}</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 20, marginBottom: 20 }}>
          <Text style={s.subtitle}>Date: {invoice.invoiceDate}</Text>
          <Text style={s.subtitle}>Due: {invoice.dueDate}</Text>
          <Text style={s.subtitle}>Currency: {cur.code}</Text>
        </View>
        <DueReminderPdf invoice={invoice} isPro={isPro} accentColor={accentColor} />
        <ItemsTablePdf invoice={invoice} cur={cur} accentColor={accentColor} />
        <SummaryPdf invoice={invoice} cur={cur} subtotal={subtotal} total={total} accentColor={accentColor} />
        <NotesPdf notes={invoice.notes} />
        <WatermarkPdf isPro={isPro} />
      </View>
    </Page>
  );
}

function BoldPdf({ invoice, cur, subtotal, total, isPro }: PdfProps) {
  const accentColor = invoice.accentColor || "#059669";
  const s = createStyles(accentColor);
  
  return (
    <Page size="A4" style={s.page}>
      <View style={{ ...s.header, alignItems: "flex-start" }}>
        <View>
          {invoice.businessLogo ? <Image src={invoice.businessLogo} style={{ height: 44, marginBottom: 8 }} /> : null}
          <Text style={{ fontSize: 22, fontFamily: "Helvetica-Bold" }}>{invoice.businessName || "Your Business"}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ fontSize: 36, fontFamily: "Helvetica-Bold", color: accentColor }}>INV</Text>
          <Text style={{ fontSize: 10, fontFamily: "Courier" }}>{invoice.invoiceNumber}</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", backgroundColor: "#f9f9f9", borderRadius: 6, padding: 12, marginBottom: 20 }}>
        <View style={{ flex: 1 }}>
          <Text style={s.sectionLabel}>From</Text>
          <Text style={s.subtitle}>{invoice.businessAddress}</Text>
          <Text style={s.subtitle}>{invoice.businessEmail}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.sectionLabel}>To</Text>
          <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold" }}>{invoice.clientName || "Client"}</Text>
          <Text style={s.subtitle}>{invoice.clientAddress}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.sectionLabel}>Details</Text>
          <Text style={s.subtitle}>Date: {invoice.invoiceDate}</Text>
          <Text style={s.subtitle}>Due: {invoice.dueDate}</Text>
          <Text style={s.subtitle}>Currency: {cur.code}</Text>
        </View>
      </View>

      <DueReminderPdf invoice={invoice} isPro={isPro} accentColor={accentColor} />
      <ItemsTablePdf invoice={invoice} cur={cur} accentColor={accentColor} />
      <SummaryPdf invoice={invoice} cur={cur} subtotal={subtotal} total={total} accentColor={accentColor} />
      <NotesPdf notes={invoice.notes} />
      <WatermarkPdf isPro={isPro} />
    </Page>
  );
}

function ExecutivePdf({ invoice, cur, subtotal, total, isPro }: PdfProps) {
  const accentColor = invoice.accentColor || "#D4AF37";
  const s = createStyles(accentColor);
  
  return (
    <Page size="A4" style={{ fontSize: 10, fontFamily: "Helvetica", color: "#111" }}>
      <View style={{ backgroundColor: "#1e3a5f", padding: 24, borderBottomWidth: 3, borderBottomColor: accentColor }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <Text style={{ fontSize: 20, fontFamily: "Helvetica-Bold", color: "white" }}>INVOICE</Text>
            <Text style={{ color: accentColor, fontSize: 11 }}>{invoice.invoiceNumber}</Text>
          </View>
          {invoice.businessLogo ? <Image src={invoice.businessLogo} style={{ height: 40 }} /> : null}
        </View>
      </View>

      <View style={{ padding: 40 }}>
        <View style={{ flexDirection: "row", gap: 30, marginBottom: 24 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: accentColor, textTransform: "uppercase", marginBottom: 4 }}>From</Text>
            <Text style={{ fontSize: 14, fontFamily: "Helvetica-Bold", marginBottom: 4 }}>{invoice.businessName || "Your Business"}</Text>
            <Text style={s.subtitle}>{invoice.businessAddress}</Text>
            <Text style={s.subtitle}>{invoice.businessEmail}</Text>
            <Text style={s.subtitle}>{invoice.businessPhone}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: accentColor, textTransform: "uppercase", marginBottom: 4 }}>Invoice Details</Text>
            <View style={{ gap: 4 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 9, color: "#666" }}>Date:</Text>
                <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold" }}>{invoice.invoiceDate}</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 9, color: "#666" }}>Due Date:</Text>
                <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold" }}>{invoice.dueDate}</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 9, color: "#666" }}>Currency:</Text>
                <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold" }}>{cur.code}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ borderTopWidth: 2, borderTopColor: accentColor, paddingTop: 16, marginBottom: 20 }}>
          <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: accentColor, textTransform: "uppercase", marginBottom: 4 }}>Bill To</Text>
          <Text style={{ fontSize: 12, fontFamily: "Helvetica-Bold", marginBottom: 2 }}>{invoice.clientName || "Client"}</Text>
          <Text style={s.subtitle}>{invoice.clientAddress}</Text>
          <Text style={s.subtitle}>{invoice.clientEmail}</Text>
        </View>

        <DueReminderPdf invoice={invoice} isPro={isPro} accentColor={accentColor} />
        <ItemsTablePdf invoice={invoice} cur={cur} accentColor={accentColor} />
        <SummaryPdf invoice={invoice} cur={cur} subtotal={subtotal} total={total} accentColor={accentColor} />
        <NotesPdf notes={invoice.notes} />
        <WatermarkPdf isPro={isPro} />
      </View>
    </Page>
  );
}

function CreativePdf({ invoice, cur, subtotal, total, isPro }: PdfProps) {
  const accentColor = invoice.accentColor || "#14b8a6";
  const sidebarColor = invoice.accentColor || "#047857";
  const s = createStyles(accentColor);
  
  return (
    <Page size="A4" style={{ fontSize: 10, fontFamily: "Helvetica", color: "#111" }}>
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: 80, backgroundColor: sidebarColor, padding: 16 }}>
          <Text style={{ fontSize: 28, fontFamily: "Helvetica-Bold", color: "white", transform: "rotate(-90deg)", marginTop: 80 }}>
            {invoice.invoiceNumber}
          </Text>
        </View>
        <View style={{ flex: 1, padding: 32 }}>
          {invoice.businessLogo ? <Image src={invoice.businessLogo} style={{ height: 36, marginBottom: 12 }} /> : null}
          
          <View style={{ borderLeftWidth: 4, borderLeftColor: accentColor, paddingLeft: 12, marginBottom: 20 }}>
            <Text style={{ fontSize: 20, fontFamily: "Helvetica-Bold", color: sidebarColor }}>INVOICE</Text>
            <Text style={{ fontSize: 8, color: "#666", marginTop: 2 }}>
              Date: {invoice.invoiceDate} · Due: {invoice.dueDate}
            </Text>
          </View>

          <View style={{ flexDirection: "row", gap: 24, marginBottom: 20 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: accentColor, textTransform: "uppercase", marginBottom: 4 }}>From</Text>
              <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold" }}>{invoice.businessName || "Your Business"}</Text>
              <Text style={{ fontSize: 8, color: "#888" }}>{invoice.businessAddress}</Text>
              <Text style={{ fontSize: 8, color: "#888" }}>{invoice.businessEmail}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: accentColor, textTransform: "uppercase", marginBottom: 4 }}>To</Text>
              <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold" }}>{invoice.clientName || "Client"}</Text>
              <Text style={{ fontSize: 8, color: "#888" }}>{invoice.clientAddress}</Text>
              <Text style={{ fontSize: 8, color: "#888" }}>{invoice.clientEmail}</Text>
            </View>
          </View>

          <DueReminderPdf invoice={invoice} isPro={isPro} accentColor={accentColor} />
          <ItemsTablePdf invoice={invoice} cur={cur} accentColor={accentColor} />
          <SummaryPdf invoice={invoice} cur={cur} subtotal={subtotal} total={total} accentColor={accentColor} />
          <NotesPdf notes={invoice.notes} />
          <WatermarkPdf isPro={isPro} />
        </View>
      </View>
    </Page>
  );
}

function StripePdf({ invoice, cur, subtotal, total, isPro }: PdfProps) {
  const accentColor = invoice.accentColor || "#635BFF";
  const s = createStyles(accentColor);
  
  return (
    <Page size="A4" style={{ padding: 48, fontSize: 10, fontFamily: "Helvetica", color: "#111" }}>
      <View style={{ borderBottomWidth: 1, borderBottomColor: "#e5e7eb", paddingBottom: 16, marginBottom: 24 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
          <View>
            {invoice.businessLogo ? <Image src={invoice.businessLogo} style={{ height: 32, marginBottom: 6 }} /> : null}
            <Text style={{ fontSize: 18, fontFamily: "Helvetica-Bold" }}>{invoice.businessName || "Your Business"}</Text>
            <Text style={{ fontSize: 9, color: "#888" }}>{invoice.businessAddress}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: 24, fontFamily: "Helvetica-Bold", color: accentColor }}>INVOICE</Text>
            <Text style={{ fontSize: 11, color: "#666" }}>{invoice.invoiceNumber}</Text>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 32, marginBottom: 24 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold", color: "#999", textTransform: "uppercase", marginBottom: 4 }}>Bill To</Text>
          <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 2 }}>{invoice.clientName || "Client"}</Text>
          <Text style={{ fontSize: 9, color: "#888" }}>{invoice.clientAddress}</Text>
          <Text style={{ fontSize: 9, color: "#888" }}>{invoice.clientEmail}</Text>
        </View>
        <View style={{ width: 140 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 3 }}>
            <Text style={{ fontSize: 9, color: "#666" }}>Date:</Text>
            <Text style={{ fontSize: 9 }}>{invoice.invoiceDate}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 3 }}>
            <Text style={{ fontSize: 9, color: "#666" }}>Due:</Text>
            <Text style={{ fontSize: 9 }}>{invoice.dueDate}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 9, color: "#666" }}>Currency:</Text>
            <Text style={{ fontSize: 9 }}>{cur.code}</Text>
          </View>
        </View>
      </View>

      <DueReminderPdf invoice={invoice} isPro={isPro} accentColor={accentColor} />

      <View>
        <View style={{ flexDirection: "row", backgroundColor: "#f3f4f6", borderRadius: 4, padding: 8, marginBottom: 4 }}>
          <Text style={{ flex: 3, fontSize: 9, fontFamily: "Helvetica-Bold", color: accentColor }}>Description</Text>
          <Text style={{ flex: 1, textAlign: "right", fontSize: 9, fontFamily: "Helvetica-Bold", color: accentColor }}>Qty</Text>
          <Text style={{ flex: 1, textAlign: "right", fontSize: 9, fontFamily: "Helvetica-Bold", color: accentColor }}>Rate</Text>
          <Text style={{ flex: 1, textAlign: "right", fontSize: 9, fontFamily: "Helvetica-Bold", color: accentColor }}>Amount</Text>
        </View>
        {invoice.items.map((item, idx) => (
          <View key={item.id} style={{ flexDirection: "row", padding: 10, backgroundColor: idx % 2 === 0 ? "#f9fafb" : "white" }}>
            <Text style={{ flex: 3 }}>{item.description || "—"}</Text>
            <Text style={{ flex: 1, textAlign: "right" }}>{item.quantity}</Text>
            <Text style={{ flex: 1, textAlign: "right" }}>{cur.symbol}{item.rate.toFixed(2)}</Text>
            <Text style={{ flex: 1, textAlign: "right", fontFamily: "Helvetica-Bold" }}>{cur.symbol}{(item.quantity * item.rate).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <SummaryPdf invoice={invoice} cur={cur} subtotal={subtotal} total={total} accentColor={accentColor} />
      <NotesPdf notes={invoice.notes} />
      <WatermarkPdf isPro={isPro} />
    </Page>
  );
}

function ContrastPdf({ invoice, cur, subtotal, total, isPro }: PdfProps) {
  const accentColor = invoice.accentColor || "#EF4444";
  const s = createStyles(accentColor);
  
  return (
    <Page size="A4" style={{ fontSize: 10, fontFamily: "Helvetica" }}>
      <View style={{ backgroundColor: "#000", padding: 28 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            {invoice.businessLogo ? <Image src={invoice.businessLogo} style={{ height: 44, marginBottom: 8 }} /> : null}
            <Text style={{ fontSize: 28, fontFamily: "Helvetica-Bold", color: "white" }}>INVOICE</Text>
            <Text style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>{invoice.invoiceNumber}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: 11, color: "white", marginBottom: 2 }}>{invoice.businessName || "Your Business"}</Text>
            <Text style={{ fontSize: 8, color: "#aaa" }}>{invoice.businessEmail}</Text>
            <Text style={{ fontSize: 8, color: "#aaa" }}>{invoice.businessPhone}</Text>
          </View>
        </View>
      </View>

      <View style={{ padding: 40, backgroundColor: "white" }}>
        <View style={{ flexDirection: "row", gap: 28, marginBottom: 24 }}>
          <View style={{ flex: 1 }}>
            <Text style={s.sectionLabel}>Bill To</Text>
            <Text style={{ fontSize: 12, fontFamily: "Helvetica-Bold", marginBottom: 2 }}>{invoice.clientName || "Client"}</Text>
            <Text style={s.subtitle}>{invoice.clientAddress}</Text>
            <Text style={s.subtitle}>{invoice.clientEmail}</Text>
          </View>
          <View style={{ width: 150 }}>
            <Text style={s.sectionLabel}>Invoice Details</Text>
            <View style={{ gap: 2 }}>
              <Text style={{ fontSize: 9, color: "#888" }}>Date: {invoice.invoiceDate}</Text>
              <Text style={{ fontSize: 9, color: "#888" }}>Due: {invoice.dueDate}</Text>
              <Text style={{ fontSize: 9, color: "#888" }}>Currency: {cur.code}</Text>
            </View>
          </View>
        </View>

        <DueReminderPdf invoice={invoice} isPro={isPro} accentColor={accentColor} />
        <ItemsTablePdf invoice={invoice} cur={cur} accentColor={accentColor} />

        <View style={{ marginTop: 16 }}>
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Subtotal</Text>
            <Text style={s.summaryValue}>{cur.symbol}{subtotal.toFixed(2)}</Text>
          </View>
          {invoice.taxRate > 0 && (
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Tax ({invoice.taxRate}%)</Text>
              <Text style={s.summaryValue}>{cur.symbol}{(subtotal * invoice.taxRate / 100).toFixed(2)}</Text>
            </View>
          )}
          {invoice.discount > 0 && (
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Discount</Text>
              <Text style={{ ...s.summaryValue, color: "#ef4444" }}>-{cur.symbol}{invoice.discount.toFixed(2)}</Text>
            </View>
          )}
          <View style={{ ...s.totalRow, borderTopWidth: 2, borderTopColor: "#000" }}>
            <Text style={{ ...s.totalLabel, fontSize: 14 }}>Total Due</Text>
            <Text style={{ width: 80, textAlign: "right", fontFamily: "Helvetica-Bold", fontSize: 14, color: accentColor }}>
              {cur.symbol}{total.toFixed(2)}
            </Text>
          </View>
        </View>

        <NotesPdf notes={invoice.notes} />
        <WatermarkPdf isPro={isPro} />
      </View>
    </Page>
  );
}

function ItemsTablePdf({ invoice, cur, accentColor }: { invoice: InvoiceData; cur: { symbol: string }; accentColor: string }) {
  return (
    <View>
      <View style={{ flexDirection: "row", backgroundColor: "#f5f5f5", borderRadius: 4, padding: 8, marginBottom: 4 }}>
        <Text style={{ flex: 3, fontSize: 9, fontFamily: "Helvetica-Bold", color: "#666" }}>Description</Text>
        <Text style={{ flex: 1, textAlign: "right", fontSize: 9, fontFamily: "Helvetica-Bold", color: "#666" }}>Qty</Text>
        <Text style={{ flex: 1, textAlign: "right", fontSize: 9, fontFamily: "Helvetica-Bold", color: "#666" }}>Rate</Text>
        <Text style={{ flex: 1, textAlign: "right", fontSize: 9, fontFamily: "Helvetica-Bold", color: "#666" }}>Amount</Text>
      </View>
      {invoice.items.map((item) => (
        <View key={item.id} style={{ flexDirection: "row", padding: 8, borderBottomWidth: 1, borderBottomColor: "#eee" }}>
          <Text style={{ flex: 3 }}>{item.description || "—"}</Text>
          <Text style={{ flex: 1, textAlign: "right" }}>{item.quantity}</Text>
          <Text style={{ flex: 1, textAlign: "right" }}>{cur.symbol}{item.rate.toFixed(2)}</Text>
          <Text style={{ flex: 1, textAlign: "right", fontFamily: "Helvetica-Bold" }}>{cur.symbol}{(item.quantity * item.rate).toFixed(2)}</Text>
        </View>
      ))}
    </View>
  );
}

function SummaryPdf({ invoice, cur, subtotal, total, accentColor }: { invoice: InvoiceData; cur: { symbol: string; code: string }; subtotal: number; total: number; accentColor: string }) {
  return (
    <View style={{ marginTop: 16 }}>
      <View style={{ flexDirection: "row", justifyContent: "flex-end", paddingVertical: 2 }}>
        <Text style={{ width: 100, textAlign: "right", color: "#888", fontSize: 9 }}>Subtotal</Text>
        <Text style={{ width: 80, textAlign: "right", fontSize: 9 }}>{cur.symbol}{subtotal.toFixed(2)}</Text>
      </View>
      {invoice.taxRate > 0 && (
        <View style={{ flexDirection: "row", justifyContent: "flex-end", paddingVertical: 2 }}>
          <Text style={{ width: 100, textAlign: "right", color: "#888", fontSize: 9 }}>Tax ({invoice.taxRate}%)</Text>
          <Text style={{ width: 80, textAlign: "right", fontSize: 9 }}>{cur.symbol}{(subtotal * invoice.taxRate / 100).toFixed(2)}</Text>
        </View>
      )}
      {invoice.discount > 0 && (
        <View style={{ flexDirection: "row", justifyContent: "flex-end", paddingVertical: 2 }}>
          <Text style={{ width: 100, textAlign: "right", color: "#888", fontSize: 9 }}>Discount</Text>
          <Text style={{ width: 80, textAlign: "right", fontSize: 9, color: "#ef4444" }}>-{cur.symbol}{invoice.discount.toFixed(2)}</Text>
        </View>
      )}
      <View style={{ flexDirection: "row", justifyContent: "flex-end", borderTopWidth: 1, borderTopColor: "#ddd", paddingTop: 6, marginTop: 4 }}>
        <Text style={{ width: 100, textAlign: "right", fontFamily: "Helvetica-Bold", fontSize: 13 }}>Total</Text>
        <Text style={{ width: 80, textAlign: "right", fontFamily: "Helvetica-Bold", fontSize: 13, color: accentColor }}>
          {cur.symbol}{total.toFixed(2)}
        </Text>
      </View>
    </View>
  );
}

function NotesPdf({ notes }: { notes: string }) {
  if (!notes) return null;
  return (
    <View style={{ marginTop: 24, borderTopWidth: 1, borderTopColor: "#eee", paddingTop: 12 }}>
      <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: "#999", textTransform: "uppercase", marginBottom: 4 }}>Notes</Text>
      <Text style={{ fontSize: 9, color: "#555", lineHeight: 1.5 }}>{notes}</Text>
    </View>
  );
}

export async function generatePdf(invoice: InvoiceData): Promise<Blob> {
  const cur = getCurrency(invoice.currency);
  const subtotal = calcSubtotal(invoice.items);
  const total = calcTotal(invoice.items, invoice.taxRate, invoice.discount);
  const isPro = isProUnlocked();

  const props: PdfProps = { invoice, cur, subtotal, total, isPro };

  let page;
  if (invoice.template === "professional") page = <ProfessionalPdf {...props} />;
  else if (invoice.template === "bold") page = <BoldPdf {...props} />;
  else if (invoice.template === "executive") page = <ExecutivePdf {...props} />;
  else if (invoice.template === "creative") page = <CreativePdf {...props} />;
  else if (invoice.template === "stripe") page = <StripePdf {...props} />;
  else if (invoice.template === "contrast") page = <ContrastPdf {...props} />;
  else page = <CleanPdf {...props} />;

  const doc = <Document>{page}</Document>;
  return await pdf(doc).toBlob();
}
