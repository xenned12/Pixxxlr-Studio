import React from 'react';
import { motion } from 'motion/react';
import { LazyImage } from './ui/LazyImage';

const portfolioItems = [
  {
    id: 1,
    title: 'Cultural Portrait',
    category: 'Studio',
    imageUrl: '/couple.jpg',
    featured: true,
    objectPosition: 'object-top'
  },
  {
    id: 2,
    title: 'Creative Portrait',
    category: 'Studio',
    imageUrl: '/artist.jpg',
    objectPosition: 'object-top'
  },
  {
    id: 3,
    title: 'Sweet Session',
    category: 'Creative',
    imageUrl: '/lollipop.jpg',
    objectPosition: 'object-center'
  },
  {
    id: 4,
    title: 'School Portrait',
    category: 'Graduation',
    imageUrl: '/inches.jpg',
    featured: true,
    objectPosition: 'object-top'
  },
  {
    id: 5,
    title: 'Endorsement Shot',
    category: 'Commercial',
    imageUrl: '/magic.jpg',
    objectPosition: 'object-center'
  },
  {
    id: 6,
    title: 'Graduation Portrait',
    category: 'Graduation',
    imageUrl: '/edited1.jpg',
    objectPosition: 'object-top'
  },
  {
    id: 7,
    title: 'Classic Studio Session',
    category: 'Studio',
    imageUrl: '/edited2.jpg',
    objectPosition: 'object-top'
  }
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-24 bg-charcoal-900 border-t border-white/5 scroll-mt-16 md:scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif mb-4 text-white">Selected Works</h2>
          <div className="w-16 h-1 bg-gold-500 mx-auto mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto font-light text-lg">
            A glimpse into our curated gallery of corporate milestones, graduation triumphs, and striking studio portraits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item, index) => (
            <div
              key={item.id}
              className={`group relative overflow-hidden bg-charcoal-800 h-80 lg:h-[400px] ${
                item.featured ? 'md:col-span-2 lg:col-span-2' : ''
              }`}
            >
              <LazyImage
                src={item.imageUrl}
                alt={item.title}
                containerClassName="absolute inset-0 w-full h-full"
                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100 ${item.objectPosition || 'object-center'}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                <span className="text-gold-500 text-sm font-bold tracking-wider uppercase mb-2">
                  {item.category}
                </span>
                <h3 className="text-2xl font-serif text-white">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
