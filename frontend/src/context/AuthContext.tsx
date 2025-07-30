import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Types
interface User {
  id: string;
  email: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // API base URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    
    setLoading(false);
  }, []);

  /**
   * Login function
   * @param email - User email
   * @param password - User password
   * @returns Promise<boolean> - Success status
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      const { token: newToken, user: newUser } = response.data;

      // Store in localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));

      // Update state
      setToken(newToken);
      setUser(newUser);

      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      toast.success('Login successful!');
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return false;
    }
  };

  /**
   * Register function
   * @param email - User email
   * @param password - User password
   * @returns Promise<boolean> - Success status
   */
  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        email,
        password
      });

      const { token: newToken, user: newUser } = response.data;

      // Store in localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));

      // Update state
      setToken(newToken);
      setUser(newUser);

      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      toast.success('Registration successful!');
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return false;
    }
  };

  /**
   * Logout function
   */
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Clear state
    setToken(null);
    setUser(null);

    // Remove authorization header
    delete axios.defaults.headers.common['Authorization'];

    toast.success('Logged out successfully!');
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};