import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export interface User {
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  register: (username: string, email: string, password: string) => boolean;
  logout: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("t4mh_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("t4mh_user");
      }
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Default test credentials
    const isDefaultUser = 
      (username.toLowerCase() === "admin" && password === "composer123") ||
      (username.toLowerCase() === "keith" && password === "piano123") ||
      (username.toLowerCase() === "demo" && password === "music2024");

    if (isDefaultUser) {
      const loggedUser = {
        username: username.charAt(0).toUpperCase() + username.slice(1),
        email: `${username.toLowerCase()}@t4mh-music.com`
      };
      setUser(loggedUser);
      localStorage.setItem("t4mh_user", JSON.stringify(loggedUser));
      setShowAuthModal(false);
      toast.success(`Welcome back, ${loggedUser.username}!`);
      return true;
    }

    // Custom signups from localStorage
    const savedAccounts = localStorage.getItem("t4mh_accounts");
    if (savedAccounts) {
      try {
        const accounts = JSON.parse(savedAccounts);
        const match = accounts.find(
          (acc: any) => acc.username.toLowerCase() === username.toLowerCase() && acc.password === password
        );
        if (match) {
          const loggedUser = { username: match.username, email: match.email };
          setUser(loggedUser);
          localStorage.setItem("t4mh_user", JSON.stringify(loggedUser));
          setShowAuthModal(false);
          toast.success(`Welcome back, ${match.username}!`);
          return true;
        }
      } catch (e) {
        console.error(e);
      }
    }

    toast.error("Invalid credentials. Try: admin / composer123");
    return false;
  };

  const register = (username: string, email: string, password: string): boolean => {
    if (!username || !email || !password) {
      toast.error("Please fill in all fields.");
      return false;
    }

    const savedAccounts = localStorage.getItem("t4mh_accounts") || "[]";
    try {
      const accounts = JSON.parse(savedAccounts);
      const exists = accounts.some(
        (acc: any) => acc.username.toLowerCase() === username.toLowerCase() || acc.email.toLowerCase() === email.toLowerCase()
      );

      if (exists || ["admin", "keith", "demo"].includes(username.toLowerCase())) {
        toast.error("Username or email already taken.");
        return false;
      }

      const newAccount = { username, email, password };
      accounts.push(newAccount);
      localStorage.setItem("t4mh_accounts", JSON.stringify(accounts));

      const loggedUser = { username, email };
      setUser(loggedUser);
      localStorage.setItem("t4mh_user", JSON.stringify(loggedUser));
      setShowAuthModal(false);
      toast.success(`Account created successfully! Welcome, ${username}!`);
      return true;
    } catch (e) {
      toast.error("Registration failed. Please try again.");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("t4mh_user");
    toast.success("Logged out successfully.");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        showAuthModal,
        setShowAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
