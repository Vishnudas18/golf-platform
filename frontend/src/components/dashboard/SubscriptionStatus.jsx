import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Rocket, Calendar, ShieldCheck, ArrowUpRight, Ban, CheckCircle2, AlertCircle } from 'lucide-react';
import { useSubscription } from '../../hooks/useSubscription';
import { formatDate } from '../../utils/formatDate';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import { useToast } from '../../hooks/useToast';
import api from '../../services/api';

const SubscriptionStatus = () => {
  const { subscription, isActive, plan, renewalDate, isLoading, setSubscription } = useSubscription();
  const { success, error } = useToast();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      const { data } = await api.post('/subscriptions/cancel');
      setSubscription(data.data);
      success('Subscription cancelled (expires at period end)');
      setIsCancelModalOpen(false);
    } catch (err) {
      error('Failed to cancel subscription');
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading || !subscription) {
    return (
      <div className="bg-surface border border-border rounded-3xl p-8 animate-pulse">
        <div className="h-6 w-32 bg-border rounded-full mb-6" />
        <div className="h-20 w-full bg-border rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-3xl p-8 relative overflow-hidden group">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-8 text-primary opacity-5 -rotate-6 group-hover:rotate-0 transition-transform duration-700">
        <CreditCard size={100} />
      </div>

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary">
            <Rocket size={24} />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-text">Your Membership</h3>
            <p className="text-xs text-muted font-body uppercase tracking-widest">{subscription?.currency?.toUpperCase() || 'GBP'} Billing</p>
          </div>
        </div>
        <Badge variant={isActive ? 'success' : 'danger'}>
          {isActive ? 'ACTIVE' : 'INACTIVE'}
        </Badge>
      </div>

      <div className="space-y-6 relative z-10">
        <div className="p-5 rounded-2xl bg-bg border border-border flex items-center justify-between group/card hover:border-primary/30 transition-all duration-300">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center text-primary shadow-inner">
               <ShieldCheck size={24} />
             </div>
             <div>
               <p className="text-sm font-bold text-text capitalize">{plan || 'No Plan'}</p>
               <p className="text-xs text-muted">Billed {plan === 'yearly' ? 'annually' : 'monthly'}</p>
             </div>
          </div>
          <p className="text-lg font-mono font-bold text-text">£{subscription.amount / 100}</p>
        </div>

        <div className="flex items-center gap-6 px-1">
          <div className="flex flex-col gap-1 flex-1">
             <div className="flex items-center gap-2 text-[10px] font-bold text-muted uppercase tracking-widest">
               <Calendar size={12} /> Renewal Date
             </div>
             <p className="text-sm font-mono font-medium text-text">{formatDate(renewalDate)}</p>
          </div>
          <div className="flex flex-col gap-1 flex-1">
             <div className="flex items-center gap-2 text-[10px] font-bold text-muted uppercase tracking-widest">
               <CreditCard size={12} /> Status
             </div>
             <p className={`text-sm font-mono font-medium ${isActive ? 'text-primary' : 'text-danger'}`}>
               {isActive ? 'Running' : 'Needs Action'}
             </p>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
          {!isActive && (
            <Button 
              variant="primary" 
              className="w-full sm:w-auto px-10 group"
              onClick={() => window.location.href = '/subscribe'}
            >
              Get Full Access
              <ArrowUpRight size={16} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          )}
          {plan === 'monthly' && (
            <Button variant="primary" className="w-full sm:w-auto px-10 group bg-primary/20 text-primary hover:bg-primary shadow-none hover:text-bg">
              Upgrade to Yearly
              <ArrowUpRight size={16} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          )}
          {isActive && !subscription.cancelAtPeriodEnd ? (
            <button
              onClick={() => setIsCancelModalOpen(true)}
              className="text-xs font-bold text-muted hover:text-danger hover:underline transition-all uppercase tracking-widest"
            >
              Cancel Membership
            </button>
          ) : subscription.cancelAtPeriodEnd ? (
            <div className="flex items-center gap-2 text-xs font-bold text-danger uppercase tracking-widest leading-none">
               <AlertCircle size={14} /> Cancels at period end
            </div>
          ) : null}
        </div>
      </div>

      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Cancel Membership"
      >
        <div className="space-y-6">
           <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 flex gap-4 text-danger">
              <Ban size={24} className="shrink-0" />
              <p className="text-sm font-medium font-body leading-relaxed leading-relaxed">
                We'll be sorry to see you go! You will lose access to monthly draws and charity impact tracking at the end of your current cycle.
              </p>
           </div>
           <div className="flex flex-col gap-3">
             <Button variant="danger" className="w-full" isLoading={isCancelling} onClick={handleCancelSubscription}>
                Confirm Cancellation
             </Button>
             <Button variant="ghost" className="w-full" onClick={() => setIsCancelModalOpen(false)}>
                Keep My Membership
             </Button>
           </div>
        </div>
      </Modal>
    </div>
  );
};

export default SubscriptionStatus;
