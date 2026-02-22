import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardNav from '@/components/DashboardNav';
import { Truck, MapPin, Heart, Activity, Thermometer, Wind, User, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const activeCase = {
  patient: 'Rahul Sharma',
  age: 45,
  gender: 'Male',
  condition: 'Suspected Cardiac Arrest',
  location: 'Sector 21, Noida',
  hospital: 'Max Hospital, Sector 19',
  eta: '4 min',
  distance: '3.2 km',
  ambulanceId: 'AMB-104',
  vitals: {
    heartRate: 92,
    bp: '130/85',
    spo2: 96,
    temp: 99.1,
    respRate: 22,
  },
};

export default function AmbulanceDashboard() {
  const { canEdit } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Truck className="w-6 h-6 text-primary" />
            Ambulance Dashboard
            <span className="text-xs font-mono text-secondary bg-secondary/10 px-2 py-0.5 rounded-full ml-2">
              {activeCase.ambulanceId}
            </span>
          </h1>
        </motion.div>

        {/* Active Case */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-5 border-primary/20"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-primary pulse-dot" />
            <span className="text-sm font-medium text-primary">Active Emergency</span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">{activeCase.patient}</p>
                  <p className="text-sm text-muted-foreground">{activeCase.age}y, {activeCase.gender}</p>
                </div>
              </div>
              <p className="text-sm text-primary font-medium">{activeCase.condition}</p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-3 h-3" /> {activeCase.location}
              </div>
              <div className="flex items-center gap-1 text-sm text-secondary">
                <ArrowRight className="w-3 h-3" /> {activeCase.hospital}
              </div>
            </div>

            <div className="flex items-center gap-6 justify-center">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">{activeCase.eta}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 justify-center"><Clock className="w-3 h-3" /> ETA</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-secondary">{activeCase.distance}</p>
                <p className="text-xs text-muted-foreground">Distance</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Live Vitals */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h2 className="text-lg font-semibold text-foreground mb-3">Live Vitals</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { icon: Heart, label: 'HR', value: `${activeCase.vitals.heartRate}`, unit: 'bpm', color: 'text-primary' },
              { icon: Activity, label: 'BP', value: activeCase.vitals.bp, unit: 'mmHg', color: 'text-warning' },
              { icon: Wind, label: 'SpO2', value: `${activeCase.vitals.spo2}`, unit: '%', color: 'text-secondary' },
              { icon: Thermometer, label: 'Temp', value: `${activeCase.vitals.temp}`, unit: '°F', color: 'text-accent' },
              { icon: Activity, label: 'Resp', value: `${activeCase.vitals.respRate}`, unit: '/min', color: 'text-success' },
            ].map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="glass-card p-3 text-center"
                >
                  <Icon className={`w-4 h-4 ${v.color} mx-auto mb-1`} />
                  <p className="text-xl font-bold text-foreground">{v.value}</p>
                  <p className="text-xs text-muted-foreground">{v.unit}</p>
                  <p className="text-[10px] text-muted-foreground">{v.label}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => navigate('/paramedic-patient')} className="gradient-medical text-secondary-foreground hover:opacity-90">
            {canEdit('paramedic') ? 'Edit Patient Data' : 'View Patient Data'}
          </Button>
          <Button onClick={() => navigate('/tracking/active')} variant="outline" className="border-border text-foreground hover:bg-muted">
            View Tracking
          </Button>
        </div>
      </div>
    </div>
  );
}
