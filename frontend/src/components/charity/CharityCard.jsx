import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Globe, ArrowRight, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/formatDate';

const CharityCard = ({ charity }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative bg-surface border border-border rounded-[2.5rem] p-4 h-full flex flex-col transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 shadow-inner"
    >
      <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden mb-6 bg-bg border border-border group-hover:border-primary/20">
        <img
          src={charity.logo || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=600'}
          alt={charity.name}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 active:scale-110"
        />
        <div className="absolute top-4 left-4 p-2 rounded-xl bg-bg/80 backdrop-blur-md border border-border text-primary shadow-lg">
           <Heart size={18} fill={charity.isFeatured ? 'currentColor' : 'none'} className={charity.isFeatured ? 'animate-pulse' : ''} />
        </div>
        {charity.isFeatured && (
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-bg text-[10px] font-black uppercase tracking-widest shadow-lg">
            Featured
          </div>
        )}
      </div>

      <div className="px-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-4">
           <h3 className="text-xl font-display font-bold text-text truncate group-hover:text-primary transition-colors">
             {charity.name}
           </h3>
           <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
             <TrendingUp size={10} /> IMPACT
           </div>
        </div>

        <p className="text-sm text-muted font-body mb-8 line-clamp-3 leading-relaxed">
          {charity.description}
        </p>

        <div className="mt-auto pt-6 border-t border-border flex items-center justify-between gap-4">
           <div>
              <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-1">Total Impact</p>
              <p className="text-xl font-mono font-black text-text italic">
                {formatCurrency(charity.totalReceived)}
              </p>
           </div>
           
           <Link to={`/charities/${charity.slug}`}>
             <button className="w-12 h-12 rounded-2xl bg-bg border border-border text-muted hover:text-primary hover:border-primary group-hover:bg-primary group-hover:text-bg transition-all flex items-center justify-center animate-pulse group-hover:animate-none">
               <ArrowRight size={20} />
             </button>
           </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CharityCard;
