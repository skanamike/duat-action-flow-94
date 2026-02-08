export const TeamSection = () => {
  const strengths = [
    "Deep supply chain and operations expertise",
    "Proprietary science-based methodology",
    "Rigorous validation and backtesting approach",
    "Understanding of what \"advance warning\" actually means to your P&L",
  ];

  return (
    <section id="team" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 space-y-12">
        <h2 className="text-4xl md:text-5xl font-bold text-primary">
          Built By People Who Understand Your Problem
        </h2>

        <div className="space-y-8">
          <div className="space-y-3">
            <p className="text-lg text-muted-foreground">
              Duat was founded by supply chain and operations leaders who've lived this problem. We've managed billion-dollar product lines. We've dealt with facility disruptions. We've felt the pressure of protecting margins while managing risk.
            </p>
            <p className="text-lg text-muted-foreground font-semibold">
              We built Duat because we knew there had to be a better way.
            </p>
          </div>

          <div className="bg-accent/10 border border-accent rounded-lg p-6 space-y-4">
            <h3 className="text-2xl font-semibold text-primary">What We Bring</h3>
            <ul className="space-y-3">
              {strengths.map((strength, i) => (
                <li key={i} className="text-lg text-muted-foreground flex items-start gap-3">
                  <span className="text-primary font-semibold">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-lg text-muted-foreground">
              We're not supply chain consultants. We're operations leaders building foresight for operations leaders.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-primary">Our Commitment</h3>
            <p className="text-lg text-muted-foreground">
              We move fast. We listen. We iterate based on what works in the real world. When you work with Duat, you're working with people who get it—because we've lived it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
