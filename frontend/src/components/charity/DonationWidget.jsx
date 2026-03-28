import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, CreditCard, ShieldCheck, Zap, ArrowRight, CheckCircle2, Sliders } from 'lucide-react';
import * as charityService from '../../services/charityService';
import Button from '../common/Button';
import Input from '../common/Input';
import { useToast } from '../../hooks/useToast';
import { formatCurrency } from '../../utils/formatDate';

const DonationWidget = ({ charityId, charityName }) => {
  const [amount, setAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastAmount, setLastAmount] = useState(0);
  const { success, error } = useToast();

  const presets = [10, 25, 50, 100];

  const handleDonate = async (e) => {
    e.preventDefault();
    const finalAmount = customAmount ? Number(customAmount) : amount;
    
    if (finalAmount < 1) return error('Minimum donation is £1');
    
    setIsProcessing(true);
    try {
      const { data } = await charityService.makeDonation(charityId, finalAmount);
      
      // Handle Success (Mock or Real)
      setLastAmount(finalAmount);
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        // Mock success case
        setIsSuccess(true);
        success(`Success! You just donated £${finalAmount}`);
      }
    } catch (err) {
      error('Failed to initiate donation');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-10 rounded-[2.5rem] bg-surface border border-primary/30 text-center space-y-8 relative overflow-hidden group shadow-3xl shadow-primary/10"
      >
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[80px]" />
        
        <div className="w-24 h-24 rounded-3xl bg-primary/20 text-primary flex items-center justify-center mx-auto mb-6 border border-primary/30">
          <CheckCircle2 size={48} className="animate-bounce" />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-3xl font-display font-black text-text uppercase italic tracking-tighter">Impact Logged!</h3>
          <p className="text-muted font-body leading-relaxed">
            You just directly supported <span className="text-text font-bold">{charityName}</span> with <span className="text-primary font-mono font-black italic text-xl">£{lastAmount}</span>.
          </p>
        </div>

        <div className="pt-6 border-t border-border flex flex-col gap-4">
          <Button variant="primary" size="md" onClick={() => setIsSuccess(false)} className="w-full">
            Give Again
          </Button>
          <button onClick={() => window.location.href='/dashboard'} className="text-[10px] font-bold text-muted uppercase tracking-[0.3em] hover:text-primary transition-colors italic">
            Back to Dashboard <ArrowRight size={10} className="inline ml-1" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-10 rounded-[2.5rem] bg-surface border border-border relative overflow-hidden shadow-2xl group"
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-8 text-primary opacity-5 group-hover:rotate-12 transition-transform duration-700">
        <Zap size={100} />
      </div>

      <div className="flex items-center gap-3 mb-10 relative z-10">
        <div className="p-3 rounded-2xl bg-danger/10 text-danger shadow-lg shadow-danger/5">
           <Heart size={24} fill="currentColor" className="animate-pulse" />
        </div>
        <div>
           <h3 className="text-2xl font-display font-bold text-text">One-time Gift</h3>
           <p className="text-xs text-muted font-body uppercase tracking-widest italic">Direct Support for {charityName}</p>
        </div>
      </div>

      <form onSubmit={handleDonate} className="space-y-8 relative z-10">
         <div className="grid grid-cols-2 gap-4">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => { setAmount(p); setCustomAmount(''); }}
                className={`flex flex-col items-center justify-center py-6 rounded-2xl border transition-all duration-300 ${
                  amount === p && !customAmount
                    ? 'bg-primary/20 border-primary text-primary shadow-lg shadow-primary/10'
                    : 'bg-bg border-border text-muted hover:border-muted group/preset'
                }`}
              >
                 <span className="text-2xl font-mono font-black italic">£{p}</span>
                 <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Impact Contribution</span>
              </button>
            ))}
         </div>

         <div className="relative group/custom">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-mono font-bold text-muted group-hover/custom:text-primary transition-colors">£</span>
            <input
              type="number"
              placeholder="Custom Amount"
              className="w-full pl-12 pr-6 py-6 bg-bg border border-border rounded-2xl text-xl font-mono font-bold text-text focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all shadow-inner placeholder:text-muted/30"
              value={customAmount}
              onChange={(e) => { setCustomAmount(e.target.value); setAmount(0); }}
            />
         </div>

         <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-surface border border-border flex items-center justify-between group/total">
               <div>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Total Contribution</p>
                  <p className="text-3xl font-mono font-black text-text italic group-total-hover:text-primary transition-colors italic">
                    {formatCurrency(customAmount ? Number(customAmount) : amount)}
                  </p>
               </div>
               <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                  <CreditCard size={24} />
               </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg border border-border text-xs text-muted">
               <ShieldCheck size={16} className="text-primary" />
               <span className="font-bold uppercase tracking-tighter italic">Secure Payment via Stripe</span>
               <div className="w-1 h-1 rounded-full bg-border mx-auto" />
               <CheckCircle2 size={16} className="text-primary" />
               <span className="font-bold uppercase tracking-tighter italic">Instant Receipt</span>
            </div>
         </div>

         <Button
           type="submit"
           variant="primary"
           size="lg"
           className="w-full shadow-2xl shadow-primary/20 py-8 text-xl group"
           isLoading={isProcessing}
         >
           Complete Donation
           <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
         </Button>

         <p className="text-[11px] text-muted text-center px-6 leading-relaxed opacity-60 italic">
           All funds are transferred directly to the charity, less standard payment processing fees. Thank you for your support.
         </p>
      </form>
    </motion.div>
  );
};

export default DonationWidget;
