export const ProofSection = () => {
  const outcomes = [
    "You find alternative suppliers from a position of strength (not desperation)",
    "You negotiate better terms (you're planning, not reacting)",
    "You protect margins instead of absorbing emergency costs",
    "You maintain customer commitments while competitors scramble",
  ];

  return (
    <section id="proof" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 space-y-12">
        <h2 className="text-4xl md:text-5xl font-bold text-primary">
          Validated. Backtested. Works.
        </h2>

        <div className="space-y-8">
          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-primary">Methodology Validated Against Real Data</h3>
            <p className="text-lg text-muted-foreground">
              Our science-based approach has been rigorously backtested against historical supply chain disruptions. The results: consistent, accurate advance warning on emerging operational issues.
            </p>
            <p className="text-lg text-muted-foreground">
              This isn't theoretical. We've tested it against real disruptions and real timelines. It works.
            </p>
          </div>

          <div className="bg-accent/10 border border-accent rounded-lg p-6 space-y-4">
            <h3 className="text-2xl font-semibold text-primary">What That Means For You</h3>
            <p className="text-lg text-muted-foreground mb-3">When you have advance warning:</p>
            <ul className="space-y-3">
              {outcomes.map((outcome, i) => (
                <li key={i} className="text-lg text-muted-foreground flex items-start gap-3">
                  <span className="text-primary font-semibold">✓</span>
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-primary">Current Status</h3>
            <p className="text-lg text-muted-foreground">
              We're in prototype phase with active validation underway. We've proven the core methodology works. We're now scaling the platform and refining based on real-world feedback.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-primary">Early Access & Partnerships</h3>
            <p className="text-lg text-muted-foreground">
              We're looking for leading companies who want to work with us early. Pilot opportunities available for companies serious about supply chain foresight.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProofSection;
