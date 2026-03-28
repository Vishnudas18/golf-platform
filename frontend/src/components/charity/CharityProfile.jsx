import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Calendar, MapPin, Heart, Share2, Award, Info } from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/formatDate';
import Button from '../common/Button';

const CharityProfile = ({ charity }) => {
  if (!charity) return null;

  return (
    <div className="space-y-12 pb-20">
      {/* Header / Banner area */}
      <div className="relative h-[400px] rounded-[3rem] overflow-hidden border-8 border-surface p-1 shadow-2xl group">
        <img
          src={charity.logo || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=1200'}
          alt={charity.name}
          className="w-full h-full object-cover rounded-[2.5rem] grayscale group-hover:grayscale-0 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent" />
        
        <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row items-end justify-between gap-8">
           <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                 <div className="p-2 rounded-xl bg-primary/20 text-primary border border-primary/30 backdrop-blur-md">
                   <Heart size={20} fill="currentColor" className="animate-pulse" />
                 </div>
                 <h1 className="text-4xl md:text-6xl font-display font-black text-text tracking-tighter uppercase italic leading-none">
                    {charity.name}
                 </h1>
              </div>
              <div className="flex items-center gap-6 text-muted font-mono text-sm font-bold uppercase tracking-widest px-1">
                 <div className="flex items-center gap-2">
                    <Globe size={16} className="text-secondary" />
                    <a href={charity.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline">Official Website</a>
                 </div>
                 <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-secondary" />
                    <span>Global Impact</span>
                 </div>
              </div>
           </div>

           <div className="p-8 rounded-3xl glass backdrop-blur-xl border border-white/10 shadow-3xl text-right group-hover:scale-105 transition-transform duration-500">
              <p className="text-[10px] font-bold text-muted uppercase tracking-[0.3em] mb-2 leading-none">Career Donations</p>
              <p className="text-5xl font-mono font-black text-primary leading-none italic">
                {formatCurrency(charity.totalReceived)}
              </p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
         {/* Main Content */}
         <div className="lg:col-span-2 space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-10 rounded-[2.5rem] bg-surface border border-border relative overflow-hidden group shadow-inner"
            >
               <div className="absolute top-0 right-0 p-10 text-primary opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                 <Award size={100} />
               </div>
               <h3 className="text-2xl font-display font-bold text-text mb-6">About the Organization</h3>
               <p className="text-lg text-muted font-body leading-relaxed leading-relaxed mb-8">
                 {charity.description}
               </p>
               <div className="flex items-center gap-6 pt-8 border-t border-border">
                  <div className="flex items-center gap-2">
                     <span className="text-3xl font-mono font-black text-text italic">12k+</span>
                     <span className="text-[10px] font-bold text-muted uppercase tracking-widest leading-none">Active<br />Donors</span>
                  </div>
                  <div className="w-px h-10 bg-border" />
                  <div className="flex items-center gap-2">
                     <span className="text-3xl font-mono font-black text-text italic">50+</span>
                     <span className="text-[10px] font-bold text-muted uppercase tracking-widest leading-none">Ongoing<br />Programs</span>
                  </div>
               </div>
            </motion.div>

            {/* Upcoming Events */}
            {charity.events && charity.events.length > 0 && (
              <div className="space-y-6">
                 <h3 className="text-2xl font-display font-bold text-text flex items-center gap-3">
                   Upcoming Events <span className="p-1.5 rounded-lg bg-secondary/10 text-secondary text-xs uppercase tracking-widest">{charity.events.length}</span>
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {charity.events.map((event, idx) => (
                      <motion.div
                         key={idx}
                         whileHover={{ x: 10 }}
                         className="p-6 rounded-3xl bg-surface border border-border group/event hover:border-secondary/50 transition-all duration-300"
                      >
                         <div className="flex items-center gap-3 text-secondary text-xs font-mono font-bold uppercase tracking-widest mb-4">
                            <Calendar size={14} /> {formatDate(event.date)}
                         </div>
                         <h4 className="text-xl font-display font-bold text-text mb-3 group-event-hover:text-secondary transition-colors">
                           {event.title}
                         </h4>
                         <p className="text-sm text-muted line-clamp-2 leading-relaxed">
                           {event.description}
                         </p>
                      </motion.div>
                    ))}
                 </div>
              </div>
            )}
         </div>

         {/* Sticky Action Sidebar */}
         <div className="sticky top-28 space-y-6">
            <div className="p-8 rounded-[2rem] bg-surface border border-border relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 p-6 text-secondary opacity-10">
                 <Heart size={40} fill="currentColor" />
               </div>
               <h3 className="text-xl font-display font-bold text-text mb-6">Partner Impact</h3>
               <div className="space-y-6 mb-8">
                  <div className="flex items-center justify-between group">
                     <span className="text-xs font-bold text-muted uppercase tracking-widest group-hover:text-primary transition-colors">Subscription Share</span>
                     <span className="text-sm font-mono font-bold text-text">10% - 100%</span>
                  </div>
                  <div className="flex items-center justify-between group">
                     <span className="text-xs font-bold text-muted uppercase tracking-widest group-hover:text-primary transition-colors">Donor Reach</span>
                     <span className="text-sm font-mono font-bold text-text">Tier 1</span>
                  </div>
                  <div className="flex items-center justify-between group">
                     <span className="text-xs font-bold text-muted uppercase tracking-widest group-hover:text-primary transition-colors">Total Programs</span>
                     <span className="text-sm font-mono font-bold text-text italic">Global</span>
                  </div>
               </div>
               <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex gap-3 text-primary mb-8">
                  <Info size={18} className="shrink-0 mt-0.5" />
                  <p className="text-xs font-medium font-body leading-relaxed leading-relaxed opacity-80 italic">
                    All donations made through GolfGives are 100% transparent and tracked.
                  </p>
               </div>
               <Button variant="primary" className="w-full">
                  Change Primary Partner
               </Button>
            </div>

            <button className="w-full p-4 rounded-2xl bg-surface border border-border text-muted hover:text-text hover:border-primary transition-all flex items-center justify-center gap-3 font-bold text-sm tracking-widest group">
               <Share2 size={18} className="group-hover:rotate-12 transition-transform" /> SHARE IMPACT
            </button>
         </div>
      </div>
    </div>
  );
};

export default CharityProfile;
