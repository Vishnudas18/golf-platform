import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, LayoutDashboard, Trophy, Heart } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      title: 'Subscribe',
      description: 'Choose your plan and start your journey towards giving and winning.',
      icon: UserPlus,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: 'Enter Scores',
      description: 'Log your Stableford golf scores weekly to stay eligible for the draw.',
      icon: LayoutDashboard,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
    },
    {
      title: 'Support Charity',
      description: 'Redirect a portion of your subscription to a cause you care about.',
      icon: Heart,
      color: 'text-danger',
      bg: 'bg-danger/10',
    },
    {
      title: 'Win Big',
      description: 'Your scores enter you into our monthly prize pool draws.',
      icon: Trophy,
      color: 'text-gold',
      bg: 'bg-gold/10',
    },
  ];

  return (
    <section className="py-32 bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-text mb-6 tracking-tight">
            How It Works
          </h2>
          <p className="text-lg text-muted font-body max-w-2xl mx-auto">
            The simplest way to track your golf progress while making a real difference in the world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group p-8 rounded-3xl bg-bg border border-border hover:border-primary/50 transition-all duration-300 shadow-2xl"
            >
              <div className="absolute top-4 right-6 text-7xl font-display font-black text-white/5 group-hover:text-primary/10 transition-colors">
                0{index + 1}
              </div>
              <div className={`w-14 h-14 rounded-2xl ${step.bg} ${step.color} flex items-center justify-center mb-8 shadow-inner`}>
                <step.icon size={28} />
              </div>
              <h3 className="text-xl font-display font-bold text-text mb-4">
                {step.title}
              </h3>
              <p className="text-sm text-muted font-body leading-relaxed leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
