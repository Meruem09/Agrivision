import React, { createContext, useContext, useState, useEffect } from 'react';

interface Alert {
  id: string;
  type: 'water_stress' | 'nutrient_deficiency' | 'pest_risk' | 'disease_detected';
  severity: 'low' | 'medium' | 'high';
  crop: 'wheat' | 'cotton' | 'rice';
  location: string;
  message: string;
  timestamp: Date;
  read: boolean;
  confidence: number;
}

interface AlertContextType {
  alerts: Alert[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'read'>) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Mock initial alerts
    const mockAlerts: Alert[] = [
      {
        id: '1',
        type: 'water_stress',
        severity: 'high',
        crop: 'wheat',
        location: 'Field A, Block 2',
        message: 'Severe water stress detected in wheat field. NDMI values below 0.3.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false,
        confidence: 87
      },
      {
        id: '2',
        type: 'nutrient_deficiency',
        severity: 'medium',
        crop: 'cotton',
        location: 'Field B, Block 1',
        message: 'Nitrogen deficiency detected. NDVI dropping in cotton fields.',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        read: false,
        confidence: 76
      },
      {
        id: '3',
        type: 'pest_risk',
        severity: 'low',
        crop: 'rice',
        location: 'Field C, Block 3',
        message: 'Potential pest activity detected in rice paddies.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
        read: true,
        confidence: 62
      }
    ];

    setAlerts(mockAlerts);
  }, []);

  const unreadCount = alerts.filter(alert => !alert.read).length;

  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const addAlert = (alertData: Omit<Alert, 'id' | 'timestamp' | 'read'>) => {
    const newAlert: Alert = {
      ...alertData,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  return (
    <AlertContext.Provider value={{ alerts, unreadCount, markAsRead, addAlert }}>
      {children}
    </AlertContext.Provider>
  );
};