import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import SiteChrome from "@/components/SiteChrome";

const SITE_URL = "https://oystra.fr";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "oystrå — Surfing Brand",
    template: "%s — oystrå",
  },
  description:
    "oystrå, marque de surf née sur l'île d'Oléron. Drop 01 le 15 août : trois coloris en série limitée, designés à la main, broderie et sérigraphie.",
  keywords: ["oystrå", "oystra", "surf", "île d'Oléron", "t-shirt", "streetwear", "drop"],
  authors: [{ name: "oystrå" }],
  alternates: { canonical: "/" },
  // Aperçu du lien (Instagram, WhatsApp, iMessage, Facebook…)
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: "oystrå",
    title: "oystrå — Drop 01 le 15 août",
    description:
      "Trois coloris, série limitée. Designés à la main sur l'île d'Oléron.",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "oystrå — Surfing Brand, drop 01 le 15 août",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "oystrå — Drop 01 le 15 août",
    description:
      "Trois coloris, série limitée. Designés à la main sur l'île d'Oléron.",
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-body">
        <CartProvider>
          <SiteChrome>{children}</SiteChrome>
        </CartProvider>
      </body>
    </html>
  );
}
