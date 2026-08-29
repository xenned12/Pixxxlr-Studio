import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { LazyImage } from './ui/LazyImage';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0 bg-charcoal-900">
        <LazyImage
          src="/hero-image.jpg"
          alt="Studio Photography"
          className="w-full h-full object-cover object-center opacity-40 mix-blend-overlay"
          containerClassName="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900 via-charcoal-900/80 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-gold-500 font-display font-medium tracking-[0.2em] uppercase text-sm md:text-base border-l-2 border-gold-500 pl-4 mb-6 block">
              PIXXXLR Creatives Studio
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-medium leading-tight mb-6 text-white text-balance">
              Capturing Your <br />
              <span className="italic text-gold-400">Timeless</span> Memories.
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed font-light max-w-2xl text-balance">
              Specializing in elegant graduation portraits, definitive corporate headshots, and welcoming on-site studio photography. Excellence in every frame.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#booking"
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-gold-500 text-black uppercase text-sm font-bold tracking-wider hover:bg-gold-400 transition-all duration-300"
              >
                Book Your Session
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#portfolio"
                className="flex items-center justify-center px-8 py-4 border border-white/20 text-white uppercase text-sm font-bold tracking-wider hover:bg-white/10 transition-all duration-300"
              >
                View Portfolio
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
