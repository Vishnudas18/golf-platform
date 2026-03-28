import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Check, Zap, ArrowRight, ShieldCheck, Heart, Info, CreditCard, Sparkles, Trophy } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { useToast } from '../hooks/useToast';

const SubscriptionPage = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly Pro',
      price: '25',
      period: 'per month',
      priceId: 'price_monthly_id', // Replace with real Stripe Price ID
      features: [
        'Weekly Score Entry',
        'Monthly Draw Entry',
        'Redirect 10-100% Impact',
        'Digital Membership Card',
        'No Commitment - Cancel Anytime',
      ],
      cta: 'Start Monthly',
      icon: Rocket,
      color: 'primary',
    },
    {
      id: 'yearly',
      name: 'Yearly Champion',
      price: '240',
      period: 'per year',
      priceId: 'price_yearly_id', // Replace with real Stripe Price ID
      features: [
        'All Monthly Features',
        '2 Months FREE',
        'Priority Draw Verification',
        'Champion Profile Badge',
        'Exclusive Event Access',
      ],
      cta: 'Start Yearly',
      icon: Zap,
      color: 'secondary',
      recommended: true,
    },
  ];

  const handleSubscribe = async (planId) => {
    setIsLoading(true);
    try {
      const { data } = await api.post('/subscriptions/create-checkout', { plan: planId });
      if (data.success && data.data?.url) {
        window.location.href = data.data.url;
      }
    } catch (err) {
      error(err.response?.data?.message || 'Checkout failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 pb-40">
        <header className="mb-24 text-center relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-10 text-primary opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
             <Rocket size={140} />
           </div>
           
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="relative z-10"
           >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-8 uppercase tracking-[0.3em] font-black italic shadow-lg">
                <ShieldCheck size={16} /> Secure Payment Gateway
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-black text-text tracking-tighter uppercase italic leading-[1.1] mb-8">
                 Fuel the <span className="text-primary italic">Game</span>.<br />
                 Fund the <span className="text-secondary italic">Future</span>.
              </h1>
              <p className="max-w-xl mx-auto text-lg text-muted font-body leading-relaxed">
                 Choose a plan that fits your lifestyle. Every subscription enters you into the monthly draw and feeds our global impact network.
              </p>
           </motion.div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
           {plans.map((plan, idx) => (
             <motion.div
               key={plan.id}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               whileHover={{ y: -10 }}
               transition={{ delay: idx * 0.1 }}
               className={`p-10 rounded-[3rem] bg-surface border-4 transition-all duration-300 relative overflow-hidden group flex flex-col shadow-2xl ${
                 plan.recommended ? 'border-primary shadow-primary/20' : 'border-border hover:border-muted'
               }`}
             >
                {plan.recommended && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 px-6 py-2 rounded-b-2xl bg-primary text-bg text-[10px] font-black uppercase tracking-[0.3em] shadow-xl">
                    MOST POPULAR
                  </div>
                )}
                
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
                   <plan.icon size={120} />
                </div>

                <div className="mb-12 relative z-10">
                   <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl ${
                      plan.id === 'monthly' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-secondary/10 text-secondary border border-secondary/20'
                   }`}>
                      <plan.icon size={32} />
                   </div>
                   <h3 className="text-3xl font-display font-black text-text uppercase italic tracking-tighter mb-2">{plan.name}</h3>
                   <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-5xl font-mono font-black text-text italic tracking-tighter">£{plan.price}</span>
                      <span className="text-xs font-bold text-muted uppercase tracking-widest">{plan.period}</span>
                   </div>
                </div>

                <div className="space-y-6 mb-16 flex-grow relative z-10">
                   {plan.features.map((feature, fIdx) => (
                     <div key={fIdx} className="flex items-center gap-4 group/item">
                        <div className={`p-1 rounded-full group-hover-item:scale-125 transition-transform ${
                           plan.recommended ? 'bg-primary/20 text-primary' : 'bg-muted/20 text-muted shadow-inner'
                        }`}>
                           <Check size={14} className="group-hover/item:scale-125 transition-transform" />
                        </div>
                        <span className="text-sm font-medium font-body text-muted leading-none group-hover/item:text-text transition-colors">
                           {feature}
                        </span>
                     </div>
                   ))}
                </div>

                <Button
                   variant={plan.recommended ? 'primary' : 'ghost'}
                   className={`w-full py-6 text-lg uppercase tracking-widest font-black shadow-2xl shadow-black/20 group relative z-10`}
                   onClick={() => handleSubscribe(plan.id)}
                   isLoading={isLoading}
                >
                   {plan.cta}
                   <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>

                {/* Developer Bypass */}
                <button
                  onClick={async () => {
                    setIsLoading(true);
                    try {
                      await api.post('/subscriptions/mock-subscribe', { plan: plan.id });
                      success('DEV MODE: Subscription Activated!');
                      window.location.href = '/dashboard';
                    } catch (err) {
                      error('Mock subscription failed');
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="mt-4 text-[10px] font-black text-muted/30 hover:text-primary transition-colors uppercase tracking-[0.2em] italic"
                >
                  [ Developer: Bypass Stripe ]
                </button>
             </motion.div>
           ))}
        </div>

        {/* Info Grid */}
        <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-12">
           <div className="p-10 rounded-[2.5rem] bg-surface border border-border group hover:border-primary/30 transition-all shadow-2xl">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mb-6 shadow-inner group-hover:animate-pulse">
                 <CreditCard size={24} />
              </div>
              <h4 className="text-xl font-display font-bold text-text mb-4 italic uppercase tracking-tighter">Secure Direct Payouts</h4>
              <p className="text-sm text-muted font-body leading-relaxed leading-relaxed">
                 Winnings are deposited directly into your linked bank account after proof verification.
              </p>
           </div>
           
           <div className="p-10 rounded-[2.5rem] bg-surface border border-border group hover:border-secondary/30 transition-all shadow-2xl">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary border border-secondary/20 flex items-center justify-center mb-6 shadow-inner group-hover:animate-pulse">
                 <Heart size={24} />
              </div>
              <h4 className="text-xl font-display font-bold text-text mb-4 italic uppercase tracking-tighter">Transparent Impact</h4>
              <p className="text-sm text-muted font-body leading-relaxed leading-relaxed">
                 100% of your allocated share reaches the charity, audited monthly by our impact team.
              </p>
           </div>

           <div className="p-10 rounded-[2.5rem] bg-surface border border-border group hover:border-gold/30 transition-all shadow-2xl">
              <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold border border-gold/20 flex items-center justify-center mb-6 shadow-inner group-hover:animate-pulse">
                 <Sparkles size={24} />
              </div>
              <h4 className="text-xl font-display font-bold text-text mb-4 italic uppercase tracking-tighter">Community Driven</h4>
              <p className="text-sm text-muted font-body leading-relaxed leading-relaxed">
                 The larger we grow, the bigger the prize pools and the greater the charitable giving.
              </p>
           </div>
        </div>

        {/* Final CTA */}
        <div className="mt-40 p-12 rounded-[3.5rem] bg-gradient-to-r from-primary/10 via-bg to-secondary/10 border border-border text-center shadow-3xl relative overflow-hidden group">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
           <div className="relative z-10 max-w-2xl mx-auto">
              <h3 className="text-4xl font-display font-black text-text uppercase italic tracking-tighter mb-8 leading-tight">
                 Questions About our <span className="text-primary">Membership</span>?
              </h3>
              <p className="text-lg text-muted font-body mb-10 leading-relaxed">
                 Our support team is here for you 24/7. Whether it's billing inquiries or charity partnership proposals.
              </p>
              <div className="flex justify-center gap-6">
                 <Button variant="ghost" size="lg" className="px-10">Read FAQs</Button>
                 <Button variant="primary" size="lg" className="px-10">Contact Support</Button>
              </div>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SubscriptionPage;
