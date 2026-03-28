import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CharityCard from '../components/charity/CharityCard';
import CharitySearch from '../components/charity/CharitySearch';
import * as charityService from '../services/charityService';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Globe, Filter } from 'lucide-react';
import Loader from '../components/common/Loader';

const CharityListPage = () => {
  const [charities, setCharities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', featured: false });

  const fetchCharities = async (searchParams = {}) => {
    setIsLoading(true);
    try {
      const { data } = await charityService.getAllCharities(searchParams);
      setCharities(data);
    } catch (error) {
      console.error('Failed to fetch charities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCharities(filters);
  }, [filters]);

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 pb-32">
        {/* Header Section */}
        <header className="mb-20 text-center relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-10 text-secondary opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
             <Heart size={140} fill="currentColor" />
           </div>
           
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="relative z-10"
           >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary border border-secondary/20 mb-8 uppercase tracking-[0.3em] font-black italic shadow-lg">
                <Sparkles size={16} /> Global Impact Partners
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-black text-text tracking-tighter uppercase italic leading-[1.1] mb-8">
                 Choose Your <span className="text-secondary italic">Cause</span>.<br />
                 Change the <span className="text-primary italic">World</span>.
              </h1>
              <p className="max-w-xl mx-auto text-lg text-muted font-body leading-relaxed">
                 From environmental recovery to technology education – choose the organization that matters most to you and track your contribution live.
              </p>
           </motion.div>
        </header>

        {/* Search & Filter */}
        <CharitySearch onSearch={handleSearch} />

        {/* Results Grid */}
        <div className="relative">
           <AnimatePresence mode="popLayout">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {[1,2,3,4,5,6].map(i => (
                      <div key={i} className="h-[450px] rounded-[2.5rem] bg-surface border border-border animate-pulse shadow-2xl" />
                   ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                >
                   {charities.map((charity, index) => (
                      <motion.div
                        key={charity._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                         <CharityCard charity={charity} />
                      </motion.div>
                   ))}
                </motion.div>
              )}
           </AnimatePresence>

           {!isLoading && charities.length === 0 && (
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="py-32 flex flex-col items-center justify-center text-center px-6 rounded-[3rem] border-2 border-dashed border-border bg-surface/30"
             >
                <div className="w-24 h-24 rounded-full bg-border/20 flex items-center justify-center text-muted mb-6 group-hover:scale-110 transition-transform">
                   <Globe size={40} className="opacity-30" />
                </div>
                <h3 className="text-2xl font-display font-bold text-text mb-2 italic uppercase tracking-widest">No matching charities</h3>
                <p className="text-muted font-body text-sm max-w-md">Try adjusting your search terms or filters to find more impact partners.</p>
             </motion.div>
           )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CharityListPage;
