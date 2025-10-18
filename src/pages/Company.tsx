import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactDialog from "@/components/ContactDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

const Company = () => {

  // Founding Team
  const foundingTeam = [
    {
      name: "Michael Weinberg",
      role: "Co-Founder & CEO",
      bio: "ex-IBM, ex-Mendix, 10 years supply chain (metals), Consistently Recognized for Building Successful Sales Teams",
      credentials: "M.D., M.S. Biomedical Chemistry, BA/BS Comp Sci"
    },
    {
      name: "Scott Jobe",
      role: "Co-Founder & CTO",
      bio: "ex-VMware, PureStorage VP Solution Architects",
      credentials: "Enterprise infrastructure & scaling expert"
    },
    {
      name: "Shaun Stewart",
      role: "Co-Founder & CPO",
      bio: "ex-Delos, ex-InfoGrid, Experienced startup exec & product leader",
      credentials: "Product strategy & market execution"
    },
    {
      name: "Zack Zondlo",
      role: "Lead Agentic AI Systems Architect",
      bio: "Architected enterprise-scale agent orchestration platforms processing millions of daily events",
      credentials: "Co-developed Chef-Metal-SSH adopted into Chef's official stack and highlighted at CHEFCONF"
    },
    {
      name: "Ruben Villa",
      role: "Co-Founder & Agricultural Supply Chain Strategist",
      bio: "Professional pilot bringing unique aerial perspective to supply chain monitoring. Combines education in agriculture and marketing to provide creative problem-solving for the complexities of modern agricultural supply chains",
      credentials: "Agriculture & Marketing expertise with aviation operations background"
    }
  ];

  // Advisors and Key Team
  const advisors = [
    {
      name: "Dean Evans",
      role: "Advisor",
      bio: "Forbes 8th Most Influential CMO (2018), C-Suite Access to Automotive OEMs and Tier 1 Suppliers",
      credentials: "CMO First All Domestic Rare Earth Supply Chain - NASDAQ IPO Approved"
    },
    {
      name: "Andreas Welsch",
      role: "AI Advisor",
      bio: "ex-SAP VP AI, Leading LinkedIn AI Influencer",
      credentials: ""
    },
    {
      name: "Jack Bornhoft",
      role: "Supply Chain Advisor",
      bio: "Relex Supply Chain Software Account Executive",
      credentials: ""
    },
    {
      name: "Vivek Srivastava",
      role: "Technical Advisor",
      bio: "ex-Manhattan Associates VP of R&D",
      credentials: "With Michael Created one of the first Supply Chain AI models for Determining Geospecific Warehousing Priority to Eliminate Out Of Stocks"
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
              <MapPin className="w-3 h-3 mr-1" />
              West Palm Beach, Florida
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About Duat Inc
            </h1>

            <p className="text-xl text-white/95 mb-8 max-w-4xl mx-auto leading-relaxed">
              Duat Inc delivers the next generation of supply chain intelligence, mapping upstream ecosystems
              with precision—from raw material extraction to final product assembly. Leveraging advanced satellite
              data and proprietary AI analytics, Duat reveals the invisible supply chain dynamics that drive
              enterprise risk, cost, and resilience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ContactDialog
                trigger={
                  <Button size="lg" className="text-lg px-8 py-4 h-auto">
                    Join Our Mission
                  </Button>
                }
                title="Join the Revolution"
                description="Connect with our team to learn how we're transforming supply chain intelligence."
              />
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto" asChild>
                <a href="/technology">Our Technology</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Market Differentiation Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 pb-3 border-b-4 border-primary inline-block">
              Market Differentiation
            </h2>

            <ul className="space-y-4 mt-8">
              <li className="flex items-start text-lg">
                <span className="text-primary text-2xl font-bold mr-4 mt-1">→</span>
                <span className="leading-relaxed">
                  <strong>Full upstream modeling:</strong> raw resources to finished goods
                </span>
              </li>
              <li className="flex items-start text-lg">
                <span className="text-primary text-2xl font-bold mr-4 mt-1">→</span>
                <span className="leading-relaxed">
                  <strong>Multi-tier disruption detection</strong>—months ahead of traditional methods
                </span>
              </li>
              <li className="flex items-start text-lg">
                <span className="text-primary text-2xl font-bold mr-4 mt-1">→</span>
                <span className="leading-relaxed">
                  <strong>Predictive, actionable analytics</strong> for material flow, bottlenecks, and <span className="font-bold tracking-wide">CASCADE</span> risk
                </span>
              </li>
              <li className="flex items-start text-lg">
                <span className="text-primary text-2xl font-bold mr-4 mt-1">→</span>
                <span className="leading-relaxed">
                  <strong>Automated mitigation strategies</strong> that protect margins and market position
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Investor Vision Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 pb-3 border-b-4 border-primary inline-block">
              Investor Vision
            </h2>

            <Card className="mt-8 border-l-4 border-primary">
              <CardContent className="p-8 md:p-10">
                <p className="text-lg leading-relaxed text-foreground">
                  Duat transforms supply chain intelligence into enterprise alpha. Our platform empowers operational
                  leaders and investors to anticipate disruptions, quantify risk, and implement cost-effective
                  mitigation—delivering sustained profitability and competitive advantage. Early insights enable
                  proactive decisions that reduce working capital, improve fulfillment, and shield earnings from
                  volatility.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Leadership Excellence Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 pb-3 border-b-4 border-primary inline-block">
              Leadership Excellence
            </h2>

            <Card className="mt-8 bg-gradient-to-br from-primary to-primary/90 text-white border-0">
              <CardContent className="p-8 md:p-10">
                <p className="text-lg leading-relaxed">
                  Our founding team draws on decades of experience from IBM, VMware, SAP, and Manhattan Associates.
                  We've built global SaaS platforms, advanced analytics systems, and solved complex supply chain
                  challenges across industries—driving innovation, operational rigor, and investor confidence.
                </p>
              </CardContent>
            </Card>

            {/* Founding Team */}
            <div className="mt-16 mb-20">
              <h3 className="text-3xl font-bold mb-8">Founding Team</h3>
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {foundingTeam.map((member, index) => (
                  <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <h4 className="text-xl font-bold mb-2">{member.name}</h4>
                      <p className="text-primary font-medium mb-3">{member.role}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-3">{member.bio}</p>
                      {member.credentials && (
                        <p className="text-sm text-accent italic">{member.credentials}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Advisors */}
            <div>
              <h3 className="text-3xl font-bold mb-8">Advisors & Key Team Members</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {advisors.map((advisor, index) => (
                  <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <h4 className="text-xl font-bold mb-2">{advisor.name}</h4>
                      <p className="text-primary font-medium mb-3">{advisor.role}</p>
                      {advisor.bio && (
                        <p className="text-muted-foreground text-sm leading-relaxed mb-3">{advisor.bio}</p>
                      )}
                      {advisor.credentials && (
                        <p className="text-sm text-accent italic">{advisor.credentials}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Duat Matters Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 pb-3 border-b-4 border-primary inline-block">
              Why Duat Matters
            </h2>

            <div className="mt-8">
              <p className="text-lg leading-relaxed text-foreground">
                Supply chain opacity is among the greatest unpriced risks in enterprise operations. Duat's intelligence
                solutions turn uncertainty into actionable foresight—transforming supply chain management from reactive
                cost center to strategic, proactive value driver.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Contact & Learn More
            </h2>
            <p className="text-xl mb-8 opacity-95 leading-relaxed">
              For investor inquiries, partnerships, and to explore what Duat can unlock for your enterprise:
            </p>
            <ContactDialog
              trigger={
                <Button variant="secondary" size="lg" className="text-lg px-8 py-6 h-auto hover:scale-105 transition-transform">
                  info@duatflow.com
                </Button>
              }
              title="Connect with Duat"
              description="For investor inquiries, partnerships, and to explore what Duat can unlock for your enterprise."
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Company;