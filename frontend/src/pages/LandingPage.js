import LandingNavbar from "../components/LandingNavbar";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import HowItWorks from "../components/HowItWorks";
import AboutSection from "../components/AboutSection";
import CTASection from "../components/CTASection";
import LandingFooter from "../components/LandingFooter";

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      
      <LandingNavbar />

      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <AboutSection />
        <CTASection />
        <LandingFooter />
    </main>

    </div>
  );
}

export default LandingPage;