import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, Heart, ArrowRight, PlayCircle } from 'lucide-react';
import Button from '../common/Button';

const HeroSection = () => {
  const [impactCount, setImpactCount] = useState(125000);

  useEffect(() => {
    const interval = setInterval(() => {
      setImpactCount((prev) => prev + Math.floor(Math.random() * 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-700" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border mb-8 shadow-xl">
          <Badge text="NEW" />
          <span className="text-sm font-body font-medium text-muted">
            The future of golf tracking and charity giving.
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-text leading-[1.1] mb-8"
        >
          Track Your <span className="text-primary italic">Game</span>.<br />
          Give to <span className="text-secondary italic">Good</span>.<br />
          Win the <span className="text-gold italic">Pot</span>.
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="max-w-2xl mx-auto text-lg md:text-xl text-muted font-body mb-12 leading-relaxed"
        >
          The only platform where your Stableford scores fund global impact. 
          Every subscription helps a charity of your choice, and enters you into the monthly prize pool.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link to="/subscribe">
            <Button variant="primary" size="lg" className="px-10 group shadow-lg shadow-primary/20">
              Start Playing
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/charities">
            <Button variant="ghost" size="lg" className="px-10 group">
              Explore Charities
              <Heart className="ml-2 group-hover:scale-110 transition-transform text-secondary" />
            </Button>
          </Link>
        </motion.div>

        <motion.div
           variants={itemVariants}
           className="mt-20 pt-12 border-t border-border/50 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24"
        >
          <div className="text-center group">
            <p className="text-xs font-bold font-display uppercase tracking-widest text-muted mb-2 group-hover:text-primary transition-colors">Total Prize Pool</p>
            <p className="text-4xl font-mono font-bold text-text">£450,000+</p>
          </div>
          <div className="text-center group">
             <p className="text-xs font-bold font-display uppercase tracking-widest text-muted mb-2 group-hover:text-secondary transition-colors">Total Impact</p>
             <p className="text-4xl font-mono font-bold text-text transition-all group-hover:scale-110">
               £{impactCount.toLocaleString()}
             </p>
          </div>
          <div className="text-center group">
            <p className="text-xs font-bold font-display uppercase tracking-widest text-muted mb-2 group-hover:text-gold transition-colors">Active Players</p>
            <p className="text-4xl font-mono font-bold text-text">12,500+</p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

const Badge = ({ text }) => (
  <span className="px-2 py-0.5 rounded-md bg-primary/20 text-primary text-[10px] font-black uppercase tracking-tighter border border-primary/20">
    {text}
  </span>
);

export default HeroSection;
