import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Coins, ArrowUpRight, TrendingUp } from 'lucide-react';
import { useDraw } from '../../hooks/useDraw';
import { estimatePrizePool } from '../../utils/prizeCalc';
import { formatCurrency, formatMonth } from '../../utils/formatDate';

const PrizePoolBanner = () => {
  const { draws, isLoading } = useDraw();
  
  const currentDraw = useMemo(() => {
    const now = new Date();
    return {
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    };
  }, []);

  // For demo, assume 1,500 subscribers and some rolled over jackpot
  const estimatedPool = useMemo(() => {
    return estimatePrizePool(1500, 25, 12500);
  }, []);

  if (isLoading) return null;

  return (
    <section className="relative py-12 px-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-br from-gold/10 via-gold/10 to-gold/20 border border-gold/30 p-8 md:p-12 relative overflow-hidden group shadow-[0_0_50px_-12px_rgba(255,215,0,0.3)] hover:shadow-[0_0_80px_-12px_rgba(255,215,0,0.4)] transition-all duration-700"
      >
        {/* Abstract Gold Background Shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 animate-pulse delay-500" />
        
        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 w-full text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-bold uppercase tracking-widest mb-6">
              <Trophy size={14} className="animate-jackpot" /> Current Live Estimates
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-text mb-4 leading-tight">
              The {formatMonth(currentDraw.month, currentDraw.year)} <span className="text-gold">Jackpot</span>
            </h2>
            <p className="text-muted text-base md:text-lg font-body max-w-xl lg:mx-0 mx-auto group-hover:text-text transition-colors">
              The monthly draw is growing! Participate now by entering your scores and help build the UK's first community-driven golf prize pool.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 w-full lg:w-auto">
            <div className="p-8 rounded-2xl bg-surface/50 backdrop-blur-md border border-gold/20 flex-1 min-w-[200px] group-hover:scale-105 transition-transform duration-500">
               <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-gold/70 uppercase tracking-widest">Est. Jackpot</p>
                  <TrendingUp size={16} className="text-gold" />
               </div>
               <p className="text-4xl font-mono font-bold text-text mb-1 italic">
                 {formatCurrency(estimatedPool.jackpot)}
               </p>
               <p className="text-xs text-muted flex items-center gap-1">
                 <ArrowUpRight size={12} className="text-primary" /> including rollover
               </p>
            </div>

            <div className="p-8 rounded-2xl bg-surface/50 backdrop-blur-md border border-gold/20 flex-1 min-w-[200px] group-hover:scale-105 transition-transform duration-500 delay-75">
               <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-gold/70 uppercase tracking-widest">Total Pool</p>
                  <Coins size={16} className="text-gold" />
               </div>
               <p className="text-4xl font-mono font-bold text-text mb-1 italic">
                 {formatCurrency(estimatedPool.total)}
               </p>
               <p className="text-xs text-muted">
                 shared between players
               </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default PrizePoolBanner;
