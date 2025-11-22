import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactDialog from "@/components/ContactDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Network, Shield, Satellite, TrendingUp, Target, Users, TrendingDown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Company = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary via-primary/95 to-secondary">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />

        <div className="container mx-auto px-6 relative">
          <div className="max-w-5xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 text-sm bg-white/20 text-white border-white/30">
              <MapPin className="w-3 h-3 mr-1" />
              West Palm Beach, Florida
            </Badge>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white">
              Predict Supply Chain Disruptions
              <span className="block mt-2">Months Before They Happen</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-6 max-w-4xl mx-auto leading-relaxed">
              Duat transforms invisible supply chain risk into strategic advantage using proprietary satellite and data neural network AI.
            </p>

            <p className="text-lg text-white/80 mb-8 max-w-3xl mx-auto font-medium">
              From raw material extraction to finished goods, see what others can't - before disruption hits.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ContactDialog
                trigger={
                  <Button size="lg" variant="secondary" className="text-lg px-8 py-6 h-auto hover:scale-105 transition-transform">
                    Request Executive Briefing
                  </Button>
                }
                title="Request Executive Briefing"
                description="Connect with our team to learn how Duat can protect your supply chain."
              />
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto bg-white/10 text-white border-white/30 hover:bg-white/20" asChild>
                <a href="/technology">See Our Technology →</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* HERO STATS SECTION */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-l-4 border-primary hover:shadow-lg transition-all">
                <CardContent className="p-8">
                  <Clock className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">MONTHS-AHEAD DETECTION</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Predict supply chain risks 3-6 months before traditional methods
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-primary hover:shadow-lg transition-all">
                <CardContent className="p-8">
                  <Network className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">FULL UPSTREAM VISIBILITY</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Map every tier from raw materials to finished products
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-primary hover:shadow-lg transition-all">
                <CardContent className="p-8">
                  <Shield className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">AUTOMATED MITIGATION</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    AI-generated strategies protect margins and market position
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-secondary hover:shadow-lg transition-all">
                <CardContent className="p-8">
                  <Satellite className="w-12 h-12 text-secondary mb-4" />
                  <h3 className="text-xl font-bold mb-2">PATENTED TECHNOLOGY</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Subsurface SAR intelligence reveals what satellites and spreadsheets miss
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-secondary hover:shadow-lg transition-all">
                <CardContent className="p-8">
                  <Target className="w-12 h-12 text-secondary mb-4" />
                  <h3 className="text-xl font-bold mb-2">MULTI-TIER RISK MODELING</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Detect cascade effects across your entire supplier network
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-secondary hover:shadow-lg transition-all">
                <CardContent className="p-8">
                  <TrendingUp className="w-12 h-12 text-secondary mb-4" />
                  <h3 className="text-xl font-bold mb-2">PREDICTIVE ANALYTICS</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Actionable insights for material flow, bottlenecks, and enterprise impact
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM SECTION */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Why This Matters Now</h2>

            <Card className="border-l-4 border-primary bg-gradient-to-r from-primary/5 to-secondary/5 mb-8">
              <CardContent className="p-8">
                <p className="text-2xl md:text-3xl font-semibold text-foreground italic leading-relaxed">
                  "Supply chain opacity is among the greatest unpriced risks in enterprise operations."
                </p>
              </CardContent>
            </Card>

            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Most companies operate blind to threats lurking in their upstream supply chains. By the time traditional monitoring systems flag a problem, it's too late to avoid impact.
            </p>

            <h3 className="text-2xl font-bold mb-4">The hidden costs of reactive supply chain management:</h3>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start text-lg">
                <span className="text-primary text-2xl font-bold mr-4 mt-1">→</span>
                <span className="leading-relaxed">
                  <strong>Margin erosion</strong> from unexpected material price spikes
                </span>
              </li>
              <li className="flex items-start text-lg">
                <span className="text-primary text-2xl font-bold mr-4 mt-1">→</span>
                <span className="leading-relaxed">
                  <strong>Production delays</strong> cascading through multi-tier suppliers
                </span>
              </li>
              <li className="flex items-start text-lg">
                <span className="text-primary text-2xl font-bold mr-4 mt-1">→</span>
                <span className="leading-relaxed">
                  <strong>Working capital</strong> trapped in excessive safety stock
                </span>
              </li>
              <li className="flex items-start text-lg">
                <span className="text-primary text-2xl font-bold mr-4 mt-1">→</span>
                <span className="leading-relaxed">
                  <strong>Revenue loss</strong> from fulfillment failures and stockouts
                </span>
              </li>
              <li className="flex items-start text-lg">
                <span className="text-primary text-2xl font-bold mr-4 mt-1">→</span>
                <span className="leading-relaxed">
                  <strong>Competitive disadvantage</strong> from slower response than rivals
                </span>
              </li>
            </ul>

            <p className="text-xl font-semibold text-primary">
              Duat changes the equation. Instead of reacting to disruptions, you anticipate and mitigate them - turning supply chain intelligence from cost center to competitive weapon.
            </p>
          </div>
        </div>
      </section>

      {/* THE DUAT ADVANTAGE SECTION */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-12 pb-3 border-b-4 border-primary inline-block">
              What Makes Duat Different
            </h2>

            <div className="space-y-12 mt-12">
              <div>
                <h3 className="text-3xl font-bold mb-4">1. Full Upstream Visibility</h3>
                <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                  Most platforms track only your direct (Tier 1) suppliers. <strong className="text-foreground">Duat maps your entire upstream ecosystem</strong> - from raw material extraction through every processing and assembly tier to your finished goods.
                </p>
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <p className="text-lg leading-relaxed">
                      <strong className="text-primary">Why this matters:</strong> A disruption at a lithium mine in Chile affects your electric vehicle production 6 months later. We show you this connection before your competitors know there's a problem.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="text-3xl font-bold mb-4">2. Months-Ahead Detection</h3>
                <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                  Traditional supply chain monitoring relies on reported data - supplier surveys, shipping manifests, news reports. <strong className="text-foreground">Duat uses advanced satellite data and proprietary AI</strong> to detect disruptions forming in real-time.
                </p>
                <Card className="bg-secondary/5 border-secondary/20">
                  <CardContent className="p-6">
                    <p className="text-lg leading-relaxed">
                      <strong className="text-secondary">The advantage:</strong> 3-6 months early warning vs. 3-6 weeks with conventional methods. That's the difference between proactive mitigation and crisis management.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="text-3xl font-bold mb-4">3. Predictive, Actionable Intelligence</h3>
                <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                  Alerts without guidance create noise, not value. <strong className="text-foreground">Duat's AI doesn't just warn you - it models the cascade impact</strong> across your supply chain and recommends mitigation strategies.
                </p>
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <p className="text-lg leading-relaxed">
                      <strong className="text-primary">The result:</strong> Clear, prioritized actions that protect margins, maintain production, and preserve competitive position.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TECHNOLOGY TEASER SECTION */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 pb-3 border-b-4 border-primary inline-block">
              Proprietary Satellite and Data Neural Network AI
            </h2>

            <div className="mt-12">
              <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                Duat leverages <strong className="text-foreground">Synthetic Aperture Radar (SAR) satellite technology</strong> to monitor global production infrastructure in real-time - regardless of cloud cover, darkness, or attempts to hide activity.
              </p>

              <Card className="bg-gradient-to-r from-primary to-secondary text-white border-0 mb-8">
                <CardContent className="p-8 text-center">
                  <p className="text-xl md:text-2xl font-semibold leading-relaxed">
                    This isn't guesswork. This is physics-based intelligence applied to your specific supply chain architecture.
                  </p>
                </CardContent>
              </Card>

              <div className="text-center">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                  <a href="/technology">Explore Our Technology Platform →</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INVESTOR VALUE TEASER */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <Card className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-l-4 border-primary hover:shadow-xl transition-all">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-start gap-6 mb-6">
                  <TrendingDown className="w-16 h-16 text-primary flex-shrink-0" />
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                      For Operational Leaders & Investors
                    </h2>
                    <p className="text-xl font-semibold mb-6">
                      Duat transforms supply chain intelligence into enterprise alpha.
                    </p>
                  </div>
                </div>

                <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                  Early insights enable proactive decisions that sustain profitability and competitive advantage. Our platform empowers you to anticipate disruptions before they impact EBITDA, quantify and hedge supply chain risk exposure, and shield earnings from volatility.
                </p>

                <div className="flex justify-center">
                  <Button size="lg" className="text-lg px-8 py-6" asChild>
                    <Link to="/why-duat">
                      See Market Opportunity & Business Model
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* TEAM TEASER SECTION */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 pb-3 border-b-4 border-primary inline-block">
              World-Class Team from Enterprise Leaders
            </h2>

            <p className="text-xl leading-relaxed text-muted-foreground mb-8 mt-12">
              Duat's founding team brings decades of experience from <strong className="text-foreground">IBM, VMware, SAP, Manhattan Associates, and PureStorage</strong> - companies that built the enterprise software and supply chain platforms Fortune 500 companies depend on.
            </p>

            <Card className="bg-gradient-to-br from-primary to-primary/90 text-white border-0 mb-12">
              <CardContent className="p-8 text-center">
                <p className="text-xl md:text-2xl font-semibold leading-relaxed">
                  We've solved these problems at global scale. Now we're making that intelligence accessible.
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <Card className="hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold mb-2">Michael Weinberg</h4>
                  <p className="text-primary font-semibold mb-2">Co-Founder & CEO</p>
                  <p className="text-muted-foreground text-sm">
                    ex-IBM, ex-Mendix, 10 years supply chain metals
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold mb-2">Scott Jobe</h4>
                  <p className="text-primary font-semibold mb-2">Co-Founder & CTO</p>
                  <p className="text-muted-foreground text-sm">
                    ex-VMware VP, PureStorage
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold mb-2">Shaun Stewart</h4>
                  <p className="text-primary font-semibold mb-2">Co-Founder & CPO</p>
                  <p className="text-muted-foreground text-sm">
                    ex-Delos, ex-InfoGrid, Startup exec
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold mb-2">Zack Zondlo</h4>
                  <p className="text-primary font-semibold mb-2">Lead AI Architect</p>
                  <p className="text-muted-foreground text-sm">
                    Enterprise-scale agent orchestration
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold mb-2">Ruben Villa</h4>
                  <p className="text-primary font-semibold mb-2">Co-Founder</p>
                  <p className="text-muted-foreground text-sm">
                    Professional pilot, Agriculture & Marketing
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all bg-primary/5 border-primary/30">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                  <Users className="w-12 h-12 text-primary mb-3" />
                  <p className="text-lg font-semibold mb-2">Plus 4 Advisors</p>
                  <p className="text-sm text-muted-foreground">
                    ex-SAP, ex-Manhattan Associates, and more
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <Link to="/company/team">
                  Meet the Full Team
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Turn Supply Chain Risk into Strategic Advantage?
            </h2>
            <p className="text-xl mb-8 opacity-95 leading-relaxed">
              See how Duat can protect your margins, maintain production, and deliver competitive intelligence your rivals don't have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ContactDialog
                trigger={
                  <Button size="lg" variant="secondary" className="text-lg px-8 py-6 h-auto hover:scale-105 transition-transform">
                    Request Executive Briefing
                  </Button>
                }
                title="Request Executive Briefing"
                description="Connect with our team to learn how Duat can protect your supply chain."
              />
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto bg-white/10 text-white border-white/30 hover:bg-white/20" asChild>
                <a href="/technology">Schedule Platform Demo</a>
              </Button>
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

export default Company;
