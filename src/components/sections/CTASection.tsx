interface CTASectionProps {
  onContactClick?: () => void;
}

export const CTASection = ({ onContactClick }: CTASectionProps) => {
  return (
    <section id="cta" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-12">
          Ready to See What's Coming?
        </h2>
      </div>
    </section>
  );
};

export default CTASection;
