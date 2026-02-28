import type { UserType } from "@/types";
import axiosInstance from "@/lib/axios";
import { clearJWT, getJWT } from "@/lib/utils";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AuthContext, type AuthContextType } from "../context/auth-context";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<UserType | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const setUser = useCallback((nextUser: UserType) => {
    setUserState(nextUser);
  }, []);

  const clearUser = useCallback(() => {
    clearJWT();
    setUserState(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      setAuthLoading(true);
      const token = getJWT();
      if (!token) {
        setUserState(null);
        return;
      }

      const { data } = await axiosInstance.get("/auth/valid-user");
      if (data.status === "USER_EXISTS" && data.user) {
        setUserState(data.user);
      } else {
        clearUser();
      }
    } catch {
      clearUser();
    } finally {
      setAuthLoading(false);
    }
  }, [clearUser]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isVerified: Boolean(user?._id && user?.isVerified),
      authLoading,
      setUser,
      clearUser,
      refreshUser,
    }),
    [user, authLoading, setUser, clearUser, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
