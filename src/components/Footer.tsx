import React, { useState } from 'react';
import { Camera, MapPin, Phone, Mail, Facebook, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Footer() {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  return (
    <footer className="bg-charcoal-900 border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="#home" className="flex items-center gap-2 group mb-6">
              <Camera className="w-8 h-8 text-gold-500 group-hover:text-gold-400 transition-colors" />
              <span className="font-display font-medium text-2xl tracking-[0.2em] text-white">
                PIXXXLR
              </span>
            </a>
            <p className="text-gray-400 font-light text-sm leading-relaxed mb-6">
              Capturing life's most precious moments with elegant lighting, masterful direction, and uncompromising quality.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/pixxxlrcreatives" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-gold-500 hover:border-gold-500 transition-all cursor-pointer">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-serif text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {['Home', 'Portfolio', 'Services', 'Testimonials', 'Book Session'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(' ', '')}`} className="text-gray-400 hover:text-gold-500 transition-colors text-sm font-light uppercase tracking-wider cursor-pointer">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-serif text-lg mb-6">Contact Us</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-white uppercase tracking-wider mb-1">Studio Location</p>
                  <p className="text-gray-400 text-sm font-light leading-relaxed">
                    Hugo Trading, Purok 2, <br />
                    Dirita-Baloguen, <br />
                    Iba, Zambales 2201
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-white uppercase tracking-wider mb-1">Phone</p>
                    <p className="text-gray-400 text-sm font-light">+63 947 513 5011</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-white uppercase tracking-wider mb-1">Email</p>
                    <p className="text-gray-400 text-sm font-light">pixxxlrcreatives@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs font-light">
            &copy; {new Date().getFullYear()} PIXXXLR Creatives. All rights reserved.
          </p>
          <div className="flex gap-6">
            <button onClick={() => setIsPrivacyOpen(true)} className="text-gray-500 hover:text-white text-xs font-light transition-colors cursor-pointer">Privacy Policy</button>
            <button onClick={() => setIsTermsOpen(true)} className="text-gray-500 hover:text-white text-xs font-light transition-colors cursor-pointer">Terms of Service</button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isPrivacyOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-charcoal-800 p-8 rounded-xl max-w-2xl w-full border border-white/10 shadow-2xl relative max-h-[80vh] flex flex-col"
            >
              <button
                onClick={() => setIsPrivacyOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-serif text-white mb-6">Privacy Policy</h2>
              <div className="overflow-y-auto pr-4 text-gray-300 space-y-4 font-light text-sm">
                <p>Welcome to PIXXXLR Creatives Privacy Policy. Your privacy is critically important to us.</p>
                <h3 className="text-white font-medium text-base mt-6">1. Information We Collect</h3>
                <p>We only collect information about you if we have a reason to do so—for example, to provide our studio photography services, to communicate with you, or to make our services better. This includes contact information like your name, email address, phone number, and any photos we take during your session.</p>
                
                <h3 className="text-white font-medium text-base mt-6">2. How We Use Information</h3>
                <p>We use the information we collect to fulfill our service commitments to you, provide customer service and support, and share updates regarding your scheduled sessions.</p>
                
                <h3 className="text-white font-medium text-base mt-6">3. Sharing Information</h3>
                <p>We do not sell our users' private personal information. We share information about you in the limited circumstances spelled out below and with appropriate safeguards on your privacy: subsidiaries, employees, and independent contractors who need to know the information in order to help us provide our services.</p>
                
                <h3 className="text-white font-medium text-base mt-6">4. Photo Usage and Consent</h3>
                <p>Client photographs remain strictly confidential unless written or explicit digital consent is given allowing PIXXXLR to use specific images for marketing or portfolio purposes on social media and our website.</p>
              </div>
            </motion.div>
          </div>
        )}

        {isTermsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-charcoal-800 p-8 rounded-xl max-w-2xl w-full border border-white/10 shadow-2xl relative max-h-[80vh] flex flex-col"
            >
              <button
                onClick={() => setIsTermsOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-serif text-white mb-6">Terms of Service</h2>
              <div className="overflow-y-auto pr-4 text-gray-300 space-y-4 font-light text-sm">
                <p>These terms and conditions outline the rules and regulations for the use of PIXXXLR Creatives Studio's services and website.</p>
                
                <h3 className="text-white font-medium text-base mt-6">1. Acceptance of Terms</h3>
                <p>By booking a session or using our site, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.</p>
                
                <h3 className="text-white font-medium text-base mt-6">2. Booking, Payment, and Cancellation</h3>
                <p>A non-refundable deposit may be required to secure your booking date and time. Cancellations must be made at least 48 hours in advance to be eligible to reschedule without an additional fee. Final payment is due on or before the day of the photoshoot.</p>
                
                <h3 className="text-white font-medium text-base mt-6">3. Delivery of Photos</h3>
                <p>The estimated turnaround time for final edited photos is generally stated in your specific package details. RAW/unedited photos will only be released at the discretion of the photographer and may be subject to additional fees.</p>
                
                <h3 className="text-white font-medium text-base mt-6">4. Copyright and Ownership</h3>
                <p>PIXXXLR Creatives retains the copyright to all images created during your session. You receive a license for personal use. Commercial use of the images requires written consent and potentially additional licensing fees.</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
