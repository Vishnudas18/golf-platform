import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Zap, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

const CTASection = () => {
  const plans = [
    {
      name: 'Monthly Professional',
      price: '25',
      period: 'per month',
      features: [
        'Weekly Score Entry',
        'Monthly Draw Entry',
        'Support 1 Charity',
        'Custom Impact Link',
        'Live Leaderboards',
      ],
      cta: 'Choose Monthly',
      variant: 'ghost',
      icon: Target,
    },
    {
      name: 'Yearly Champion',
      price: '240',
      period: 'per year',
      features: [
        'All Monthly Features',
        '2 Months FREE',
        'Priority Draw Sorting',
        'Exclusive Event Access',
        'Champion Badge',
      ],
      cta: 'Choose Yearly',
      variant: 'primary',
      recommended: true,
      icon: Zap,
    },
  ];

  return (
    <section className="py-32 bg-bg relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-surface to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-surface to-transparent" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-text mb-8 tracking-tighter capitalize leading-tight">
            Ready to <span className="text-primary italic">Transform</span> Your <span className="text-secondary italic">Game</span>?
          </h2>
          <p className="max-w-xl mx-auto text-lg text-muted font-body mb-8">
            Select a plan to start trackings your handicap while funding global impact. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className={`relative flex flex-col p-8 rounded-[40px] border transition-all duration-300 ${
                plan.recommended 
                  ? 'bg-surface border-primary ring-4 ring-primary/10 shadow-[0_0_80px_-12px_rgba(0,229,160,0.2)]' 
                  : 'bg-surface/50 border-border hover:border-muted'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-primary text-bg text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                  Most Popular
                </div>
              )}

              <div className="flex items-center justify-between mb-8">
                <div className={`p-4 rounded-2xl ${plan.recommended ? 'bg-primary/20 text-primary' : 'bg-muted/10 text-muted'}`}>
                  <plan.icon size={28} />
                </div>
                <div className="text-right">
                  <p className="text-4xl font-mono font-bold text-text italic">£{plan.price}</p>
                  <p className="text-xs text-muted font-bold uppercase tracking-widest">{plan.period}</p>
                </div>
              </div>

              <h3 className="text-2xl font-display font-bold text-text mb-8">
                {plan.name}
              </h3>

              <div className="space-y-4 mb-12 flex-grow">
                {plan.features.map((feature, fIndex) => (
                  <div key={fIndex} className="flex items-center gap-3 text-muted group">
                    <div className={`p-1 rounded-full ${plan.recommended ? 'bg-primary/20 text-primary shadow-sm' : 'bg-muted/20 text-muted shadow-sm'}`}>
                      <Check size={14} className="group-hover:scale-125 transition-transform" />
                    </div>
                    <span className="text-sm font-body font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <Link to="/register">
                <Button 
                  variant={plan.variant} 
                  size="lg" 
                  className="w-full group shadow-2xl"
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-20 text-center"
        >
          <p className="text-sm text-muted font-body mb-4">
            Trusted by golfers worldwide at
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
             <span className="text-xl font-display font-black tracking-tighter">NIKE GOLF</span>
             <span className="text-xl font-display font-black tracking-tighter">TITLEIST</span>
             <span className="text-xl font-display font-black tracking-tighter">CALLAWAY</span>
             <span className="text-xl font-display font-black tracking-tighter">PUMA</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
