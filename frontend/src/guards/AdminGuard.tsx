import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

const AdminGuard = () => {
  const { isVerified, user } = useAuth();

  if (!isVerified) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!user?.roles?.includes("admin")) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full border rounded-lg p-6 text-center space-y-3">
          <h2 className="text-2xl font-semibold">Access denied</h2>
          <p className="text-sm text-muted-foreground">
            This page is available only for admin users.
          </p>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default AdminGuard;
