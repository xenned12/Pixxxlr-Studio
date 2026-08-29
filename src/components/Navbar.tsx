import React, { useState, useEffect } from 'react';
import { Camera, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    // Initial call to set size
    handleResize();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Services', href: '#services' },
    { name: 'Packages', href: '#packages' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Location', href: '#location' },
  ];

  // Calculate dynamic sizes based on window width
  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;
  
  const logoSize = isMobile ? 'w-6 h-6' : isTablet ? 'w-7 h-7' : 'w-8 h-8';
  const logoTextSize = isMobile ? 'text-xl' : isTablet ? 'text-2xl' : 'text-2xl';
  const headerPadding = isScrolled ? (isMobile ? 'py-3' : 'py-4') : (isMobile ? 'py-4' : 'py-6');
  const navGap = isTablet ? 'gap-4' : 'gap-8';
  const pxContainer = isMobile ? 'px-4' : 'px-6 md:px-12';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-charcoal-900/95 backdrop-blur-md shadow-lg ' + headerPadding : 'bg-transparent ' + headerPadding
      }`}
    >
      <div className={`w-full max-w-7xl mx-auto ${pxContainer} flex items-center justify-between`}>
        <a href="#home" onClick={handleNavClick} className="flex items-center gap-2 group">
          <Camera className={`${logoSize} text-gold-500 group-hover:text-gold-400 transition-colors`} />
          <span className={`font-sans font-bold ${logoTextSize} tracking-[0.2em] text-white`}>
            PIXXXLR
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className={`hidden lg:flex items-center ${navGap}`}>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={handleNavClick}
              className="text-xs lg:text-sm font-medium tracking-wide text-gray-300 hover:text-gold-500 transition-colors uppercase whitespace-nowrap"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#booking"
            onClick={handleNavClick}
            className="px-4 lg:px-6 py-2 lg:py-2.5 border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-charcoal-900 transition-all duration-300 uppercase text-xs lg:text-sm font-semibold tracking-wider whitespace-nowrap"
          >
            Book Now
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-charcoal-800 border-t border-white/10 overflow-hidden"
          >
            <nav className="flex flex-col px-6 py-4 space-y-4 max-h-[80vh] overflow-y-auto">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={handleNavClick}
                  className="text-base font-medium text-gray-300 hover:text-gold-500 uppercase tracking-wide py-2"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#booking"
                onClick={handleNavClick}
                className="w-full text-center px-6 py-4 bg-gold-500 text-charcoal-900 uppercase text-sm font-bold tracking-wider mt-4 rounded-sm"
              >
                Book Now
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
