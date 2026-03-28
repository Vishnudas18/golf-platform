import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Calendar, Sparkles, AlertCircle, Info } from 'lucide-react';
import { useDraw } from '../../hooks/useDraw';
import { useScores } from '../../hooks/useScores';
import { matchUserScores } from '../../utils/matchScores';
import { formatMonth } from '../../utils/formatDate';
import Badge from '../common/Badge';

const DrawCard = () => {
  const { latestDraw, isLoading } = useDraw();
  const { scores } = useScores();
  
  const matchResult = useMemo(() => {
    if (!latestDraw || !scores.length) return null;
    return matchUserScores(scores, latestDraw.drawnNumbers);
  }, [latestDraw, scores]);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      // Assume next draw is 1st of next month
      const nextDraw = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const diff = nextDraw - now;
      
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / (1000 * 60)) % 60),
      };
    };

    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 60000);
    setTimeLeft(calculateTimeLeft());
    return () => clearInterval(timer);
  }, []);

  if (isLoading || !latestDraw) {
    return (
      <div className="bg-surface border border-border rounded-3xl p-8 animate-pulse">
        <div className="h-6 w-32 bg-border rounded-full mb-6" />
        <div className="h-12 w-full bg-border rounded-2xl mb-8" />
        <div className="flex gap-4">
          {[1,2,3,4,5].map(i => <div key={i} className="w-12 h-12 rounded-full bg-border" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-3xl p-8 relative overflow-hidden group">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-8 text-gold opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-700">
        <Sparkles size={120} />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gold/10 text-gold shadow-lg shadow-gold/5">
            <Trophy size={24} className="animate-jackpot" />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-text">Latest Draw Result</h3>
            <p className="text-xs text-muted font-body uppercase tracking-widest">{formatMonth(latestDraw.month, latestDraw.year)}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-3 rounded-2xl bg-bg border border-border shadow-inner">
           <div className="text-center px-3 border-r border-border/50">
             <p className="text-lg font-mono font-bold text-text">{timeLeft.days}</p>
             <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Days</p>
           </div>
           <div className="text-center px-3 border-r border-border/50">
             <p className="text-lg font-mono font-bold text-text">{timeLeft.hours}</p>
             <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Hrs</p>
           </div>
           <div className="text-center px-3">
             <p className="text-lg font-mono font-bold text-text">{timeLeft.mins}</p>
             <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Mins</p>
           </div>
           <p className="text-[10px] font-bold text-gold/80 uppercase tracking-widest text-center writing-mode-vertical rotate-180">Next Draw</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-4 mb-10 relative z-10">
        {latestDraw.drawnNumbers.map((num, i) => {
          const isUserMatch = scores.some(s => s.value === num);
          return (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
              className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center font-mono text-xl md:text-2xl font-bold shadow-2xl border-4 transition-all duration-500 ${
                isUserMatch 
                  ? 'bg-primary text-bg border-primary/50 ring-4 ring-primary/20 scale-110 shadow-primary/20' 
                  : 'bg-bg text-text border-border group-hover:border-muted hover:scale-105 shadow-inner'
              }`}
            >
              {num}
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {matchResult ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center justify-center gap-3 p-4 rounded-2xl border ${
              matchResult === 'fiveMatch' ? 'bg-gold/10 border-gold/30 text-gold' : 'bg-primary/10 border-primary/20 text-primary'
            }`}
          >
            <Sparkles size={20} className="animate-jackpot" />
            <span className="font-bold font-display text-lg">
              You matched! Tier: {matchResult.replace(/([A-Z])/g, ' $1').trim()}
            </span>
          </motion.div>
        ) : scores.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2 text-muted"
          >
             <Info size={16} />
             <p className="text-xs font-medium font-body italic">Add your scores to see if you matched this draw.</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2 text-muted"
          >
             <AlertCircle size={16} />
             <p className="text-xs font-medium font-body italic">No matches in this draw. Better luck next time!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DrawCard;
