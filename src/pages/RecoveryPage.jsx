import { BrandDataSection } from "../components/BrandDataSection";
import { HammerHeadHero } from "../components/HammerHeadHero";
import { ProcessSection } from "../components/ProcessSection";
import { RecoverySection } from "../components/RecoverySection";

export function RecoveryPage() {
  return (
    <>
      <HammerHeadHero />
      <ProcessSection />
      <RecoverySection />
      <BrandDataSection/>
    </>
  );
}