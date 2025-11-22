import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactDialog from "@/components/ContactDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Satellite,
  Network,
  Clock,
  TrendingDown,
  DollarSign,
  Shield,
  Atom,
  Brain,
  Database,
  ExternalLink,
  Play,
  Calendar,
  CheckCircle2,
  ArrowRight,
  AlertCircle
} from "lucide-react";

const Product = () => {
  const features = [
    {
      icon: Satellite,
      title: "Real-Time Facility Monitoring",
      description: "Track production activity at global manufacturing facilities using patented SAR intelligence that works through clouds, darkness, and weather.",
      demoLink: "https://aurachainmonitor-claude-code.onrender.com/"
    },
    {
      icon: Network,
      title: "Multi-Tier Supply Chain Mapping",
      description: "Visualize your entire upstream supply chain from raw materials through tier 3+ suppliers with automated dependency mapping.",
      demoLink: "https://aurachainmonitor-claude-code.onrender.com/"
    },
    {
      icon: Clock,
      title: "Disruption Prediction Timeline",
      description: "Get 3-6 months advance warning of potential disruptions with physics-based detection of production slowdowns.",
      demoLink: "https://aurachainmonitor-claude-code.onrender.com/"
    },
    {
      icon: TrendingDown,
      title: "CASCADE Risk Modeling",
      description: "Model how disruptions propagate through your supplier network with AI-powered cascade analysis.",
      demoLink: "https://aurachainmonitor-claude-code.onrender.com/"
    },
    {
      icon: DollarSign,
      title: "Financial Impact Forecasting",
      description: "Quantify the potential cost impact of supply chain disruptions with automated scenario modeling.",
      demoLink: "https://aurachainmonitor-claude-code.onrender.com/"
    },
    {
      icon: Shield,
      title: "Automated Mitigation Recommendations",
      description: "AI-powered action plans to prevent or minimize disruption impact with alternative sourcing strategies.",
      demoLink: "https://aurachainmonitor-claude-code.onrender.com/"
    }
  ];

  const currentCapabilities = [
    "Core technology validated and operational",
    "Satellite data integration functional",
    "AI risk detection algorithms proven",
    "Interactive demo available for exploration",
    "Multi-tier supply chain mapping working",
    "Real-time facility monitoring operational"
  ];

  const roadmapItems = [
    "Enterprise-scale data infrastructure",
    "Production-ready API and integrations",
    "Custom client deployment frameworks",
    "24/7 monitoring and alerting systems",
    "Mobile applications",
    "Integration marketplace"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary via-primary/95 to-secondary">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />

        <div className="container mx-auto px-6 relative">
          <div className="max-w-5xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 text-sm border-white/30 text-white">
              <Atom className="w-3 h-3 mr-1" />
              Pre-MVP Technology Demonstration
            </Badge>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white">
              Experience Supply Chain Intelligence
              <span className="block mt-2">Before Disruption Hits</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
              Explore our working demonstration of satellite-based risk detection and cascade modeling.
              Validated technology, operational today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-6 h-auto hover:scale-105 transition-transform"
                asChild
              >
                <a href="https://aurachainmonitor-claude-code.onrender.com/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Launch Interactive Demo
                </a>
              </Button>
              <ContactDialog
                trigger={
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-6 border-white/30 text-white hover:bg-white/10"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule Executive Briefing
                  </Button>
                }
                title="Schedule a Personalized Demo"
                description="Talk to our team about your specific supply chain challenges and see how Duat can help."
              />
            </div>

            <p className="mt-6 text-white/70 text-sm">
              Note: Demo may take 60 seconds to load if idle for 15+ minutes
            </p>
          </div>
        </div>
      </section>

      {/* Development Status Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                Current Stage: Pre-MVP Development
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our core technology is validated and operational. We're building the enterprise infrastructure to scale these capabilities to production.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-l-4 border-primary">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 flex items-center">
                    <CheckCircle2 className="w-6 h-6 text-primary mr-2" />
                    Current Capabilities
                  </h3>
                  <ul className="space-y-3">
                    {currentCapabilities.map((capability, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{capability}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-secondary">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 flex items-center">
                    <ArrowRight className="w-6 h-6 text-secondary mr-2" />
                    Building Toward Production
                  </h3>
                  <ul className="space-y-3">
                    {roadmapItems.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <ArrowRight className="w-5 h-5 text-secondary mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Capabilities Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 pb-3 border-b-4 border-primary inline-block">
              Platform Capabilities
            </h2>

            <p className="text-lg leading-relaxed text-foreground mb-12 mt-8">
              Explore the features powering our supply chain intelligence platform. Each capability is functional
              in our demonstration environment.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                  <CardContent className="pt-8 pb-6">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">{feature.description}</p>
                    <a
                      href={feature.demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-semibold hover:text-primary/80 transition-colors inline-flex items-center"
                    >
                      View in Demo
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 pb-3 border-b-4 border-primary inline-block">
              Built on Proven Technology
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <Card className="border-l-4 border-primary">
                <CardContent className="p-6">
                  <Satellite className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-4">Data Sources</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Synthetic Aperture Radar (SAR) satellite imagery
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Optical satellite imagery
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Hyperspectral analysis
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Open-source supply chain data
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Proprietary facility databases
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-secondary">
                <CardContent className="p-6">
                  <Brain className="w-12 h-12 text-secondary mb-4" />
                  <h3 className="text-xl font-bold mb-4">AI & Processing</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <span className="text-secondary mr-2">•</span>
                      LLM-based reasoning and analysis
                    </li>
                    <li className="flex items-start">
                      <span className="text-secondary mr-2">•</span>
                      Multi-agent orchestration systems
                    </li>
                    <li className="flex items-start">
                      <span className="text-secondary mr-2">•</span>
                      Real-time event stream processing
                    </li>
                    <li className="flex items-start">
                      <span className="text-secondary mr-2">•</span>
                      Graph neural networks for network modeling
                    </li>
                    <li className="flex items-start">
                      <span className="text-secondary mr-2">•</span>
                      85-95% prediction accuracy validated
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-primary">
                <CardContent className="p-6">
                  <Database className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-4">Platform Architecture</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Cloud-native infrastructure
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      React/TypeScript frontend
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Distributed data processing pipeline
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      RESTful API architecture
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      20TB daily satellite data processing
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Access Options Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 pb-3 border-b-4 border-primary inline-block">
              Experience Duat Today
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <Card className="hover:shadow-lg transition-all">
                <CardContent className="p-8 text-center">
                  <ExternalLink className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3">Interactive Demo</h3>
                  <p className="text-muted-foreground mb-6">
                    Explore the platform yourself. No signup required - start exploring in 60 seconds.
                  </p>
                  <Button className="w-full" asChild>
                    <a href="https://aurachainmonitor-claude-code.onrender.com/" target="_blank" rel="noopener noreferrer">
                      Explore Now
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all border-primary border-2">
                <CardContent className="p-8 text-center">
                  <Play className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3">Guided Walkthrough</h3>
                  <p className="text-muted-foreground mb-6">
                    Schedule a personalized demo with our team tailored to your use case.
                  </p>
                  <ContactDialog
                    trigger={
                      <Button className="w-full" variant="outline">
                        Schedule Demo
                      </Button>
                    }
                    title="Schedule a Demo"
                    description="Our team will walk you through Duat's capabilities and answer your questions."
                  />
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all">
                <CardContent className="p-8 text-center">
                  <Calendar className="w-16 h-16 text-secondary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3">Executive Briefing</h3>
                  <p className="text-muted-foreground mb-6">
                    Talk to our team about your specific supply chain challenges and ROI.
                  </p>
                  <ContactDialog
                    trigger={
                      <Button className="w-full" variant="outline">
                        Get in Touch
                      </Button>
                    }
                    title="Executive Briefing Request"
                    description="Connect with our leadership team to discuss how Duat can transform your supply chain visibility."
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 pb-3 border-b-4 border-primary inline-block">
              From Pre-MVP to Production: Our Journey
            </h2>

            <div className="mt-12 space-y-8">
              <Card className="border-l-4 border-primary bg-gradient-to-r from-primary/10 to-transparent">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <Badge className="mr-3">Q1 2025 - CURRENT</Badge>
                    <h3 className="text-2xl font-bold">Pre-MVP Development</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-primary mr-2 mt-0.5" />
                        <span>Core technology validation</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-primary mr-2 mt-0.5" />
                        <span>Interactive demo platform</span>
                      </li>
                    </ul>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-primary mr-2 mt-0.5" />
                        <span>Satellite data pipeline operational</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-primary mr-2 mt-0.5" />
                        <span>AI risk detection proven</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-secondary">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <Badge variant="outline" className="mr-3">Q2 2025</Badge>
                    <h3 className="text-2xl font-bold">MVP Launch</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start">
                        <ArrowRight className="w-5 h-5 text-secondary mr-2 mt-0.5" />
                        <span>First enterprise pilot customers</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="w-5 h-5 text-secondary mr-2 mt-0.5" />
                        <span>Production-ready API</span>
                      </li>
                    </ul>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start">
                        <ArrowRight className="w-5 h-5 text-secondary mr-2 mt-0.5" />
                        <span>Real-time alerting system</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="w-5 h-5 text-secondary mr-2 mt-0.5" />
                        <span>Custom deployment framework</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-secondary">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <Badge variant="outline" className="mr-3">Q3-Q4 2025</Badge>
                    <h3 className="text-2xl font-bold">Scale & Expansion</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start">
                        <ArrowRight className="w-5 h-5 text-secondary mr-2 mt-0.5" />
                        <span>Multi-customer deployment</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="w-5 h-5 text-secondary mr-2 mt-0.5" />
                        <span>Advanced analytics features</span>
                      </li>
                    </ul>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start">
                        <ArrowRight className="w-5 h-5 text-secondary mr-2 mt-0.5" />
                        <span>Integration marketplace</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="w-5 h-5 text-secondary mr-2 mt-0.5" />
                        <span>Mobile applications</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-primary">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <Badge variant="outline" className="mr-3">2026 & Beyond</Badge>
                    <h3 className="text-2xl font-bold">Enterprise Platform</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start">
                        <ArrowRight className="w-5 h-5 text-primary mr-2 mt-0.5" />
                        <span>Global coverage expansion</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="w-5 h-5 text-primary mr-2 mt-0.5" />
                        <span>Industry-specific solutions</span>
                      </li>
                    </ul>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start">
                        <ArrowRight className="w-5 h-5 text-primary mr-2 mt-0.5" />
                        <span>Autonomous mitigation systems</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="w-5 h-5 text-primary mr-2 mt-0.5" />
                        <span>Supply chain digital twin platform</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="border-l-4 border-secondary">
              <CardContent className="p-8">
                <div className="flex items-start mb-4">
                  <AlertCircle className="w-6 h-6 text-secondary mr-3 mt-1 flex-shrink-0" />
                  <h3 className="text-2xl font-bold">Important Information for Early Stakeholders</h3>
                </div>

                <div className="space-y-4 text-muted-foreground">
                  <p className="text-lg font-semibold text-foreground">
                    Pre-MVP Demonstration Status
                  </p>

                  <p className="leading-relaxed">
                    The demonstration platform showcases validated technology and proven algorithms. However, please note:
                  </p>

                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start">
                      <span className="text-secondary mr-2">•</span>
                      <span>This is a demonstration environment, not production-ready software</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-secondary mr-2">•</span>
                      <span>Data shown is representative and for illustration purposes</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-secondary mr-2">•</span>
                      <span>Response times and coverage in production will vary based on deployment</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-secondary mr-2">•</span>
                      <span>Feature set and pricing are subject to change as we refine our offering</span>
                    </li>
                  </ul>

                  <p className="leading-relaxed font-semibold text-foreground pt-4">
                    We're committed to transparency as we build the future of supply chain intelligence.
                    If you have questions about our current capabilities vs. roadmap features, we're happy to discuss in detail.
                  </p>
                </div>
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
              Be Part of the Supply Chain Revolution
            </h2>
            <p className="text-xl mb-8 opacity-95 leading-relaxed">
              Join forward-thinking enterprises exploring how Duat can transform their supply chain visibility.
              Early stakeholders gain preferred pricing and the ability to shape our roadmap.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-6 h-auto hover:scale-105 transition-transform"
                asChild
              >
                <a href="https://aurachainmonitor-claude-code.onrender.com/" target="_blank" rel="noopener noreferrer">
                  Explore Interactive Demo
                </a>
              </Button>
              <ContactDialog
                trigger={
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-6 border-white/30 text-white hover:bg-white/10"
                  >
                    Schedule Executive Briefing
                  </Button>
                }
                title="Get in Touch"
                description="Connect with our team to discuss partnership opportunities, investment, or early customer access."
              />
            </div>
            <p className="mt-8 text-white/80">
              <strong>Contact:</strong> info@duatflow.com | West Palm Beach, Florida
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Product;
