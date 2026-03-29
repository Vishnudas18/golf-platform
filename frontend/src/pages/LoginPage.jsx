import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck, Trophy } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const LoginPage = () => {
  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await login(data);
      success('Welcome back to GolfGives!');
      
      // Redirect based on role
      if (response.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      error(err.response?.data?.message || 'Login failed. Check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-10">
           <Link to="/" className="inline-flex items-center gap-2 group mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-bg shadow-xl group-hover:scale-110 transition-transform">
                <Trophy size={28} />
              </div>
              <span className="text-3xl font-display font-bold text-text tracking-tight italic">
                Golf<span className="text-primary">Gives</span>
              </span>
           </Link>
           <h1 className="text-3xl font-display font-black text-text uppercase tracking-tighter italic">Player Login</h1>
           <p className="text-muted font-body mt-2">Access your scorecard and prize draws.</p>
        </div>

        <div className="p-10 rounded-[2.5rem] bg-surface border border-border shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 text-primary opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-700">
              <ShieldCheck size={100} />
           </div>

           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
              <div className="space-y-1 group/input">
                 <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-widest pl-1 mb-1 group-focus-within/input:text-primary transition-colors">
                    <Mail size={14} /> Email Address
                 </div>
                 <Input
                   type="email"
                   placeholder="name@email.com" autoComplete="email"
                   register={register('email')}
                   error={errors.email}
                 />
              </div>

              <div className="space-y-1 group/input">
                 <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-widest pl-1 mb-1 group-focus-within/input:text-primary transition-colors">
                    <Lock size={14} /> Password
                 </div>
                 <Input
                   type="password"
                   placeholder="••••••••" autoComplete="current-password"
                   register={register('password')}
                   error={errors.password}
                 />
              </div>

              <div className="flex items-center justify-between px-1">
                 <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded bg-bg border-border text-primary focus:ring-primary/20" />
                    <span className="text-xs text-muted group-hover:text-text transition-colors">Remember me</span>
                 </label>
                 <Link to="/forgot-password" size="xs" className="text-xs text-primary font-bold hover:underline">
                    Forgot Password?
                 </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full shadow-2xl shadow-primary/20 group"
                isLoading={isSubmitting}
              >
                Enter Platform
                <LogIn size={20} className="ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
           </form>
        </div>

        <p className="text-center mt-10 text-muted text-sm">
           New to the platform?{' '}
           <Link to="/register" className="text-primary font-black hover:underline italic">
              Create an Account <ArrowRight size={14} className="inline ml-1" />
           </Link>
        </p>

        <div className="mt-12 flex flex-col items-center gap-6">
           <div className="flex items-center justify-center gap-8 opacity-20 grayscale">
              <div className="flex items-center gap-2">
                 <ShieldCheck size={16} />
                 <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Secure SSL</span>
              </div>
              <div className="w-px h-6 bg-border" />
              <div className="flex items-center gap-2">
                 <Lock size={16} />
                 <span className="text-[10px] font-bold uppercase tracking-widest leading-none">256-bit AES</span>
              </div>
           </div>

           <Link 
              to="/admin-portal" 
              className="text-[10px] uppercase font-black tracking-[0.3em] text-muted hover:text-gold transition-colors flex items-center gap-2 group"
           >
              <ShieldCheck size={12} className="group-hover:rotate-12 transition-transform" />
              Administrative Access Portal
           </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
