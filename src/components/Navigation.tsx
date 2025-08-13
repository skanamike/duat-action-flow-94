import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-secondary rounded-sm flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rotate-45 border-b-0 border-r-0"></div>
            </div>
            <span className="text-2xl font-bold text-white">DUAT</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <ContactDialog
              trigger={<button className="text-white/90 hover:text-accent transition-colors">Solutions</button>}
            />
            <ContactDialog
              trigger={<button className="text-white/90 hover:text-accent transition-colors">Technology</button>}
            />
            <ContactDialog
              trigger={<button className="text-white/90 hover:text-accent transition-colors">Company</button>}
            />
            <ContactDialog
              trigger={<Button variant="hero" size="sm">Get Started</Button>}
            />
          </div>

          <Button variant="ghost" size="icon" className="md:hidden text-white">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </nav>
  );
};
export default Navigation;