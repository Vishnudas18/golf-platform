import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import ScoreEntry from '../components/dashboard/ScoreEntry';
import ScoreList from '../components/dashboard/ScoreList';
import DrawCard from '../components/dashboard/DrawCard';
import CharitySelector from '../components/dashboard/CharitySelector';
import SubscriptionStatus from '../components/dashboard/SubscriptionStatus';
import WinningsOverview from '../components/dashboard/WinningsOverview';
import ParticipationSummary from '../components/dashboard/ParticipationSummary';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { Trophy, Activity, Target, ShieldCheck, Heart, CreditCard } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-12">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-8 py-10 border-b border-border mb-12 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-10 text-primary opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
             <Trophy size={120} />
           </div>
           
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-primary to-secondary p-1 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                 <div className="w-full h-full rounded-[1.8rem] bg-bg flex items-center justify-center text-4xl font-display font-black text-text italic">
                    {user?.name?.charAt(0) || 'P'}
                 </div>
              </div>
              <div className="flex flex-col gap-2">
                 <h1 className="text-4xl md:text-5xl font-display font-black text-text tracking-tighter uppercase italic leading-none">
                    Welcome, <span className="text-primary">{user?.name?.split(' ')[0]}</span>
                 </h1>
                 <p className="text-sm font-mono font-bold text-muted uppercase tracking-[0.3em] flex items-center justify-center md:justify-start gap-2">
                    <ShieldCheck size={14} className="text-primary" /> Verified Player ID: GG-{user?._id?.slice(-6).toUpperCase()}
                 </p>
              </div>
           </div>

           <div className="flex gap-4 relative z-10">
              <div className="p-4 rounded-3xl bg-surface border border-border text-center min-w-[120px] group-hover:border-primary/30 transition-all shadow-xl">
                 <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Rank</p>
                 <p className="text-2xl font-mono font-black text-text italic tracking-tighter">Pro</p>
              </div>
              <div className="p-4 rounded-3xl bg-surface border border-border text-center min-w-[120px] group-hover:border-secondary/30 transition-all shadow-xl">
                 <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Win Streak</p>
                 <p className="text-2xl font-mono font-black text-text italic tracking-tighter">3 mo</p>
              </div>
           </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Left Column: Participation & Scores */}
           <div className="lg:col-span-1 space-y-8">
              <section>
                 <ParticipationSummary />
              </section>
              <section className="p-10 rounded-[3rem] bg-surface border border-border shadow-2xl relative overflow-hidden group">
                 <ScoreEntry />
                 <div className="mt-12">
                   <ScoreList />
                 </div>
              </section>
           </div>

           {/* Center Column: Draws & Winnings */}
           <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <section className="md:col-span-1">
                    <DrawCard />
                 </section>
                 <section className="md:col-span-1">
                    <WinningsOverview />
                 </section>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <section className="md:col-span-1">
                    <CharitySelector />
                 </section>
                 <section className="md:col-span-1">
                    <SubscriptionStatus />
                 </section>
              </div>

              {/* Engagement Banner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-10 rounded-[3rem] bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 relative overflow-hidden group"
              >
                 <div className="absolute top-0 right-0 p-8 text-primary opacity-5 group-hover:rotate-12 transition-transform duration-700">
                   <CreditCard size={100} />
                 </div>
                 <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex-1 text-center md:text-left">
                       <h3 className="text-2xl font-display font-black text-text uppercase italic tracking-tighter mb-2">Refer a Partner</h3>
                       <p className="text-sm text-muted font-body">Get 1 month free for every golfer who joins using your link.</p>
                    </div>
                    <button className="px-8 py-4 rounded-2xl bg-primary text-bg font-display font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                       Copy Referral Link
                    </button>
                 </div>
              </motion.div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
