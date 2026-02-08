export const ProblemSection = () => {
  const problems = [
    "After a supplier alerts you (already in crisis)",
    "After purchasing flags a problem (disruption underway)",
    "When production slows or halts (losing money)",
    "When customers complain (damage control mode)",
  ];

  return (
    <section id="problem" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 space-y-12">
        <h2 className="text-4xl md:text-5xl font-bold text-primary">
          You Can't Protect What You Can't See
        </h2>

        <div className="space-y-8">
          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-primary">You Own the P&L</h3>
            <p className="text-lg text-muted-foreground">
              You're accountable for production targets, margins, and hitting commitments. A supply chain disruption isn't abstract—it's a direct hit to your bottom line.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-primary">How You Find Out Now</h3>
            <p className="text-lg text-muted-foreground mb-4">Right now, you discover supplier issues:</p>
            <ul className="space-y-2 ml-6">
              {problems.map((problem, i) => (
                <li key={i} className="text-lg text-muted-foreground flex items-start gap-3">
                  <span className="text-primary font-semibold">•</span>
                  <span>{problem}</span>
                </li>
              ))}
            </ul>
            <p className="text-lg text-muted-foreground mt-4">
              By the time you know, your options are terrible: emergency sourcing at 30-40% premiums, line slowdowns, quality compromises, cascading delays.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-primary">The Cost Is Real</h3>
            <p className="text-lg text-muted-foreground">
              One facility disruption = lost margin on units + expedited costs + rework + reputation risk. Depending on your supply chain, millions at stake.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-primary">The Gap In Your Visibility</h3>
            <p className="text-lg text-muted-foreground mb-4">Your current tools give you lagging data:</p>
            <ul className="space-y-2 ml-6">
              <li className="text-lg text-muted-foreground flex items-start gap-3">
                <span className="text-primary font-semibold">•</span>
                <span>Quarterly supplier reviews (things change in weeks)</span>
              </li>
              <li className="text-lg text-muted-foreground flex items-start gap-3">
                <span className="text-primary font-semibold">•</span>
                <span>Financial reports (looking backward)</span>
              </li>
              <li className="text-lg text-muted-foreground flex items-start gap-3">
                <span className="text-primary font-semibold">•</span>
                <span>Supplier alerts (dependent on honesty)</span>
              </li>
              <li className="text-lg text-muted-foreground flex items-start gap-3">
                <span className="text-primary font-semibold">•</span>
                <span>Market intelligence (public, not predictive)</span>
              </li>
            </ul>
            <p className="text-lg text-muted-foreground mt-4">
              None tell you what's about to happen.
            </p>
          </div>

          <div className="bg-accent/10 border border-accent rounded-lg p-6 space-y-3">
            <h3 className="text-2xl font-semibold text-primary">The Opportunity You're Missing</h3>
            <p className="text-lg text-muted-foreground">
              You can't adjust from strength. You can't negotiate alternative suppliers proactively. You can't build redundancy incrementally. You scramble when you have to, paying whatever it costs.
            </p>
            <p className="text-lg font-semibold text-primary">
              Imagine if you had 6-12 months of advance warning instead.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
