import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CharityProfile from '../components/charity/CharityProfile';
import DonationWidget from '../components/charity/DonationWidget';
import * as charityService from '../services/charityService';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Share2, Heart, Award, Sparkles, AlertCircle } from 'lucide-react';
import Loader from '../components/common/Loader';

const CharityDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [charity, setCharity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharity = async () => {
      setIsLoading(true);
      try {
        const { data } = await charityService.getCharityBySlug(slug);
        setCharity(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Charity not found');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCharity();
  }, [slug]);

  if (isLoading) return <Loader fullPage />;

  if (error) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-6 text-center">
         <div className="max-w-md space-y-6">
            <div className="w-20 h-20 rounded-full bg-danger/10 text-danger flex items-center justify-center mx-auto mb-8 animate-pulse">
               <AlertCircle size={40} />
            </div>
            <h1 className="text-4xl font-display font-black text-text uppercase italic tracking-tighter">Charity Missing</h1>
            <p className="text-muted font-body leading-relaxed leading-relaxed">
              We couldn't find the organization you're looking for. It may have been renamed or removed from the platform.
            </p>
            <button
               onClick={() => navigate('/charities')}
               className="inline-flex items-center gap-2 text-primary font-bold hover:underline italic"
            >
               <ChevronLeft size={18} /> Back to Directory
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 pb-32">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-12 sticky top-28 z-20 glass p-4 rounded-2xl mx-[-1rem] px-8 shadow-2xl">
           <button
             onClick={() => navigate('/charities')}
             className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-[0.2em] hover:text-primary transition-colors group"
           >
             <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Partners
           </button>
           
           <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 text-[10px] font-bold text-muted uppercase tracking-[0.2em] hover:text-secondary transition-colors group">
                 <Share2 size={14} className="group-hover:rotate-12 transition-transform" /> Share Impact
              </button>
              <div className="w-px h-6 bg-border" />
              <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] animate-pulse">
                 <Sparkles size={14} /> LIVE TRACKING
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
           {/* Profile Content */}
           <div className="lg:col-span-2">
              <CharityProfile charity={charity} />
           </div>

           {/* Donation Sidebar */}
           <aside className="sticky top-48 space-y-8">
              <DonationWidget charityId={charity._id} charityName={charity.name} />
              
              <div className="p-8 rounded-[2.5rem] bg-surface border border-border relative overflow-hidden group shadow-2xl">
                 <div className="absolute top-0 right-0 p-6 text-primary opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                   <Award size={64} />
                 </div>
                 <h3 className="text-lg font-display font-bold text-text mb-4">Partner Status</h3>
                 <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-sm font-bold text-muted group-hover:text-text transition-colors">
                       <Heart size={16} className="text-danger" fill="currentColor" />
                       Verified 501(c)(3)
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold text-muted group-hover:text-text transition-colors">
                       <Award size={16} className="text-gold" fill="currentColor" />
                       Audit Score: Gold
                    </div>
                 </div>
                 <p className="text-[10px] text-muted italic font-body opacity-50 px-1 border-l border-border italic">
                   This partner exceeds transparency standards for platform impact distribution.
                 </p>
              </div>

              {/* Impact Stats */}
              <div className="flex flex-col gap-4 text-center p-8 rounded-[2rem] bg-surface/30 border border-border">
                 <div>
                    <p className="text-[8px] font-bold text-muted uppercase tracking-[0.4em] mb-1 leading-none">Global Direct Impact</p>
                    <p className="text-3xl font-mono font-black text-text italic">£{(charity.totalReceived * 0.95).toFixed(2)}</p>
                 </div>
                 <div className="w-full h-px bg-border" />
                 <div>
                    <p className="text-[8px] font-bold text-muted uppercase tracking-[0.4em] mb-1 leading-none">Beneficiaries Reached</p>
                    <p className="text-3xl font-mono font-black text-text italic">142,500+</p>
                 </div>
              </div>
           </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CharityDetailsPage;
