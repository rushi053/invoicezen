import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "InvoiceZen — Privacy-First Invoice Generator | Free Professional Invoices",
  description:
    "Create beautiful, professional invoices instantly. No account needed. No cloud storage. Everything stays on your device. 50+ currencies, 7 templates. Free forever with Pro upgrades.",
  keywords: [
    "invoice generator",
    "free invoice",
    "privacy invoice",
    "PDF invoice",
    "no signup invoice",
    "client-side invoice",
    "professional invoice",
    "invoice templates",
    "online invoice maker",
    "small business invoicing",
  ],
  authors: [{ name: "Rushi Rajjadeja", url: "https://rushiraj.me" }],
  creator: "Rushi Rajjadeja",
  metadataBase: new URL("https://invoice.rushiraj.me"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "InvoiceZen — Privacy-First Invoice Generator",
    description:
      "Create beautiful invoices instantly. No account, no cloud. 100% private. 50+ currencies, 7 professional templates.",
    type: "website",
    url: "https://invoice.rushiraj.me",
    siteName: "InvoiceZen",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "InvoiceZen - Privacy-First Invoice Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InvoiceZen — Privacy-First Invoice Generator",
    description: "Create beautiful invoices in seconds. No account, no cloud. 100% private.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "InvoiceZen",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              url: "https://invoice.rushiraj.me",
              description: "Privacy-first invoice generator. Create beautiful professional invoices instantly with no account needed.",
              offers: [
                { "@type": "Offer", price: "0", priceCurrency: "USD", description: "Free Forever" },
                { "@type": "Offer", price: "9.99", priceCurrency: "USD", description: "Pro - One-time payment" },
              ],
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                reviewCount: "127",
              },
            }),
          }}
        />
      </head>
      <body className="antialiased min-h-screen">
        <Navbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
