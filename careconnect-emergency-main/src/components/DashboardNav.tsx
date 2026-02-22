import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Building2, Truck, Activity, MapPin, Users, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/dashboard', label: 'Command', icon: Activity, module: 'sos' },
  { path: '/hospital', label: 'Hospital', icon: Building2, module: 'hospital' },
  { path: '/ambulance', label: 'Ambulance', icon: Truck, module: 'ambulance' },
  { path: '/paramedic-patient', label: 'Paramedic', icon: Users, module: 'paramedic' },
  { path: '/tracking/active', label: 'Tracking', icon: MapPin, module: 'tracking' },
];

export default function DashboardNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 glass-card rounded-none border-t-0 border-x-0 px-6 py-3 items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary pulse-dot" />
            <span className="font-semibold text-sm text-foreground">MedResponse</span>
          </div>
          <div className="flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const active = location.pathname.startsWith(item.path.replace('/active', ''));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-muted">
            {user.role === 'hospital' ? '🏥' : user.role === 'dispatch' ? '🚑' : '👤'} {user.name}
          </span>
          <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Mobile nav */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 glass-card rounded-none border-t-0 border-x-0 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary pulse-dot" />
          <span className="font-semibold text-sm text-foreground">MedResponse</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden fixed top-12 left-0 right-0 z-40 glass-card rounded-none border-t-0 border-x-0 p-4 space-y-1"
          >
            {navItems.map(item => {
              const Icon = item.icon;
              const active = location.pathname.startsWith(item.path.replace('/active', ''));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground w-full"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-14" />
    </>
  );
}
