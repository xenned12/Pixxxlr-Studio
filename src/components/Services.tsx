import React from 'react';
import { motion } from 'motion/react';
import { LazyImage } from './ui/LazyImage';

const services = [
  {
    title: 'Graduation Pictorial',
    image: '/grad-pic.jpg',
    objectPosition: 'object-top'
  },
  {
    title: 'Creative Pictorial',
    image: '/creative-shot.jpg',
    objectPosition: 'object-top'
  },
  {
    title: 'Barkada Picture',
    image: '/barkada-photo.jpg',
    objectPosition: 'object-top'
  },
  {
    title: 'Family Photo',
    image: '/family-photo.jpg',
    objectPosition: 'object-top'
  },
  {
    title: 'Group Photo',
    image: '/portrait-group.jpg',
    objectPosition: 'object-top'
  },
  {
    title: 'On-Site Photo Studio',
    image: '/outdoor-studio.jpg',
    objectPosition: 'object-center' // Assuming this is more architectural/setup
  },
  {
    title: 'Photobooth',
    badge: 'Coming Soon',
    image: '/photo-booth.jpg',
    objectPosition: 'object-center' // Equipment
  },
  {
    title: 'Party Food Cart',
    badge: 'Coming Soon',
    image: '/party-food-cart.jpg',
    objectPosition: 'object-center' // Equipment
  }
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-charcoal-900 border-t border-white/5 relative scroll-mt-16 md:scroll-mt-24">
      <div className="max-w-[100rem] mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif mb-4 text-white">Our Services</h2>
          <div className="w-16 h-1 bg-gold-500 mx-auto mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto font-light text-lg">
            Capture every moment perfectly with our diverse range of photography services tailored just for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <div
              key={service.title}
              className="relative group overflow-hidden h-80 rounded-lg"
            >
              {/* @ts-ignore - badge may not exist on all items */}
              {service.badge && (
                <div className="absolute top-6 right-[-36px] w-40 transform rotate-45 bg-gold-500 text-black font-bold text-[10px] py-1.5 text-center shadow-md z-10 uppercase tracking-widest">
                  {service.badge}
                </div>
              )}
              <LazyImage
                src={service.image}
                alt={service.title}
                containerClassName="absolute inset-0 w-full h-full"
                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${service.objectPosition || 'object-top'}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/90 via-charcoal-900/40 to-transparent flex items-end">
                <div className="p-6 w-full">
                  <h3 className="text-xl font-bold tracking-wide text-white font-serif mb-2">{service.title}</h3>
                  <div className="w-8 h-0.5 bg-gold-500 transition-all duration-300 group-hover:w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
