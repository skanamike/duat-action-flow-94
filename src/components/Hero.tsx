import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
const Hero = () => {
  return <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-hero opacity-95" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 container mx-auto px-6 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
        
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">
              {" "}Systems of ProAction
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed"><span className="text-accent font-semibold">MultiModal Satellite</span> and <span className="text-secondary font-semibold">Big Data</span> combined with <span className="text-accent font-semibold">Digital Twinning</span> enables <span className="text-secondary font-semibold">UNIQUE</span> foreknowledge of the best proactions to avoid supply chain disruptions.</p>
          
          <div className="text-lg md:text-xl mb-12 font-semibold text-accent">
            Detect. Define. De-Risk.
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4 h-auto">
              See What's Next
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button variant="outline-hero" size="lg" className="text-lg px-8 py-4 h-auto">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
      
      {/* Floating animation elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent rounded-full animate-pulse" />
      <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-secondary rounded-full animate-pulse" style={{
      animationDelay: '1s'
    }} />
      <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-accent rounded-full animate-pulse" style={{
      animationDelay: '2s'
    }} />
    </section>;
};
export default Hero;