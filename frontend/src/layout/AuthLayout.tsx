import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { LuMoonStar, LuSunMedium } from "react-icons/lu";
import { SiSinglestore } from "react-icons/si";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className={`grid min-h-svh grid-cols-1`}>
      <div className={`flex p-6 md:p-10 flex-col gap-4`}>
        <div className="flex gap-2 justify-between">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md">
              <SiSinglestore className="size-8 text-primary" />
            </div>
            <span className="text-xl font-bold">QRS Ecom</span>
          </a>
          <Button
            variant="ghost"
            className="cursor-pointer rounded-full hover:bg-transparent dark:hover:bg-transparent"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <LuSunMedium className="size-5" />
            ) : (
              <LuMoonStar className="size-4" />
            )}
          </Button>
        </div>
        <Outlet />
      </div>
    </div>
  );
};
export default AuthLayout;
