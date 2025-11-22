import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactDialog from "@/components/ContactDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Target, Shield, Zap, Globe, DollarSign } from "lucide-react";

const WhyDuat = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary via-primary/95 to-secondary">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />

        <div className="container mx-auto px-6 relative">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white">
              Why Duat Matters
            </h1>
            <p className="text-2xl text-white/90 leading-relaxed">
              Turning Supply Chain's Greatest Weakness into Competitive Advantage
            </p>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 pb-3 border-b-4 border-primary inline-block">
              The Problem: Unpriced Risk
            </h2>

            <p className="text-xl leading-relaxed text-muted-foreground mb-8 mt-12">
              Supply chain opacity represents one of the largest unpriced risks in modern enterprise operations.
            </p>

            <h3 className="text-2xl font-bold mb-6">Consider:</h3>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <Card className="border-l-4 border-primary">
                <CardContent className="p-6">
                  <p className="text-lg leading-relaxed">
                    A single disruption at a lithium processing facility in Australia can halt EV production in three continents
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-primary">
                <CardContent className="p-6">
                  <p className="text-lg leading-relaxed">
                    The 2021 Suez Canal blockage cost global trade <strong className="text-primary">$9-10 billion per week</strong>
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-secondary">
                <CardContent className="p-6">
                  <p className="text-lg leading-relaxed">
                    <strong className="text-foreground">75%</strong> of companies experienced supply chain disruptions in 2023,
                    but only <strong className="text-foreground">15%</strong> had advance warning
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-secondary">
                <CardContent className="p-6">
                  <p className="text-lg leading-relaxed">
                    Average cost of supply chain disruption: <strong className="text-primary">$184 million per event</strong> (Gartner)
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-l-4 border-primary">
              <CardContent className="p-8">
                <p className="text-xl leading-relaxed font-semibold">
                  <strong className="text-primary">The core issue:</strong> Most companies only monitor their Tier 1 (direct) suppliers.
                  But <strong>80% of disruptions originate in Tier 2-4 suppliers</strong> - hidden from view until it's too late to respond effectively.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 pb-3 border-b-4 border-primary inline-block">
              The Market Opportunity
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <Card className="hover:shadow-lg transition-all">
                <CardContent className="p-8 text-center">
                  <Globe className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3">Total Addressable Market (TAM)</h3>
                  <div className="space-y-3 text-muted-foreground">
                    <p>Global supply chain management software: <strong className="text-foreground">$22.5B</strong></p>
                    <p>Risk management & compliance software: <strong className="text-foreground">$12.8B</strong></p>
                    <p>Predictive analytics for supply chain: <strong className="text-foreground">$8.3B</strong></p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all border-primary border-2">
                <CardContent className="p-8 text-center">
                  <Target className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3">Serviceable Addressable Market (SAM)</h3>
                  <div className="space-y-3 text-muted-foreground">
                    <p>Enterprise companies with complex multi-tier supply chains</p>
                    <p><strong className="text-foreground">Fortune 2000</strong> companies (manufacturing, automotive, electronics)</p>
                    <p>Annual spend on supply chain visibility: <strong className="text-foreground">$5-15M</strong> per enterprise</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all">
                <CardContent className="p-8 text-center">
                  <TrendingUp className="w-16 h-16 text-secondary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3">Serviceable Obtainable Market (SOM)</h3>
                  <div className="space-y-3 text-muted-foreground">
                    <p>Early adopters: Companies with <strong className="text-foreground">high supply chain risk exposure</strong></p>
                    <p>Target: <strong className="text-foreground">200-500 enterprises</strong> in first 3 years</p>
                    <p>Revenue potential: <strong className="text-foreground">$500M+ ARR</strong> at scale</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* The Duat Solution */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 pb-3 border-b-4 border-primary inline-block">
              The Duat Solution: What Others Can't See, We Show
            </h2>

            <p className="text-xl leading-relaxed text-muted-foreground mb-12 mt-12">
              Duat delivers <strong className="text-foreground">months-ahead disruption intelligence</strong> through three core capabilities:
            </p>

            <div className="space-y-8">
              <Card className="border-l-4 border-primary hover:shadow-lg transition-all">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">1. Full Upstream Mapping</h3>
                  <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                    We map your entire supply chain ecosystem - from raw material extraction through every tier of processing and assembly.
                  </p>
                  <p className="text-lg font-semibold text-primary">
                    Competitive advantage: While competitors track 1-2 tiers, we track 4-6 tiers deep.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-secondary hover:shadow-lg transition-all">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">2. Proprietary Satellite and Data Neural Network AI</h3>
                  <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                    Our proprietary satellite data analysis reveals production activity in real-time, regardless of weather,
                    darkness, or attempts to conceal activity.
                  </p>
                  <p className="text-lg font-semibold text-secondary">
                    Competitive advantage: Physics-based detection vs. self-reported data.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-primary hover:shadow-lg transition-all">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">3. CASCADE Risk Modeling</h3>
                  <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                    Our AI models how disruptions propagate through multi-tier networks, showing not just what's disrupted but
                    what will be disrupted next.
                  </p>
                  <p className="text-lg font-semibold text-primary">
                    Competitive advantage: Predictive intelligence vs. reactive alerts.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Business Model */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 pb-3 border-b-4 border-primary inline-block">
              Business Model
            </h2>

            <div className="mt-12 space-y-8">
              <div>
                <h3 className="text-3xl font-bold mb-6">Revenue Streams</h3>

                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="border-l-4 border-primary">
                    <CardContent className="p-6">
                      <DollarSign className="w-12 h-12 text-primary mb-4" />
                      <h4 className="text-xl font-bold mb-3">Platform Subscriptions (Primary)</h4>
                      <p className="text-muted-foreground mb-3">Tiered pricing based on supply chain complexity and monitoring breadth</p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><strong className="text-foreground">Enterprise:</strong> $500K - $2M+ annually</li>
                        <li><strong className="text-foreground">Mid-market:</strong> $100K - $500K annually</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-secondary">
                    <CardContent className="p-6">
                      <Shield className="w-12 h-12 text-secondary mb-4" />
                      <h4 className="text-xl font-bold mb-3">Professional Services</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>Supply chain mapping & integration: <strong className="text-foreground">$50K - $300K</strong> per engagement</li>
                        <li>Custom risk modeling: <strong className="text-foreground">$25K - $150K</strong> per model</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-primary">
                    <CardContent className="p-6">
                      <Zap className="w-12 h-12 text-primary mb-4" />
                      <h4 className="text-xl font-bold mb-3">Premium Intelligence (Future)</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>Industry-specific intelligence reports</li>
                        <li>Competitive supply chain analysis</li>
                        <li>Market intelligence feeds</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-l-4 border-primary">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Unit Economics</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <ul className="space-y-3 text-lg">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Customer Acquisition Cost (CAC):</span>
                          <strong>$150K - $300K</strong>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Lifetime Value (LTV):</span>
                          <strong>$3M - $8M</strong>
                        </li>
                        <li className="flex justify-between border-t pt-3">
                          <span className="text-muted-foreground">LTV:CAC ratio:</span>
                          <strong className="text-primary">15-25x (best-in-class SaaS)</strong>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <ul className="space-y-3 text-lg">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Gross margin:</span>
                          <strong className="text-primary">80%+</strong>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Retention period:</span>
                          <strong>5-7 years</strong>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Competitive Landscape */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 pb-3 border-b-4 border-primary inline-block">
              Competitive Landscape
            </h2>

            <div className="mt-12 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">Traditional Supply Chain Software</h3>
                  <p className="text-muted-foreground mb-2">SAP, Oracle, Manhattan Associates</p>
                  <p className="text-sm text-accent"><strong>Limitation:</strong> Downstream focus, limited predictive capability</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">Supply Chain Visibility Platforms</h3>
                  <p className="text-muted-foreground mb-2">Project44, FourKites, ClearMetal</p>
                  <p className="text-sm text-accent"><strong>Limitation:</strong> Logistics tracking only, no upstream visibility</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">Risk Intelligence Platforms</h3>
                  <p className="text-muted-foreground mb-2">Resilinc, Everstream Analytics, Interos</p>
                  <p className="text-sm text-accent"><strong>Limitation:</strong> Relies on reported data and news feeds, weeks-to-months delayed</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-primary to-secondary text-white border-0">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Duat's Differentiation</h3>
                  <ul className="space-y-3 text-lg">
                    <li className="flex items-start">
                      <span className="text-white text-2xl mr-3">✓</span>
                      <span>Only platform with proprietary satellite and data neural network AI</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-white text-2xl mr-3">✓</span>
                      <span>Only platform mapping full upstream supply chains</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-white text-2xl mr-3">✓</span>
                      <span>Only platform delivering months-ahead predictions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-white text-2xl mr-3">✓</span>
                      <span>Only platform with automated mitigation strategy generation</span>
                    </li>
                  </ul>
                  <p className="text-xl font-semibold mt-6 text-center">
                    We're not competing in an existing category - we're creating a new one.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why Now */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 pb-3 border-b-4 border-primary inline-block">
              Why Now
            </h2>

            <p className="text-xl leading-relaxed text-muted-foreground mb-12 mt-12">
              Three converging trends make 2025 the inflection point for supply chain intelligence:
            </p>

            <div className="space-y-8">
              <Card className="border-l-4 border-primary">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">1. Geopolitical Fragmentation</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start">
                      <span className="text-primary mr-3">•</span>
                      US-China trade tensions forcing supply chain restructuring
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-3">•</span>
                      Near-shoring and friend-shoring creating new, complex networks
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-3">•</span>
                      Enterprises need visibility into unfamiliar suppliers and regions
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-secondary">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">2. Climate Volatility</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start">
                      <span className="text-secondary mr-3">•</span>
                      Increasing frequency of extreme weather disrupting production
                    </li>
                    <li className="flex items-start">
                      <span className="text-secondary mr-3">•</span>
                      Traditional risk models underestimate climate impact on supply chains
                    </li>
                    <li className="flex items-start">
                      <span className="text-secondary mr-3">•</span>
                      Satellite-based monitoring provides early warning of climate-related disruptions
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-primary">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">3. AI Maturity</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start">
                      <span className="text-primary mr-3">•</span>
                      LLMs and agent-based systems enable autonomous intelligence at scale
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-3">•</span>
                      What required armies of analysts 5 years ago now runs autonomously
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-3">•</span>
                      Cost of AI processing dropped 90%+ in 3 years, making our model economically viable
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-l-4 border-primary">
              <CardContent className="p-8 text-center">
                <p className="text-2xl font-bold text-primary">
                  The window is open. The technology is ready. The market is demanding solutions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* The Vision */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 pb-3 border-b-4 border-primary inline-block">
              The Duat Vision
            </h2>

            <Card className="mt-12 bg-gradient-to-r from-primary to-secondary text-white border-0">
              <CardContent className="p-12 text-center">
                <p className="text-3xl font-bold mb-8">
                  We're building the intelligence layer for global supply chains.
                </p>
                <p className="text-xl leading-relaxed mb-8">
                  Five years from now, no major enterprise will make supply chain decisions without consulting platforms
                  like Duat - because operating blind will be unthinkable.
                </p>
                <p className="text-2xl font-semibold">
                  We're not just preventing disruptions. We're fundamentally changing how enterprises understand and manage
                  their supply chains.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Discuss Partnership or Investment?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Connect with our team to learn more about Duat's technology, market opportunity, and investment potential.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ContactDialog
                trigger={
                  <Button size="lg" className="text-lg px-8 py-6 h-auto hover:scale-105 transition-transform">
                    Request Investor Deck
                  </Button>
                }
                title="Request Investor Information"
                description="Connect with our team to learn about investment opportunities."
              />
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <a href="/company">Learn About Our Team →</a>
              </Button>
            </div>
            <p className="mt-8 text-muted-foreground">
              <strong>Contact:</strong> info@duatflow.com | West Palm Beach, Florida
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WhyDuat;
