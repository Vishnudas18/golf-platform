import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import * as drawService from '../services/drawService';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Calendar, Sparkles, Coins, Users, ArrowUpRight, Award, UserCircle } from 'lucide-react';
import Loader from '../components/common/Loader';
import Badge from '../components/common/Badge';
import { formatCurrency, formatMonth, formatDate } from '../utils/formatDate';

const WinnerListPage = () => {
  const [draws, setDraws] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDraws = async () => {
      try {
        const { data } = await drawService.getAllDraws();
        setDraws(data);
      } catch (err) {
        console.error('Failed to fetch draws:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDraws();
  }, []);

  if (isLoading) return <Loader fullPage />;

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 pb-32">
        {/* Header Section */}
        <header className="mb-24 text-center relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-10 text-gold opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
             <Trophy size={140} />
           </div>
           
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="relative z-10"
           >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold border border-gold/20 mb-8 uppercase tracking-[0.3em] font-black italic shadow-lg shadow-gold/5">
                <Sparkles size={16} /> Hall of Champions
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-black text-text tracking-tighter uppercase italic leading-[1.1] mb-8">
                 Celebrating Our <span className="text-gold italic">Winners</span>.<br />
                 Rewarding the <span className="text-primary italic">Game</span>.
              </h1>
              <p className="max-w-xl mx-auto text-lg text-muted font-body leading-relaxed leading-relaxed">
                 Discover every player who matched the monthly draw and see the life-changing prize pools distributed to our community.
              </p>
           </motion.div>
        </header>

        {/* Draws Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
           <AnimatePresence mode="popLayout">
              {draws.map((draw, idx) => (
                <motion.div
                  key={draw._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-10 rounded-[3rem] bg-surface border border-border group hover:border-gold/30 transition-all duration-300 shadow-2xl relative overflow-hidden"
                >
                   {/* Background Jackpot Decor */}
                   <div className="absolute top-0 right-0 p-10 text-gold opacity-5 group-hover:rotate-6 transition-transform duration-700">
                     <Coins size={100} />
                   </div>

                   <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10 relative z-10 px-2">
                      <div className="flex items-center gap-4">
                         <div className="w-16 h-16 rounded-[1.5rem] bg-gold/10 text-gold flex items-center justify-center border border-gold/20 shadow-inner group-hover:animate-jackpot">
                            <Trophy size={32} />
                         </div>
                         <div>
                            <h3 className="text-2xl font-display font-black text-text uppercase italic tracking-tighter">
                               {formatMonth(draw.month, draw.year)}
                            </h3>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-muted uppercase tracking-[0.3em] pl-1">
                               <Calendar size={12} className="text-primary" /> {formatDate(draw.publishedAt)}
                            </div>
                         </div>
                      </div>
                      
                      <div className="text-right">
                         <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-1">Total Distributed</p>
                         <p className="text-3xl font-mono font-black text-gold italic">{formatCurrency(draw.totalPrizePool)}</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 relative z-10">
                      {/* Numbers */}
                      <div className="space-y-4">
                         <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] px-2 mb-2">Winning Combination</p>
                         <div className="flex flex-wrap gap-3">
                            {draw.drawnNumbers.map((num, i) => (
                              <div key={i} className="w-12 h-12 rounded-xl bg-bg border border-border flex items-center justify-center font-mono font-bold text-text italic hover:border-gold/50 transition-colors shadow-inner">
                                 {num}
                              </div>
                            ))}
                         </div>
                      </div>

                      {/* Summary */}
                      <div className="flex flex-col gap-4">
                         <div className="p-4 rounded-2xl bg-bg border border-border flex items-center justify-between group/stat">
                            <div className="flex items-center gap-3">
                               <Users size={16} className="text-secondary" />
                               <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Total Winners</span>
                            </div>
                            <span className="text-xl font-mono font-black text-text">142</span>
                         </div>
                         <div className="p-4 rounded-2xl bg-bg border border-border flex items-center justify-between group/stat">
                            <div className="flex items-center gap-3">
                               <Award size={16} className="text-primary" />
                               <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Jackpots Won</span>
                            </div>
                            <span className="text-xl font-mono font-black text-text text-gold">2</span>
                         </div>
                      </div>
                   </div>

                   {/* Top Winners List */}
                   <div className="space-y-4 relative z-10">
                      <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] px-2 mb-2">Top Performers</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         {[1, 2, 3, 4].map(w => (
                           <div key={w} className="flex items-center justify-between p-4 rounded-2xl bg-bg/50 border border-border text-xs group/winner hover:border-primary/30 transition-all">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-muted font-bold shadow-inner">
                                    <UserCircle size={20} />
                                 </div>
                                 <span className="font-bold text-text truncate max-w-[80px]">Player {w}</span>
                              </div>
                              <span className="text-primary font-mono font-black italic">£{w * 105.15}</span>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="mt-10 pt-8 border-t border-border flex items-center justify-center">
                      <button className="flex items-center gap-2 text-[10px] font-bold text-muted uppercase tracking-[0.3em] hover:text-gold transition-colors group">
                        VIEW FULL BREAKDOWN <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </button>
                   </div>
                </motion.div>
              ))}
           </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WinnerListPage;
