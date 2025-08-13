import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactDialog from "@/components/ContactDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Users, Eye, Shield, Zap } from "lucide-react";

const Company = () => {
  const coreValues = [
    {
      icon: Eye,
      title: "Transparency",
      description: "Bringing unprecedented visibility to global supply chain networks through advanced satellite intelligence."
    },
    {
      icon: Shield,
      title: "Trust",
      description: "Enterprise-grade security and compliance built on decades of supply chain and technology leadership experience."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Bold disruptors pushing the boundaries of what's possible with multi-modal satellite data fusion."
    }
  ];

  const leadership = [
    {
      name: "Michael Weinberg",
      role: "Chief Technology Officer",
      deity: "Set - The Breaker of Boundaries",
      description: "Breakthrough SAR Doppler tomography pioneer who discovered how to peer through industrial facilities using Earth's natural vibrations.",
      status: "public"
    },
    {
      name: "Jack Bornhoft", 
      role: "Chief Revenue Officer",
      deity: "Horus - The Sky's Spear",
      description: "Transforms satellite intelligence into profitable parametric insurance products and enterprise solutions.",
      status: "public"
    },
    {
      name: "Andreas Welsch",
      role: "Chief Data Officer", 
      deity: "Ptah - The Maker of Realities",
      description: "Architects the technological infrastructure processing 20TB+ daily satellite data into actionable intelligence.",
      status: "public"
    },
    {
      name: "Scott Jobe",
      role: "Chief Science Officer",
      deity: "Thoth - The Keeper of Truth", 
      description: "Ensures mathematical soundness and statistical validity of all predictive algorithms and models.",
      status: "stealth"
    },
    {
      name: "Vivek Srivastava",
      role: "Chief Recognition Officer",
      deity: "Imhotep - The Architect of Vision",
      description: "Pattern recognition master who sees breakthrough insights in SAR backscatter and spectral analysis data.",
      status: "stealth"
    },
    {
      name: "Brett Egloff",
      role: "Chief Partnership Officer", 
      deity: "Hermes - The Divine Diplomat",
      description: "Bridges technology and business worlds, forging impossible partnerships between domains.",
      status: "stealth"
    },
    {
      name: "Jack [Stealth]",
      role: "Strategic Advisor",
      deity: "Guardian of Networks",
      description: "Supply chain intelligence specialist operating in stealth until full funding completion.",
      status: "stealth"
    },
    {
      name: "Kristy [Stealth]", 
      role: "Strategic Advisor",
      deity: "Weaver of Connections",
      description: "Enterprise technology leader operating in stealth until full funding completion.",
      status: "stealth"
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
              Where Ancient Wisdom Meets
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Modern Intelligence
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Veteran AI and SaaS leadership from supply chain and leading technology companies, 
              resolved to bring transparency and proactive intelligence to complex global supply chains.
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

      {/* Mission Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                The Legend of Duat LLC
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                In the realm where the known world ends and the impossible begins, 
                we discovered the ancient secret of seeing through matter itself.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {coreValues.map((value, index) => (
                <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300">
                  <CardContent className="pt-8 pb-6">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <value.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center">The Modern Prophecy</h3>
              <div className="max-w-4xl mx-auto text-center space-y-4 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  Using the same principles that allowed ancient architects to map hidden chambers, 
                  Duat LLC creates digital maps of global supply chain vulnerabilities.
                </p>
                <p className="text-lg leading-relaxed">
                  Through SAR Doppler tomography and multi-modal satellite fusion, we penetrate 
                  industrial facilities like cosmic X-rays, revealing production levels and 
                  predicting disruptions 6-12 months in advance.
                </p>
                <p className="text-lg font-semibold text-primary">
                  We are the modern guardians of global commerce, using the eyes of the heavens 
                  to protect the world's supply chains from chaos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                The Pantheon Assembles
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Bold innovators and disruptors with trustworthy enterprise experience, 
                each embodying the ancient wisdom needed to transform global supply chain intelligence.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {leadership.map((leader, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant={leader.status === 'stealth' ? 'secondary' : 'default'} className="text-xs">
                        {leader.status === 'stealth' ? 'Stealth Mode' : 'Public'}
                      </Badge>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2">{leader.name}</h3>
                    <p className="text-primary font-medium mb-2">{leader.role}</p>
                    <p className="text-sm text-accent font-medium mb-3 italic">{leader.deity}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{leader.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 text-center">
              <div className="bg-muted/50 rounded-lg p-6 max-w-2xl mx-auto">
                <Users className="w-8 h-8 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">
                  <strong>Note:</strong> Several founders remain in stealth mode due to their current roles 
                  at leading technology companies, until full funding completion enables their public emergence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join the Ancient Order
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Be part of the revolution that transforms chaos into clarity, 
              bringing transparency to the world's most complex supply chains.
            </p>
            <ContactDialog
              trigger={
                <Button variant="secondary" size="lg" className="text-lg px-8 py-4 h-auto">
                  Connect with the Pantheon
                </Button>
              }
              title="Connect with Duat LLC"
              description="Reach out to learn more about our mission and explore partnership opportunities."
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Company;