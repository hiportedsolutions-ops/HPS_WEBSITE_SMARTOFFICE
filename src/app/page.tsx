import { Nav } from "@/components/hps/nav";
import { Hero } from "@/components/hps/hero";
import { Trustbar } from "@/components/hps/trustbar";
import { Purpose } from "@/components/hps/purpose";
import { Solutions } from "@/components/hps/solutions";
import { SmartOfficeSpotlight } from "@/components/hps/smart-office-spotlight";
import { Framework } from "@/components/hps/framework-3d";
import { Industries } from "@/components/hps/industries";
import { WhyHPS } from "@/components/hps/why-hps";
import { Stories } from "@/components/hps/stories";
import { SchoolMarketplace } from "@/components/hps/school-marketplace";
import { CACSection } from "@/components/hps/cac-section";
import { Services } from "@/components/hps/services";
import { About } from "@/components/hps/about";
import { ContactSection } from "@/components/hps/contact-section";
import { CTA } from "@/components/hps/cta";
import { Footer } from "@/components/hps/footer";
import { ChatWidget } from "@/components/hps/chat-widget";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Nav />
      {/* Spacer for fixed nav */}
      <div className="h-[70px]" aria-hidden />

      <main className="flex-1">
        <Hero />
        <Trustbar />
        <Purpose />
        <Solutions />
        <SmartOfficeSpotlight />
        <Framework />
        <Industries />
        <WhyHPS />
        <Stories />
        <SchoolMarketplace />
        <CACSection />
        <Services />
        <About />
        <CTA />
        <ContactSection />
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
}
