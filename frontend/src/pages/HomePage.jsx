import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/home/HeroSection';
import HowItWorks from '../components/home/HowItWorks';
import PrizePoolBanner from '../components/home/PrizePoolBanner';
import CharitySpotlight from '../components/home/CharitySpotlight';
import CTASection from '../components/home/CTASection';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main>
        <HeroSection />
        <PrizePoolBanner />
        <HowItWorks />
        <CharitySpotlight />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
