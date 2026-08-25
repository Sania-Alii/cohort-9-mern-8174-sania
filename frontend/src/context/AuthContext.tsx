import { createContext, useState, useEffect, ReactNode } from 'react';

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isInitialized: boolean;
  login: (userData: AuthUser, userToken: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // check if user is already logged in 
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    
    setIsInitialized(true);
  }, []);

  // run after getting a successful login response from API
  const login = (userData: AuthUser, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    
    // save to local storage so user stays logged in after page refresh
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, isInitialized, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};