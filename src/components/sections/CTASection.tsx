import { Button } from '@/components/ui/button';

interface CTASectionProps {
  onContactClick?: () => void;
}

export const CTASection = ({ onContactClick }: CTASectionProps) => {
  const ctaOptions = [
    {
      title: "Pilot Program",
      description: "See how Duat works on your real supply chain. We monitor your critical suppliers and deliver advance risk signals for 30 days. Real data. Real validation. Real value.",
      buttonText: "Start a Pilot",
    },
    {
      title: "See the Platform",
      description: "15-minute walk-through. We'll show you how the system works, what risk signals look like, and how it integrates into your workflow.",
      buttonText: "Schedule a Demo",
    },
    {
      title: "Invest or Partner Early",
      description: "If you're interested in getting involved at the prototype stage, we have options.",
      buttonText: "Get in Touch",
    },
  ];

  return (
    <section id="cta" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-primary">
            Ready to See What's Coming?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose your path forward. All options start with a conversation about your supply chain.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {ctaOptions.map((option, i) => (
            <div key={i} className="border border-border rounded-lg p-6 space-y-4 flex flex-col">
              <h3 className="text-xl font-semibold text-primary">{option.title}</h3>
              <p className="text-muted-foreground flex-grow">{option.description}</p>
              <Button
                onClick={onContactClick}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {option.buttonText}
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center pt-8 border-t border-border">
          <p className="text-muted-foreground mb-2">Questions? Reach out directly:</p>
          <p className="text-lg font-semibold text-primary">contact@duatflow.com</p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
