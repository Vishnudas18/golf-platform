import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Globe, ArrowRight, ExternalLink } from 'lucide-react';
import * as charityService from '../../services/charityService';
import Button from '../common/Button';

const CharitySpotlight = () => {
  const [featuredCharity, setFeaturedCharity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await charityService.getAllCharities({ featured: true });
        if (data.length > 0) {
          setFeaturedCharity(data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch spotlight charity:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (isLoading || !featuredCharity) return null;

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary/5 skew-x-12 transform origin-top-right -z-10" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-widest mb-6">
              <Heart size={14} /> Spotlight Charity
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-text mb-8 leading-tight">
              Giving back to <span className="text-secondary">{featuredCharity.name}</span>
            </h2>
            <p className="text-lg text-muted font-body mb-8 leading-relaxed">
              {featuredCharity.description?.substring(0, 200)}...
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-12">
               <div className="p-4 rounded-2xl bg-surface border border-border shadow-xl w-full sm:w-auto">
                 <p className="text-xs font-bold text-muted uppercase tracking-widest mb-1">Total Received</p>
                 <p className="text-3xl font-mono font-bold text-text uppercase">£{featuredCharity.totalReceived.toLocaleString()}</p>
               </div>
               <div className="flex items-center gap-4">
                  <a href={featuredCharity.website} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-bg border border-border text-muted hover:text-primary hover:border-primary/50 transition-all">
                    <ExternalLink size={20} />
                  </a>
                  <p className="text-sm font-body text-muted">Trusted by <span className="text-primary font-bold">5,400+</span> GolfGives players.</p>
               </div>
            </div>

            <Link to={`/charities/${featuredCharity.slug}`}>
              <Button variant="secondary" size="lg" className="px-10 group">
                Support {featuredCharity.name}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="group relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-secondary/30 to-primary/30 blur-2xl opacity-50 group-hover:opacity-100 transition-all duration-700" />
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden glass border-8 border-surface p-1 shadow-2xl">
              <img
                src={featuredCharity.logo || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=1000'}
                alt={featuredCharity.name}
                className="w-full h-full object-cover rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-700 active:scale-105"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 p-6 rounded-2xl bg-bg border border-border flex items-center gap-4 shadow-3xl">
               <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                 <Heart size={24} fill="currentColor" />
               </div>
               <div>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-0.5">Community Impact</p>
                  <p className="text-lg font-display font-bold text-text">Live Donation Feed</p>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CharitySpotlight;
