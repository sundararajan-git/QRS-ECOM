import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet, matchPath, useLocation } from "react-router-dom";

const publicRoutes = [
  "/signup",
  "/login",
  "/verify/:token",
  "/forgot-password",
  "/reset-password/:token",
  "/admin/login",
];

const AuthGuard = () => {
  const { isVerified } = useAuth();
  const location = useLocation();

  const isPublicRoute = publicRoutes.some((route) =>
    matchPath({ path: route, end: true }, location.pathname)
  );

  if (isVerified && isPublicRoute) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
