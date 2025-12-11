import { createContext, useContext, useState, type ReactNode } from 'react';
import { type Member } from '@/types';
import { mockAuthUsers } from '@/mock-list';

export type AuthUser = Omit<Member, 'password'> & {
  userId?: string;
  token?: string;
};

interface AuthContextType {
  user: AuthUser | null;
  login: (userId: string, pass: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('authUser');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (userId: string, pass: string): Promise<boolean> => {
    const found: Member | undefined = mockAuthUsers.find(
      (u) => (u.id === userId || u.email === userId) && u.password === pass
    );

    if (found) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userData } = found;

      const authUser: AuthUser = {
        ...userData,
        userId: found.id,
      };

      setUser(authUser);
      localStorage.setItem('authUser', JSON.stringify(authUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
