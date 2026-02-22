import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardNav from '@/components/DashboardNav';
import { MapPin, Clock, Truck, Building2, ArrowRight, Navigation } from 'lucide-react';

const updates = [
  { time: '14:23', text: 'Ambulance dispatched from Station 4' },
  { time: '14:25', text: 'En route — estimated 8 minutes' },
  { time: '14:28', text: 'Patient vitals received by Max Hospital' },
  { time: '14:30', text: 'Trauma team preparing for arrival' },
  { time: '14:32', text: '3.2 km remaining — ETA 4 minutes' },
];

export default function Tracking() {
  const [progress, setProgress] = useState(62);
  const [ambulancePos, setAmbulancePos] = useState({ x: 30, y: 55 });

  // Simulate movement
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => Math.min(p + 0.5, 95));
      setAmbulancePos(pos => ({
        x: pos.x + (70 - pos.x) * 0.01,
        y: pos.y + (35 - pos.y) * 0.01,
      }));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Navigation className="w-6 h-6 text-secondary" />
            Live Tracking
          </h1>
        </motion.div>

        {/* Map simulation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-1 overflow-hidden"
        >
          <div className="relative w-full h-64 md:h-80 bg-muted/30 rounded-lg overflow-hidden">
            {/* Grid overlay */}
            <svg className="absolute inset-0 w-full h-full opacity-10">
              {Array.from({ length: 20 }).map((_, i) => (
                <line key={`h${i}`} x1="0" y1={`${i * 5}%`} x2="100%" y2={`${i * 5}%`} stroke="currentColor" strokeWidth="0.5" />
              ))}
              {Array.from({ length: 20 }).map((_, i) => (
                <line key={`v${i}`} x1={`${i * 5}%`} y1="0" x2={`${i * 5}%`} y2="100%" stroke="currentColor" strokeWidth="0.5" />
              ))}
            </svg>

            {/* Route line */}
            <svg className="absolute inset-0 w-full h-full">
              <path
                d={`M ${ambulancePos.x}% ${ambulancePos.y}% Q 50% 45% 70% 35%`}
                stroke="hsl(187 94% 43%)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="6 3"
                opacity="0.6"
              />
            </svg>

            {/* Ambulance marker */}
            <motion.div
              className="absolute z-10"
              style={{ left: `${ambulancePos.x}%`, top: `${ambulancePos.y}%` }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <div className="relative -translate-x-1/2 -translate-y-1/2">
                <div className="w-10 h-10 rounded-full gradient-emergency flex items-center justify-center glow-emergency">
                  <Truck className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-[10px] font-mono bg-card/90 text-foreground px-1.5 py-0.5 rounded">AMB-104</span>
                </div>
              </div>
            </motion.div>

            {/* Hospital marker */}
            <div className="absolute z-10" style={{ left: '70%', top: '35%' }}>
              <div className="relative -translate-x-1/2 -translate-y-1/2">
                <div className="w-10 h-10 rounded-full gradient-medical flex items-center justify-center glow-medical">
                  <Building2 className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-[10px] font-mono bg-card/90 text-foreground px-1.5 py-0.5 rounded">Max Hospital</span>
                </div>
              </div>
            </div>

            {/* Patient marker */}
            <div className="absolute z-10" style={{ left: '25%', top: '60%' }}>
              <div className="relative -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 h-8 rounded-full bg-warning flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-warning-foreground" />
                </div>
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-[10px] font-mono bg-card/90 text-foreground px-1.5 py-0.5 rounded">Pickup</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress bar */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> Sector 21</span>
            <span className="text-sm text-muted-foreground flex items-center gap-1"><Building2 className="w-3 h-3" /> Max Hospital</span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full gradient-medical rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">{progress.toFixed(0)}% complete</span>
            <span className="text-xs font-mono text-secondary flex items-center gap-1">
              <Clock className="w-3 h-3" /> ETA ~4 min
            </span>
          </div>
        </div>

        {/* Updates feed */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Live Updates</h2>
          <div className="space-y-2">
            {updates.map((u, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3"
              >
                <span className="text-xs font-mono text-secondary whitespace-nowrap mt-0.5">{u.time}</span>
                <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">{u.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
