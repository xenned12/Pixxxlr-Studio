import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation } from 'lucide-react';

export default function LocationMap() {
  const lat = 15.332680864077053;
  const lng = 119.97867280853342;
  const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=16&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <section id="location" className="py-24 bg-charcoal-900 border-t border-white/5 relative overflow-hidden scroll-mt-16 md:scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          
          <div className="w-full md:w-1/3">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-serif font-medium mb-6 text-white tracking-tight">
                Our <span className="text-gold-500 italic">Location</span>
              </h2>
              <p className="text-gray-400 mb-8 text-lg">
                Visit our humble small photo studio. We are fully equipped with new lighting, various backdrops, and a dressing area to give you the perfect shoot experience.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0 border border-gold-500/20">
                    <MapPin className="w-6 h-6 text-gold-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-lg mb-1">Studio Address</h3>
                    <p className="text-gray-400">
                      PIXXXLR Creatives Studio<br />
                      Purok 2, Brgy. Dirita-Baloguen<br />
                      Iba, Zambales, Philippines <br />
                      +63 947 513 5011 <br />
                      https://www.facebook.com/pixxxlrcreatives  <br />
                      www.pixxxlr.com
                    </p>
                  </div>
                </div>

                <a 
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gold-500 text-charcoal-900 px-6 py-3 rounded hover:bg-gold-400 transition-colors font-medium border border-gold-400"
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </a>
              </div>
            </motion.div>
          </div>

          <div className="w-full md:w-2/3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-video md:aspect-[21/9] rounded-xl overflow-hidden shadow-2xl border border-white/10"
            >
              <iframe
                title="PIXXXLR Studio Location"
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 grayscale contrast-125 opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              ></iframe>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
