import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Heart, Sparkles, Filter, X } from 'lucide-react';
import Button from '../common/Button';

const CharitySearch = ({ onSearch, initialFeatured = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFeatured, setIsFeatured] = useState(initialFeatured);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch({ search: searchTerm, featured: isFeatured });
    }, 3000); // 300ms debounce
    return () => clearTimeout(timer);
  }, [searchTerm, isFeatured]);

  const toggleFeatured = () => setIsFeatured(!isFeatured);

  return (
    <div className="space-y-6 mb-12 relative z-10">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 group">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted group-hover:text-primary transition-colors" size={24} />
           <input
             type="text"
             placeholder="Search charities by name or cause..."
             className="w-full pl-16 pr-6 py-6 bg-surface border border-border rounded-[2.5rem] text-lg font-body text-text focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-xl hover:border-muted placeholder:text-muted/50"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
           {searchTerm && (
             <button
               onClick={() => setSearchTerm('')}
               className="absolute right-6 top-1/2 -translate-y-1/2 text-muted hover:text-text"
             >
               <X size={20} />
             </button>
           )}
        </div>
        
        <div className="flex items-center gap-4">
           <button
             onClick={toggleFeatured}
             className={`flex items-center gap-3 px-8 py-5 rounded-[2.5rem] border border-border group transition-all duration-300 ${
               isFeatured ? 'bg-primary/10 text-primary border-primary/50 shadow-lg shadow-primary/5' : 'bg-surface text-muted hover:border-muted'
             }`}
           >
             <Heart size={20} className={isFeatured ? 'fill-current animate-pulse' : ''} />
             <span className="text-sm font-bold uppercase tracking-widest font-display">Featured Only</span>
           </button>

           <button
             onClick={() => setIsFiltersOpen(!isFiltersOpen)}
             className={`p-5 rounded-full border border-border bg-surface transition-all duration-300 shadow-xl ${
               isFiltersOpen ? 'text-primary border-primary rotate-180' : 'text-muted hover:text-text hover:border-muted'
             }`}
           >
             <SlidersHorizontal size={24} />
           </button>
        </div>
      </div>

      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, scaleY: 0 }}
            animate={{ opacity: 1, height: 'auto', scaleY: 1 }}
            exit={{ opacity: 0, height: 0, scaleY: 0 }}
            className="p-8 bg-surface border border-border rounded-[2.5rem] mt-4 flex flex-wrap gap-8 origin-top shadow-2xl"
          >
             <div className="flex flex-col gap-3">
                <p className="text-xs font-bold text-muted uppercase tracking-widest px-1">Impact Sector</p>
                <div className="flex flex-wrap gap-2">
                   {['Climate', 'Education', 'Health', 'Poverty', 'Tech'].map(tag => (
                      <button key={tag} className="px-5 py-2 rounded-full bg-bg border border-border text-xs font-bold text-muted hover:text-primary hover:border-primary transition-all">
                        {tag}
                      </button>
                   ))}
                </div>
             </div>

             <div className="flex flex-col gap-3">
                <p className="text-xs font-bold text-muted uppercase tracking-widest px-1">Region</p>
                <div className="flex flex-wrap gap-2">
                   {['Global', 'UK', 'EU', 'USA', 'Africa'].map(tag => (
                      <button key={tag} className="px-5 py-2 rounded-full bg-bg border border-border text-xs font-bold text-muted hover:text-primary hover:border-primary transition-all">
                        {tag}
                      </button>
                   ))}
                </div>
             </div>

             <div className="flex flex-col gap-3">
                <p className="text-xs font-bold text-muted uppercase tracking-widest px-1">Engagement</p>
                <div className="flex flex-wrap gap-2">
                   <button className="px-5 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-xs font-bold text-secondary flex items-center gap-2">
                      <Sparkles size={14} /> Top Impact Partner
                   </button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AnimatePresence = ({ children }) => {
  // Simplified for demo if framer-motion AnimatePresence is tricky in single view
  return <div className="transition-all duration-500 overflow-hidden">{children}</div>;
};

export default CharitySearch;
