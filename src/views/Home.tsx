import type { ReactNode } from "react";
import Hero from "@/components/Hero";
import SupplyChainCrisis from "@/components/SupplyChainCrisis";
import Features from "@/components/Features";
import CTA from "@/components/CTA";

interface IndexProps {
  /** Hero background layer, passed from the Astro page through a named slot. */
  heroBackground?: ReactNode;
}

const Index = ({ heroBackground }: IndexProps) => {
  return (
    <div className="min-h-screen">
      <Hero background={heroBackground} />
      <SupplyChainCrisis />
      <Features />
      <CTA />
    </div>
  );
};

export default Index;
