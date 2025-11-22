import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-secondary rounded-sm flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rotate-45 border-b-0 border-r-0"></div>
            </div>
            <span className="text-2xl font-bold text-white">DUAT</span>
          </a>

          <div className="hidden md:flex items-center space-x-8">
            <a href="/product" className="text-white/90 hover:text-accent transition-colors">Product</a>
            <a href="/technology" className="text-white/90 hover:text-accent transition-colors">Technology</a>
            <a href="/company" className="text-white/90 hover:text-accent transition-colors">Company</a>
            <a href="/company/team" className="text-white/90 hover:text-accent transition-colors">Team</a>
            <a href="/why-duat" className="text-white/90 hover:text-accent transition-colors">Why Duat</a>
            <ContactDialog
              trigger={<Button variant="hero" size="sm">Get Started</Button>}
            />
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