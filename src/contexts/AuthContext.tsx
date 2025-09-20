import {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
} from 'react';
import scoutApi from '../services/scoutApi';
import type { User } from '../services/scoutApi.types';

type AuthProviderProps = {
  children: ReactNode;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserFromToken = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const userData = await scoutApi.getUserData();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error(
            'Falha ao buscar dados do usuário, limpando token:',
            error
          );
          localStorage.removeItem('authToken');
        }
      }
      setIsLoading(false);
    };

    loadUserFromToken();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
