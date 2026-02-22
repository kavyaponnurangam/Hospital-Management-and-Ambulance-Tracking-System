import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'hospital' | 'patient' | 'dispatch';

interface User {
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (name: string, role: UserRole) => void;
  logout: () => void;
  canEdit: (module: string) => boolean;
  canView: (module: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const PERMISSIONS: Record<UserRole, { edit: string[]; view: string[] }> = {
  hospital: {
    edit: ['facility', 'team-status'],
    view: ['incoming-patients', 'statistics', 'ambulance', 'paramedic', 'tracking'],
  },
  patient: {
    edit: ['sos', 'health-profile'],
    view: ['ambulance', 'hospital', 'paramedic', 'tracking', 'family'],
  },
  dispatch: {
    edit: ['patient-data', 'paramedic'],
    view: ['hospital', 'command', 'tracking', 'ambulance'],
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (name: string, role: UserRole) => setUser({ name, role });
  const logout = () => setUser(null);

  const canEdit = (module: string) => {
    if (!user) return false;
    return PERMISSIONS[user.role].edit.includes(module);
  };

  const canView = (module: string) => {
    if (!user) return false;
    return [...PERMISSIONS[user.role].edit, ...PERMISSIONS[user.role].view].includes(module);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, canEdit, canView }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
