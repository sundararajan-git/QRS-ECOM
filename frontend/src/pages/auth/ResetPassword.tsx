import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { showErrorToast, validateForm } from "@/lib/utils";
import axiosInstance from "@/lib/axios";
import type { ErrorToastType } from "@/types";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [btnLoading, setBtnLoading] = useState(false);

  const logInBtnHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const formJson = Object.fromEntries(formData);

      if (!validateForm(e.currentTarget)) {
        return toast.error("Invalid inputs");
      }

      setBtnLoading(true);

      const { data } = await axiosInstance.put(
        `/auth/reset-password/${token}`,
        {
          ...formJson,
        },
      );

      toast.success(data.message);
      switch (data.status) {
        case "PASSWORD_RESET_DONE":
          navigate("/login");
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
          onSubmit={logInBtnHandler}
          noValidate
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Reset Password</h1>
          </div>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                name="password"
                placeholder="password"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full hover:cursor-pointer"
              disabled={btnLoading}
            >
              {btnLoading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ResetPassword;
