import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Sidebar from '../components/layout/Sidebar';
import DrawManager from '../components/admin/DrawManager';
import CharityManager from '../components/admin/CharityManager';
import UserManager from '../components/admin/UserManager';
import WinnerAuditor from '../components/admin/WinnerAuditor';
import AdminAnalytics from '../components/admin/AdminAnalytics';
import SettingsManager from '../components/admin/SettingsManager';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, BarChart3, Users, Trophy, Heart, Activity, Settings, Bell, Search, Menu, X } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'analytics', name: 'Platform Intelligence', icon: BarChart3, color: 'text-primary' },
    { id: 'users', name: 'Member Directory', icon: Users, color: 'text-secondary' },
    { id: 'draws', name: 'Draw Console', icon: Trophy, color: 'text-gold' },
    { id: 'charities', name: 'Impact Hub', icon: Heart, color: 'text-danger' },
    { id: 'winners', name: 'Audit & Payouts', icon: ShieldCheck, color: 'text-primary' },
    { id: 'settings', name: 'Global Config', icon: Settings, color: 'text-gold' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics': return <AdminAnalytics />;
      case 'users': return <UserManager />;
      case 'draws': return <DrawManager />;
      case 'charities': return <CharityManager />;
      case 'winners': return <WinnerAuditor />;
      case 'settings': return <SettingsManager />;
      default: return <AdminAnalytics />;
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
         {/* Desktop Sidebar */}
         <aside className="hidden lg:block w-80 bg-surface border-r border-border p-8 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto">
            <div className="flex items-center gap-3 mb-10 px-2 py-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
               <ShieldCheck size={24} className="animate-pulse" />
               <h2 className="text-xl font-display font-black uppercase italic tracking-tighter">System Root</h2>
            </div>

            <nav className="space-y-4">
               {menuItems.map((item) => (
                 <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-4 p-5 rounded-3xl border transition-all duration-300 group ${
                       activeTab === item.id 
                        ? 'bg-bg border-border text-text shadow-2xl shadow-black/40 ring-1 ring-white/10' 
                        : 'border-transparent text-muted hover:text-text hover:bg-bg/50'
                    }`}
                 >
                    <div className={`p-3 rounded-2xl transition-all ${
                       activeTab === item.id ? 'bg-surface shadow-inner ' + item.color : 'bg-surface/50 opacity-50 group-hover:opacity-100'
                    }`}>
                       <item.icon size={20} />
                    </div>
                    <span className="text-sm font-bold tracking-widest uppercase font-display leading-none">{item.name}</span>
                 </button>
               ))}
            </nav>

            <div className="mt-20 pt-10 border-t border-border space-y-4">
               <button 
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${
                     activeTab === 'settings' ? 'bg-bg text-gold shadow-lg shadow-gold/10' : 'text-muted hover:text-text hover:bg-bg'
                  }`}
               >
                  <Settings size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest leading-none">Global Config</span>
               </button>
               <button className="w-full flex items-center gap-3 p-4 text-muted hover:text-text hover:bg-bg rounded-2xl transition-all">
                  <Bell size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest leading-none">Notification Log</span>
               </button>
            </div>
         </aside>

         {/* Mobile Menu Trigger */}
         <div className="lg:hidden p-4 border-b border-border bg-surface flex items-center justify-between">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-xl bg-bg border border-border text-muted">
               <Menu size={24} />
            </button>
            <h2 className="text-lg font-display font-black uppercase italic text-text tracking-tighter">Admin Dashboard</h2>
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
               <ShieldCheck size={20} />
            </div>
         </div>

         {/* Mobile Sidebar Overlay */}
         <AnimatePresence>
            {isSidebarOpen && (
               <motion.div
                 initial={{ x: '-100%' }}
                 animate={{ x: 0 }}
                 exit={{ x: '-100%' }}
                 className="fixed inset-0 z-[100] lg:hidden bg-bg/95 backdrop-blur-xl p-8 overflow-y-auto"
               >
                  <div className="flex items-center justify-between mb-12">
                     <div className="flex items-center gap-3 text-primary">
                        <ShieldCheck size={28} />
                        <h2 className="text-2xl font-display font-black uppercase italic tracking-tighter">System Root</h2>
                     </div>
                     <button onClick={() => setIsSidebarOpen(false)} className="p-3 rounded-xl bg-surface border border-border text-muted">
                        <X size={24} />
                     </button>
                  </div>
                  <nav className="space-y-4">
                     {menuItems.map((item) => (
                       <button
                          key={item.id}
                          onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                          className={`w-full flex items-center gap-6 p-6 rounded-3xl border ${
                             activeTab === item.id ? 'bg-surface border-primary/30 text-text' : 'border-transparent text-muted'
                          }`}
                       >
                          <item.icon size={24} className={activeTab === item.id ? item.color : ''} />
                          <span className="text-lg font-display font-black uppercase tracking-widest">{item.name}</span>
                       </button>
                     ))}
                  </nav>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Main Content Area */}
         <main className="flex-1 p-8 lg:p-12 pb-24 overflow-x-hidden relative">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
            
            <motion.div
              layout
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative z-10"
            >
               {renderContent()}
            </motion.div>
         </main>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
