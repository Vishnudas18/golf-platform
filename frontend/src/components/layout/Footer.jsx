import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trophy, Mail, Instagram, Twitter, MessageCircle } from 'lucide-react';
import Button from '../common/Button';

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-bg shadow-sm">
                <Trophy size={20} />
              </div>
              <span className="text-xl font-display font-bold text-text tracking-tight">
                Golf<span className="text-primary">Gives</span>
              </span>
            </Link>
            <p className="text-sm text-muted leading-relaxed">
              Tracking scores, giving back, and winning big. The premium platform for golfers who care and play to win.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 rounded-lg bg-bg border border-border text-muted hover:text-primary hover:border-primary/50 transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-bg border border-border text-muted hover:text-primary hover:border-primary/50 transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-bg border border-border text-muted hover:text-primary hover:border-primary/50 transition-all">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-6">
            <h4 className="text-sm font-display font-bold uppercase tracking-wider text-text">
              Platform
            </h4>
            <ul className="flex flex-col gap-4">
              <li>
                <Link to="/subscribe" className="text-sm text-muted hover:text-primary transition-colors">How it Works</Link>
              </li>
              <li>
                <Link to="/charities" className="text-sm text-muted hover:text-primary transition-colors">Charities</Link>
              </li>
              <li>
                <Link to="/winners" className="text-sm text-muted hover:text-primary transition-colors">Previous Winners</Link>
              </li>
              <li>
                <Link to="/subscribe" className="text-sm text-muted hover:text-primary transition-colors">Subscription Plans</Link>
              </li>
            </ul>
          </div>

          {/* Impact Column */}
          <div className="flex flex-col gap-6">
            <h4 className="text-sm font-display font-bold uppercase tracking-wider text-text">
              Impact
            </h4>
            <div className="p-4 rounded-xl bg-bg border border-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Heart size={18} />
                </div>
                <span className="text-sm font-bold text-text">Live Counter</span>
              </div>
              <p className="text-2xl font-mono font-bold text-primary">£142,500+</p>
              <p className="text-xs text-muted mt-1 underline">donated to 50+ charities</p>
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="flex flex-col gap-6">
            <h4 className="text-sm font-display font-bold uppercase tracking-wider text-text">
              Stay Updated
            </h4>
            <p className="text-sm text-muted">Join our monthly newsletter for draw announcements and charity updates.</p>
            <form className="flex flex-col gap-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                <input
                  type="email"
                  placeholder="name@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>
              <Button variant="ghost" size="sm" className="w-full">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} GolfGives Platform. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link to="/terms" className="text-xs text-muted hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/privacy" className="text-xs text-muted hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
