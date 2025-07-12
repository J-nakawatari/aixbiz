import HeroSection from "@/components/lp/HeroSection";
import ProblemsSection from "@/components/lp/ProblemsSection";
import FeaturesSection from "@/components/lp/FeaturesSection";
import UseCasesSection from "@/components/lp/UseCasesSection";
import DiagnosticSection from "@/components/lp/DiagnosticSection";
import FAQSection from "@/components/lp/FAQSection";
import CTASection from "@/components/lp/CTASection";
import Footer from "@/components/lp/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ProblemsSection />
      <FeaturesSection />
      <UseCasesSection />
      <DiagnosticSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}