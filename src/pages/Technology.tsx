import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactDialog from "@/components/ContactDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Atom, Waves, Network, Target, Microscope, Radio } from "lucide-react";

const Technology = () => {
  const scienceFoundations = [
    {
      icon: Atom,
      title: "Physics-Based Detection",
      description: "Leveraging electromagnetic wave properties, SAR interferometry, and spectral analysis to reveal physical changes at industrial facilities."
    },
    {
      icon: Waves,
      title: "Multi-Modal Data Fusion",
      description: "Combining SAR, optical, and hyperspectral satellite data with ground truth validation for comprehensive facility monitoring."
    },
    {
      icon: Microscope,
      title: "Scientific Validation",
      description: "Rigorous testing and validation of signals against known operational changes to ensure prediction accuracy and reliability."
    }
  ];

  const dataCapabilities = [
    {
      title: "SAR (Synthetic Aperture Radar)",
      description: "All-weather, day-night imaging that penetrates clouds to detect machinery vibrations, structural changes, and material movement through backscatter analysis.",
      physics: "Measures microwave radiation reflection from surfaces"
    },
    {
      title: "Optical Imagery",
      description: "High-resolution visual spectrum analysis for inventory tracking, vehicle counting, and infrastructure changes across facility footprints.",
      physics: "Captures visible and near-infrared wavelengths"
    },
    {
      title: "Hyperspectral Analysis",
      description: "Chemical signature detection for material composition, environmental emissions, and process byproduct identification.",
      physics: "Analyzes hundreds of spectral bands for molecular fingerprinting"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 text-sm">
              <Atom className="w-3 h-3 mr-1" />
              Physics & Science-Driven Intelligence
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              It's All About
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Physics and Science
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Simplifying the gathering and collection of data to identify and validate the truth—not only about
              productivity at individual facilities, but the interconnectivity of each node with the rest of the
              global supply chain.
            </p>
          </div>
        </div>
      </section>

      {/* Science Foundation Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 pb-3 border-b-4 border-primary inline-block">
              Scientific Foundation
            </h2>

            <p className="text-lg leading-relaxed text-foreground mb-12 mt-8">
              At its core, supply chain intelligence is a physics problem. By measuring electromagnetic signatures,
              thermal emissions, and spectral properties from space, we transform raw physical phenomena into
              actionable operational insights. Every data point is grounded in measurable, reproducible science.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {scienceFoundations.map((item, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                  <CardContent className="pt-8 pb-6">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <item.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Data Collection Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 pb-3 border-b-4 border-primary inline-block">
              Multi-Modal Data Collection
            </h2>

            <p className="text-lg leading-relaxed text-foreground mb-12 mt-8">
              We collect and process <strong>20TB of daily satellite data</strong> from multiple sensor modalities,
              each providing a unique physical perspective on facility operations:
            </p>

            <div className="space-y-6">
              {dataCapabilities.map((capability, index) => (
                <Card key={index} className="border-l-4 border-primary hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Radio className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-xl font-bold mb-2">{capability.title}</h3>
                        <p className="text-muted-foreground leading-relaxed mb-3">{capability.description}</p>
                        <p className="text-sm text-primary font-medium italic">
                          Physics: {capability.physics}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Facility Truth Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 pb-3 border-b-4 border-primary inline-block">
              Identifying Facility Truth
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-0">
                <CardContent className="p-8">
                  <Target className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Individual Facility Analysis</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-primary text-xl font-bold mr-3 mt-1">→</span>
                      <span className="leading-relaxed">
                        Production activity levels measured through thermal signatures and machinery vibration patterns
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary text-xl font-bold mr-3 mt-1">→</span>
                      <span className="leading-relaxed">
                        Inventory changes detected via optical analysis of storage yards and staging areas
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary text-xl font-bold mr-3 mt-1">→</span>
                      <span className="leading-relaxed">
                        Transportation logistics tracked through vehicle counting and movement patterns
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary text-xl font-bold mr-3 mt-1">→</span>
                      <span className="leading-relaxed">
                        Process validation using hyperspectral emissions analysis
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-secondary/5 to-primary/5 border-0">
                <CardContent className="p-8">
                  <Network className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Supply Chain Interconnectivity</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-primary text-xl font-bold mr-3 mt-1">→</span>
                      <span className="leading-relaxed">
                        Upstream-downstream dependency mapping across every tier from raw materials to finished goods
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary text-xl font-bold mr-3 mt-1">→</span>
                      <span className="leading-relaxed">
                        Bottleneck identification through flow analysis of material movement patterns
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary text-xl font-bold mr-3 mt-1">→</span>
                      <span className="leading-relaxed">
                        CASCADE risk modeling—how disruptions propagate through network nodes
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary text-xl font-bold mr-3 mt-1">→</span>
                      <span className="leading-relaxed">
                        Alternative sourcing pathway discovery for resilience planning
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Validation Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 pb-3 border-b-4 border-primary inline-block">
              Truth Through Validation
            </h2>

            <Card className="mt-8 border-l-4 border-primary">
              <CardContent className="p-8 md:p-10">
                <p className="text-lg leading-relaxed text-foreground mb-6">
                  Science demands validation. Every signal we detect is cross-referenced against:
                </p>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-start text-lg">
                    <span className="text-primary text-2xl font-bold mr-4 mt-1">→</span>
                    <span className="leading-relaxed">
                      <strong>Ground truth data</strong> from known operational events
                    </span>
                  </li>
                  <li className="flex items-start text-lg">
                    <span className="text-primary text-2xl font-bold mr-4 mt-1">→</span>
                    <span className="leading-relaxed">
                      <strong>Multi-sensor corroboration</strong> ensuring consistency across data modalities
                    </span>
                  </li>
                  <li className="flex items-start text-lg">
                    <span className="text-primary text-2xl font-bold mr-4 mt-1">→</span>
                    <span className="leading-relaxed">
                      <strong>Time-series analysis</strong> establishing baseline patterns and detecting anomalies
                    </span>
                  </li>
                  <li className="flex items-start text-lg">
                    <span className="text-primary text-2xl font-bold mr-4 mt-1">→</span>
                    <span className="leading-relaxed">
                      <strong>Continuous learning algorithms</strong> that improve accuracy with each validated prediction
                    </span>
                  </li>
                </ul>

                <p className="text-lg leading-relaxed text-foreground font-semibold text-primary">
                  Result: 85-95% prediction accuracy, validated against real-world supply chain disruptions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              From Physics to Foresight
            </h2>
            <p className="text-xl mb-8 opacity-95 leading-relaxed">
              Discover how our science-driven approach transforms electromagnetic signals into
              supply chain intelligence your enterprise can act on.
            </p>
            <ContactDialog
              trigger={
                <Button variant="secondary" size="lg" className="text-lg px-8 py-6 h-auto hover:scale-105 transition-transform">
                  Learn More About Our Technology
                </Button>
              }
              title="Connect with Duat"
              description="Learn how our physics-based approach can provide unprecedented visibility into your supply chain."
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Technology;
