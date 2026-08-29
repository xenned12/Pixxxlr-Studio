/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Portfolio from './components/Portfolio';
import Services from './components/Services';
import Pricing from './components/Pricing';
import Booking from './components/Booking';
import Testimonials from './components/Testimonials';
import LocationMap from './components/LocationMap';
import Chat from './components/Chat';
import Footer from './components/Footer';
import Admin from './components/Admin';
import { db } from './firebase';

function Landing() {
  return (
    <>
      <Navbar />
      <Hero />
      <Portfolio />
      <Services />
      <Pricing />
      <Booking />
      <Testimonials />
      <LocationMap />
      <Chat />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-charcoal-900 min-h-screen">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
