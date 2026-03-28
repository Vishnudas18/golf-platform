import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Search, Filter, CheckCircle2, XCircle, Clock, Trash2, Eye, Download, Info, Check, X, FileText, Ban } from 'lucide-react';
import * as adminService from '../../services/adminService';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import { formatCurrency, formatDate } from '../../utils/formatDate';
import { useToast } from '../../hooks/useToast';

const WinnerAuditor = () => {
  const [winners, setWinners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWinner, setSelectedWinner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { success, error, info } = useToast();

  const fetchWinners = async () => {
    setIsLoading(true);
    try {
      const { data } = await adminService.getAllWinners();
      setWinners(data);
    } catch (err) {
      error('Failed to load winners');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWinners();
  }, []);

  const handleVerify = async (id, status) => {
    setIsVerifying(true);
    try {
      await adminService.verifyWinner(id, { verificationStatus: status });
      success(`Winner ${status === 'verified' ? 'verified' : 'rejected'}`);
      setIsModalOpen(false);
      fetchWinners();
    } catch (err) {
      error('Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleMarkPayout = async (id) => {
    try {
       await adminService.markPayout(id);
       success('Payout marked as paid');
       fetchWinners();
    } catch (err) {
       error('Payout update failed');
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-[2rem] bg-surface border border-border">
         <div>
            <h2 className="text-2xl font-display font-black text-text uppercase italic tracking-tighter">Winner Auditing</h2>
            <p className="text-xs text-muted font-body uppercase tracking-widest mt-1">Proof Verification & Payouts</p>
         </div>
         <div className="flex items-center gap-4">
            <button className="p-3 rounded-xl bg-bg border border-border text-muted hover:text-primary transition-all shadow-inner">
               <Download size={20} />
            </button>
            <Badge variant="gold" className="text-[10px] py-1 px-3">PENDING: {winners.filter(w => w.verificationStatus === 'pending').length}</Badge>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {isLoading ? (
           [1,2,3].map(i => <div key={i} className="h-48 rounded-[2.5rem] bg-surface border border-border animate-pulse" />)
         ) : (
           winners.map((winner, idx) => (
             <motion.div
               key={winner._id}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: idx * 0.1 }}
               className={`p-6 rounded-[2.5rem] border bg-surface group relative overflow-hidden flex flex-col transition-all duration-300 ${
                 winner.verificationStatus === 'verified' ? 'border-primary/20 hover:border-primary/50' : 'border-border hover:border-gold/30'
               }`}
             >
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-bg border border-border flex items-center justify-center text-text font-bold text-xs">
                         {winner.userId?.name?.charAt(0) || '?'}
                      </div>
                      <div>
                         <p className="text-sm font-bold text-text truncate max-w-[100px]">{winner.userId?.name || 'Unknown'}</p>
                         <p className="text-[10px] text-muted font-mono">{formatDate(winner.createdAt)}</p>
                      </div>
                   </div>
                   <Badge variant={winner.verificationStatus === 'verified' ? 'success' : winner.verificationStatus === 'rejected' ? 'danger' : 'gold'} className="text-[8px] py-0 px-1">
                      {winner.verificationStatus.toUpperCase()}
                   </Badge>
                </div>

                <div className="p-4 rounded-2xl bg-bg/50 border border-border mb-6">
                   <div className="flex items-center justify-between mb-1">
                      <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Prize Won</p>
                      <Badge variant="info" className="text-[8px] py-0 px-1">{winner.matchType.toUpperCase()}</Badge>
                   </div>
                   <p className="text-2xl font-mono font-black text-text italic">
                      {formatCurrency(winner.prizeAmount)}
                   </p>
                </div>

                <div className="mt-auto flex items-center gap-3">
                   <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1 text-xs border-border/50 group-hover:border-primary/30"
                      onClick={() => { setSelectedWinner(winner); setIsModalOpen(true); }}
                   >
                     <Eye size={14} className="mr-2" /> Audit Proof
                   </Button>
                   {winner.verificationStatus === 'verified' && winner.paymentStatus !== 'paid' && (
                     <button
                        onClick={() => handleMarkPayout(winner._id)}
                        className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-bg transition-colors shadow-2xl shadow-primary/20"
                     >
                        <ShieldCheck size={18} />
                     </button>
                   )}
                </div>
             </motion.div>
           ))
         )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Winner Audit & Payout"
      >
        {selectedWinner && (
          <div className="space-y-6">
             <div className="flex items-center gap-6 p-6 rounded-2xl bg-bg border border-border">
                <div className="flex-1">
                   <p className="text-[10px] font-bold text-muted uppercase tracking-widest leading-none mb-1">Authenticated Winner</p>
                   <p className="text-xl font-display font-bold text-text">{selectedWinner.userId?.name}</p>
                   <p className="text-xs text-muted font-mono">{selectedWinner.userId?.email}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold text-muted uppercase tracking-widest leading-none mb-1">Prize Claim</p>
                   <p className="text-3xl font-mono font-black text-gold italic">{formatCurrency(selectedWinner.prizeAmount)}</p>
                </div>
             </div>

             <div>
                <p className="text-xs font-bold text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                  <FileText size={14} className="text-primary" /> Submitted Proof
                </p>
                <div className="aspect-[16/9] rounded-2xl bg-bg border border-border flex items-center justify-center overflow-hidden group/proof relative">
                   {selectedWinner.proofUrl ? (
                     <>
                       <img src={selectedWinner.proofUrl} alt="Score Proof" className="w-full h-full object-cover transition-transform duration-700 group-hover/proof:scale-110" />
                       <div className="absolute inset-0 bg-bg/50 backdrop-blur-sm opacity-0 group-hover/proof:opacity-100 transition-opacity flex items-center justify-center">
                          <button className="p-4 rounded-full bg-primary text-bg shadow-2xl">
                             <Download size={24} />
                          </button>
                       </div>
                     </>
                   ) : (
                     <div className="flex flex-col items-center gap-3 text-muted/30">
                        <Ban size={48} />
                        <p className="text-xs font-bold font-display px-6 text-center">NO PROOF UPLOADED YET</p>
                     </div>
                   )}
                </div>
             </div>

             <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20 flex gap-4 text-secondary text-xs italic opacity-80 leading-relaxed px-6">
                <Info size={16} className="shrink-0 mt-0.5" />
                Please verify that the submitted scorecard matches the drawn numbers and belongs to the correct user before approving.
             </div>

             <div className="flex items-center gap-4 border-t border-border pt-6">
                <Button 
                   variant="primary" 
                   className="flex-1 bg-primary text-bg hover:bg-primary shadow-2xl shadow-primary/20"
                   isLoading={isVerifying}
                   onClick={() => handleVerify(selectedWinner._id, 'verified')}
                >
                   <Check size={18} className="mr-2" /> Approve
                </Button>
                <Button 
                  variant="ghost" 
                  className="flex-1 text-danger border-danger/20 hover:bg-danger/10 hover:border-danger/50"
                  isLoading={isVerifying}
                  onClick={() => handleVerify(selectedWinner._id, 'rejected')}
                >
                   <X size={18} className="mr-2" /> Reject
                </Button>
             </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default WinnerAuditor;
