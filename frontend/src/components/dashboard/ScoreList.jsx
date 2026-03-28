import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit2, Calendar, Target, Check, X } from 'lucide-react';
import { useScores } from '../../hooks/useScores';
import { formatDate } from '../../utils/formatDate';
import Button from '../common/Button';
import Loader from '../common/Loader';

const ScoreList = () => {
  const { scores, isLoading, deleteScore, editScore } = useScores();
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState(0);
  const [editDate, setEditDate] = useState('');

  const handleEditStart = (score) => {
    setEditingId(score._id);
    setEditValue(score.value);
    setEditDate(new Date(score.date).toISOString().split('T')[0]);
  };

  const handleEditSave = async (id) => {
    try {
      await editScore(id, { value: Number(editValue), date: editDate });
      setEditingId(null);
    } catch (error) {
       console.error('Update failed:', error);
    }
  };

  if (isLoading && scores.length === 0) return <Loader />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-display font-bold text-text">Your Scorecard</h3>
        <span className="text-xs font-mono font-bold text-muted uppercase tracking-widest bg-border/20 px-3 py-1 rounded-full border border-border">
          {scores.length} / 5 entries
        </span>
      </div>

      <AnimatePresence mode="popLayout">
        {scores.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 px-6 rounded-3xl border border-dashed border-border bg-surface/30"
          >
             <div className="w-16 h-16 rounded-full bg-border/20 flex items-center justify-center text-muted mb-4 opacity-50">
               <Target size={32} />
             </div>
             <p className="text-sm text-muted font-body mb-2 text-center">No scores added yet.</p>
             <p className="text-xs text-muted/50 font-body text-center">Add your first scorecard to participate in the draw.</p>
          </motion.div>
        ) : (
          scores.map((score, index) => (
            <motion.div
              key={score._id || index}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className={`group flex items-center justify-between p-4 rounded-2xl border bg-surface transition-all duration-300 ${
                editingId === score._id ? 'border-primary ring-1 ring-primary/20' : 'border-border hover:border-muted'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono text-xl font-bold italic shadow-inner ${
                  editingId === score._id ? 'bg-primary text-bg' : 'bg-bg text-primary'
                }`}>
                  {editingId === score._id ? (
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full h-full bg-transparent text-center focus:outline-none"
                      autoFocus
                    />
                  ) : score.value}
                </div>
                <div className="flex flex-col gap-0.5">
                  {editingId === score._id ? (
                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="text-xs font-mono bg-bg border border-border rounded px-1 text-muted"
                    />
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-muted font-mono uppercase tracking-widest leading-none mb-1">
                      <Calendar size={12} className="opacity-50" />
                      {formatDate(score.date)}
                    </div>
                  )}
                  <p className="text-xs font-bold text-text uppercase tracking-widest leading-none">
                    Stableford Score
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {editingId === score._id ? (
                  <>
                    <button
                      onClick={() => handleEditSave(score._id)}
                      className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:scale-110 active:scale-95 transition-all"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-2 rounded-lg bg-danger/10 text-danger border border-danger/20 hover:scale-110 active:scale-95 transition-all"
                    >
                      <X size={18} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditStart(score)}
                      className="p-2 rounded-lg bg-muted/10 text-muted border border-border hover:text-primary hover:border-primary/50 transition-all"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => deleteScore(score._id)}
                      className="p-2 rounded-lg bg-muted/10 text-muted border border-border hover:text-danger hover:border-danger/50 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScoreList;
