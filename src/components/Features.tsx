import { Eye, Target, Shield, Brain, Zap, Network } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Eye,
      title: "Detect",
      description: "Early warning system using patented subsurface SAR intelligence and multimodal data sources to identify potential disruptions before they manifest."
    },
    {
      icon: Target,
      title: "Define", 
      description: "Digital twin modeling provides precise impact analysis and scenario planning to understand exactly what will be affected and when."
    },
    {
      icon: Shield,
      title: "De-Risk",
      description: "AI-powered action recommendations deliver optimal mitigation strategies to prevent or minimize supply chain disruptions."
    },
    {
      icon: Brain,
      title: "Predictive Intelligence",
      description: "Advanced AI algorithms process vast amounts of data to predict supply chain disruptions with unprecedented accuracy."
    },
    {
      icon: Zap,
      title: "Real-time Action",
      description: "Transform insights into immediate action with automated workflows and intelligent decision support systems."
    },
    {
      icon: Network,
      title: "Connected Ecosystem",
      description: "Seamlessly integrate with existing systems to create a unified view of your entire supply chain network."
    }
  ];

  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            The Future of Supply Chain Foresight
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            DuatFlow is the first and only platform to predict supply chain disruptions 
            before they happen using patented subsurface SAR intelligence.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-8 rounded-xl bg-card border border-border hover:shadow-card transition-all duration-300 hover:scale-105 group"
            >
              <div className="w-16 h-16 bg-gradient-secondary rounded-xl flex items-center justify-center mb-6 group-hover:shadow-glow transition-all duration-300">
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;