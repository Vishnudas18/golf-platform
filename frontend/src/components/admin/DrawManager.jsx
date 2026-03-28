import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Play, Send, CheckCircle2, AlertCircle, Sparkles, Coins, Zap, ShieldCheck } from 'lucide-react';
import * as adminService from '../../services/adminService';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { useToast } from '../../hooks/useToast';
import { formatCurrency, formatMonth } from '../../utils/formatDate';

const DrawManager = () => {
  const [simulation, setSimulation] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [activeLogic, setActiveLogic] = useState('random');
  const { success, error, info } = useToast();

  const fetchActiveSettings = async () => {
    try {
      const { data } = await adminService.getSettings();
      setActiveLogic(data.drawLogic);
    } catch (err) {
      console.error('Failed to load active draw logic');
    }
  };

  useEffect(() => {
    fetchActiveSettings();
  }, []);

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      const { data } = await adminService.simulateDraw(); // Backend now defaults to Settings
      setSimulation(data);
      success('Draw simulated successfully');
    } catch (err) {
      error(err.response?.data?.message || 'Simulation failed');
    } finally {
      setIsSimulating(false);
    }
  };

  const handlePublish = async () => {
    if (!simulation?._id) return;
    setIsPublishing(true);
    try {
      await adminService.publishDraw(simulation._id);
      success('Draw results published to platform!');
      setSimulation(null);
    } catch (err) {
      error(err.response?.data?.message || 'Publishing failed');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-[2.5rem] bg-surface border border-border relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 text-gold opacity-5 rotate-12 group-hover:rotate-0 transition-all duration-1000">
           <Trophy size={140} />
         </div>

         <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
               <div className="p-3 rounded-2xl bg-gold/10 text-gold shadow-lg shadow-gold/5">
                 <Trophy size={28} className="animate-jackpot" />
               </div>
               <div>
                 <h2 className="text-3xl font-display font-black text-text uppercase italic tracking-tighter">Draw Console</h2>
                 <p className="text-xs text-muted font-body uppercase tracking-[0.2em]">Monthly Prize Lifecycle</p>
               </div>
            </div>
            <p className="text-sm text-muted font-body max-w-md leading-relaxed">
              Generate monthly draw results using audited weighted/random algorithms. Results must be simulated and reviewed before publishing.
            </p>
         </div>

         <div className="flex gap-4 relative z-10 w-full md:w-auto">
            {!simulation && (
              <Button 
                variant="primary" 
                size="lg" 
                className="w-full md:w-auto px-10 group bg-gold text-bg hover:bg-gold/80" 
                onClick={handleSimulate}
                isLoading={isSimulating}
              >
                <Play size={18} className="mr-2 fill-current" />
                Simulate {formatMonth(new Date().getMonth() + 1, new Date().getFullYear())}
              </Button>
            )}
            <Button variant="ghost" size="lg" className="w-full md:w-auto">
               Algorithm Settings
            </Button>
         </div>
      </div>

      <AnimatePresence mode="wait">
        {simulation ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-10 rounded-[3rem] bg-surface border-4 border-gold/20 relative overflow-hidden shadow-2xl"
          >
             <div className="absolute top-0 right-10 px-6 py-2 rounded-b-2xl bg-gold text-bg text-[10px] font-black uppercase tracking-widest shadow-lg">
                Pending Publication
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
                <div className="space-y-8">
                   <div>
                      <h3 className="text-xs font-bold text-muted uppercase tracking-[0.3em] mb-4">Drawn Numbers</h3>
                      <div className="flex flex-wrap gap-4">
                        {simulation.drawnNumbers.map((num, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: i * 0.1, type: 'spring' }}
                            className="w-16 h-16 rounded-2xl bg-bg border border-gold/30 flex items-center justify-center font-mono text-3xl font-black text-gold italic shadow-2xl"
                          >
                            {num}
                          </motion.div>
                        ))}
                      </div>
                   </div>

                   <div className="flex gap-6">
                      <div className="p-6 rounded-3xl bg-bg border border-border flex-1 group hover:border-gold/30 transition-all">
                         <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Total Prize Pool</p>
                            <Coins size={14} className="text-gold" />
                         </div>
                         <p className="text-3xl font-mono font-black text-text italic">
                            {formatCurrency(simulation.totalPrizePool)}
                         </p>
                      </div>
                      <div className="p-6 rounded-3xl bg-bg border border-border flex-1 group hover:border-gold/30 transition-all">
                         <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Winners Count</p>
                            <Zap size={14} className="text-primary" />
                         </div>
                         <p className="text-3xl font-mono font-black text-text italic">
                            {simulation.winners?.length || 0}
                         </p>
                      </div>
                   </div>
                </div>

                <div className="p-8 rounded-[2rem] bg-bg/50 border border-border space-y-4">
                   <h4 className="text-sm font-bold text-text uppercase tracking-widest mb-4 flex items-center gap-2">
                     <ShieldCheck size={16} className="text-primary" /> Winner Auditing Preview
                   </h4>
                   <div className="space-y-3 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                      {simulation.winners?.map((w, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border text-xs">
                          <span className="font-bold text-muted truncate max-w-[120px]">{w.userId?.name || 'User ' + idx}</span>
                          <div className="flex items-center gap-3">
                             <Badge variant="gold" className="text-[8px]">{w.matchType.toUpperCase()}</Badge>
                             <span className="font-mono font-bold text-text">£{w.prizeAmount}</span>
                          </div>
                        </div>
                      ))}
                      {(!simulation.winners || simulation.winners.length === 0) && (
                        <p className="text-center text-muted py-4 italic text-xs">No winners in this simulation.</p>
                      )}
                   </div>
                </div>
             </div>

             <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10 border-t border-border">
                <Button 
                   variant="primary" 
                   size="lg" 
                   className="w-full sm:w-auto px-12 bg-primary text-bg hover:bg-primary/80 group shadow-2xl shadow-primary/20"
                   onClick={handlePublish}
                   isLoading={isPublishing}
                >
                   Publish Draw Results
                   <Send size={18} className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="lg" 
                  className="w-full sm:w-auto text-danger border-danger/20 hover:bg-danger/10 hover:border-danger/50"
                  onClick={() => setSimulation(null)}
                >
                   Discard & Re-Simulate
                </Button>
             </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-24 flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-border bg-surface/30"
          >
             <div className="w-24 h-24 rounded-full bg-border/20 flex items-center justify-center text-muted mb-6 group-hover:scale-110 transition-transform">
                <Sparkles size={40} className="opacity-30" />
             </div>
             <p className="text-lg font-display text-muted italic">Ready for next month's draw generation.</p>
             <p className="text-xs text-muted/50 mt-2 font-body uppercase tracking-[0.2em]">Awaiting Simulation Command</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DrawManager;
