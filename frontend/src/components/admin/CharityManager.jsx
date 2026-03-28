import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Plus, Edit2, Trash2, Globe, ArrowRight, ExternalLink, Image as ImageIcon, CheckCircle2, X } from 'lucide-react';
import * as adminService from '../../services/adminService';
import * as charityService from '../../services/charityService';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import { useToast } from '../../hooks/useToast';
import { formatCurrency } from '../../utils/formatDate';

const CharityManager = () => {
  const [charities, setCharities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCharity, setEditingCharity] = useState(null);
  const { success, error } = useToast();

  const fetchCharities = async () => {
    setIsLoading(true);
    try {
      const { data } = await charityService.getAllCharities();
      setCharities(data);
    } catch (err) {
      error('Failed to load charities');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCharities();
  }, []);

  const handleEdit = (charity) => {
    setEditingCharity(charity);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setEditingCharity(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this charity? All associated data will be removed.')) return;
    try {
      await adminService.deleteCharity(id);
      success('Charity removed successfully');
      fetchCharities();
    } catch (err) {
      error('Delete failed');
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      if (editingCharity) {
        await adminService.updateCharity(editingCharity._id, formData);
        success('Charity updated successfully');
      } else {
        await adminService.addCharity(formData);
        success('New charity partner added');
      }
      setIsModalOpen(false);
      fetchCharities();
    } catch (err) {
      error('Operation failed');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between p-8 rounded-[2rem] bg-surface border border-border">
         <div>
            <h2 className="text-2xl font-display font-black text-text uppercase italic tracking-tighter">Impact Hub</h2>
            <p className="text-xs text-muted font-body uppercase tracking-widest mt-1">Manage Charity Partners</p>
         </div>
         <Button variant="primary" size="md" onClick={handleNew}>
            <Plus size={18} className="mr-2" /> 
            Add New Partner
         </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {isLoading ? (
           [1,2,3].map(i => (
             <div key={i} className="h-64 rounded-[2.5rem] bg-surface border border-border animate-pulse" />
           ))
         ) : (
           charities.map((charity) => (
             <motion.div
               key={charity._id}
               whileHover={{ y: -5 }}
               className="p-6 rounded-[2.5rem] bg-surface border border-border group relative overflow-hidden flex flex-col transition-all duration-300 hover:border-primary/50"
             >
                <div className="flex items-center gap-4 mb-6 relative z-10">
                   <div className="w-16 h-16 rounded-2xl bg-bg border border-border overflow-hidden p-1 flex items-center justify-center group-hover:bg-primary/10 transition-all">
                      <img src={charity.logo || 'https://images.unsplash.com/photo-1544027993-37dbfe43552e?auto=format&fit=crop&q=80&w=200'} alt="logo" className="w-full h-full object-cover rounded-xl" />
                   </div>
                   <div className="flex-1">
                      <h3 className="text-lg font-display font-bold text-text truncate">{charity.name}</h3>
                      <p className="text-xs text-muted font-body truncate">{charity.website}</p>
                   </div>
                   <div className="flex flex-col gap-2">
                      <button onClick={() => handleEdit(charity)} className="p-2 rounded-lg bg-bg border border-border text-muted hover:text-primary transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(charity._id)} className="p-2 rounded-lg bg-bg border border-border text-muted hover:text-danger transition-colors">
                        <Trash2 size={16} />
                      </button>
                   </div>
                </div>

                <div className="p-4 rounded-2xl bg-bg/50 border border-border mb-6">
                   <div className="flex items-center justify-between mb-2">
                     <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Lifetime Impact</p>
                     <p className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">LIVE</p>
                   </div>
                   <p className="text-2xl font-mono font-black text-text italic">
                     {formatCurrency(charity.totalReceived)}
                   </p>
                </div>

                <div className="mt-auto flex items-center justify-between gap-4">
                   <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-widest">
                      <ExternalLink size={14} className="text-secondary" />
                      View Profile
                   </div>
                   {charity.isFeatured && (
                     <Badge variant="gold" className="text-[8px] py-0 px-1">FEATURED</Badge>
                   )}
                </div>
             </motion.div>
           ))
         )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCharity ? 'Update Charity' : 'Add Charity Partner'}
      >
        <form onSubmit={onSubmit} className="space-y-6">
           <div className="grid grid-cols-2 gap-4">
              <Input label="Charity Name" name="name" defaultValue={editingCharity?.name} placeholder="e.g. Save The Oceans" />
              <Input label="Slug (Optional)" name="slug" defaultValue={editingCharity?.slug} placeholder="save-the-oceans" />
           </div>
           <Input label="Website URL" name="website" type="url" defaultValue={editingCharity?.website} placeholder="https://..." />
           <div>
              <label className="text-sm font-body font-medium text-muted block mb-1.5">Description</label>
              <textarea
                name="description"
                rows="4"
                className="w-full bg-bg border border-border rounded-xl p-4 text-sm text-text focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted/30"
                defaultValue={editingCharity?.description}
                placeholder="Organization mission and goals..."
              />
           </div>
           
           <div className="p-6 rounded-2xl bg-bg border border-dashed border-border group hover:border-primary/50 transition-colors">
              <label className="flex flex-col items-center justify-center gap-3 cursor-pointer">
                 <div className="p-3 rounded-xl bg-surface text-muted group-hover:text-primary transition-colors">
                    <ImageIcon size={32} />
                 </div>
                 <div className="text-center">
                    <p className="text-sm font-bold text-text">Upload Logo</p>
                    <p className="text-xs text-muted">PNG, JPG up to 2MB</p>
                 </div>
                 <input type="file" name="logo" className="hidden" accept="image/*" />
              </label>
           </div>

           <div className="flex items-center gap-4 py-4 border-t border-border">
              <Button type="submit" variant="primary" className="flex-1">
                 {editingCharity ? 'Update Partner' : 'Create Partner'}
              </Button>
              <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsModalOpen(false)}>
                 Cancel
              </Button>
           </div>
        </form>
      </Modal>
    </div>
  );
};

export default CharityManager;
