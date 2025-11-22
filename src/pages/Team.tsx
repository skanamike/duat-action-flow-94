import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactDialog from "@/components/ContactDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Briefcase, Award } from "lucide-react";

const Team = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              The Duat Team
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Building the next generation of supply chain intelligence requires deep expertise across enterprise software,
              AI systems, supply chain operations, and satellite technology. Our team has built that expertise at the world's
              leading enterprise software and infrastructure companies.
            </p>
          </div>
        </div>
      </section>

      {/* Founding Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-12">
              <Users className="w-8 h-8 text-primary" />
              <h2 className="text-4xl md:text-5xl font-bold">Founding Team</h2>
            </div>

            <div className="space-y-8">
              {/* Michael Weinberg */}
              <Card className="hover:shadow-lg transition-all">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-12 h-12 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold mb-2">Michael Weinberg</h3>
                      <p className="text-xl text-primary font-semibold mb-4">Co-Founder & Chief Executive Officer</p>

                      <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                        Michael brings 10+ years of hands-on supply chain experience from the metals industry, where he witnessed
                        firsthand how upstream disruptions cascade through production networks.
                      </p>

                      <div className="mb-4">
                        <h4 className="font-bold text-lg mb-2">Previous Experience:</h4>
                        <ul className="space-y-2 text-muted-foreground">
                          <li className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            Supply chain operations and sales leadership at <strong className="text-foreground">IBM</strong> and <strong className="text-foreground">Mendix</strong>
                          </li>
                          <li className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            Consistently recognized for building high-performance sales teams
                          </li>
                          <li className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            Deep technical background in both biomedical sciences and computer science
                          </li>
                        </ul>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-bold text-lg mb-2">Education:</h4>
                        <p className="text-muted-foreground">M.D., M.S. Biomedical Chemistry | B.A./B.S. Computer Science</p>
                      </div>

                      <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="p-4">
                          <p className="italic text-foreground">
                            "I've watched companies lose millions because they couldn't see disruptions forming deep in their
                            supply chains - tier-3, tier-4, and beyond. Duat gives enterprises the visibility they need to operate
                            confidently in an uncertain world."
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Scott Jobe */}
              <Card className="hover:shadow-lg transition-all">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-12 h-12 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold mb-2">Scott Jobe</h3>
                      <p className="text-xl text-primary font-semibold mb-4">Co-Founder & Chief Technology Officer</p>

                      <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                        Scott is an enterprise infrastructure expert who has architected and scaled platforms processing billions
                        of transactions for Fortune 500 companies.
                      </p>

                      <div className="mb-4">
                        <h4 className="font-bold text-lg mb-2">Previous Experience:</h4>
                        <ul className="space-y-2 text-muted-foreground">
                          <li className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            VP Solution Architects at <strong className="text-foreground">VMware</strong>
                          </li>
                          <li className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            Enterprise infrastructure leadership at <strong className="text-foreground">PureStorage</strong>
                          </li>
                          <li className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            Expert in distributed systems, cloud architecture, and global-scale SaaS platforms
                          </li>
                        </ul>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-bold text-lg mb-2">Expertise:</h4>
                        <p className="text-muted-foreground">
                          Building systems that handle massive data volumes with millisecond latency - exactly what's required
                          for real-time supply chain intelligence.
                        </p>
                      </div>

                      <Card className="bg-secondary/5 border-secondary/20">
                        <CardContent className="p-4">
                          <p className="italic text-foreground">
                            "Supply chain visibility is fundamentally a data engineering problem. The technology exists to
                            solve it - someone just needed to build it the right way."
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shaun Stewart */}
              <Card className="hover:shadow-lg transition-all">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-12 h-12 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold mb-2">Shaun Stewart</h3>
                      <p className="text-xl text-primary font-semibold mb-4">Co-Founder & Chief Product Officer</p>

                      <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                        Shaun is an experienced startup executive who has taken products from concept to market across multiple verticals.
                      </p>

                      <div className="mb-4">
                        <h4 className="font-bold text-lg mb-2">Previous Experience:</h4>
                        <ul className="space-y-2 text-muted-foreground">
                          <li className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            Product leadership at <strong className="text-foreground">Delos</strong> and <strong className="text-foreground">InfoGrid</strong>
                          </li>
                          <li className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            Go-to-market strategy and product-market fit expert
                          </li>
                          <li className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            Track record of translating complex technology into customer value
                          </li>
                        </ul>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-bold text-lg mb-2">Expertise:</h4>
                        <p className="text-muted-foreground">
                          Understanding what enterprises actually need vs. what they think they need, and building products
                          that deliver measurable ROI.
                        </p>
                      </div>

                      <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="p-4">
                          <p className="italic text-foreground">
                            "Every supply chain leader knows they have blind spots. Our job is to illuminate those spots in
                            a way that drives immediate, actionable decisions."
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Zack Zondlo */}
              <Card className="hover:shadow-lg transition-all">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-12 h-12 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold mb-2">Zack Zondlo</h3>
                      <p className="text-xl text-primary font-semibold mb-4">Lead Agentic AI Systems Architect</p>

                      <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                        Zack is a distributed systems architect specializing in large-scale agent orchestration - the backbone
                        of Duat's autonomous intelligence platform.
                      </p>

                      <div className="mb-4">
                        <h4 className="font-bold text-lg mb-2">Previous Experience:</h4>
                        <ul className="space-y-2 text-muted-foreground">
                          <li className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            Architected enterprise-scale agent orchestration platforms processing <strong className="text-foreground">millions of daily events</strong>
                          </li>
                          <li className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            Co-developed <strong className="text-foreground">Chef-Metal-SSH</strong>, adopted into Chef's official stack and highlighted at CHEFCONF
                          </li>
                          <li className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            Expert in autonomous systems, real-time decision-making, and AI agent coordination
                          </li>
                        </ul>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-bold text-lg mb-2">Expertise:</h4>
                        <p className="text-muted-foreground">
                          Building AI systems that don't just analyze data but autonomously identify patterns, predict outcomes,
                          and recommend actions.
                        </p>
                      </div>

                      <Card className="bg-secondary/5 border-secondary/20">
                        <CardContent className="p-4">
                          <p className="italic text-foreground">
                            "Supply chain intelligence requires AI that can reason across massive, interconnected datasets in
                            real-time. That's exactly what our agent architecture enables."
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ruben Villa */}
              <Card className="hover:shadow-lg transition-all">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-12 h-12 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold mb-2">Ruben Villa</h3>
                      <p className="text-xl text-primary font-semibold mb-4">Co-Founder & Agricultural Supply Chain Strategist</p>

                      <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                        Ruben brings a unique perspective as a professional pilot with deep expertise in agricultural supply
                        chains - one of the most complex and climate-vulnerable supply networks.
                      </p>

                      <div className="mb-4">
                        <h4 className="font-bold text-lg mb-2">Previous Experience:</h4>
                        <ul className="space-y-2 text-muted-foreground">
                          <li className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            Aviation operations background providing literal "aerial perspective" on supply chain infrastructure
                          </li>
                          <li className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            Education in agriculture and marketing
                          </li>
                          <li className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            Creative problem-solving for modern agricultural supply chain complexities
                          </li>
                        </ul>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-bold text-lg mb-2">Expertise:</h4>
                        <p className="text-muted-foreground">
                          Understanding how climate, geography, and logistics intersect in agricultural supply chains - and how
                          satellite intelligence can monitor it.
                        </p>
                      </div>

                      <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="p-4">
                          <p className="italic text-foreground">
                            "Flying over agricultural regions, you see things that don't show up in spreadsheets - droughts
                            forming, production slowdowns, infrastructure stress. Duat makes this intelligence accessible to everyone."
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Advisors Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-12">
              <Award className="w-8 h-8 text-primary" />
              <h2 className="text-4xl md:text-5xl font-bold">Advisors & Key Team Members</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Dean Evans */}
              <Card className="hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-2">Dean Evans</h3>
                  <p className="text-lg text-primary font-semibold mb-4">Advisor - Automotive & Strategic Markets</p>

                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Dean brings C-suite access to automotive OEMs and Tier 1 suppliers, plus deep experience taking companies public.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-bold mb-2">Credentials:</h4>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        Named <strong className="text-foreground">Forbes 8th Most Influential CMO (2018)</strong>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        CMO of first all-domestic rare earth supply chain - <strong className="text-foreground">NASDAQ IPO approved</strong>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        Strategic advisor on automotive supply chain risk management
                      </li>
                    </ul>
                  </div>

                  <p className="text-sm text-accent italic">
                    <strong>Value to Duat:</strong> Opening doors at the largest automotive manufacturers and helping position
                    Duat for strategic partnerships and investment.
                  </p>
                </CardContent>
              </Card>

              {/* Andreas Welsch */}
              <Card className="hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-2">Andreas Welsch</h3>
                  <p className="text-lg text-primary font-semibold mb-4">AI Advisor</p>

                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Andreas is a recognized AI thought leader with deep experience deploying AI at enterprise scale.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-bold mb-2">Credentials:</h4>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        Former <strong className="text-foreground">VP of AI at SAP</strong>, leading AI strategy for one of the world's largest enterprise software companies
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <strong className="text-foreground">Leading LinkedIn AI influencer</strong> with extensive network in the AI community
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        Expert in practical AI deployment and ethical AI frameworks
                      </li>
                    </ul>
                  </div>

                  <p className="text-sm text-accent italic">
                    <strong>Value to Duat:</strong> Ensuring our AI architecture follows best practices and helping navigate
                    the rapidly evolving AI landscape.
                  </p>
                </CardContent>
              </Card>

              {/* Jack Bornhoft */}
              <Card className="hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-2">Jack Bornhoft</h3>
                  <p className="text-lg text-primary font-semibold mb-4">Supply Chain Advisor</p>

                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Jack brings current, front-line experience in supply chain software sales and implementation.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-bold mb-2">Credentials:</h4>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        Account Executive at <strong className="text-foreground">Relex Solutions</strong> (leading supply chain optimization platform)
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        Deep understanding of current supply chain software capabilities and gaps
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        Experience selling complex supply chain solutions to enterprise buyers
                      </li>
                    </ul>
                  </div>

                  <p className="text-sm text-accent italic">
                    <strong>Value to Duat:</strong> Insight into what supply chain leaders are actually buying, what problems
                    keep them up at night, and how to position disruptive technology.
                  </p>
                </CardContent>
              </Card>

              {/* Vivek Srivastava */}
              <Card className="hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-2">Vivek Srivastava</h3>
                  <p className="text-lg text-primary font-semibold mb-4">Technical Advisor - AI & Supply Chain</p>

                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Vivek has been at the cutting edge of supply chain AI since before it was mainstream.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-bold mb-2">Credentials:</h4>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        Former <strong className="text-foreground">VP of R&D at Manhattan Associates</strong> (leading supply chain execution software)
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        Co-created with Michael one of the <strong className="text-foreground">first supply chain AI models</strong> for determining
                        geo-specific warehousing priority to eliminate out-of-stocks
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        Deep expertise in both AI/ML and supply chain domain
                      </li>
                    </ul>
                  </div>

                  <p className="text-sm text-accent italic">
                    <strong>Value to Duat:</strong> Bridging the gap between theoretical AI capabilities and practical supply
                    chain applications. He's already proven this AI can work - now we're scaling it.
                  </p>
                </CardContent>
              </Card>

              {/* Mark Rogers */}
              <Card className="hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-2">Mark Rogers</h3>
                  <p className="text-lg text-primary font-semibold mb-4">GTM Advisor</p>

                  <p className="text-muted-foreground leading-relaxed mb-4">
                    As CRO at Coolfire, Mark leads high-impact customer solutions and strategic partnerships. He has a proven track record of creating lasting customer relationships and pioneering new markets.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-bold mb-2">Credentials:</h4>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <strong className="text-foreground">Chief Revenue Officer at Coolfire</strong>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        As SVP of Business Development, helped pioneer the low-code market at <strong className="text-foreground">Mendix</strong>, landing Gartner leadership quadrants year over year and contributing to its <strong className="text-foreground">$760M acquisition by Siemens (2018)</strong>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        Former head of product management for <strong className="text-foreground">Microsoft Azure</strong> during its 2009 launch, forming the foundation for Microsoft's cloud strategy
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        Led Microsoft Windows Developer and ISV ecosystem for the global launch of Windows 7
                      </li>
                    </ul>
                  </div>

                  <p className="text-sm text-accent italic">
                    <strong>Value to Duat:</strong> Deep expertise in go-to-market strategy, strategic partnerships, and scaling enterprise software businesses from startup to successful exit.
                  </p>
                </CardContent>
              </Card>

              {/* Pete LaSpina */}
              <Card className="hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-2">Pete LaSpina</h3>
                  <p className="text-lg text-primary font-semibold mb-4">Sales Operations Advisor</p>

                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Pete brings extensive experience in building and scaling high-performing sales teams, with a proven track record of driving revenue growth and executing winning sales strategies.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-bold mb-2">Credentials:</h4>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <strong className="text-foreground">Executive Vice President of Sales at Wrights Impact Window</strong> (June 2024 - Present)
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        Rapidly advanced from Sales Representative (2020) to Assistant Sales Manager (2023) to EVP of Sales (2024)
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <strong className="text-foreground">15+ years as Title Insurance Producer in New Jersey</strong> (2009 - Present)
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        Expert in sales strategy development, team building, sales forecasting, and customer relationship management
                      </li>
                    </ul>
                  </div>

                  <p className="text-sm text-accent italic">
                    <strong>Value to Duat:</strong> Front-line sales operations expertise, from building teams and setting targets to executing strategies that drive consistent revenue growth.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Join Team CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join Our Team
            </h2>
            <p className="text-xl mb-8 opacity-95 leading-relaxed">
              We're building something that hasn't been built before. If you're passionate about using cutting-edge
              technology to solve real-world problems that affect billions of dollars in global commerce, we'd love to hear from you.
            </p>
            <ContactDialog
              trigger={
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6 h-auto hover:scale-105 transition-transform">
                  Get in Touch
                </Button>
              }
              title="Join the Duat Team"
              description="Interested in joining our team? Reach out to learn about opportunities."
            />
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

export default Team;
