import type { Metadata } from "next";
import { Zilla_Slab } from "next/font/google";
import { LeadsBoard } from "./leads-board";

const zillaSlab = Zilla_Slab({
  variable: "--font-zilla-slab",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

// Private team page: never indexed.
export const metadata: Metadata = {
  title: "Leads | Smart Office",
  robots: { index: false, follow: false },
};

export default function LeadsPage() {
  return (
    <div className={zillaSlab.variable}>
      <LeadsBoard />
    </div>
  );
}
