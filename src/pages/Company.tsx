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
      <section className="relative pt-40 pb-24 bg-gradient-to-br from-primary via-primary/98 to-secondary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(172,210,255,0.08),transparent_50%)]" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <Badge variant="secondary" className="mb-8 text-sm bg-white/15 text-white border-white/20 backdrop-blur-sm hover:bg-white/20 transition-colors">
              <MapPin className="w-3 h-3 mr-2" />
              West Palm Beach, Florida
            </Badge>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 text-white leading-tight tracking-tight">
              Predict Disruptions
              <span className="block text-secondary/95 mt-3">Months Before Impact</span>
            </h1>

            <p className="text-lg md:text-xl text-white/85 mb-8 max-w-3xl mx-auto leading-relaxed font-light">
              Transform invisible supply chain risk into strategic advantage using proprietary satellite intelligence and advanced AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ContactDialog
                trigger={
                  <Button size="lg" variant="secondary" className="text-base px-8 py-3 h-auto rounded-lg font-semibold hover:shadow-lg hover:scale-102 transition-all">
                    Request Executive Briefing
                  </Button>
                }
                title="Request Executive Briefing"
                description="Connect with our team to learn how Duat can protect your supply chain."
              />
              <Button size="lg" variant="outline" className="text-base px-8 py-3 h-auto bg-white/10 text-white border-white/30 hover:bg-white/20 rounded-lg font-semibold transition-all" asChild>
                <a href="/technology">Explore Technology →</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* HERO STATS SECTION */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-0 hover:shadow-xl transition-all duration-300 bg-white border border-border/50">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                    <Clock className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground">MONTHS-AHEAD DETECTION</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    Predict supply chain risks 3-6 months before traditional methods
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 hover:shadow-xl transition-all duration-300 bg-white border border-border/50">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-lg bg-secondary/10 flex items-center justify-center mb-5">
                    <Network className="w-7 h-7 text-secondary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground">FULL UPSTREAM VISIBILITY</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    Map every tier from raw materials to finished products
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 hover:shadow-xl transition-all duration-300 bg-white border border-border/50">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                    <Shield className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground">AUTOMATED MITIGATION</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    AI-generated strategies protect margins and market position
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 hover:shadow-xl transition-all duration-300 bg-white border border-border/50">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-lg bg-secondary/10 flex items-center justify-center mb-5">
                    <Satellite className="w-7 h-7 text-secondary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground">PATENTED TECHNOLOGY</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    Subsurface SAR intelligence reveals what satellites and spreadsheets miss
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 hover:shadow-xl transition-all duration-300 bg-white border border-border/50">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                    <Target className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground">MULTI-TIER RISK MODELING</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    Detect cascade effects across your entire supplier network
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 hover:shadow-xl transition-all duration-300 bg-white border border-border/50">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-lg bg-secondary/10 flex items-center justify-center mb-5">
                    <TrendingUp className="w-7 h-7 text-secondary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground">PREDICTIVE ANALYTICS</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    Actionable insights for material flow, bottlenecks, and enterprise impact
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM SECTION */}
      <section className="py-24 bg-muted/40">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-2">Why This Matters Now</h2>
              <div className="w-16 h-1 bg-secondary rounded-full"></div>
            </div>

            <Card className="border-0 bg-gradient-to-br from-primary/8 to-secondary/8 mb-12 shadow-sm">
              <CardContent className="p-8 md:p-10">
                <p className="text-2xl md:text-3xl font-light text-foreground italic leading-relaxed">
                  &ldquo;Supply chain opacity is among the greatest unpriced risks in enterprise operations.&rdquo;
                </p>
              </CardContent>
            </Card>

            <p className="text-lg leading-relaxed text-muted-foreground mb-8">
              Most companies operate blind to threats lurking in their upstream supply chains. By the time traditional monitoring systems flag a problem, it&apos;s too late to avoid impact.
            </p>

            <h3 className="text-2xl font-bold text-foreground mb-6">The hidden costs of reactive supply chain management:</h3>

            <ul className="space-y-4 mb-10">
              <li className="flex items-start text-lg group">
                <span className="text-secondary font-bold mr-4 mt-0.5 group-hover:scale-125 transition-transform">•</span>
                <span className="leading-relaxed">
                  <strong className="text-foreground">Margin erosion</strong> <span className="text-muted-foreground">from unexpected material price spikes</span>
                </span>
              </li>
              <li className="flex items-start text-lg group">
                <span className="text-secondary font-bold mr-4 mt-0.5 group-hover:scale-125 transition-transform">•</span>
                <span className="leading-relaxed">
                  <strong className="text-foreground">Production delays</strong> <span className="text-muted-foreground">cascading through multi-tier suppliers</span>
                </span>
              </li>
              <li className="flex items-start text-lg group">
                <span className="text-secondary font-bold mr-4 mt-0.5 group-hover:scale-125 transition-transform">•</span>
                <span className="leading-relaxed">
                  <strong className="text-foreground">Working capital</strong> <span className="text-muted-foreground">trapped in excessive safety stock</span>
                </span>
              </li>
              <li className="flex items-start text-lg group">
                <span className="text-secondary font-bold mr-4 mt-0.5 group-hover:scale-125 transition-transform">•</span>
                <span className="leading-relaxed">
                  <strong className="text-foreground">Revenue loss</strong> <span className="text-muted-foreground">from fulfillment failures and stockouts</span>
                </span>
              </li>
              <li className="flex items-start text-lg group">
                <span className="text-secondary font-bold mr-4 mt-0.5 group-hover:scale-125 transition-transform">•</span>
                <span className="leading-relaxed">
                  <strong className="text-foreground">Competitive disadvantage</strong> <span className="text-muted-foreground">from slower response than rivals</span>
                </span>
              </li>
            </ul>

            <Card className="border-0 bg-secondary/8 rounded-xl">
              <CardContent className="p-8">
                <p className="text-lg font-medium text-foreground leading-relaxed">
                  <span className="text-secondary font-bold">Duat changes the equation.</span> Instead of reacting to disruptions, you anticipate and mitigate them—turning supply chain intelligence from cost center to competitive weapon.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* THE DUAT ADVANTAGE SECTION */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16">
              <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-3">What Makes Duat Different</h2>
              <div className="w-16 h-1 bg-secondary rounded-full"></div>
            </div>

            <div className="space-y-14 mt-12">
              <div>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-full bg-secondary/15 flex items-center justify-center">
                    <span className="text-lg font-bold text-secondary">1</span>
                  </div>
                  <h3 className="text-3xl font-bold text-foreground">Full Upstream Visibility</h3>
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground mb-5 pl-16">
                  Most platforms track only your direct (Tier 1) suppliers. <strong className="text-foreground">Duat maps your entire upstream ecosystem</strong>—from raw material extraction through every processing and assembly tier to your finished goods.
                </p>
                <Card className="bg-gradient-to-br from-secondary/8 to-secondary/4 border-secondary/20 ml-16">
                  <CardContent className="p-6">
                    <p className="text-lg leading-relaxed">
                      <span className="text-secondary font-semibold">Why this matters:</span> <span className="text-muted-foreground">A disruption at a lithium mine in Chile affects your EV production 6 months later. We show you this connection before competitors know there&apos;s a problem.</span>
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">2</span>
                  </div>
                  <h3 className="text-3xl font-bold text-foreground">Months-Ahead Detection</h3>
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground mb-5 pl-16">
                  Traditional supply chain monitoring relies on reported data—supplier surveys, shipping manifests, news reports. <strong className="text-foreground">Duat uses advanced satellite data and proprietary AI</strong> to detect disruptions forming in real-time.
                </p>
                <Card className="bg-gradient-to-br from-primary/8 to-primary/4 border-primary/20 ml-16">
                  <CardContent className="p-6">
                    <p className="text-lg leading-relaxed">
                      <span className="text-primary font-semibold">The advantage:</span> <span className="text-muted-foreground">3–6 months early warning vs. 3–6 weeks with conventional methods. That&apos;s the difference between proactive mitigation and crisis management.</span>
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-full bg-secondary/15 flex items-center justify-center">
                    <span className="text-lg font-bold text-secondary">3</span>
                  </div>
                  <h3 className="text-3xl font-bold text-foreground">Predictive, Actionable Intelligence</h3>
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground mb-5 pl-16">
                  Alerts without guidance create noise, not value. <strong className="text-foreground">Duat&apos;s AI doesn&apos;t just warn you—it models the cascade impact</strong> across your supply chain and recommends mitigation strategies.
                </p>
                <Card className="bg-gradient-to-br from-secondary/8 to-secondary/4 border-secondary/20 ml-16">
                  <CardContent className="p-6">
                    <p className="text-lg leading-relaxed">
                      <span className="text-secondary font-semibold">The result:</span> <span className="text-muted-foreground">Clear, prioritized actions that protect margins, maintain production, and preserve competitive position.</span>
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TECHNOLOGY TEASER SECTION */}
      <section className="py-24 bg-muted/40">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-3">Proprietary Satellite & AI</h2>
              <div className="w-16 h-1 bg-secondary rounded-full"></div>
            </div>

            <div className="mt-14">
              <p className="text-lg leading-relaxed text-muted-foreground mb-8">
                Duat leverages <strong className="text-foreground">Synthetic Aperture Radar (SAR) satellite technology</strong> to monitor global production infrastructure in real-time—regardless of cloud cover, darkness, or attempts to hide activity.
              </p>

              <Card className="bg-gradient-to-br from-primary via-primary/95 to-secondary text-white border-0 mb-10 shadow-lg">
                <CardContent className="p-10 md:p-12 text-center">
                  <p className="text-xl md:text-2xl font-light leading-relaxed">
                    This isn&apos;t guesswork. This is physics-based intelligence applied to your specific supply chain architecture.
                  </p>
                </CardContent>
              </Card>

              <div className="text-center">
                <Button size="lg" variant="outline" className="text-base px-8 py-3 rounded-lg font-semibold" asChild>
                  <a href="/technology">Explore Our Technology Platform →</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INVESTOR VALUE TEASER */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <Card className="bg-gradient-to-br from-primary/8 via-background to-secondary/5 border-0 hover:shadow-xl transition-all shadow-md">
              <CardContent className="p-10 md:p-14">
                <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
                  <div className="w-16 h-16 rounded-lg bg-secondary/15 flex items-center justify-center flex-shrink-0">
                    <TrendingDown className="w-8 h-8 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                      For Operational Leaders & Investors
                    </h2>
                    <p className="text-xl font-medium text-foreground mb-2">
                      Duat transforms supply chain intelligence into enterprise alpha.
                    </p>
                  </div>
                </div>

                <p className="text-lg leading-relaxed text-muted-foreground mb-8">
                  Early insights enable proactive decisions that sustain profitability and competitive advantage. Our platform empowers you to anticipate disruptions before they impact EBITDA, quantify and hedge supply chain risk exposure, and shield earnings from volatility.
                </p>

                <div className="flex justify-center">
                  <Button size="lg" className="text-base px-8 py-3 rounded-lg font-semibold" asChild>
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
      <section className="py-24 bg-muted/40">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-3">World-Class Team</h2>
              <div className="w-16 h-1 bg-secondary rounded-full"></div>
            </div>

            <p className="text-lg leading-relaxed text-muted-foreground mb-10 mt-12">
              Duat&apos;s founding team brings decades of experience from <strong className="text-foreground">IBM, VMware, SAP, Manhattan Associates, and PureStorage</strong>—companies that built the enterprise software and supply chain platforms Fortune 500 companies depend on.
            </p>

            <Card className="bg-gradient-to-br from-primary to-primary/95 text-white border-0 mb-12 shadow-lg">
              <CardContent className="p-10 md:p-12 text-center">
                <p className="text-xl md:text-2xl font-light leading-relaxed">
                  We&apos;ve solved these problems at global scale. Now we&apos;re making that intelligence accessible.
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
