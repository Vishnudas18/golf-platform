import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Filter, Edit2, Award, CreditCard, Heart, ChevronLeft, ChevronRight, Mail, Trash2 } from 'lucide-react';
import * as adminService from '../../services/adminService';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { useToast } from '../../hooks/useToast';
import { formatDate } from '../../utils/formatDate';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { success, error } = useToast();

  const [selectedUser, setSelectedUser] = useState(null);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [newScores, setNewScores] = useState(['', '', '', '', '']);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data } = await adminService.getAllUsers({ page, limit: 10, search: searchTerm });
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (err) {
      error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, searchTerm]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user? This action is irreversible.')) return;
    try {
      await adminService.deleteUser(id);
      success('User deleted');
      fetchUsers();
    } catch (err) {
      error('Delete failed');
    }
  };

  const handleScoreUpdate = async () => {
    const scores = newScores.map(Number);
    if (scores.some(isNaN)) {
      error('Please enter valid numbers for all 5 scores');
      return;
    }
    
    setIsUpdatingStatus(true);
    try {
      await adminService.editUserScore(selectedUser._id, scores);
      success('Scores updated successfully');
      setIsScoreModalOpen(false);
      fetchUsers();
    } catch (err) {
      error('Failed to update scores');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const openScoreModal = (user) => {
    setSelectedUser(user);
    setIsScoreModalOpen(true);
    setNewScores(['', '', '', '', '']);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-[2rem] bg-surface border border-border">
         <div>
            <h2 className="text-2xl font-display font-black text-text uppercase italic tracking-tighter">User Directory</h2>
            <p className="text-xs text-muted font-body uppercase tracking-widest mt-1">Platform Membership Base</p>
         </div>
         <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
               <input
                 type="text"
                 placeholder="Search by name/email..."
                 className="w-full pl-10 pr-4 py-2 bg-bg border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            <button className="p-2 rounded-xl bg-bg border border-border text-muted hover:text-text transition-all">
               <Filter size={20} />
            </button>
         </div>
      </div>

      <div className="overflow-x-auto rounded-[2rem] border border-border bg-surface">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="border-b border-border bg-bg/50">
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-widest">User Profile</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-widest">Access Level</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-widest">Subscription</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-widest">Impact</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-widest">Member Since</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-widest">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-border">
               {isLoading ? (
                 [1,2,3,4,5].map(i => (
                    <tr key={i} className="animate-pulse">
                       <td colSpan="6" className="px-6 py-8"><div className="h-4 bg-border rounded w-full" /></td>
                    </tr>
                 ))
               ) : (
                 users.map((user) => (
                    <tr key={user._id} className="group hover:bg-bg/50 transition-colors">
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-text font-bold text-xs uppercase shadow-inner border border-border">
                                {user.name.charAt(0)}
                             </div>
                             <div>
                                <p className="text-sm font-bold text-text mb-0.5">{user.name}</p>
                                <p className="text-xs text-muted flex items-center gap-1"><Mail size={10} /> {user.email}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <Badge variant={user.role === 'admin' ? 'danger' : 'info'} className="text-[10px] uppercase font-bold px-2 py-0.5">
                             {user.role}
                          </Badge>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                             <CreditCard size={14} className={user.stripeSubscriptionId ? 'text-primary' : 'text-muted'} />
                             <span className={`text-xs font-bold uppercase ${user.stripeSubscriptionId ? 'text-primary' : 'text-muted/50'}`}>
                                {user.stripeSubscriptionId ? 'ACTIVE' : 'FREE'}
                             </span>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase truncate max-w-[120px]">
                             <Heart size={12} className="text-danger" /> 
                             {user.charityId?.name || 'Unassigned'}
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <span className="text-xs text-muted font-mono">{formatDate(user.createdAt)}</span>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button 
                                onClick={() => openScoreModal(user)}
                                className="p-2 rounded-lg bg-bg border border-border text-muted hover:text-gold transition-all"
                                title="Edit Scores"
                             >
                                <Award size={14} />
                             </button>
                             <button className="p-2 rounded-lg bg-bg border border-border text-muted hover:text-primary transition-all">
                                <Edit2 size={14} />
                             </button>
                             <button onClick={() => handleDelete(user._id)} className="p-2 rounded-lg bg-bg border border-border text-muted hover:text-danger transition-all">
                                <Trash2 size={14} />
                             </button>
                          </div>
                       </td>
                    </tr>
                 ))
               )}
            </tbody>
         </table>
      </div>

      <div className="flex items-center justify-between px-8 py-4 rounded-[2rem] bg-surface border border-border">
         <p className="text-xs text-muted">Showing {(page-1)*10+1} - {Math.min(page*10, users.length)} of {totalPages*10} users</p>
         <div className="flex items-center gap-4">
            <button
               onClick={() => setPage(p => Math.max(1, p - 1))}
               disabled={page === 1}
               className="p-2 rounded-xl bg-bg border border-border text-muted hover:text-primary disabled:opacity-30 transition-all shadow-inner"
            >
               <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-bold text-text">{page}</span>
            <button
               onClick={() => setPage(p => Math.min(totalPages, p + 1))}
               disabled={page === totalPages}
               className="p-2 rounded-xl bg-bg border border-border text-muted hover:text-primary disabled:opacity-30 transition-all shadow-inner"
            >
               <ChevronRight size={20} />
            </button>
         </div>
      </div>

      <AnimatePresence>
        {isScoreModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-surface border border-border rounded-[3rem] p-10 shadow-3xl"
            >
              <h3 className="text-2xl font-display font-black text-text uppercase italic tracking-tighter mb-2">Edit Golf Scores</h3>
              <p className="text-xs text-muted font-body uppercase tracking-[0.2em] mb-8">Manage numbers for {selectedUser?.name}</p>

              <div className="grid grid-cols-5 gap-4 mb-10">
                {newScores.map((score, idx) => (
                  <div key={idx} className="space-y-2">
                    <label className="text-[10px] font-bold text-muted uppercase block text-center">#{idx + 1}</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={score}
                      onChange={(e) => {
                        const updated = [...newScores];
                        updated[idx] = e.target.value;
                        setNewScores(updated);
                      }}
                      className="w-full bg-bg border border-border rounded-xl p-3 text-center font-mono font-bold text-xl focus:ring-1 focus:ring-primary/50 text-text outline-none"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Button variant="primary" className="flex-1 uppercase font-black tracking-widest" onClick={handleScoreUpdate} isLoading={isUpdatingStatus}>
                  Update Scores
                </Button>
                <Button variant="ghost" className="flex-1 uppercase font-black tracking-widest" onClick={() => setIsScoreModalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManager;
