import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";

interface NavigationProps {
  onContactClick?: () => void;
}

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

const Navigation = ({ onContactClick }: NavigationProps) => {
  const navigationLinks = [
    { label: "Platform", sectionId: "solution" },
    { label: "Proof", sectionId: "proof" },
    { label: "Why Duat", sectionId: "why-duat" },
    { label: "Team", sectionId: "team" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => scrollToSection("hero")}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-gradient-secondary rounded-sm flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rotate-45 border-b-0 border-r-0"></div>
            </div>
            <span className="text-2xl font-bold text-white">DUAT</span>
          </button>

          <div className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <button
                key={link.sectionId}
                onClick={() => scrollToSection(link.sectionId)}
                className="text-white/90 hover:text-accent transition-colors"
              >
                {link.label}
              </button>
            ))}
            <Button
              variant="hero"
              size="sm"
              onClick={onContactClick}
            >
              Contact
            </Button>
          </div>

          <ContactDialog
            trigger={
              <Button variant="ghost" size="icon" className="md:hidden text-white" aria-label="Open contact form">
                <Menu className="h-6 w-6" />
              </Button>
            }
          />
        </div>
      </div>
    </nav>
  );
};
export default Navigation;