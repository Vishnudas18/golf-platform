import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, Calendar, LayoutDashboard, Trophy, Sparkles, TrendingUp, AlertCircle, Heart } from 'lucide-react';
import { useScores } from '../../hooks/useScores';
import { useSubscription } from '../../hooks/useSubscription';
import Badge from '../common/Badge';

const ParticipationSummary = () => {
  const { scores, isLoading } = useScores();
  const { isActive } = useSubscription();

  const eligibility = useMemo(() => {
    if (!isActive) return { status: 'Ineligible', color: 'text-danger', bg: 'bg-danger/10', icon: AlertCircle };
    if (scores.length < 5) return { status: 'Pending', color: 'text-secondary', bg: 'bg-secondary/10', icon: ClockIcon };
    return { status: 'Eligible', color: 'text-primary', bg: 'bg-primary/10', icon: CheckCircle2 };
  }, [isActive, scores.length]);

  const scorePercentage = (scores.length / 5) * 100;

  return (
    <div className="bg-surface border border-border rounded-3xl p-8 relative overflow-hidden group h-full">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-8 text-primary opacity-5 group-hover:scale-110 transition-transform duration-700">
        <Target size={100} />
      </div>

      <div className="flex items-center gap-3 mb-8 relative z-10">
        <div className="p-3 rounded-2xl bg-primary/10 text-primary">
          <LayoutDashboard size={24} />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-text">Participation</h3>
          <p className="text-xs text-muted font-body uppercase tracking-widest">Draw Entry Status</p>
        </div>
      </div>

      <div className="space-y-8 relative z-10">
        {/* Eligibility Card */}
        <div className={`p-6 rounded-2xl border flex items-center justify-between transition-all duration-500 ${eligibility.bg} ${eligibility.color} border-current/20`}>
           <div className="flex items-center gap-4">
              <eligibility.icon size={28} className="shrink-0 animate-pulse" />
              <div>
                 <p className="text-xs font-bold uppercase tracking-widest leading-none mb-1 opacity-70">Current Status</p>
                 <p className="text-2xl font-display font-black tracking-tight">{eligibility.status}</p>
              </div>
           </div>
           <Badge variant={eligibility.status === 'Eligible' ? 'success' : 'info'} className="text-[10px] px-2 py-0.5">
             MARCH DRAW
           </Badge>
        </div>

        {/* Progress Tracker */}
        <div className="space-y-4">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-widest">
                <TrendingUp size={14} className="text-primary" /> Draw Readiness
              </div>
              <span className="text-lg font-mono font-bold text-text italic">{scores.length} / 5</span>
           </div>
           <div className="h-3 w-full bg-bg border border-border rounded-full p-0.5 overflow-hidden group/bar">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${scorePercentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full rounded-full transition-all duration-500 ${
                  scorePercentage === 100 ? 'bg-primary' : scorePercentage > 0 ? 'bg-secondary' : 'bg-muted/10'
                } relative`}
              >
                {scorePercentage === 100 && (
                  <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse" />
                )}
              </motion.div>
           </div>
           <p className="text-xs text-muted italic text-right">
             {scorePercentage === 100 
               ? 'Scorecard complete! You are in the draw.' 
               : `Add ${5 - scores.length} more scores to qualify.`}
           </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
           <div className="p-4 rounded-xl bg-bg border border-border group/stat hover:border-primary/30 transition-all duration-300">
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Draws Entered</p>
              <div className="flex items-center gap-2">
                 <Calendar size={16} className="text-secondary group-hover/stat:text-primary transition-colors" />
                 <p className="text-xl font-mono font-bold text-text italic">12</p>
              </div>
           </div>
           <div className="p-4 rounded-xl bg-bg border border-border group/stat hover:border-gold/30 transition-all duration-300">
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Total Impact</p>
              <div className="flex items-center gap-2">
                 <Heart size={16} className="text-danger group-hover/stat:text-gold transition-colors" />
                 <p className="text-xl font-mono font-bold text-text italic">£45.00</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ClockIcon = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default ParticipationSummary;
