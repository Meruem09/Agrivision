import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'farmer' | 'admin';
  phone?: string;
  farmLocation?: {
    lat: number;
    lng: number;
    district: string;
    village: string;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock users for demo
  const mockUsers = {
    'farmer@demo.com': {
      id: '1',
      name: 'રાજેશ પટેલ',
      email: 'farmer@demo.com',
      role: 'farmer' as const,
      phone: '+91 98765 43210',
      farmLocation: {
        lat: 23.0225,
        lng: 72.5714,
        district: 'Ahmedabad',
        village: 'Sanand'
      }
    },
    'admin@demo.com': {
      id: '2',
      name: 'Dr. Priya Sharma',
      email: 'admin@demo.com',
      role: 'admin' as const,
      phone: '+91 98765 43211'
    }
  };

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('AgriVision_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);

    // Mock authentication delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check if it's one of the predefined demo users
    const mockUser = mockUsers[email as keyof typeof mockUsers];
    if (mockUser && password === 'demo123') {
      setUser(mockUser);
      localStorage.setItem('AgriVision_user', JSON.stringify(mockUser));
      setLoading(false);
      return true;
    }

    // Allow random login (Simulated SignUp/Login)
    // If it's not a predefined user, we create a new temporary user session
    // This allows the user's request: "if i write my own email n password random, then i should be able to login"
    if (email && password) {
      const newUser: User = {
        id: Date.now().toString(),
        name: email.split('@')[0], // Use part of email as name
        email: email,
        role: 'farmer', // Default to farmer role
        // Default location to roughly central Gujarat for map functionality
        farmLocation: {
          lat: 23.0225,
          lng: 72.5714,
          district: 'Unknown',
          village: 'Unknown'
        }
      };

      setUser(newUser);
      localStorage.setItem('AgriVision_user', JSON.stringify(newUser));
      setLoading(false);
      return true;
    }

    setLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('AgriVision_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};