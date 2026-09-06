import type { Metadata } from "next";
import { Zilla_Slab } from "next/font/google";
import { SmartOfficeLaunch } from "./smart-office-launch";

const zillaSlab = Zilla_Slab({
  variable: "--font-zilla-slab",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Smart Office | Every approval, accounted for — by Hi'ported",
  description:
    "Smart Office is a compliance-centered workflow platform for universities and institutions: payment memos, internal audit review, budget control and a complete audit trail — in one system. Launching soon.",
  keywords: [
    "Smart Office",
    "payment memo workflow",
    "internal audit software Nigeria",
    "approval automation",
    "university financial workflow",
    "Hi'ported Professional Services",
  ],
  openGraph: {
    title: "Smart Office — Every approval, accounted for",
    description:
      "Payment memos, internal audit review, budget control and a complete audit trail — in one system. A product of Hi'ported Solutions.",
    type: "website",
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Office — Every approval, accounted for",
    description:
      "Payment memos, internal audit review, budget control and a complete audit trail — in one system.",
  },
};

export default function SmartOfficePage() {
  return (
    <div className={zillaSlab.variable}>
      <SmartOfficeLaunch />
    </div>
  );
}
