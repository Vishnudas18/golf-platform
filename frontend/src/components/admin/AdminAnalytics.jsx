import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Heart, Trophy, CreditCard, ArrowUpRight, ArrowDownRight, Activity, Zap, PieChart } from 'lucide-react';
import * as adminService from '../../services/adminService';
import { formatCurrency } from '../../utils/formatDate';
import Loader from '../common/Loader';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await adminService.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading) return <Loader />;

  // Provide default values if analytics data is not yet available or failed to fetch
  const stats = [
    {
      label: 'Gross Revenue',
      value: formatCurrency(analytics?.totalRevenue || 0),
      trend: '+0%',
      up: true,
      icon: CreditCard,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Active Players',
      value: (analytics?.activeSubscribers || 0).toLocaleString(),
      trend: '+0%',
      up: true,
      icon: Users,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
    },
    {
      label: 'Total Impact',
      value: formatCurrency(analytics?.totalImpact || 0),
      trend: '+0%',
      up: true,
      icon: Heart,
      color: 'text-danger',
      bg: 'bg-danger/10',
    },
    {
      label: 'Prize Payouts',
      value: formatCurrency(analytics?.totalPrizePaid || 0),
      trend: '+0%',
      up: true,
      icon: Trophy,
      color: 'text-gold',
      bg: 'bg-gold/10',
    },
  ];

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between p-8 rounded-[2rem] bg-surface border border-border">
         <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
               <Activity size={24} className="animate-pulse" />
            </div>
            <div>
               <h2 className="text-2xl font-display font-black text-text uppercase italic tracking-tighter">Platform Intelligence</h2>
               <p className="text-xs text-muted font-body uppercase tracking-widest mt-1">Real-time Performance Metrics</p>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <button className="px-6 py-3 rounded-xl bg-bg border border-border text-xs font-bold text-muted uppercase tracking-widest hover:text-text hover:border-primary transition-all">Export Report</button>
            <button className="px-6 py-3 rounded-xl bg-primary text-bg text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20">Live Sync</button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {stats.map((stat, idx) => (
           <motion.div
             key={idx}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: idx * 0.1 }}
             className="p-8 rounded-[2.5rem] bg-surface border border-border group hover:border-primary/30 transition-all duration-300 relative overflow-hidden shadow-xl"
           >
              <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity`}>
                 <stat.icon size={80} />
              </div>
              <div className="flex items-center justify-between mb-6 relative z-10">
                 <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shadow-inner`}>
                    <stat.icon size={24} />
                 </div>
                 <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${stat.up ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-danger/10 text-danger border border-danger/20'}`}>
                    {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {stat.trend}
                 </div>
              </div>
              <p className="text-xs font-bold text-muted uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-mono font-black text-text italic group-hover:text-primary transition-colors italic">
                 {stat.value}
              </p>
           </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="p-10 rounded-[3rem] bg-surface border border-border shadow-2xl relative overflow-hidden group">
            <h3 className="text-xl font-display font-bold text-text mb-8 flex items-center justify-between">
               Revenue Progression
               <BarChart3 size={20} className="text-muted" />
            </h3>
            <div className="h-[240px] flex items-end justify-between gap-4 px-4 overflow-hidden">
               {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
                 <motion.div
                   key={i}
                   initial={{ height: 0 }}
                   animate={{ height: `${h}%` }}
                   transition={{ delay: i * 0.05, duration: 1 }}
                   className="w-full bg-gradient-to-t from-primary/20 to-primary group-hover:to-gold transition-all duration-700 rounded-t-lg relative"
                 >
                    <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-30 transition-opacity" />
                 </motion.div>
               ))}
            </div>
            <div className="flex items-center justify-between mt-6 px-1 text-[10px] font-bold text-muted uppercase tracking-widest">
               <span>Jan</span>
               <span>Jun</span>
               <span>Dec</span>
            </div>
         </div>

         <div className="p-10 rounded-[3rem] bg-surface border border-border shadow-2xl relative overflow-hidden group">
            <h3 className="text-xl font-display font-bold text-text mb-8 flex items-center justify-between">
               Impact Distribution
               <PieChart size={20} className="text-muted" />
            </h3>
            <div className="space-y-6">
               {[
                 { label: 'Oceans Recovery', value: 45, color: 'bg-primary' },
                 { label: 'Reforestation', value: 30, color: 'bg-secondary' },
                 { label: 'Tech Education', value: 15, color: 'bg-danger' },
                 { label: 'Others', value: 10, color: 'bg-gold' },
               ].map((item, i) => (
                 <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                       <span className="text-muted">{item.label}</span>
                       <span className="text-text italic">{item.value}%</span>
                    </div>
                    <div className="h-2 w-full bg-bg border border-border rounded-full p-0.5 overflow-hidden">
                       <motion.div
                         initial={{ width: 0 }}
                         animate={{ width: `${item.value}%` }}
                         className={`h-full rounded-full ${item.color}`}
                       />
                    </div>
                 </div>
               ))}
            </div>
            <div className="mt-8 pt-8 border-t border-border flex items-center justify-between gap-2">
               <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg border border-border text-xs font-bold text-muted group-hover:text-primary transition-colors">
                  <Zap size={14} className="text-primary" /> Multi-sector Reach
               </div>
               <p className="text-[10px] text-muted italic font-body uppercase tracking-tighter opacity-50 px-2 leading-none">Automated Breakdown</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
