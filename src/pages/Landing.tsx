import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ContactDialog from '@/components/ContactDialog';
import {
  HeroSection,
  ProblemSection,
  SolutionSection,
  ProofSection,
  WhyDuatSection,
  TeamSection,
  CTASection,
} from '@/components/sections';

export default function Landing() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Navigation onContactClick={() => setContactOpen(true)} />

      <main>
        <HeroSection onContactClick={() => setContactOpen(true)} />
        <ProblemSection />
        <SolutionSection />
        <ProofSection />
        <WhyDuatSection />
        <TeamSection />
        <CTASection onContactClick={() => setContactOpen(true)} />
      </main>

      <Footer />

      <ContactDialog isOpen={contactOpen} onOpenChange={setContactOpen} />
    </div>
  );
}
