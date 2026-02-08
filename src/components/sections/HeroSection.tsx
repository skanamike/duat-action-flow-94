import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onContactClick?: () => void;
}

export const HeroSection = ({ onContactClick }: HeroSectionProps) => {
  return (
    <section id="hero" className="min-h-[100svh] bg-background flex items-center justify-center pt-20">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary leading-tight">
          Disrupt Your Supply Chain Before It Disrupts You
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
          Give yourself 6-12 months of advance warning. Time to adjust from strength, not desperation.
        </p>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Supply chain disruptions are costing you millions. The problem: you find out too late. Duat changes that. Our science-based approach delivers advance warning on facility disruptions—giving you months to adjust suppliers, protect margins, and hit targets while competitors scramble.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Button size="lg" onClick={onContactClick} className="bg-primary hover:bg-primary/90">
            Request a Demo
          </Button>
          <Button size="lg" variant="outline">
            See the Platform
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
