import React from 'react';
import { motion } from 'motion/react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    text: "I commend this photo studio. They bring the whole studio to your place! We can't even say that our classroom was a classroom pa or a photo studio na!?",
    author: "Joanna Mae R.",
    role: "High School Student"
  },
  {
    id: 2,
    text: "Parang barkada lang sila. Super happy sa shoot! Hindi namin namalayan, gabi na pala! ",
    author: "Joevert Rae M.",
    role: "College Student"
  },
  {
    id: 3,
    text: "Wow! Para kaming pumunta sa studio. Madaming ilaw, madaming damit at accessories. Sulit ang bayad!",
    author: "Sarah D.",
    role: "Elementary Student Parent"
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-charcoal-800 border-t border-white/5 relative overflow-hidden scroll-mt-16 md:scroll-mt-24">
      {/* Decorative large quote marks */}
      <div className="absolute top-10 right-10 opacity-5 pointer-events-none">
        <Quote className="w-64 h-64 text-gold-500" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif mb-4 text-white">Client Stories</h2>
          <div className="w-16 h-1 bg-gold-500 mx-auto mb-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-charcoal-900 p-8 border border-white/5 hover:border-gold-500/30 transition-colors duration-300 relative group"
            >
              <Quote className="w-8 h-8 text-gold-500/50 mb-6 group-hover:text-gold-500 transition-colors" />
              <p className="text-gray-300 font-light leading-relaxed mb-8 italic">
                "{t.text}"
              </p>
              <div>
                <h4 className="text-white font-serif tracking-wide">{t.author}</h4>
                <p className="text-gold-500 text-xs font-semibold tracking-wider uppercase">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
