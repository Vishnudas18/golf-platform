import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Trophy, 
  Heart, 
  UserCircle, 
  Home, 
  Settings, 
  PieChart 
} from 'lucide-react';

const Sidebar = ({ className = '' }) => {
  const adminLinks = [
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Draws', path: '/admin/draws', icon: Trophy },
    { name: 'Charities', path: '/admin/charities', icon: Heart },
    { name: 'Winners', path: '/admin/winners', icon: UserCircle },
    { name: 'Payouts', path: '/admin/payouts', icon: PieChart },
  ];

  return (
    <aside className={`w-64 bg-surface border-r border-border h-[calc(100vh-80px)] overflow-y-auto ${className}`}>
      <div className="p-6">
        <h3 className="text-xs font-display font-bold uppercase tracking-widest text-muted mb-6">
          Admin Control
        </h3>
        <nav className="flex flex-col gap-2">
          {adminLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5'
                    : 'text-muted hover:text-text hover:bg-bg border border-transparent'
                }`
              }
            >
              <link.icon size={18} />
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-border">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted hover:text-text transition-all"
        >
          <Home size={18} />
          View Website
        </NavLink>
        <NavLink
            to="/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted hover:text-text transition-all"
        >
            <Settings size={18} />
            Settings
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
