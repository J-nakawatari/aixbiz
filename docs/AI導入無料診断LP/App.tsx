import HeroSection from "./components/HeroSection";
import ProblemsSection from "./components/ProblemsSection";
import FeaturesSection from "./components/FeaturesSection";
import UseCasesSection from "./components/UseCasesSection";
import DiagnosticSection from "./components/DiagnosticSection";
import FAQSection from "./components/FAQSection";
import CTASection from "./components/CTASection";
import Footer from "./imports/Footer";

export default function App() {
  return (
    <div className="min-h-screen">
      {/* Header/Navigation could be added here */}
      
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