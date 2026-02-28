import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/lib/axios";
import { showErrorToast } from "@/lib/utils";
import type { ErrorToastType } from "@/types/index";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const EmailVerify = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [btnLoading, setBtnLoading] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "Backspace") {
      setOtp((prev) => {
        const clone = prev.map((n, j) => {
          if (j === index) {
            return "";
          } else {
            return n;
          }
        });
        return clone;
      });
    }
    if (e.key === "Enter") {
      verifyHandler();
    }
  };

  const verifyHandler = async () => {
    try {
      setBtnLoading(true);
      const { data } = await axiosInstance.post(`/auth/verify-email/${token}`, {
        code: otp.join(""),
      });
      toast.success(data.message);
      switch (data.status) {
        case "VERIFIED":
          navigate("/login");
          break;
        default:
          console.warn("Unhandled status:", data.status);
      }
    } catch (err: unknown) {
      showErrorToast(err as ErrorToastType);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="w-full max-w-xs space-y-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Email Verification</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your 6-digit OTP code sent to your email
          </p>
        </div>
        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-2">
            {otp.map((digit, index) => (
              <Input
                key={index}
                type="text"
                maxLength={1}
                className="w-12 h-12 text-center text-lg"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
              />
            ))}
          </div>
          <Button
            variant="default"
            className="rounded-sm hover:cursor-pointer"
            onClick={verifyHandler}
            disabled={btnLoading}
          >
            {btnLoading ? "Verifying.." : "Verify OTP"}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default EmailVerify;
