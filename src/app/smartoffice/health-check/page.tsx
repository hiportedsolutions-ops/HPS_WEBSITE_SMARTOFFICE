import type { Metadata } from "next";
import { Zilla_Slab } from "next/font/google";
import { HealthCheck } from "./health-check";

const zillaSlab = Zilla_Slab({
  variable: "--font-zilla-slab",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const title = "Payment Control Health Check | Smart Office";
const description =
  "How safe are your organisation's payments? Answer 15 questions in five minutes and get a free control score, an estimate of payments at risk, and the gaps to close first. Built by internal audit professionals.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "payment control",
    "internal control assessment Nigeria",
    "fraud risk",
    "segregation of duties",
    "internal audit",
    "Smart Office",
  ],
  openGraph: {
    title: "How safe are your payments? Take the free Payment Control Health Check",
    description,
    type: "website",
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: "How safe are your payments? Take the free Payment Control Health Check",
    description,
  },
};

export default function HealthCheckPage() {
  return (
    <div className={zillaSlab.variable}>
      <HealthCheck />
    </div>
  );
}
