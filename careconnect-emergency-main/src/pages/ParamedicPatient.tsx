import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import DashboardNav from '@/components/DashboardNav';
import { User, Heart, Activity, Thermometer, Wind, FileText, Send, Camera, Stethoscope } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function ParamedicPatient() {
  const { canEdit } = useAuth();
  const { toast } = useToast();
  const editable = canEdit('paramedic') || canEdit('patient-data');

  const [patient, setPatient] = useState({
    name: 'Rahul Sharma',
    age: '45',
    gender: 'male',
    bloodGroup: 'O+',
    allergies: 'Penicillin',
    conditions: 'Hypertension, Diabetes',
  });

  const [vitals, setVitals] = useState({
    heartRate: '92',
    bpSys: '130',
    bpDia: '85',
    spo2: '96',
    temp: '99.1',
    respRate: '22',
    glucose: '145',
  });

  const [assessment, setAssessment] = useState({
    complaint: 'Chest pain radiating to left arm, onset 30 minutes ago',
    observations: 'Patient conscious, diaphoretic, mild distress',
    medications: 'Aspirin 325mg administered, Nitroglycerin SL',
  });

  const handleSubmit = () => {
    toast({ title: '✅ Submitted to Hospital', description: 'Patient data sent to Max Hospital, Sector 19' });
  };

  const Field = ({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) => (
    <div>
      <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
      {editable ? (
        <Input value={value} onChange={e => onChange(e.target.value)} className="bg-muted/50 border-border h-9 text-sm" type={type} />
      ) : (
        <p className="text-sm text-foreground py-1.5">{value}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-medical" />
            Paramedic — Patient Module
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {editable ? 'Edit patient information and submit to hospital' : 'Read-only view of patient data'}
          </p>
        </motion.div>

        {/* Patient Info */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card p-5">
          <h2 className="text-md font-semibold text-foreground flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-secondary" /> Patient Information
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Field label="Full Name" value={patient.name} onChange={v => setPatient(p => ({ ...p, name: v }))} />
            <Field label="Age" value={patient.age} onChange={v => setPatient(p => ({ ...p, age: v }))} type="number" />
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Gender</label>
              {editable ? (
                <Select value={patient.gender} onValueChange={v => setPatient(p => ({ ...p, gender: v }))}>
                  <SelectTrigger className="bg-muted/50 border-border h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-foreground py-1.5 capitalize">{patient.gender}</p>
              )}
            </div>
            <Field label="Blood Group" value={patient.bloodGroup} onChange={v => setPatient(p => ({ ...p, bloodGroup: v }))} />
            <Field label="Allergies" value={patient.allergies} onChange={v => setPatient(p => ({ ...p, allergies: v }))} />
            <Field label="Existing Conditions" value={patient.conditions} onChange={v => setPatient(p => ({ ...p, conditions: v }))} />
          </div>
        </motion.div>

        {/* Vitals */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card p-5">
          <h2 className="text-md font-semibold text-foreground flex items-center gap-2 mb-4">
            <Heart className="w-4 h-4 text-primary" /> Live Vitals
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Field label="Heart Rate (bpm)" value={vitals.heartRate} onChange={v => setVitals(vt => ({ ...vt, heartRate: v }))} type="number" />
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Blood Pressure</label>
              <div className="flex gap-1">
                {editable ? (
                  <>
                    <Input value={vitals.bpSys} onChange={e => setVitals(v => ({ ...v, bpSys: e.target.value }))} className="bg-muted/50 border-border h-9 text-sm w-16" />
                    <span className="text-muted-foreground self-center">/</span>
                    <Input value={vitals.bpDia} onChange={e => setVitals(v => ({ ...v, bpDia: e.target.value }))} className="bg-muted/50 border-border h-9 text-sm w-16" />
                  </>
                ) : (
                  <p className="text-sm text-foreground py-1.5">{vitals.bpSys}/{vitals.bpDia}</p>
                )}
              </div>
            </div>
            <Field label="SpO2 (%)" value={vitals.spo2} onChange={v => setVitals(vt => ({ ...vt, spo2: v }))} type="number" />
            <Field label="Temperature (°F)" value={vitals.temp} onChange={v => setVitals(vt => ({ ...vt, temp: v }))} />
            <Field label="Resp Rate (/min)" value={vitals.respRate} onChange={v => setVitals(vt => ({ ...vt, respRate: v }))} type="number" />
            <Field label="Glucose (mg/dL)" value={vitals.glucose} onChange={v => setVitals(vt => ({ ...vt, glucose: v }))} type="number" />
          </div>
        </motion.div>

        {/* Clinical Assessment */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card p-5">
          <h2 className="text-md font-semibold text-foreground flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-warning" /> Clinical Assessment
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Chief Complaint</label>
              {editable ? (
                <Textarea value={assessment.complaint} onChange={e => setAssessment(a => ({ ...a, complaint: e.target.value }))} className="bg-muted/50 border-border text-sm min-h-[60px]" />
              ) : (
                <p className="text-sm text-foreground">{assessment.complaint}</p>
              )}
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Observations</label>
              {editable ? (
                <Textarea value={assessment.observations} onChange={e => setAssessment(a => ({ ...a, observations: e.target.value }))} className="bg-muted/50 border-border text-sm min-h-[60px]" />
              ) : (
                <p className="text-sm text-foreground">{assessment.observations}</p>
              )}
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Medications Administered</label>
              {editable ? (
                <Textarea value={assessment.medications} onChange={e => setAssessment(a => ({ ...a, medications: e.target.value }))} className="bg-muted/50 border-border text-sm min-h-[60px]" />
              ) : (
                <p className="text-sm text-foreground">{assessment.medications}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        {editable && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-3"
          >
            <Button onClick={handleSubmit} className="gradient-emergency text-primary-foreground hover:opacity-90">
              <Send className="w-4 h-4 mr-2" /> Submit to Hospital
            </Button>
            <Button variant="outline" className="border-border text-foreground hover:bg-muted">
              <Camera className="w-4 h-4 mr-2" /> Add Photo
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
