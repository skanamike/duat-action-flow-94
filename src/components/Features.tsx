import { Eye, Target, Shield, Brain, Zap, Network } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Eye,
      title: "Detect",
      description: "Early warning system using proprietary satellite and data neural network AI and multimodal data sources to identify potential disruptions before they manifest."
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
            before they happen using proprietary satellite and data neural network AI.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
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

        {/* SAR Intelligence Visualization */}
        <div className="mt-20 max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Proprietary Satellite and Data Neural Network AI
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From satellite data to actionable insights - our proprietary technology transforms invisible supply chain dynamics into strategic advantage
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-border bg-card">
            <img
              src="/images/generated/sar-intelligence.png"
              alt="SAR intelligence pipeline from satellite to supply chain insights"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;