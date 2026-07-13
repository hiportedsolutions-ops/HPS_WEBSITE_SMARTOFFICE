import type { Metadata } from "next";
import { Archivo, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hi'ported Professional Services | Building Businesses, Creating Opportunities and Sustaining Success.",
  description:
    "HPS is a business growth and enterprise solutions company in Garki, Abuja helping entrepreneurs, SMEs, NGOs and institutions with accounting, audit, business registration in Nigeria, UK & US, automation and corporate training.",
  keywords: [
    "CAC registration Nigeria",
    "business registration Abuja",
    "accounting services Nigeria",
    "tax advisory Abuja",
    "internal audit",
    "business advisory",
    "UK company registration",
    "US LLC registration",
    "Hi'ported Professional Services",
    "HPS",
  ],
  authors: [{ name: "Hi'ported Professional Services" }],
  icons: {
    icon: [
      { url: "/hps-favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/hps-favicon-64.png", sizes: "64x64", type: "image/png" },
    ],
    shortcut: "/hps-favicon.png",
    apple: "/hps-favicon.png",
  },
  openGraph: {
    title: "Hi'ported Professional Services",
    description:
      "Building Businesses. Creating Opportunities. Sustaining Success. Business growth & enterprise solutions in Garki, Abuja.",
    type: "website",
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hi'ported Professional Services",
    description:
      "Building Businesses. Creating Opportunities. Sustaining Success.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${archivo.variable} ${publicSans.variable} ${ibmPlexMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
