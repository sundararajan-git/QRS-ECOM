import type { UserType } from "@/types";
import { createContext } from "react";

export type AuthContextType = {
  user: UserType | null;
  isVerified: boolean;
  authLoading: boolean;
  setUser: (user: UserType) => void;
  clearUser: () => void;
  refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);
