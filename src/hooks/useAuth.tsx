import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type UserType = "student" | "parent" | "admin";

interface User {
  type: UserType;
  name: string;
  email: string;
  isPremium?: boolean;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  login: (userType: UserType, userData: any) => void;
  logout: () => void;
  isAuthenticated: boolean;
  setPremiumStatus: (isPremium: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("eduzone-user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userType: UserType, userData: any) => {
    const user: User = {
      type: userType,
      ...userData
    };
    setUser(user);
    localStorage.setItem("eduzone-user", JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("eduzone-user");
  };

  const setPremiumStatus = (isPremium: boolean) => {
    if (user) {
      const updatedUser = { ...user, isPremium };
      setUser(updatedUser);
      localStorage.setItem("eduzone-user", JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    setPremiumStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}