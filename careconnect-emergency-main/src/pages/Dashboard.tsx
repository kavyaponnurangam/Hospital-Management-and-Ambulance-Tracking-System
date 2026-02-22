import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardNav from '@/components/DashboardNav';
import { AlertTriangle, MapPin, Phone, Clock, Activity, Heart, Thermometer, Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const mockAlerts = [
  { id: 1, type: 'Critical', patient: 'Rahul Sharma', location: 'Sector 21, Noida', eta: '8 min', ambulanceId: 'AMB-104' },
  { id: 2, type: 'Moderate', patient: 'Priya Gupta', location: 'MG Road, Delhi', eta: '12 min', ambulanceId: 'AMB-207' },
];

const stats = [
  { label: 'Active Emergencies', value: '3', icon: AlertTriangle, color: 'text-primary' },
  { label: 'Ambulances Deployed', value: '7', icon: Activity, color: 'text-secondary' },
  { label: 'Avg Response Time', value: '6.2m', icon: Clock, color: 'text-warning' },
  { label: 'Hospitals Online', value: '12', icon: MapPin, color: 'text-success' },
];

export default function Dashboard() {
  const { user, canEdit } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sosActive, setSosActive] = useState(false);

  const handleSOS = () => {
    setSosActive(true);
    toast({
      title: '🚨 SOS Alert Sent!',
      description: 'Nearest ambulance and hospitals have been notified. Help is on the way.',
    });
    setTimeout(() => setSosActive(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* SOS Button for patients */}
        {canEdit('sos') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center"
          >
            <button
              onClick={handleSOS}
              className={`relative w-40 h-40 rounded-full gradient-emergency flex flex-col items-center justify-center transition-all duration-300 ${
                sosActive ? 'pulse-emergency scale-110' : 'hover:scale-105'
              }`}
            >
              <AlertTriangle className="w-12 h-12 text-primary-foreground mb-1" />
              <span className="text-primary-foreground font-bold text-lg">SOS</span>
              <span className="text-primary-foreground/80 text-xs">Tap for help</span>
              {sosActive && (
                <motion.div
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border-2 border-primary"
                />
              )}
            </button>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-4"
              >
                <Icon className={`w-5 h-5 ${s.color} mb-2`} />
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Active Alerts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary pulse-dot" />
            Active Emergencies
          </h2>
          <div className="space-y-3">
            {mockAlerts.map((alert, i) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="glass-card-hover p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${alert.type === 'Critical' ? 'bg-primary pulse-dot' : 'bg-warning'}`} />
                  <div>
                    <p className="font-medium text-foreground">{alert.patient}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {alert.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-mono text-secondary">{alert.ambulanceId}</p>
                    <p className="text-xs text-muted-foreground">ETA: {alert.eta}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate('/tracking/active')}
                    className="border-border text-foreground hover:bg-muted"
                  >
                    Track
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Vitals (simulation) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-3">Latest Patient Vitals</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Heart, label: 'Heart Rate', value: '92 bpm', color: 'text-primary' },
              { icon: Activity, label: 'Blood Pressure', value: '130/85', color: 'text-warning' },
              { icon: Wind, label: 'SpO2', value: '96%', color: 'text-secondary' },
              { icon: Thermometer, label: 'Temperature', value: '99.1°F', color: 'text-success' },
            ].map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={v.label} className="glass-card p-3 flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${v.color}`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{v.value}</p>
                    <p className="text-xs text-muted-foreground">{v.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
