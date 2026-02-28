import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { showErrorToast, setJWT, validateForm } from "@/lib/utils";
import axiosInstance from "@/lib/axios";
import type { ErrorToastType } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { LuArrowLeft } from "react-icons/lu";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [btnLoading, setBtnLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const logInBtnHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const formJson = Object.fromEntries(formData);
      const email = String(formJson.email || "").trim();
      const password = String(formJson.password || "");
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!validateForm(e.currentTarget)) {
        return toast.error("Invalid inputs");
      }
      if (!emailRegex.test(email)) {
        return toast.error("Please enter a valid admin email");
      }
      if (!password.trim()) {
        return toast.error("Password is required");
      }

      setBtnLoading(true);

      const { data } = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      toast.success(data.message);

      switch (data.status) {
        case "LOGINED": {
          const isAdmin =
            Array.isArray(data?.user?.roles) &&
            data.user.roles.includes("admin");
          if (!isAdmin) {
            return toast.error("This account does not have admin access");
          }
          setUser(data.user);
          setJWT(data.jwtToken);
          navigate("/admin/categories");
          break;
        }
        case "RESEND_VERIFICATION":
          navigate(`/verify/${data.user._id}`);
          break;
        default:
          console.warn("Unhandled status:", data.status);
      }
    } catch (err) {
      showErrorToast(err as ErrorToastType);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh items-center justify-center px-2 sm:px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card/80 p-5 shadow-lg backdrop-blur sm:p-7">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-colors mb-2"
        >
          <LuArrowLeft className="size-4" />
          <span>Back to Store</span>
        </button>

        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Admin Portal
            </p>
            <h1 className="text-2xl font-semibold leading-tight">
              Secure Admin Login
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to manage products, categories, and platform settings.
            </p>
          </div>
          <div className="rounded-xl border bg-background p-2.5 text-primary">
            <ShieldCheck className="size-5" />
          </div>
        </div>

        <form
          className="flex flex-col gap-5"
          onSubmit={logInBtnHandler}
          noValidate
        >
          <div className="grid gap-5">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="admin@company.com"
                  required
                  autoComplete="email"
                  className="h-11 pl-10"
                />
              </div>
            </div>
            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="h-11 pl-10 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="h-11 w-full hover:cursor-pointer"
              disabled={btnLoading}
            >
              {btnLoading ? "Signing in..." : "Login to Admin"}
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Need customer access?{" "}
            <span
              className="underline underline-offset-4 hover:cursor-pointer text-foreground"
              onClick={() => navigate("/login")}
            >
              Login here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
