import { Document, Page, Text, View, StyleSheet, pdf, Image } from "@react-pdf/renderer";
import { InvoiceData, calcSubtotal, calcTotal } from "./types";
import { getCurrency } from "./currencies";

const s = StyleSheet.create({
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
  totalValue: { width: 80, textAlign: "right", fontFamily: "Helvetica-Bold", fontSize: 13, color: "#059669" },
  notes: { marginTop: 24, borderTopWidth: 1, borderTopColor: "#eee", paddingTop: 12 },
  notesText: { fontSize: 9, color: "#555", lineHeight: 1.5 },
  // Professional template
  proHeader: { backgroundColor: "#059669", padding: 24, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  proHeaderText: { color: "white" },
  proTitle: { fontSize: 22, fontFamily: "Helvetica-Bold", color: "white" },
  proSub: { fontSize: 9, color: "#a7f3d0" },
  proBody: { padding: 40 },
  // Bold template
  boldInv: { fontSize: 36, fontFamily: "Helvetica-Bold", color: "#059669" },
  // Executive template
  execHeader: { backgroundColor: "#1e3a5f", padding: 24, borderBottomWidth: 3, borderBottomColor: "#D4AF37" },
  execGold: { color: "#D4AF37" },
  execTitle: { fontSize: 20, fontFamily: "Helvetica-Bold", color: "white" },
  execColumns: { flexDirection: "row", gap: 30, marginBottom: 24 },
  execCol: { flex: 1 },
  execTotalValue: { width: 80, textAlign: "right", fontFamily: "Helvetica-Bold", fontSize: 14, color: "#D4AF37" },
  // Creative template
  creativeContainer: { flexDirection: "row" },
  creativeSidebar: { width: 80, backgroundColor: "#047857", padding: 16 },
  creativeMain: { flex: 1, padding: 32 },
  creativeInvNumber: { fontSize: 28, fontFamily: "Helvetica-Bold", color: "white", transform: "rotate(-90deg)", marginTop: 80 },
  creativeTealHeader: { borderLeftWidth: 4, borderLeftColor: "#14b8a6", paddingLeft: 12, marginBottom: 20 },
  // Stripe template
  stripeHeader: { borderBottomWidth: 1, borderBottomColor: "#e5e7eb", paddingBottom: 16, marginBottom: 24 },
  stripeAccent: { color: "#635BFF" },
  stripeRow: { flexDirection: "row", padding: 10, backgroundColor: "#f9fafb" },
  stripeRowAlt: { flexDirection: "row", padding: 10, backgroundColor: "white" },
  stripeTotalValue: { width: 80, textAlign: "right", fontFamily: "Helvetica-Bold", fontSize: 13, color: "#635BFF" },
  // Contrast template
  contrastHeader: { backgroundColor: "#000", padding: 28 },
  contrastTitle: { fontSize: 28, fontFamily: "Helvetica-Bold", color: "white" },
  contrastBody: { padding: 40, backgroundColor: "white" },
  contrastTotalValue: { width: 80, textAlign: "right", fontFamily: "Helvetica-Bold", fontSize: 14, color: "#EF4444" },
});

function CleanPdf({ invoice, cur, subtotal, total }: PdfProps) {
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

      <ItemsTablePdf invoice={invoice} cur={cur} />
      <SummaryPdf invoice={invoice} cur={cur} subtotal={subtotal} total={total} />
      <NotesPdf notes={invoice.notes} />
    </Page>
  );
}

function ProfessionalPdf({ invoice, cur, subtotal, total }: PdfProps) {
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
        <ItemsTablePdf invoice={invoice} cur={cur} />
        <SummaryPdf invoice={invoice} cur={cur} subtotal={subtotal} total={total} />
        <NotesPdf notes={invoice.notes} />
      </View>
    </Page>
  );
}

function BoldPdf({ invoice, cur, subtotal, total }: PdfProps) {
  return (
    <Page size="A4" style={s.page}>
      <View style={{ ...s.header, alignItems: "flex-start" }}>
        <View>
          {invoice.businessLogo ? <Image src={invoice.businessLogo} style={{ height: 44, marginBottom: 8 }} /> : null}
          <Text style={{ fontSize: 22, fontFamily: "Helvetica-Bold" }}>{invoice.businessName || "Your Business"}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={s.boldInv}>INV</Text>
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

      <ItemsTablePdf invoice={invoice} cur={cur} />
      <SummaryPdf invoice={invoice} cur={cur} subtotal={subtotal} total={total} />
      <NotesPdf notes={invoice.notes} />
    </Page>
  );
}

function ExecutivePdf({ invoice, cur, subtotal, total }: PdfProps) {
  return (
    <Page size="A4" style={{ fontSize: 10, fontFamily: "Helvetica", color: "#111" }}>
      <View style={s.execHeader}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <Text style={s.execTitle}>INVOICE</Text>
            <Text style={{ ...s.execGold, fontSize: 11 }}>{invoice.invoiceNumber}</Text>
          </View>
          {invoice.businessLogo ? <Image src={invoice.businessLogo} style={{ height: 40 }} /> : null}
        </View>
      </View>

      <View style={{ padding: 40 }}>
        <View style={s.execColumns}>
          <View style={s.execCol}>
            <Text style={{ ...s.sectionLabel, color: "#D4AF37" }}>From</Text>
            <Text style={{ fontSize: 14, fontFamily: "Helvetica-Bold", marginBottom: 4 }}>{invoice.businessName || "Your Business"}</Text>
            <Text style={s.subtitle}>{invoice.businessAddress}</Text>
            <Text style={s.subtitle}>{invoice.businessEmail}</Text>
            <Text style={s.subtitle}>{invoice.businessPhone}</Text>
          </View>
          <View style={s.execCol}>
            <Text style={{ ...s.sectionLabel, color: "#D4AF37" }}>Invoice Details</Text>
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

        <View style={{ borderTopWidth: 2, borderTopColor: "#D4AF37", paddingTop: 16, marginBottom: 20 }}>
          <Text style={{ ...s.sectionLabel, color: "#D4AF37" }}>Bill To</Text>
          <Text style={{ fontSize: 12, fontFamily: "Helvetica-Bold", marginBottom: 2 }}>{invoice.clientName || "Client"}</Text>
          <Text style={s.subtitle}>{invoice.clientAddress}</Text>
          <Text style={s.subtitle}>{invoice.clientEmail}</Text>
        </View>

        <ItemsTablePdf invoice={invoice} cur={cur} />
        
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
          <View style={{ ...s.totalRow, borderTopColor: "#D4AF37", borderTopWidth: 2 }}>
            <Text style={{ ...s.totalLabel, fontSize: 14 }}>Total</Text>
            <Text style={s.execTotalValue}>{cur.symbol}{total.toFixed(2)}</Text>
          </View>
        </View>
        
        <NotesPdf notes={invoice.notes} />
      </View>
    </Page>
  );
}

function CreativePdf({ invoice, cur, subtotal, total }: PdfProps) {
  return (
    <Page size="A4" style={{ fontSize: 10, fontFamily: "Helvetica", color: "#111" }}>
      <View style={s.creativeContainer}>
        <View style={s.creativeSidebar}>
          <Text style={s.creativeInvNumber}>{invoice.invoiceNumber}</Text>
        </View>
        <View style={s.creativeMain}>
          {invoice.businessLogo ? <Image src={invoice.businessLogo} style={{ height: 36, marginBottom: 12 }} /> : null}
          
          <View style={s.creativeTealHeader}>
            <Text style={{ fontSize: 20, fontFamily: "Helvetica-Bold", color: "#047857" }}>INVOICE</Text>
            <Text style={{ fontSize: 8, color: "#666", marginTop: 2 }}>
              Date: {invoice.invoiceDate} · Due: {invoice.dueDate}
            </Text>
          </View>

          <View style={{ flexDirection: "row", gap: 24, marginBottom: 20 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ ...s.sectionLabel, color: "#14b8a6" }}>From</Text>
              <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold" }}>{invoice.businessName || "Your Business"}</Text>
              <Text style={{ ...s.subtitle, fontSize: 8 }}>{invoice.businessAddress}</Text>
              <Text style={{ ...s.subtitle, fontSize: 8 }}>{invoice.businessEmail}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ ...s.sectionLabel, color: "#14b8a6" }}>To</Text>
              <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold" }}>{invoice.clientName || "Client"}</Text>
              <Text style={{ ...s.subtitle, fontSize: 8 }}>{invoice.clientAddress}</Text>
              <Text style={{ ...s.subtitle, fontSize: 8 }}>{invoice.clientEmail}</Text>
            </View>
          </View>

          <ItemsTablePdf invoice={invoice} cur={cur} />
          <SummaryPdf invoice={invoice} cur={cur} subtotal={subtotal} total={total} />
          <NotesPdf notes={invoice.notes} />
        </View>
      </View>
    </Page>
  );
}

function StripePdf({ invoice, cur, subtotal, total }: PdfProps) {
  return (
    <Page size="A4" style={{ padding: 48, fontSize: 10, fontFamily: "Helvetica", color: "#111" }}>
      <View style={s.stripeHeader}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
          <View>
            {invoice.businessLogo ? <Image src={invoice.businessLogo} style={{ height: 32, marginBottom: 6 }} /> : null}
            <Text style={{ fontSize: 18, fontFamily: "Helvetica-Bold" }}>{invoice.businessName || "Your Business"}</Text>
            <Text style={{ ...s.subtitle, fontSize: 9 }}>{invoice.businessAddress}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: 24, fontFamily: "Helvetica-Bold", color: "#635BFF" }}>INVOICE</Text>
            <Text style={{ fontSize: 11, color: "#666" }}>{invoice.invoiceNumber}</Text>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 32, marginBottom: 24 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ ...s.sectionLabel, fontSize: 7 }}>Bill To</Text>
          <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 2 }}>{invoice.clientName || "Client"}</Text>
          <Text style={{ ...s.subtitle, fontSize: 9 }}>{invoice.clientAddress}</Text>
          <Text style={{ ...s.subtitle, fontSize: 9 }}>{invoice.clientEmail}</Text>
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

      <View>
        <View style={{ ...s.tableHeader, backgroundColor: "#f3f4f6" }}>
          <Text style={{ ...s.th, ...s.colDesc, color: "#635BFF" }}>Description</Text>
          <Text style={{ ...s.th, ...s.colQty, color: "#635BFF" }}>Qty</Text>
          <Text style={{ ...s.th, ...s.colRate, color: "#635BFF" }}>Rate</Text>
          <Text style={{ ...s.th, ...s.colAmt, color: "#635BFF" }}>Amount</Text>
        </View>
        {invoice.items.map((item, idx) => (
          <View key={item.id} style={idx % 2 === 0 ? s.stripeRow : s.stripeRowAlt}>
            <Text style={s.colDesc}>{item.description || "—"}</Text>
            <Text style={s.colQty}>{item.quantity}</Text>
            <Text style={s.colRate}>{cur.symbol}{item.rate.toFixed(2)}</Text>
            <Text style={{ ...s.colAmt, fontFamily: "Helvetica-Bold" }}>{cur.symbol}{(item.quantity * item.rate).toFixed(2)}</Text>
          </View>
        ))}
      </View>

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
        <View style={{ ...s.totalRow, borderTopColor: "#e5e7eb" }}>
          <Text style={s.totalLabel}>Total</Text>
          <Text style={s.stripeTotalValue}>{cur.symbol}{total.toFixed(2)}</Text>
        </View>
      </View>

      <NotesPdf notes={invoice.notes} />
    </Page>
  );
}

function ContrastPdf({ invoice, cur, subtotal, total }: PdfProps) {
  return (
    <Page size="A4" style={{ fontSize: 10, fontFamily: "Helvetica" }}>
      <View style={s.contrastHeader}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            {invoice.businessLogo ? <Image src={invoice.businessLogo} style={{ height: 44, marginBottom: 8 }} /> : null}
            <Text style={s.contrastTitle}>INVOICE</Text>
            <Text style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>{invoice.invoiceNumber}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: 11, color: "white", marginBottom: 2 }}>{invoice.businessName || "Your Business"}</Text>
            <Text style={{ fontSize: 8, color: "#aaa" }}>{invoice.businessEmail}</Text>
            <Text style={{ fontSize: 8, color: "#aaa" }}>{invoice.businessPhone}</Text>
          </View>
        </View>
      </View>

      <View style={s.contrastBody}>
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
              <Text style={{ ...s.subtitle, fontSize: 9 }}>Date: {invoice.invoiceDate}</Text>
              <Text style={{ ...s.subtitle, fontSize: 9 }}>Due: {invoice.dueDate}</Text>
              <Text style={{ ...s.subtitle, fontSize: 9 }}>Currency: {cur.code}</Text>
            </View>
          </View>
        </View>

        <ItemsTablePdf invoice={invoice} cur={cur} />

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
            <Text style={s.contrastTotalValue}>{cur.symbol}{total.toFixed(2)}</Text>
          </View>
        </View>

        <NotesPdf notes={invoice.notes} />
      </View>
    </Page>
  );
}

function ItemsTablePdf({ invoice, cur }: { invoice: InvoiceData; cur: { symbol: string } }) {
  return (
    <View>
      <View style={s.tableHeader}>
        <Text style={{ ...s.th, ...s.colDesc }}>Description</Text>
        <Text style={{ ...s.th, ...s.colQty }}>Qty</Text>
        <Text style={{ ...s.th, ...s.colRate }}>Rate</Text>
        <Text style={{ ...s.th, ...s.colAmt }}>Amount</Text>
      </View>
      {invoice.items.map((item) => (
        <View key={item.id} style={s.tableRow}>
          <Text style={s.colDesc}>{item.description || "—"}</Text>
          <Text style={s.colQty}>{item.quantity}</Text>
          <Text style={s.colRate}>{cur.symbol}{item.rate.toFixed(2)}</Text>
          <Text style={{ ...s.colAmt, fontFamily: "Helvetica-Bold" }}>{cur.symbol}{(item.quantity * item.rate).toFixed(2)}</Text>
        </View>
      ))}
    </View>
  );
}

function SummaryPdf({ invoice, cur, subtotal, total }: PdfProps) {
  return (
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
      <View style={s.totalRow}>
        <Text style={s.totalLabel}>Total</Text>
        <Text style={s.totalValue}>{cur.symbol}{total.toFixed(2)}</Text>
      </View>
    </View>
  );
}

function NotesPdf({ notes }: { notes: string }) {
  if (!notes) return null;
  return (
    <View style={s.notes}>
      <Text style={s.sectionLabel}>Notes</Text>
      <Text style={s.notesText}>{notes}</Text>
    </View>
  );
}

interface PdfProps {
  invoice: InvoiceData;
  cur: { symbol: string; code: string };
  subtotal: number;
  total: number;
}

export async function generatePdf(invoice: InvoiceData): Promise<Blob> {
  const cur = getCurrency(invoice.currency);
  const subtotal = calcSubtotal(invoice.items);
  const total = calcTotal(invoice.items, invoice.taxRate, invoice.discount);

  const props = { invoice, cur, subtotal, total };

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
