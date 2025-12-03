import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import { useEffect, useRef, useState } from "react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Close on click outside or Escape; focus management for opening
  useEffect(() => {
      function onDocClick(e: MouseEvent) {
      if (!isOpen) return;
      const target = e.target as Node;
      const menuEl = menuRef.current;
      const buttonEl = buttonRef.current;
      if (menuEl && buttonEl && !menuEl.contains(target) && !buttonEl.contains(target)) {
        setIsOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      // focus first focusable element inside menu
      const first = menuRef.current?.querySelector("a, button") as HTMLElement | null;
      first?.focus();
    } else {
      // return focus to toggle
      const btn = buttonRef.current as HTMLElement | null;
      btn?.focus();
    }
  }, [isOpen]);

  // ariaExpanded will be represented by separate button instances

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-white/10" role="navigation" aria-label="Primary">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-secondary rounded-sm flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rotate-45 border-b-0 border-r-0"></div>
            </div>
            <span className="text-2xl font-bold text-white">DUAT</span>
          </a>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-accent focus:text-primary focus:px-3 focus:py-2 focus:rounded focus:font-semibold">Skip to main content</a>

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

          <div className="md:hidden">
            {isOpen ? (
              <button
                type="button"
                role="button"
                ref={buttonRef}
                className="text-white p-1 rounded-md"
                aria-label="Close main menu"
                aria-expanded="true"
                aria-controls="mobile-menu"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            ) : (
              <button
                type="button"
                role="button"
                ref={buttonRef}
                className="text-white p-1 rounded-md"
                aria-label="Open main menu"
                aria-expanded="false"
                aria-controls="mobile-menu"
                onClick={() => setIsOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Mobile menu panel — render only when open to avoid aria-hidden expression lint issues */}
      {isOpen && (
        <div
          id="mobile-menu"
          ref={menuRef}
          className="md:hidden fixed inset-x-4 top-20 z-40 rounded-lg bg-primary/95 backdrop-blur-sm border border-white/10 p-6"
          role="dialog"
          aria-label="Mobile navigation menu"
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsOpen(false);
          }}
        >
          <div className="flex flex-col space-y-4" role="menu">
            <a role="menuitem" href="/product" className="text-white/90 hover:text-accent">Product</a>
            <a role="menuitem" href="/technology" className="text-white/90 hover:text-accent">Technology</a>
            <a role="menuitem" href="/company" className="text-white/90 hover:text-accent">Company</a>
            <a role="menuitem" href="/company/team" className="text-white/90 hover:text-accent">Team</a>
            <a role="menuitem" href="/why-duat" className="text-white/90 hover:text-accent">Why Duat</a>
            <ContactDialog trigger={<Button variant="hero" size="sm">Get Started</Button>} />
          </div>
        </div>
      )}
    </nav>
  );
};
export default Navigation;
