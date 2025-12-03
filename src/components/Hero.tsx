import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import HeroPills from "@/components/HeroPills";
const Hero = () => {
  return <section className="relative min-h-[100svh] pt-24 md:pt-28 flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 bg-gradient-hero">
        <img
          src="/images/generated/hero-background.png"
          alt="Supply chain network visualization"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/80" />
      </div>
      {/* Additional background effects */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 container mx-auto px-6 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">
              Predict Supply Chain Disruptions Months Before They Happen
            </span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-secondary">Avoid supply chain disruptions with satellite-backed predictive intelligence.</h2>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">Satellite + multimodal data and digital twins to detect risks early and recommend precise actions.</p>
          
          <div className="mb-10 md:mb-12 flex justify-center">
            <HeroPills />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <ContactDialog
              trigger={
                <Button variant="hero" size="lg" className="text-lg px-8 py-4 h-auto">
                  See What's Next
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              }
            />

            <Button asChild variant="outline-hero" size="lg" className="text-lg px-8 py-4 h-auto">
              <a href="https://demo.duatflow.com" target="_blank" rel="noopener noreferrer">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </a>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Floating animation elements */}
      <div className="absolute top-[18%] left-[14%] w-5 h-5 rounded-full bg-[hsl(var(--moonlight))] shadow-[0_0_40px_hsl(var(--moonlight)/0.35)] ring-2 ring-[hsl(var(--moonlight))]/40 animate-pulse" />
      <div className="absolute top-[32%] right-[12%] w-4 h-4 rounded-full bg-[hsl(var(--moonlight))] shadow-[0_0_40px_hsl(var(--moonlight)/0.35)] ring-2 ring-[hsl(var(--moonlight))]/40 animate-pulse" style={{
      animationDelay: '0.5s'
    }} />
      <div className="absolute top-[58%] left-[70%] w-6 h-6 rounded-full bg-[hsl(var(--moonlight))] shadow-[0_0_40px_hsl(var(--moonlight)/0.35)] ring-2 ring-[hsl(var(--moonlight))]/40 animate-pulse" style={{
      animationDelay: '1s'
    }} />
      <div className="absolute top-[72%] right-[20%] w-4 h-4 rounded-full bg-[hsl(var(--moonlight))] shadow-[0_0_40px_hsl(var(--moonlight)/0.35)] ring-2 ring-[hsl(var(--moonlight))]/40 animate-pulse" style={{
      animationDelay: '1.5s'
    }} />
      <div className="absolute bottom-[12%] left-[22%] w-4 h-4 rounded-full bg-[hsl(var(--moonlight))] shadow-[0_0_40px_hsl(var(--moonlight)/0.35)] ring-2 ring-[hsl(var(--moonlight))]/40 animate-pulse" style={{
      animationDelay: '2s'
    }} />
      <div className="absolute top-[45%] right-[40%] w-5 h-5 rounded-full bg-[hsl(var(--moonlight))] shadow-[0_0_40px_hsl(var(--moonlight)/0.35)] ring-2 ring-[hsl(var(--moonlight))]/40 animate-pulse" style={{
      animationDelay: '2.5s'
    }} />
      <div className="absolute bottom-[28%] right-[12%] w-6 h-6 rounded-full bg-[hsl(var(--moonlight))] shadow-[0_0_40px_hsl(var(--moonlight)/0.35)] ring-2 ring-[hsl(var(--moonlight))]/40 animate-pulse" style={{
      animationDelay: '3s'
    }} />
      <div className="absolute top-[10%] right-[25%] w-4 h-4 rounded-full bg-[hsl(var(--moonlight))] shadow-[0_0_40px_hsl(var(--moonlight)/0.35)] ring-2 ring-[hsl(var(--moonlight))]/40 animate-pulse" style={{
      animationDelay: '3.5s'
    }} />
    </section>;
};
export default Hero;