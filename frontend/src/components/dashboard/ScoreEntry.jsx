import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Calendar, Trophy, Info } from 'lucide-react';
import { useScores } from '../../hooks/useScores';
import Button from '../common/Button';
import Input from '../common/Input';

const scoreSchema = z.object({
  value: z.number()
    .min(1, 'Score must be at least 1')
    .max(45, 'Score cannot exceed 45'),
  date: z.string().nonempty('Date is required'),
});

const ScoreEntry = () => {
  const { addScore, isLoading, scores } = useScores();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(scoreSchema),
    defaultValues: {
      value: 0,
      date: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data) => {
    try {
      await addScore(data);
      reset();
    } catch (error) {
      console.error('Failed to add score:', error);
    }
  };

  const isFull = scores.length >= 5;

  return (
    <div className="bg-surface border border-border rounded-3xl p-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <Trophy size={80} />
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-primary/10 text-primary">
          <Plus size={24} />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-text">New Score</h3>
          <p className="text-xs text-muted font-body">Stableford 1-45</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            label="Stableford Points"
            type="number"
            placeholder="e.g. 36"
            register={register('value', { valueAsNumber: true })}
            error={errors.value}
          />
          <Input
            label="Date of Play"
            type="date"
            register={register('date')}
            error={errors.date}
          />
        </div>

        {isFull && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary">
            <Info size={18} className="shrink-0 mt-0.5" />
            <p className="text-xs font-medium font-body leading-relaxed">
              Max scores reached (5). Adding a new score will remove your oldest entry (Rolling Replacement).
            </p>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full shadow-lg shadow-primary/20"
          isLoading={isLoading}
        >
          Add to Scorecard
        </Button>
      </form>
    </div>
  );
};

export default ScoreEntry;
