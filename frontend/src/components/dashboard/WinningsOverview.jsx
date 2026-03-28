import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Coins, Download, ShieldCheck, Clock, FileCheck, CheckCircle2, ChevronRight, Share2, Upload } from 'lucide-react';
import api from '../../services/api';
import { formatCurrency, formatDate, formatMonth } from '../../utils/formatDate';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Loader from '../common/Loader';
import { useToast } from '../../hooks/useToast';

const WinningsOverview = () => {
  const [winnings, setWinnings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { success, error } = useToast();

  useEffect(() => {
    const fetchWinnings = async () => {
      try {
        const { data } = await api.get('/winners/me');
        setWinnings(data.data);
      } catch (err) {
        console.error('Failed to fetch winnings:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWinnings();
  }, []);

  const totalWon = winnings.reduce((acc, win) => acc + (win.prizeAmount || 0), 0);

  if (isLoading) return <Loader />;

  return (
    <div className="bg-surface border border-border rounded-3xl p-8 relative overflow-hidden group h-full">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-8 text-gold opacity-5 rotate-12 transition-transform duration-700">
        <Coins size={120} />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gold/10 text-gold shadow-lg shadow-gold/5">
            <Trophy size={24} className="animate-jackpot" />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-text">Prize Winnings</h3>
            <p className="text-xs text-muted font-body uppercase tracking-widest">Rewards History</p>
          </div>
        </div>
        <div className="text-right">
           <p className="text-xs font-bold text-muted uppercase tracking-[0.2em] mb-1">Total Career Won</p>
           <p className="text-4xl font-mono font-black text-gold italic">
             {formatCurrency(totalWon)}
           </p>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <AnimatePresence mode="popLayout">
          {winnings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 px-6 rounded-3xl border border-dashed border-border bg-bg/50"
            >
               <div className="w-16 h-16 rounded-full bg-border/20 flex items-center justify-center text-muted mb-4 opacity-50">
                 <Coins size={32} />
               </div>
               <p className="text-sm text-muted font-body mb-2 text-center italic">No winnings yet. Keep playing to enter the monthly draws!</p>
               <p className="text-xs text-muted/30 font-body text-center">Your prize records will appear here after each draw.</p>
            </motion.div>
          ) : (
            winnings.map((win, index) => (
              <motion.div
                key={win._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="group/item flex flex-col sm:flex-row items-center justify-between p-6 rounded-2xl border border-border bg-bg hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 transition-all duration-300"
              >
                <div className="flex items-center gap-5 w-full sm:w-auto mb-4 sm:mb-0">
                   <div className="w-14 h-14 rounded-xl bg-surface border border-border flex flex-col items-center justify-center text-gold group-hover/item:bg-gold/10 transition-colors">
                      <p className="text-[10px] font-bold uppercase leading-none mb-1 opacity-70">DRAW</p>
                      <p className="text-sm font-mono font-bold leading-none">{win.drawId?.month}/{String(win.drawId?.year).slice(-2)}</p>
                   </div>
                   <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-text uppercase tracking-widest">{formatMonth(win.drawId?.month, win.drawId?.year)}</p>
                        <Badge variant="gold" className="text-[8px] px-1 py-0">{win.matchType === 'fiveMatch' ? 'JACKPOT' : win.matchType.replace(/([A-Z])/g, ' $1').toUpperCase()}</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="flex items-center gap-1 text-xs text-muted">
                           <Clock size={12} className="opacity-50" />
                           {formatDate(win.createdAt)}
                         </div>
                         <div className="w-1 h-1 rounded-full bg-border" />
                         <div className="flex items-center gap-1">
                            {win.paymentStatus === 'paid' ? (
                              <Badge variant="success" className="text-[8px] px-1 py-0 flex items-center gap-1">
                                <CheckCircle2 size={10} /> PAID
                              </Badge>
                            ) : (
                              <Badge variant="info" className="text-[8px] px-1 py-0 flex items-center gap-1">
                                <Clock size={10} /> PENDING
                              </Badge>
                            )}
                         </div>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-6 w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-8">
                   <div className="text-right flex-1 sm:flex-initial">
                      <p className="text-xs font-bold text-muted uppercase tracking-widest mb-1">Earned</p>
                      <p className="text-2xl font-mono font-bold text-text group-hover/item:text-gold transition-colors">{formatCurrency(win.prizeAmount)}</p>
                   </div>
                   
                   <div className="flex items-center gap-2">
                      {win.verificationStatus === 'pending' && !win.proofUrl ? (
                         <Button variant="primary" size="sm" className="px-4 bg-primary/20 text-primary border border-primary/20 hover:bg-primary hover:text-bg">
                            <Upload size={14} className="mr-2" /> Proof
                         </Button>
                      ) : (
                         <div className="p-2 rounded-lg bg-surface border border-border text-muted hover:text-gold hover:border-gold/50 transition-all cursor-not-allowed opacity-50">
                           <ShieldCheck size={18} />
                         </div>
                      )}
                      <button className="p-2 rounded-lg bg-surface border border-border text-muted hover:text-primary hover:border-primary/50 transition-all">
                        <Share2 size={18} />
                      </button>
                   </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {winnings.length > 0 && (
        <div className="mt-8 pt-8 border-t border-border flex justify-center flex flex-col gap-4">
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-widest">
                 <ShieldCheck size={14} className="text-primary" /> Verified Payouts
              </div>
              <p className="text-[10px] text-muted font-bold uppercase tracking-widest italic leading-none px-4">Secure Network</p>
           </div>
           <Button variant="ghost" size="sm" className="w-full text-xs opacity-50 hover:opacity-100">
             Load Historical Winnings
           </Button>
        </div>
      )}
    </div>
  );
};

export default WinningsOverview;
