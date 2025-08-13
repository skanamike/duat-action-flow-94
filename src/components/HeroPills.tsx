import { Shield, Search, Activity } from "lucide-react";

export default function HeroPills() {
  const items = [
    { icon: Search, label: "Detect" },
    { icon: Activity, label: "Define" },
    { icon: Shield, label: "De‑Risk" },
  ];

  return (
    <div className="inline-flex items-stretch rounded-full border border-white/20 bg-white/10 backdrop-blur-md overflow-hidden">
      {items.map((Item, idx) => (
        <div
          key={Item.label}
          className="flex items-center gap-2 px-4 py-2 text-white text-sm md:text-base hover-scale"
        >
          <Item.icon className="h-4 w-4 text-accent" />
          <span className={idx === 1 ? "text-secondary font-semibold" : "text-white/90 font-semibold"}>{Item.label}</span>
          {idx < items.length - 1 && (
            <span className="mx-3 h-4 w-px bg-white/30" aria-hidden="true" />
          )}
        </div>
      ))}
    </div>
  );
}
