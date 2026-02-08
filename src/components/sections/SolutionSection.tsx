export const SolutionSection = () => {
  const benefits = [
    "Advance warning: 6-12 months visibility into emerging issues",
    "Clear risk signals: Real-time alerts when problems emerge",
    "Time to act: Adjust suppliers, secure capacity, protect margins—without panic",
  ];

  const workflows = [
    "Supply chain management system",
    "Risk planning process",
    "Procurement strategy",
    "P&L forecasting",
  ];

  return (
    <section id="solution" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 space-y-12">
        <h2 className="text-4xl md:text-5xl font-bold text-primary">
          Advance Warning Changes Everything
        </h2>

        <div className="space-y-8">
          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-primary">What Duat Delivers</h3>
            <p className="text-lg text-muted-foreground mb-4">
              Our science-based methodology identifies operational disruptions months before they impact your supply chain—giving you time to adjust.
            </p>
            <p className="text-lg text-muted-foreground mb-4">You get:</p>
            <ul className="space-y-2 ml-6">
              {benefits.map((benefit, i) => (
                <li key={i} className="text-lg text-muted-foreground flex items-start gap-3">
                  <span className="text-primary font-semibold">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-primary">How You Use It</h3>
            <p className="text-lg text-muted-foreground mb-4">
              Risk intelligence feeds into your existing workflow:
            </p>
            <ul className="space-y-2 ml-6">
              {workflows.map((workflow, i) => (
                <li key={i} className="text-lg text-muted-foreground flex items-start gap-3">
                  <span className="text-primary font-semibold">•</span>
                  <span>{workflow}</span>
                </li>
              ))}
            </ul>
            <p className="text-lg text-muted-foreground mt-4">
              No new tools. Just better foresight.
            </p>
          </div>

          <div className="bg-accent/10 border border-accent rounded-lg p-6 space-y-3">
            <h3 className="text-2xl font-semibold text-primary">Why This Works</h3>
            <p className="text-lg text-muted-foreground">
              You see problems <span className="font-semibold">months before</span> they're public knowledge. That advantage is real.
            </p>
            <p className="text-lg text-muted-foreground">
              Your competitors are using the same supply chain data you do. With Duat, you see what's coming first. That buys you time to negotiate, adjust, and protect your margin while they scramble.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-primary">Why Duat Is Different</h3>
            <ul className="space-y-3 ml-6">
              <li className="text-lg text-muted-foreground flex items-start gap-3">
                <span className="text-primary font-semibold">•</span>
                <span><strong>Proprietary science-based approach.</strong> Not a commodity service. Competitors can't replicate it.</span>
              </li>
              <li className="text-lg text-muted-foreground flex items-start gap-3">
                <span className="text-primary font-semibold">•</span>
                <span><strong>Validated through rigorous backtesting.</strong> Our methodology has been tested against real historical disruptions and proven accurate.</span>
              </li>
              <li className="text-lg text-muted-foreground flex items-start gap-3">
                <span className="text-primary font-semibold">•</span>
                <span><strong>Built for your business.</strong> We understand P&L accountability and what advance warning actually means to your bottom line.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
