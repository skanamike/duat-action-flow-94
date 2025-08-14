import { BadgeAlert, EyeOff, Wallet } from "lucide-react";
import globalSupplyChainImage from "@/assets/global-supply-chain.jpg";

const items = [
  {
    icon: EyeOff,
    title: "Visibility Blindness",
    desc: "69% of companies lack end-to-end supply chain visibility",
    color: "from-accent to-secondary",
    bg: "bg-accent/10",
  },
  {
    icon: BadgeAlert,
    title: "Reactive Risk Management",
    desc: "4–7 months to identify and respond to disruptions",
    color: "from-secondary to-accent",
    bg: "bg-secondary/10",
  },
  {
    icon: Wallet,
    title: "Massive Financial Impact",
    desc: "$184B lost annually due to supply chain disruptions",
    color: "from-accent to-secondary",
    bg: "bg-accent/10",
  },
];

export default function SupplyChainCrisis() {
  return (
    <section id="crisis" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <header className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            The $4.7T Supply Chain Crisis
          </h2>
          <p className="text-muted-foreground mt-3">
            Companies lose $184B annually due to supply chain disruptions. 69% lack end-to-end visibility, taking 23 weeks to respond to risks.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left column: reasons */}
          <div className="space-y-5">
            {items.map(({ icon: Icon, title, desc, color, bg }, idx) => (
              <article
                key={idx}
                className={`relative rounded-xl ${bg} p-5 shadow-[0_10px_30px_-10px_hsl(var(--primary)/0.2)] border border-border`}
              >
                <div className={`absolute left-0 top-0 h-full w-1 rounded-l-xl bg-gradient-to-b ${color}`} />
                <div className="flex items-start gap-4">
                  <div className="shrink-0 mt-1 p-2 rounded-lg bg-background/60 ring-1 ring-border">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{desc}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Right column: visual */}
          <div className="rounded-2xl overflow-hidden bg-card shadow-lg border border-border">
            <img
              src={globalSupplyChainImage}
              alt="Global supply chain interconnectivity visualization showing network connections across continents"
              loading="lazy"
              className="w-full h-full object-cover aspect-[4/3]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
