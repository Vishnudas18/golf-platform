import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserPlus, ArrowRight, ShieldCheck, Trophy, Target, Heart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const RegisterPage = () => {
  const { register: signup } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      await signup(data);
      success('Welcome to GolfGives! Redirecting to checkout...');
      navigate('/subscribe');
    } catch (err) {
      error(err.response?.data?.message || 'Registration failed. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full">
         <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[150px] animate-pulse" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[150px] animate-pulse delay-700" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl px-6 py-12"
      >
        <div className="text-center mb-12">
           <Link to="/" className="inline-flex items-center gap-2 group mb-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-bg shadow-2xl group-hover:scale-110 transition-transform">
                <Trophy size={32} />
              </div>
              <span className="text-4xl font-display font-black text-text tracking-tighter italic">
                Golf<span className="text-primary">Gives</span>
              </span>
           </Link>
           <h1 className="text-4xl font-display font-black text-text uppercase tracking-tighter italic mb-4">Join the Club</h1>
           <p className="text-muted font-body text-lg">Start tracking your game and giving back to global causes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-surface/50 border border-border p-10 rounded-[3rem] shadow-3xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 text-secondary opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-700">
              <Heart size={140} fill="currentColor" />
           </div>

           <div className="space-y-8 relative z-10">
              <h3 className="text-xs font-bold text-muted uppercase tracking-[0.3em] mb-6 px-1 border-l-4 border-primary pl-4">Member Perks</h3>
              <div className="space-y-6">
                 <div className="flex items-center gap-4 group/perk hover:translate-x-2 transition-transform">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
                       <Target size={20} />
                    </div>
                    <p className="text-sm font-bold text-text">Weekly Score Tracking</p>
                 </div>
                 <div className="flex items-center gap-4 group/perk hover:translate-x-2 transition-transform">
                    <div className="p-3 rounded-xl bg-secondary/10 text-secondary border border-secondary/20">
                       <Heart size={20} />
                    </div>
                    <p className="text-sm font-bold text-text">Live Impact Dashboard</p>
                 </div>
                 <div className="flex items-center gap-4 group/perk hover:translate-x-2 transition-transform">
                    <div className="p-3 rounded-xl bg-gold/10 text-gold border border-gold/20">
                       <Trophy size={20} />
                    </div>
                    <p className="text-sm font-bold text-text">Monthly Prize Pool Draws</p>
                 </div>
              </div>
              
              <div className="pt-8 border-t border-border mt-10">
                 <div className="p-4 rounded-2xl bg-bg border border-border flex items-center gap-4 group">
                    <img src="https://images.unsplash.com/photo-1544027993-37dbfe43552e?auto=format&fit=crop&q=80&w=200" alt="community" className="w-12 h-12 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all shadow-inner" />
                    <div>
                       <p className="text-xs font-bold text-text">Joined by 12k+</p>
                       <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-0.5">Global Golfers</p>
                    </div>
                 </div>
              </div>
           </div>

           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
              <div className="space-y-1">
                 <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-widest pl-1 mb-1">
                    <User size={14} /> Full Name
                 </div>
                 <Input
                   placeholder="Tiger Woods" autoComplete="name"
                   register={register('name')}
                   error={errors.name}
                 />
              </div>

              <div className="space-y-1">
                 <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-widest pl-1 mb-1">
                    <Mail size={14} /> Email Address
                 </div>
                 <Input
                   type="email"
                   placeholder="tiger@pro.com" autoComplete="email"
                   register={register('email')}
                   error={errors.email}
                 />
              </div>

              <div className="space-y-1">
                 <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-widest pl-1 mb-1">
                    <Lock size={14} /> Password
                 </div>
                 <Input
                   type="password"
                   placeholder="••••••••" autoComplete="new-password"
                   register={register('password')}
                   error={errors.password}
                 />
              </div>

              <div className="space-y-1">
                 <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-widest pl-1 mb-1">
                    <Lock size={14} /> Confirm Password
                 </div>
                 <Input
                   type="password"
                   placeholder="••••••••" autoComplete="new-password"
                   register={register('confirmPassword')}
                   error={errors.confirmPassword}
                 />
              </div>

              <div className="pt-4">
                 <Button
                   type="submit"
                   variant="primary"
                   size="lg"
                   className="w-full shadow-2xl shadow-primary/20 group"
                   isLoading={isSubmitting}
                 >
                   Become a Member
                   <UserPlus size={20} className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                 </Button>
              </div>
           </form>
        </div>

        <p className="text-center mt-12 text-muted text-sm">
           Already a member?{' '}
           <Link to="/login" className="text-primary font-black hover:underline italic">
              Access Your Profile <ArrowRight size={14} className="inline ml-1" />
           </Link>
        </p>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all duration-1000">
           <span className="text-xs font-display font-black tracking-widest italic">SECURE GATEWAY</span>
           <span className="w-1 h-1 rounded-full bg-border" />
           <span className="text-xs font-display font-black tracking-widest italic">STRIPE POWERED</span>
           <span className="w-1 h-1 rounded-full bg-border" />
           <span className="text-xs font-display font-black tracking-widest italic">SSL CERTIFIED</span>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
