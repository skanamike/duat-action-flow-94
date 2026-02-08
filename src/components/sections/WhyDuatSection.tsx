export const WhyDuatSection = () => {
  const advantages = [
    "You adjust from strength, not desperation",
    "You maintain margins instead of absorbing emergency costs",
    "You protect customer commitments while competitors scramble",
    "You turn supply chain risk into strategic opportunity",
  ];

  return (
    <section id="why-duat" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 space-y-12">
        <h2 className="text-4xl md:text-5xl font-bold text-primary">
          Companies Are Spending Billions on Solutions That Look Backward
        </h2>

        <div className="space-y-8">
          <div className="space-y-3">
            <p className="text-lg text-muted-foreground">
              ERP systems. Logistics optimization. Supplier management platforms. Billions spent. Yet disruptions are more frequent, more expensive, and revenue losses are mounting.
            </p>
            <p className="text-lg text-muted-foreground font-semibold">
              Why? Because you're managing risk with yesterday's data.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-primary">The Real Problem</h3>
            <p className="text-lg text-muted-foreground">
              You can't optimize your way out of blindness. Better logistics don't help if you can't see problems coming. Supplier management platforms don't predict disruptions. Historical data doesn't predict the future.
            </p>
          </div>

          <div className="bg-accent/10 border border-accent rounded-lg p-6 space-y-4">
            <h3 className="text-2xl font-semibold text-primary">Duat Provides The Foresight</h3>
            <p className="text-lg text-muted-foreground">
              We don't optimize existing processes. We give you visibility months in advance. That visibility turns disruption from a cost center into a competitive advantage.
            </p>
            <p className="text-lg text-muted-foreground mb-3">When you see problems coming:</p>
            <ul className="space-y-3">
              {advantages.map((advantage, i) => (
                <li key={i} className="text-lg text-muted-foreground flex items-start gap-3">
                  <span className="text-primary font-semibold">•</span>
                  <span>{advantage}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-primary">The Competitive Advantage</h3>
            <p className="text-lg text-muted-foreground">
              The companies winning in supply chain aren't the ones with the best optimization systems. They're the ones who see problems first and act before everyone else has to.
            </p>
            <p className="text-lg text-muted-foreground font-semibold">
              Duat gives you that foresight.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyDuatSection;
