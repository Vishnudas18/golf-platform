import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Rocket, User, LogOut, LayoutDashboard, ShieldCheck, Heart, Trophy, CreditCard } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';
import Button from '../common/Button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const { isActive } = useSubscription();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Rocket },
    { name: 'Charities', path: '/charities', icon: Heart },
    { name: 'Winners', path: '/winners', icon: Trophy },
  ];

  const isActivePath = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-bg shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <Trophy size={24} />
            </div>
            <span className="text-2xl font-display font-bold text-text tracking-tight">
              Golf<span className="text-primary">Gives</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActivePath(link.path) ? 'text-primary' : 'text-muted'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="p-2 text-muted hover:text-primary transition-colors"
                    title="Admin Panel"
                  >
                    <ShieldCheck size={20} />
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface border border-border hover:border-primary/50 transition-all group"
                >
                  <LayoutDashboard size={18} className="text-muted group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium">Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-muted hover:text-danger transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-muted hover:text-primary transition-colors">
                  Login
                </Link>
                <Link to="/subscribe">
                  <Button variant="primary" size="sm">
                    Start Playing
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-muted hover:text-primary"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-bg border-b border-border overflow-hidden"
          >
            <div className="space-y-1 px-4 py-6">
              {[...navLinks, ...(isAuthenticated ? [
                { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
                ...(user?.role === 'admin' ? [{ name: 'Admin', path: '/admin', icon: ShieldCheck }] : []),
              ] : [])].map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-4 rounded-lg text-base font-medium transition-colors ${
                    isActivePath(link.path) ? 'bg-primary/10 text-primary' : 'text-muted active:bg-surface'
                  }`}
                >
                  <link.icon size={20} />
                  {link.name}
                </Link>
              ))}
              
              {!isAuthenticated ? (
                <div className="grid grid-cols-2 gap-4 pt-6">
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full">Login</Button>
                  </Link>
                  <Link to="/subscribe" onClick={() => setIsOpen(false)}>
                    <Button variant="primary" className="w-full">Sign Up</Button>
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-full mt-6 flex items-center justify-center gap-2 py-4 text-danger font-bold rounded-lg border border-danger/20 active:bg-danger/10"
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
