import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import DashboardNav from '@/components/DashboardNav';
import { Building2, Bed, Wind, Heart, Stethoscope, Users, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface Facility {
  id: string;
  name: string;
  icon: typeof Bed;
  total: number;
  available: number;
  active: boolean;
}

interface Team {
  id: string;
  name: string;
  ready: boolean;
}

const incomingPatients = [
  { id: 1, name: 'Rahul Sharma', condition: 'Cardiac Arrest', eta: '4 min', severity: 'critical' },
  { id: 2, name: 'Priya Gupta', condition: 'Fracture - Leg', eta: '11 min', severity: 'moderate' },
  { id: 3, name: 'Amit Verma', condition: 'Burn Injury', eta: '7 min', severity: 'critical' },
];

export default function HospitalDashboard() {
  const { canEdit } = useAuth();
  const { toast } = useToast();
  const isEditable = canEdit('facility');

  const [facilities, setFacilities] = useState<Facility[]>([
    { id: 'icu', name: 'ICU Beds', icon: Bed, total: 20, available: 5, active: true },
    { id: 'general', name: 'General Beds', icon: Bed, total: 100, available: 34, active: true },
    { id: 'oxygen', name: 'Oxygen Supply', icon: Wind, total: 50, available: 22, active: true },
    { id: 'ventilator', name: 'Ventilators', icon: Heart, total: 15, available: 3, active: true },
  ]);

  const [teams, setTeams] = useState<Team[]>([
    { id: 'trauma', name: 'Trauma Team', ready: true },
    { id: 'or', name: 'OR Team', ready: false },
    { id: 'neuro', name: 'Neuro Team', ready: true },
    { id: 'cardio', name: 'Cardiology Team', ready: false },
  ]);

  const toggleFacility = (id: string) => {
    if (!isEditable) return;
    setFacilities(f => f.map(item => item.id === id ? { ...item, active: !item.active } : item));
    toast({ title: 'Facility updated' });
  };

  const toggleTeam = (id: string) => {
    if (!canEdit('team-status')) return;
    setTeams(t => t.map(item => item.id === id ? { ...item, ready: !item.ready } : item));
    toast({ title: 'Team status updated' });
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="w-6 h-6 text-secondary" />
            Hospital Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isEditable ? 'Manage facility availability and team readiness' : 'Read-only view'}
          </p>
        </motion.div>

        {/* Facility Availability */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Facility Availability</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {facilities.map((f, i) => {
              const Icon = f.icon;
              const pct = (f.available / f.total) * 100;
              const barColor = pct < 20 ? 'bg-primary' : pct < 50 ? 'bg-warning' : 'bg-success';
              return (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-secondary" />
                      <span className="text-sm font-medium text-foreground">{f.name}</span>
                    </div>
                    {isEditable && (
                      <Switch checked={f.active} onCheckedChange={() => toggleFacility(f.id)} />
                    )}
                  </div>
                  <p className="text-3xl font-bold text-foreground">{f.available}<span className="text-lg text-muted-foreground">/{f.total}</span></p>
                  <div className="w-full h-2 bg-muted rounded-full mt-2 overflow-hidden">
                    <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{f.active ? 'Available' : 'Offline'}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Team Readiness */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Team Readiness</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {teams.map((t, i) => (
              <motion.button
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                onClick={() => toggleTeam(t.id)}
                disabled={!canEdit('team-status')}
                className={`glass-card p-4 text-left transition-all duration-300 ${
                  canEdit('team-status') ? 'cursor-pointer hover:border-border' : 'cursor-default'
                } ${t.ready ? 'border-success/30' : 'border-warning/30'}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {t.ready ? (
                    <CheckCircle className="w-4 h-4 text-success" />
                  ) : (
                    <Clock className="w-4 h-4 text-warning" />
                  )}
                  <span className="text-sm font-medium text-foreground">{t.name}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  t.ready ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                }`}>
                  {t.ready ? 'Team Ready' : 'Preparing'}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Incoming Patients */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary pulse-dot" />
            Incoming Patients
          </h2>
          <div className="space-y-3">
            {incomingPatients.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="glass-card p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${p.severity === 'critical' ? 'bg-primary pulse-dot' : 'bg-warning'}`} />
                  <div>
                    <p className="font-medium text-foreground">{p.name}</p>
                    <p className="text-sm text-muted-foreground">{p.condition}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    p.severity === 'critical' ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'
                  }`}>
                    {p.severity}
                  </span>
                  <span className="text-sm font-mono text-secondary">ETA {p.eta}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
