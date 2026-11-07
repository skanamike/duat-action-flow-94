import type { ReactNode } from "react";
import { DEMO_VIDEO_URL } from "@/config/site";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import ContactTrigger from "@/components/ContactTrigger";
import HeroPills from "@/components/HeroPills";

interface HeroProps {
  /** Decorative background layer (the HeroBackground Astro component), rendered first inside the section. */
  background?: ReactNode;
}

const Hero = ({ background }: HeroProps) => {
  return <section className="relative isolate min-h-[100svh] overflow-hidden bg-primary flex items-start pt-[calc(4.5rem+var(--hero-band))] pb-12 hero-side:items-center hero-side:pt-24 hero-side:pb-16">
      {background}
      <div className="relative z-10 container mx-auto px-6 text-left text-white">
        <div className="max-w-[36rem] hero-side:max-w-[min(40rem,50vw)]">
          <h1 className="text-[clamp(2.5rem,4.6vw,4.5rem)] font-bold mb-6 leading-tight">
        
            <span className="text-accent">
              {" "}Systems of ProAction
            </span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-secondary">Avoid Supply Chain Disruptions</h2>
          <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed"><span className="text-accent font-semibold">MultiModal Satellite</span> and <span className="text-secondary font-semibold">Big Data</span> combined with <span className="text-accent font-semibold">Digital Twinning</span> enables <span className="text-secondary font-semibold">UNIQUE</span> foreknowledge of the best proactions.</p>
          
          <div className="mb-10 md:mb-12 flex justify-start">
            <HeroPills />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-start items-start">
            <ContactTrigger
              trigger={
                <Button variant="hero" size="lg" className="text-lg px-8 py-4 h-auto">
                  See What's Next
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              }
            />

            <Button asChild variant="outline-hero" size="lg" className="text-lg px-8 py-4 h-auto">
              <a href={DEMO_VIDEO_URL} target="_blank" rel="noopener noreferrer">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;
