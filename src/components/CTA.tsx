import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 bg-gradient-primary">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Predict Before It Strikes?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Transform your supply chain from reactive to predictive. 
            Join the enterprises already using DuatFlow to stay ahead of disruptions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="hero" 
              size="lg"
              className="text-lg px-8 py-4 h-auto bg-white text-primary hover:bg-white/90"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline-hero" 
              size="lg"
              className="text-lg px-8 py-4 h-auto border-white text-white hover:bg-white hover:text-primary"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;