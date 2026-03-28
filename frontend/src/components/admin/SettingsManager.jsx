import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, RefreshCw, BarChart, Percent, ShieldCheck, Info } from 'lucide-react';
import * as adminService from '../../services/adminService';
import Button from '../common/Button';
import { useToast } from '../../hooks/useToast';

const SettingsManager = () => {
  const [settings, setSettings] = useState({
    drawLogic: 'random',
    jackpotPercentage: 50,
    fourMatchPercentage: 30,
    threeMatchPercentage: 20,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { success, error } = useToast();

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const { data } = await adminService.getSettings();
      setSettings(data);
    } catch (err) {
      error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: name.includes('Percentage') ? Number(value) : value,
    }));
  };

  const handleSave = async () => {
    if (settings.jackpotPercentage + settings.fourMatchPercentage + settings.threeMatchPercentage !== 100) {
      error('Total prize pool percentages must equal 100%');
      return;
    }

    setIsSaving(true);
    try {
      await adminService.updateSettings(settings);
      success('Global settings updated successfully');
    } catch (err) {
      error('Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw size={32} className="text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between p-8 rounded-[2rem] bg-surface border border-border">
         <div>
            <h2 className="text-2xl font-display font-black text-text uppercase italic tracking-tighter text-gold">Global Configuration</h2>
            <p className="text-xs text-muted font-body uppercase tracking-widest mt-1">Platform Rules & Draw Logic</p>
         </div>
         <Button variant="primary" size="md" onClick={handleSave} isLoading={isSaving}>
            <Save size={18} className="mr-2" /> 
            Save Configuration
         </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Draw Logic */}
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-[2.5rem] bg-surface border border-border flex flex-col h-full"
         >
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 shadow-xl border border-primary/20">
               <BarChart size={24} />
            </div>
            <h3 className="text-xl font-display font-black text-text uppercase italic tracking-tighter mb-4">Draw Algorithm</h3>
            <p className="text-sm text-muted font-body mb-8 leading-relaxed">
               Select how the monthly winning numbers are generated. Weighted mode considers user activity and scores.
            </p>
            
            <div className="space-y-4 mt-auto">
               <label className={`flex items-center gap-4 p-5 rounded-3xl border transition-all cursor-pointer ${
                  settings.drawLogic === 'random' ? 'bg-bg border-primary shadow-2xl ring-1 ring-primary/20' : 'bg-bg/30 border-border opacity-60'
               }`}>
                  <input 
                    type="radio" 
                    name="drawLogic" 
                    value="random" 
                    checked={settings.drawLogic === 'random'} 
                    onChange={handleChange}
                    className="hidden" 
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                     settings.drawLogic === 'random' ? 'border-primary' : 'border-muted'
                  }`}>
                     {settings.drawLogic === 'random' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                  <div>
                     <p className="text-sm font-bold text-text uppercase tracking-widest">Pure Random</p>
                     <p className="text-[10px] text-muted font-medium">Standard 5/100 RNG</p>
                  </div>
               </label>

               <label className={`flex items-center gap-4 p-5 rounded-3xl border transition-all cursor-pointer ${
                  settings.drawLogic === 'weighted' ? 'bg-bg border-secondary shadow-2xl ring-1 ring-secondary/20' : 'bg-bg/30 border-border opacity-60'
               }`}>
                  <input 
                    type="radio" 
                    name="drawLogic" 
                    value="weighted" 
                    checked={settings.drawLogic === 'weighted'} 
                    onChange={handleChange}
                    className="hidden" 
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                     settings.drawLogic === 'weighted' ? 'border-secondary' : 'border-muted'
                  }`}>
                     {settings.drawLogic === 'weighted' && <div className="w-2.5 h-2.5 rounded-full bg-secondary" />}
                  </div>
                  <div>
                     <p className="text-sm font-bold text-text uppercase tracking-widest text-secondary">Smart Algorithm</p>
                     <p className="text-[10px] text-muted font-medium">Weighted by Score Performance</p>
                  </div>
               </label>
            </div>
         </motion.div>

         {/* Prize Distribution */}
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-[2.5rem] bg-surface border border-border h-full"
         >
            <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-6 shadow-xl border border-gold/20">
               <Percent size={24} />
            </div>
            <h3 className="text-xl font-display font-black text-text uppercase italic tracking-tighter mb-4">Prize Pool Distribution</h3>
            <p className="text-sm text-muted font-body mb-8 leading-relaxed">
               Allocate how the total prize pool is split between match tiers.
            </p>

            <div className="space-y-6">
               <div className="space-y-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Jackpot (5 Matches)</label>
                    <span className="text-sm font-mono font-black text-gold">{settings.jackpotPercentage}%</span>
                  </div>
                  <input 
                    type="range" 
                    name="jackpotPercentage" 
                    min="0" max="100" 
                    value={settings.jackpotPercentage} 
                    onChange={handleChange}
                    className="w-full accent-gold bg-bg h-2 rounded-lg appearance-none cursor-pointer"
                  />
               </div>

               <div className="space-y-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">4 Tier Pool</label>
                    <span className="text-sm font-mono font-black text-primary">{settings.fourMatchPercentage}%</span>
                  </div>
                  <input 
                    type="range" 
                    name="fourMatchPercentage" 
                    min="0" max="100" 
                    value={settings.fourMatchPercentage} 
                    onChange={handleChange}
                    className="w-full accent-primary bg-bg h-2 rounded-lg appearance-none cursor-pointer"
                  />
               </div>

               <div className="space-y-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">3 Tier Pool</label>
                    <span className="text-sm font-mono font-black text-secondary">{settings.threeMatchPercentage}%</span>
                  </div>
                  <input 
                    type="range" 
                    name="threeMatchPercentage" 
                    min="0" max="100" 
                    value={settings.threeMatchPercentage} 
                    onChange={handleChange}
                    className="w-full accent-secondary bg-bg h-2 rounded-lg appearance-none cursor-pointer"
                  />
               </div>

               <div className={`mt-6 p-4 rounded-2xl flex items-center gap-3 border ${
                  settings.jackpotPercentage + settings.fourMatchPercentage + settings.threeMatchPercentage === 100 
                  ? 'bg-success/10 border-success/20 text-success text-[10px]' 
                  : 'bg-danger/10 border-danger/20 text-danger text-[10px]'
               }`}>
                  {settings.jackpotPercentage + settings.fourMatchPercentage + settings.threeMatchPercentage === 100 ? (
                    <ShieldCheck size={14} />
                  ) : (
                    <Info size={14} />
                  )}
                  <span className="uppercase font-black font-display tracking-widest">
                    TOTAL ALLOCATION: {settings.jackpotPercentage + settings.fourMatchPercentage + settings.threeMatchPercentage}% / 100%
                  </span>
               </div>
            </div>
         </motion.div>
      </div>

      <div className="p-8 rounded-[2.5rem] bg-surface border border-border flex items-start gap-6 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-10 text-primary opacity-5 group-hover:scale-110 transition-transform duration-1000">
            <Settings size={140} />
         </div>
         <div className="w-12 h-12 rounded-xl bg-bg border border-border flex items-center justify-center text-muted shrink-0">
            <Info size={20} />
         </div>
         <div className="relative z-10">
            <h4 className="text-sm font-display font-black text-text uppercase italic tracking-tighter mb-2">Audit Information</h4>
            <p className="text-xs text-muted leading-relaxed font-body max-w-2xl">
               Changes to the Draw Algorithm or Prize Distribution will take effect from the NEXT simulation. 
               Past draws and distributed prizes will not be affected by these settings.
               Last system config update: <span className="text-gold font-mono uppercase">{settings.updatedAt ? new Date(settings.updatedAt).toLocaleDateString() : 'N/A'}</span>
            </p>
         </div>
      </div>
    </div>
  );
};

export default SettingsManager;
