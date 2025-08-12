const Footer = () => {
  return (
    <footer className="bg-primary text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-secondary rounded-sm flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white rotate-45 border-b-0 border-r-0"></div>
              </div>
              <span className="text-2xl font-bold">DUATFLOW</span>
            </div>
            <p className="text-white/80 mb-6 max-w-md">
              The first and only platform to predict supply chain disruptions before they happen 
              using patented subsurface SAR intelligence.
            </p>
            <div className="text-accent font-semibold">
              See What's Next
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Solutions</h3>
            <ul className="space-y-2 text-white/80">
              <li><a href="#" className="hover:text-accent transition-colors">Supply Chain Intelligence</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Risk Management</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Digital Twin Modeling</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Predictive Analytics</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-white/80">
              <li><a href="#" className="hover:text-accent transition-colors">About</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-12 pt-8 text-center text-white/60">
          <p>&copy; 2024 Duat. All rights reserved. Turning Systems of Record into Systems of Action.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;