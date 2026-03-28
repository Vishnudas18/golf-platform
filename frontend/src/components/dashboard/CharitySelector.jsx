import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Search, ChevronRight, CheckCircle2, Sliders, Info } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import * as charityService from '../../services/charityService';
import * as authService from '../../services/authService';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Loader from '../common/Loader';
import { useToast } from '../../hooks/useToast';

const CharitySelector = () => {
  const { user, setUser } = useAuth();
  const { success, error } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [charities, setCharities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCharity, setSelectedCharity] = useState(null);
  const [percentage, setPercentage] = useState(user?.charityPercent || 10);

  useEffect(() => {
    if (user?.charityId) {
       // This would normally be populated, for now we fetch if needed
    }
  }, [user]);

  const fetchCharities = async () => {
    setIsLoading(true);
    try {
      const { data } = await charityService.getAllCharities({ search: searchTerm });
      setCharities(data);
    } catch (err) {
      error('Failed to load charities');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      fetchCharities();
    }
  }, [isModalOpen, searchTerm]);

  const handleCharitySelect = async (charity) => {
    try {
      const { data } = await authService.updateProfile({ charityId: charity._id });
      setUser(data);
      setIsModalOpen(false);
      success(`Supporting ${charity.name}!`);
    } catch (err) {
      error('Failed to update charity');
    }
  };

  const savePercentage = async (val) => {
    try {
      const { data } = await authService.updateProfile({ charityPercent: val });
      setUser(data);
      success('Impact allocation updated');
    } catch (err) {
      error('Failed to update percentage');
    }
  };

  const currentSelectedCharity = charities.find(c => c._id === user?.charityId) || { name: 'None Selected', logo: '' };

  return (
    <div className="bg-surface border border-border rounded-3xl p-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 text-secondary opacity-5 group-hover:rotate-6 transition-transform duration-700">
        <Heart size={100} fill="currentColor" />
      </div>

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-secondary/10 text-secondary">
            <Heart size={24} />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-text">Charity Partner</h3>
            <p className="text-xs text-muted font-body uppercase tracking-widest">Impact Allocation</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(true)}>
          Change Partner
        </Button>
      </div>

      <div className="flex items-center gap-6 p-6 rounded-2xl bg-bg border border-border mb-8 relative z-10">
        <div className="w-16 h-16 rounded-xl bg-surface border border-border flex items-center justify-center overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
          {user?.charityId ? (
            <img src={currentSelectedCharity.logo || 'https://images.unsplash.com/photo-1544027993-37dbfe43552e?auto=format&fit=crop&q=80&w=200'} alt="logo" className="w-full h-full object-cover" />
          ) : (
            <Heart size={24} className="text-muted/30" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-muted uppercase tracking-widest mb-1">Supporting</p>
          <p className="text-xl font-display font-bold text-text">{user?.charityName || 'No Charity Selected'}</p>
          <p className="text-xs text-primary font-bold mt-1">Impact: £{(25 * percentage / 100).toFixed(2)} / month</p>
        </div>
        <CheckCircle2 size={24} className={user?.charityId ? 'text-primary' : 'text-muted/20'} />
      </div>

      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between mb-2">
           <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-widest">
             <Sliders size={14} /> Donation Percentage
           </div>
           <span className="text-lg font-mono font-bold text-text">{percentage}%</span>
        </div>
        <input 
          type="range" 
          min="10" 
          max="100" 
          value={percentage} 
          onChange={(e) => setPercentage(Number(e.target.value))}
          onMouseUp={(e) => savePercentage(Number(e.target.value))}
          onTouchEnd={(e) => savePercentage(Number(e.target.value))}
          className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary" 
        />
        <div className="flex items-center justify-between text-[10px] text-muted font-bold uppercase tracking-tighter">
          <span>Min 10%</span>
          <div className="flex items-center gap-1 group/info px-2 py-0.5 rounded-full bg-border/20">
             <Info size={10} />
             <span>Impact Scale</span>
          </div>
          <span>Max 100%</span>
        </div>
      </div>

      {/* Charity Selection Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Choose a Charity Partner"
      >
        <div className="space-y-6">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input 
                type="text" 
                placeholder="Search charities..."
                className="w-full pl-10 pr-4 py-3 bg-bg border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>

           <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2">
             {isLoading ? <Loader /> : (
               charities.map((charity) => (
                 <button
                   key={charity._id}
                   onClick={() => handleCharitySelect(charity)}
                   className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-bg transition-all group/item text-left"
                 >
                   <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center overflow-hidden border border-border group-hover/item:border-primary/30">
                     <img src={charity.logo || 'https://images.unsplash.com/photo-1544027993-37dbfe43552e?auto=format&fit=crop&q=80&w=200'} alt="logo" className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1">
                      <p className="text-sm font-bold text-text">{charity.name}</p>
                      <p className="text-xs text-muted line-clamp-1">{charity.description}</p>
                   </div>
                   <ChevronRight size={18} className="text-muted group-hover/item:text-primary transition-colors translate-x-0 group-hover/item:translate-x-1" />
                 </button>
               ))
             )}
             {!isLoading && charities.length === 0 && (
               <p className="text-center text-muted py-8 italic">No charities found matching your search.</p>
             )}
           </div>
        </div>
      </Modal>
    </div>
  );
};

export default CharitySelector;
