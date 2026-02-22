import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Building2, Users, Truck, Shield, Eye, Edit3, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const roles: { id: UserRole; label: string; icon: typeof Building2; description: string; permissions: { edit: string[]; view: string[] } }[] = [
  {
    id: 'hospital',
    label: 'Hospital Staff',
    icon: Building2,
    description: 'Manage facility availability, team readiness, and incoming patients.',
    permissions: {
      edit: ['Facility availability', 'Team status'],
      view: ['Incoming patients', 'Statistics', 'Analytics'],
    },
  },
  {
    id: 'patient',
    label: 'Patient & Family',
    icon: Users,
    description: 'Access emergency SOS, track ambulances, and view all dashboards.',
    permissions: {
      edit: ['Emergency SOS', 'Health profile'],
      view: ['All dashboards (read-only)', 'Ambulance tracking'],
    },
  },
  {
    id: 'dispatch',
    label: 'Dispatch / Ambulance',
    icon: Truck,
    description: 'Manage patient data, submit to hospital, and coordinate response.',
    permissions: {
      edit: ['Patient data', 'Paramedic module'],
      view: ['Hospital dashboard', 'Live tracking'],
    },
  },
];

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole || !name.trim()) return;
    login(name.trim(), selectedRole);
    toast({ title: 'Welcome!', description: `Logged in as ${name} (${roles.find(r => r.id === selectedRole)?.label})` });
    const routes: Record<UserRole, string> = { hospital: '/hospital', patient: '/dashboard', dispatch: '/ambulance' };
    navigate(routes[selectedRole]);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4"
          >
            <div className="w-2 h-2 rounded-full bg-primary pulse-dot" />
            <span className="text-sm font-medium text-primary">Emergency Response System</span>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Smart Hospital & Ambulance
          </h1>
          <p className="text-muted-foreground text-lg">Coordination System</p>
        </div>

        {/* Role selection */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {roles.map((role, i) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            return (
              <motion.button
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                onClick={() => setSelectedRole(role.id)}
                className={`glass-card p-5 text-left transition-all duration-300 cursor-pointer group ${
                  isSelected ? 'border-primary/50 glow-emergency' : 'hover:border-border'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors ${
                  isSelected ? 'gradient-emergency' : 'bg-muted'
                }`}>
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{role.label}</h3>
                <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
                <div className="space-y-1.5">
                  {role.permissions.edit.map(p => (
                    <div key={p} className="flex items-center gap-1.5 text-xs">
                      <Edit3 className="w-3 h-3 text-success" />
                      <span className="text-muted-foreground">{p}</span>
                    </div>
                  ))}
                  {role.permissions.view.map(p => (
                    <div key={p} className="flex items-center gap-1.5 text-xs">
                      <Eye className="w-3 h-3 text-secondary" />
                      <span className="text-muted-foreground">{p}</span>
                    </div>
                  ))}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Login form */}
        {selectedRole && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            onSubmit={handleLogin}
            className="glass-card p-6 max-w-sm mx-auto"
          >
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Demo Login</span>
            </div>
            <div className="space-y-3">
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-muted/50 border-border"
              />
              <Input
                type="password"
                placeholder="Password (any)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-muted/50 border-border"
              />
              <Button
                type="submit"
                disabled={!name.trim()}
                className="w-full gradient-emergency text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Enter System <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
}
