import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, LogIn, ArrowLeft, Terminal, Cpu } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const loginSchema = z.object({
  email: z.string().email('Invalid administrative email'),
  password: z.string().min(6, 'Password required'),
});

const AdminPortalPage = () => {
  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

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
      if (response.role !== 'admin') {
        error('Access Denied: Insufficient Privileges');
        return;
      }
      success('System Access Granted. Welcome, Administrator.');
      navigate('/admin', { replace: true });
    } catch (err) {
      error(err.response?.data?.message || 'Authentication failed. Verify secure credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center p-6 relative overflow-hidden font-mono">
      {/* Matrix-like Background Decor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="text-center mb-10">
           <Link to="/login" className="inline-flex items-center gap-2 text-gold/60 hover:text-gold transition-colors text-xs font-bold uppercase tracking-[0.2em] mb-8 group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Terminal
           </Link>
           <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-3xl bg-surface border-2 border-gold/30 flex items-center justify-center text-gold shadow-[0_0_50px_rgba(255,215,0,0.15)] relative group">
                 <ShieldCheck size={40} className="relative z-10" />
                 <div className="absolute inset-0 bg-gold/5 rounded-3xl animate-pulse" />
                 <div className="absolute -inset-1 border border-gold/20 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
           </div>
           <h1 className="text-4xl font-display font-black text-text uppercase tracking-[-0.05em] italic italic">
             System<span className="text-gold">Root</span>
           </h1>
           <p className="text-muted text-xs font-bold uppercase tracking-[0.3em] mt-3 flex items-center justify-center gap-2">
              <Cpu size={12} className="text-gold" /> Administrative Access Portal
           </p>
        </div>

        <div className="p-1 w-full rounded-[2.5rem] bg-gradient-to-br from-gold/20 via-border to-transparent shadow-2xl">
           <div className="p-10 rounded-[2.3rem] bg-surface relative overflow-hidden">
              {/* Internal Decorative Elements */}
              <div className="absolute top-0 right-0 p-6 text-gold opacity-5 rotate-45">
                 <Terminal size={120} />
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative z-10">
                 <div className="space-y-2 group/input">
                    <div className="flex items-center justify-between px-1">
                       <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] group-focus-within/input:text-gold transition-colors">
                          Identity Auth
                       </label>
                       <span className="text-[8px] text-muted/50 font-mono tracking-tighter">SEC_LEVEL_04</span>
                    </div>
                    <Input
                      type="email"
                      placeholder="admin_id@golfgives.sys"
                      className="bg-bg/50 border-gold/10 focus:border-gold/50 text-gold placeholder:text-gold/20 font-mono"
                      register={register('email')}
                      error={errors.email}
                    />
                 </div>

                 <div className="space-y-2 group/input">
                    <div className="flex items-center justify-between px-1">
                       <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] group-focus-within/input:text-gold transition-colors">
                          Encr_Key
                       </label>
                       <span className="text-[8px] text-muted/50 font-mono tracking-tighter">ROTATION_ACTIVE</span>
                    </div>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="bg-bg/50 border-gold/10 focus:border-gold/50 text-gold placeholder:text-gold/20 font-mono"
                      register={register('password')}
                      error={errors.password}
                    />
                 </div>

                 <div className="pt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full bg-gold hover:bg-gold/90 text-bg border-none font-display font-black uppercase italic tracking-widest shadow-[0_10px_30px_rgba(255,215,0,0.2)] group"
                      isLoading={isSubmitting}
                    >
                      Initialize Link
                      <LogIn size={20} className="ml-3 group-hover:scale-110 transition-transform" />
                    </Button>
                 </div>
              </form>
           </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-6">
           <div className="flex items-center gap-6 opacity-30">
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-gold animate-ping" />
                 <span className="text-[10px] uppercase font-bold tracking-widest text-gold text-gold">Gateway Active</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <span className="text-[10px] uppercase font-bold tracking-widest">v 4.0.2-SEC</span>
           </div>
           
           <p className="max-w-[280px] text-center text-[10px] text-muted/60 leading-relaxed font-bold uppercase tracking-widest">
              Authorized personnel only. All access attempts are decrypted and logged in the platform audit trail.
           </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminPortalPage;
