import Hero from "@/components/Hero";
import SupplyChainCrisis from "@/components/SupplyChainCrisis";
import Features from "@/components/Features";
import CTA from "@/components/CTA";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <SupplyChainCrisis />
      <Features />
      <CTA />
    </div>
  );
};

export default Index;
