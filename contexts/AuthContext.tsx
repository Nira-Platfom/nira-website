"use client";
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import api from "@/lib/api";

interface User {
  id: string;
  full_name: string;
  email: string;
}

interface Business {
  id: string;
  name: string;
  type: "salon_spa" | "cosmetic_shop";
  city: string;
  whatsapp_connected: boolean;
  bot_active: boolean;
  onboarding_completed: boolean;
  bot_code?: string | null;
  whatsapp_link?: string | null;
}

interface BusinessSummary {
  id: string;
  name: string;
  type: "salon_spa" | "cosmetic_shop";
  role: string;
  is_active_business: boolean;
}

interface AuthContextType {
  user: User | null;
  business: Business | null;
  role: string | null;
  permissions: string[];
  businesses: BusinessSummary[];
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  switchBusiness: (id: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [businesses, setBusinesses] = useState<BusinessSummary[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("nira_token");
      if (!token) {
        setIsLoading(false);
        return;
      }
      const [{ data: me }, { data: profile }] = await Promise.all([
        api.get("/auth/me"),
        api.get("/business/profile"),
      ]);
      setUser(me.user);
      setBusiness({ ...me.active_business, ...profile });
      setRole(me.role);
      setPermissions(me.permissions || []);
      setBusinesses(me.businesses || []);
    } catch {
      localStorage.removeItem("nira_token");
      setUser(null);
      setBusiness(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (token: string) => {
    localStorage.setItem("nira_token", token);
    setIsLoading(true);
    await refreshUser();
  };

  const logout = () => {
    localStorage.removeItem("nira_token");
    setUser(null);
    setBusiness(null);
    setRole(null);
    setBusinesses([]);
    window.location.href = "/login";
  };

  const switchBusiness = async (id: string) => {
    const { data } = await api.post("/businesses/switch", { business_id: id });
    localStorage.setItem("nira_token", data.access_token);
    await refreshUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        business,
        businesses,
        role,
        permissions,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        switchBusiness,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
