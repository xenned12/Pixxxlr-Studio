import React from 'react';
import { motion } from 'motion/react';
import { 
  Check, 
  Camera, 
  Wand2, 
  Image as ImageIcon, 
  Frame, 
  GraduationCap, 
  Shirt, 
  CloudDownload, 
  Eye, 
  Clock, 
  Sparkles,
  TriangleAlert 
} from 'lucide-react';

const getIconForFeature = (feature: string) => {
  const lower = feature.toLowerCase();
  if (lower.includes('priority')) return Clock;
  if (lower.includes('shots') || lower.includes('studio time') || lower.includes('hours studio')) return Camera;
  if (lower.includes('retouch') || lower.includes('enhance')) return Wand2;
  if (lower.includes('8r') || lower.includes('5r') || lower.includes('frame') || lower.includes('premium print')) return Frame;
  if (lower.includes('wallet')) return ImageIcon;
  if (lower.includes('toga')) return GraduationCap;
  if (lower.includes('outfit')) return Shirt;
  if (lower.includes('soft') || lower.includes('download') || lower.includes('delivery') || lower.includes('raw')) return CloudDownload;
  if (lower.includes('preview')) return Eye;
  if (lower.includes('backdrop') || lower.includes('background')) return ImageIcon;
  if (lower.includes('makeup') || lower.includes('hair')) return Sparkles;
  if (lower.includes('group shots') || lower.includes('who availed')) return TriangleAlert;
  return Check;
};

const packages = [
  {
    name: 'Basic',
    price: '₱599',
    description: 'Perfect for budget-conscious students',
    features: [
      'Unlimited Shots (10 mins max / 1 layout)',
      '1 Retouched Photo (Choose best photo)',
      '8R Photo Print (Toga Pose)',
      'Free use of toga (Confirm color before schedule)',
      'Sameday Soft Edit Copy (Google Drive)',
      'On-site photo preview'
    ],
    highlight: false
  },
  {
    name: 'Standard',
    price: '₱799',
    description: 'Best Value - The Classic package for most individuals',
    features: [
      'Unlimited Shots (10 Minutes Max / 2 Lay-out)',
      '2 Retouched Photos (Choose Best Photos)',
      '1 8R Print + Matted Frame (Elegant Wood Frame Toga Pose)',
      '1 5R Photo Print (Filipiniana or Barong Outfit)',
      '4 Wallet Size Print (Filipiniana or Barong Outfit)',
      'Free use of toga (Confirm color before schedule)',
      'Free Outfit Styling (Filipiniana / Barong / Accessories)',
      'Sameday Soft Edit Copy (Google Drive)',
      'On-site photo preview'
    ],
    highlight: true
  },
  {
    name: 'Barkada Deal',
    price: '₱749',
    description: 'Mas Masaya Kapag Magkakasama, Bardagulan Ngani!',
    features: [
      'Individual + Group Shots (10 min. Individual + 10 min. Group)',
      '2 Retouched Photo (Choose Best Photos Individual)',
      '1 8R Print + Matted Frame (Elegant Wood Frame Toga Pose)',
      '1 5R Photo Print (Filipiniana or Barong Outfit)',
      '4 Wallet Size Print (2 Filipiniana/Barong + 2 Group)',
      'Free use of toga (Confirm color before schedule)',
      'Free Outfit Styling (Filipiniana / Barong / Accessories)',
      'Shared Barkada Soft Copy (Soft Edited Images Google Drive)',
      'On-site photo preview',
      'Note: In this package, the only allowed person for Group are the only ones who availed the package. Outsider must pay 100 per head.',
      'Priority Scheduling (We will make time for you)'
    ],
    highlight: true
  },
  {
    name: 'Deluxe',
    price: '₱1,099',
    description: 'For Individuals and Students Who Want Extra Style & Variety',
    features: [
      'Unlimited Shots (Toga + Creative + Formal (20 Mins))',
      '3 Retouched Photo (Choose Best Photos)',
      '1 8R Print + Matted Frame (Elegant Wood Frame Toga Pose)',
      '1 5R Formal Photo Print (Filipiniana / Barong - Choose One)',
      '1 5R Creatives Photo Print (Creative Shots - Choose One)',
      '6 Wallet Size Print (2 Toga + 2 Formal + 2 Creatives)',
      'Free family picture (Max 5 heads)',
      'Free use of toga (Confirm color before schedule)',
      'Free Outfit Styling (Filipiniana / Barong / Accessories)',
      'Sameday Soft Edit Copy (Soft Edited Images Google Drive)',
      'On-site photo preview',
      '2 Different Backdrops (Black w/ Accent + Studio Backdrop)'
    ],
    highlight: false
  },
  {
    name: 'Premium',
    price: '₱1,399',
    description: 'For Students and Individuals Who Want a Complete Photoshoot Experience with Classy Frame Memorabilia',
    features: [
      'Unlimited Shots (Toga + Creative + Formal (30 Mins))',
      '5 Retouched Photo (Choose Best Photos)',
      '1 8R Print + Glass to Glass Frame (Glass to Glass Frame Toga Pose)',
      '1 5R Formal Photo Print (Filipiniana / Barong - Choose One)',
      '1 5R Creatives Photo Print (Creative Shots - Choose One)',
      '6 Wallet Size Print (2 Toga + 2 Formal + 2 Creatives)',
      'Free family picture (Max 5 heads)',
      'Free use of toga (Confirm color before schedule)',
      'Free Outfit Styling (Filipiniana / Barong / Accessories)',
      'Sameday Soft Edit Copy (Soft Edited Images Google Drive)',
      'On-site photo preview',
      '2 Different Backdrops (Black w/ Accent + Studio Backdrop)'
    ],
    highlight: true
  }
];

export default function Pricing() {
  const [selectedPkg, setSelectedPkg] = React.useState<string | null>(null);

  return (
    <section id="packages" className="py-24 bg-charcoal-800 border-t border-white/5 relative scroll-mt-16 md:scroll-mt-24">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop')] opacity-[0.03] bg-cover bg-center mix-blend-overlay pointer-events-none" />
      <div className="max-w-[100rem] mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif mb-4 text-white">Packages</h2>
          <div className="w-16 h-1 bg-gold-500 mx-auto mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto font-light text-lg">
            Transparent pricing for exceptionally crafted portraiture. Select the package that aligns with your budget and vision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 xl:gap-6 justify-center">
          {packages.map((pkg, idx) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative flex flex-col h-full transition-all duration-300 isolate lg:hover:scale-105 lg:hover:z-50 ${
                pkg.highlight 
                  ? pkg.name === 'Barkada Deal'
                    ? 'transform lg:-translate-y-4 shadow-2xl shadow-[#ffb703]/10'
                    : pkg.name === 'Standard'
                    ? 'transform lg:-translate-y-4 shadow-2xl shadow-[#219ebc]/10'
                    : pkg.name === 'Premium'
                    ? 'transform lg:-translate-y-4 shadow-2xl shadow-gold-500/20'
                    : 'transform lg:-translate-y-4 shadow-2xl shadow-gold-500/10' 
                  : 'hover:border-white/30'
              }`}
            >
              <div className="absolute inset-0 overflow-hidden z-[-2]">
                {pkg.name === 'Premium' ? (
                  <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_70%,#eab308_100%)] animate-[spin_3s_linear_infinite]" />
                ) : pkg.highlight ? (
                  <div className={`absolute inset-0 ${
                    pkg.name === 'Barkada Deal' ? 'bg-[#ffb703]' : pkg.name === 'Standard' ? 'bg-[#219ebc]' : 'bg-gold-500'
                  }`} />
                ) : (
                  <div className="absolute inset-0 bg-white/10" />
                )}
                <div className="absolute inset-[1px] bg-charcoal-900" />
              </div>

              {pkg.highlight && (
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black px-4 py-1 text-xs font-bold uppercase tracking-widest text-center whitespace-nowrap z-20 ${
                  pkg.name === 'Barkada Deal' ? 'bg-[#ffb703]' : pkg.name === 'Standard' ? 'bg-[#219ebc]' : 'bg-gold-500'
                }`}>
                  {pkg.name === 'Barkada Deal' ? 'Most Fun' : pkg.name === 'Premium' ? 'Most Picked' : 'Most Popular'}
                </div>
              )}

              <div className="p-4 lg:p-5 flex flex-col h-full z-10">
              
              <div className={`mt-2 ${['Barkada Deal', 'Premium'].includes(pkg.name) ? 'mb-0' : 'mb-6'}`}>
                <h3 className={`text-2xl mb-2 ${['Standard', 'Barkada Deal', 'Premium'].includes(pkg.name) ? 'font-bold' : 'font-serif'} ${pkg.highlight ? (pkg.name === 'Barkada Deal' ? 'text-[#ffb703]' : pkg.name === 'Standard' ? 'text-[#219ebc]' : 'text-gold-400') : 'text-white'}`}>{pkg.name}</h3>
                <div className="flex flex-col gap-1 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl lg:text-4xl font-light text-white">{pkg.price}</span>
                  </div>
                  {pkg.name === 'Barkada Deal' && (
                    <div>
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold bg-[#ffb703] text-black">
                        Min. 5 Pax
                      </span>
                    </div>
                  )}
                </div>
                <p className={`text-gray-400 text-xs font-light leading-relaxed ${['Barkada Deal', 'Premium'].includes(pkg.name) ? 'min-h-[3.5rem] mb-4' : 'min-h-[2.5rem]'}`}>{pkg.description}</p>
              </div>

              <ul className="flex-1 space-y-2 mb-6">
                {pkg.features.map((feature, i) => {
                  const isPriority = feature.toLowerCase().includes('priority scheduling');
                  const is8RPrint = feature.includes('1 8R Print +');
                  const IconComponent = getIconForFeature(feature);
                  return (
                    <li key={i} className={`flex items-start gap-2 ${is8RPrint ? 'text-[13px] md:text-sm font-semibold text-white' : 'text-xs text-gray-300 font-light'}`}>
                      <IconComponent className={`shrink-0 mt-0.5 ${is8RPrint ? 'w-4 h-4' : 'w-3.5 h-3.5'} ${isPriority ? 'text-green-500' : (pkg.name === 'Barkada Deal' ? 'text-[#ffb703]' : pkg.name === 'Standard' ? 'text-[#219ebc]' : 'text-gold-500')}`} />
                      <span className={`leading-tight ${isPriority ? 'text-red-400 font-bold animate-pulse drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]' : ''}`}>{feature}</span>
                    </li>
                  );
                })}
              </ul>

                <button
                  type="button"
                  onClick={() => setSelectedPkg(pkg.name)}
                  className={`w-full mt-auto py-2.5 px-4 text-center text-sm font-bold tracking-wider uppercase transition-colors duration-300 border ${
                    pkg.highlight
                      ? pkg.name === 'Barkada Deal'
                        ? 'bg-[#ffb703] text-black hover:bg-[#e0a000] border-[#ffb703]'
                        : pkg.name === 'Standard'
                        ? 'bg-[#219ebc] text-white hover:bg-[#12829c] border-[#219ebc]'
                        : 'bg-gold-500 text-black hover:bg-gold-400 border-gold-500'
                      : 'bg-white/5 text-white hover:bg-white/10 border-white/10'
                  }`}
                >
                  Choose {pkg.name === 'Barkada Deal' ? 'Barkada' : pkg.name === 'Premium' ? 'Premium' : pkg.name}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="max-w-5xl mx-auto mt-16 bg-charcoal-800 p-6 md:p-8 border border-white/5 rounded-xl">
          <h3 className="text-lg font-serif text-white mb-4 flex items-center gap-2">
            <span className="text-gold-500">Important Notes</span>
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-gold-500 font-bold mt-0.5">•</span>
              Hair and Make-up NOT INCLUDED (Make-up packages are available. Chat us for more info)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-500 font-bold mt-0.5">•</span>
              Bring own long sleeves or t-shirt for boys (white) and tube (preferably nude color) for girls
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-500 font-bold mt-0.5">•</span>
              No change outfit for FREE family photo (Deluxe &amp; Premium)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-500 font-bold mt-0.5">•</span>
              P500.00 for family session (max 5 heads, add'l. 100 per extra head)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-500 font-bold mt-0.5">•</span>
              P100.00 per change outfit for family/group photo
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-500 font-bold mt-0.5">•</span>
              Retouched photos 10 days (estimated)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-500 font-bold mt-0.5">•</span>
              G-drive access up to 3 months
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-500 font-bold mt-0.5">•</span>
              Framed photos 28 days (estimated)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-500 font-bold mt-0.5">•</span>
              Photo with other person / fur babies / pets + P200.00
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-500 font-bold mt-0.5">•</span>
              Additional 100 per head for change outfit (family &amp; group)
            </li>
          </ul>
        </div>

      {selectedPkg && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedPkg(null)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-charcoal-800 border border-white/10 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative z-10 p-6 md:p-8 shadow-2xl"
          >
            <button 
              onClick={() => setSelectedPkg(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-xl font-serif text-white mb-6 flex items-center gap-2">
              <TriangleAlert className="w-6 h-6 text-gold-500" />
              <span className="text-gold-500">Important Notes Before Booking</span>
            </h3>
            
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm text-gray-300 mb-8">
              <li className="flex items-start gap-2">
                <span className="text-gold-500 font-bold mt-0.5">•</span>
                Hair and Make-up NOT INCLUDED (Make-up packages are available. Chat us for more info)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500 font-bold mt-0.5">•</span>
                Bring own long sleeves or t-shirt for boys (white) and tube (preferably nude color) for girls
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500 font-bold mt-0.5">•</span>
                No change outfit for FREE family photo (Deluxe &amp; Premium)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500 font-bold mt-0.5">•</span>
                P500.00 for family session (max 5 heads, add'l. 100 per extra head)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500 font-bold mt-0.5">•</span>
                P100.00 per change outfit for family/group photo
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500 font-bold mt-0.5">•</span>
                Retouched photos 10 days (estimated)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500 font-bold mt-0.5">•</span>
                G-drive access up to 3 months
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500 font-bold mt-0.5">•</span>
                Framed photos 28 days (estimated)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500 font-bold mt-0.5">•</span>
                Photo with other person / fur babies / pets + P200.00
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500 font-bold mt-0.5">•</span>
                Additional 100 per head for change outfit (family &amp; group)
              </li>
            </ul>

            <div className="flex justify-end gap-3 mt-4 pt-6 border-t border-white/5">
              <button
                onClick={() => setSelectedPkg(null)}
                className="px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const event = new CustomEvent('package-selected', { detail: selectedPkg });
                  window.dispatchEvent(event);
                  const el = document.getElementById('booking');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.location.hash = '#booking';
                  }
                  setSelectedPkg(null);
                }}
                className="px-8 py-2.5 bg-gold-500 text-black text-sm font-bold uppercase tracking-wider hover:bg-gold-400 transition-colors rounded-sm"
              >
                Continue to Booking
              </button>
            </div>
          </motion.div>
        </div>
      )}
      </div>
    </section>
  );
}
