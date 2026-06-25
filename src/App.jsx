import { BrandDataSection } from "./components/BrandDataSection";
import { HammerHeadHero } from "./components/HammerHeadHero";
import { ProcessSection } from "./components/ProcessSection";
import { RecoverySection } from "./components/RecoverySection";
import { ServicesSection } from "./components/ServicesSection";
import { Footer } from "./components/Footer";


function App() {
  return (
    <main className="min-h-screen bg-black text-white">
      <HammerHeadHero />
      <ServicesSection/>
      <RecoverySection/>
      <BrandDataSection/>
      <ProcessSection/>
      <Footer/>
   
      </main>
  );
}

export default App;