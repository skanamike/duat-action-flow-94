interface HeroSectionProps {
  onContactClick?: () => void;
}

export const HeroSection = ({ onContactClick }: HeroSectionProps) => {
  return (
    <section id="hero" className="min-h-[100svh] bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
          Disrupt Your Supply Chain Before It Disrupts You
        </h1>
      </div>
    </section>
  );
};

export default HeroSection;
