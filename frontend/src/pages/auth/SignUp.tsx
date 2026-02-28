import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { showErrorToast, validateForm } from "@/lib/utils";
import axiosInstance from "@/lib/axios";
import type { ErrorToastType } from "@/types";

const SignUp = () => {
  const navigate = useNavigate();
  const [btnLoading, setBtnLoading] = useState(false);

  const signUpBtnHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const formJson = Object.fromEntries(formData);
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

      if (!validateForm(e.currentTarget)) {
        return toast.error("Invalid inputs");
      }

      if (!regex.test((formJson.email as string).trim())) {
        return toast.error("Invalid Email");
      }

      if (formJson.password !== formJson.confirmPassword) {
        return toast.error("Password is not matched");
      }

      if (!passwordRegex.test(formJson.password as string)) {
        return toast.error(
          "Password must be 8+ chars with 1 uppercase & 1 lowercase.",
        );
      }

      setBtnLoading(true);
      const { data } = await axiosInstance.post("/auth/signup", {
        ...formJson,
      });

      toast.success(data.message);
      switch (data.status) {
        case "ALREADY_VERIFIED":
          navigate("/login");
          break;
        case "RESEND_VERIFICATION":
          navigate(`/verify/${data.user._id}`);
          break;
        case "NEW_USER":
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
    <div className="flex flex-1 items-center justify-center">
      <div className="w-full max-w-xs">
        <form
          className="flex flex-col gap-6"
          onSubmit={signUpBtnHandler}
          noValidate
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Sign up</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Enter your email below to signup to your account
            </p>
          </div>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="email"
                required
              />
            </div>
            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                type="password"
                id="password"
                name="password"
                placeholder="password"
                required
              />
            </div>
            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
              </div>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="password"
                required
              />
            </div>
            <Button
              type="submit"
              variant="default"
              className="w-full py-4 hover:cursor-pointer"
              disabled={btnLoading}
            >
              {btnLoading ? "Signing..." : "Signup"}
            </Button>
          </div>
          <div className="text-center text-sm">
            Already you have an account?{" "}
            <span
              className="underline underline-offset-4 hover:cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SignUp;
