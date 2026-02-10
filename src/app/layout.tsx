import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InvoiceZen — Privacy-First Invoice Generator",
  description:
    "Create beautiful, professional invoices instantly. No account needed. No cloud storage. Everything stays on your device. Free forever.",
  keywords: [
    "invoice generator",
    "free invoice",
    "privacy invoice",
    "PDF invoice",
    "no signup invoice",
    "client-side invoice",
  ],
  openGraph: {
    title: "InvoiceZen — Privacy-First Invoice Generator",
    description:
      "Create beautiful invoices instantly. No account, no cloud. 100% private.",
    type: "website",
    url: "https://invoice.rushiraj.me",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 text-lg font-bold">
              <span className="text-emerald-500 text-2xl">◈</span>
              <span>InvoiceZen</span>
            </a>
            <div className="flex items-center gap-6">
              <a
                href="/templates"
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                Templates
              </a>
              <a href="/create" className="btn-primary text-sm !py-2 !px-4">
                Create Invoice
              </a>
            </div>
          </div>
        </nav>
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
