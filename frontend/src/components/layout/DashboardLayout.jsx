import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useSubscription } from '../../hooks/useSubscription';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
  const { isActive, subscription, isLoading } = useSubscription();

  const isExpiringSoon = () => {
    if (!subscription?.currentPeriodEnd) return false;
    const end = new Date(subscription.currentPeriodEnd);
    const now = new Date();
    const diff = end - now;
    const days = diff / (1000 * 60 * 60 * 24);
    return days > 0 && days < 7;
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Navbar />
      
      {/* Sub status banner */}
      {!isLoading && !isActive && (
        <div className="bg-danger/10 border-b border-danger/20 py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-danger">
              <AlertCircle size={18} />
              <span className="text-sm font-bold">Subscription Inactive</span>
              <span className="hidden sm:inline text-xs opacity-75">
                Renew now to participate in this month's draw.
              </span>
            </div>
            <Link 
              to="/subscribe" 
              className="group flex items-center gap-2 text-sm font-bold text-danger hover:underline transition-all"
            >
              Get Subscription
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      )}

      {isActive && isExpiringSoon() && (
        <div className="bg-gold/10 border-b border-gold/20 py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-gold">
            <div className="flex items-center gap-2 font-bold text-sm">
              <AlertCircle size={18} />
              <span>Subscription expiring in less than 7 days.</span>
            </div>
            <Link to="/settings" className="flex items-center gap-2 text-sm underline font-bold">
              Manage Billing
            </Link>
          </div>
        </div>
      )}

      <main className="flex-grow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardLayout;
