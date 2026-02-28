import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GrocerySearch } from "@/components/shared/GrocerySearch";
import MobileGrocerySearch from "@/components/shared/MobileGrocerySearch";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import useCart from "@/hooks/useCart";
import axiosInstance from "@/lib/axios";
import { clearJWT, showErrorToast } from "@/lib/utils";
import type { ErrorToastType } from "@/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoCartOutline } from "react-icons/io5";
import { LuSearch } from "react-icons/lu";
import { SiSinglestore } from "react-icons/si";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const { setTheme } = useTheme();
  const navigate = useNavigate();
  const { isVerified, user, clearUser } = useAuth();
  const { totalItems } = useCart();
  const [searchQueries, setSearchQueries] = useState<string[]>([]);
  const [searchModelMob, setSearchModdelMob] = useState(false);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const { data } = await axiosInstance.get("/product-lists");
        if (data.status === "FETCHED") {
          const list = data?.productsList?.productSearchQuery;
          setSearchQueries(Array.isArray(list) ? list : []);
        }
      } catch (error) {
        showErrorToast(error as ErrorToastType);
      }
    };

    fetchQueries();
  }, []);

  const onLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      clearJWT();
      clearUser();
      toast.success("Logout successfully");
      navigate("/");
    } catch {
      console.error("Error on logout");
    }
  };

  return (
    <header className="flex gap-2 items-center justify-between w-full p-2 pb-4 sm:p-4 sticky top-0 bg-background z-50">
      <button
        type="button"
        className="text-xl flex items-center justify-center gap-3 font-semibold hover:cursor-pointer"
        onClick={() => navigate("/")}
      >
        <SiSinglestore className="size-8 text-primary" />
        <span className="hidden sm:inline-block font-bold">QRS Ecom</span>
      </button>

      <GrocerySearch searchQueries={searchQueries} />

      <div className="flex items-center gap-4 sm:gap-8 sm:pe-5">
        <button
          type="button"
          className="cursor-pointer hidden sm:flex flex-col items-center gap-1 relative"
          onClick={() => navigate("/cart")}
        >
          <IoCartOutline className="text-2xl" />
          <Badge
            variant="default"
            className="rounded-full w-5 h-5 bg-green-600 absolute -top-2 left-5"
          >
            {totalItems}
          </Badge>
        </button>

        <button
          type="button"
          className="hover:cursor-pointer sm:hidden"
          onClick={() => {
            setSearchModdelMob(true);
          }}
        >
          <LuSearch />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src={user?.profilePic} className="cursor-pointer" />
              <AvatarFallback className="cursor-pointer">
                {user?.username?.[0] ?? "E"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuGroup>
              {isVerified ? (
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  Profile
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuItem
                className="sm:hidden"
                onClick={() => navigate("/cart")}
              >
                Cart
              </DropdownMenuItem>
              {isVerified ? <DropdownMenuItem>Orders</DropdownMenuItem> : null}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                      System
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              {isVerified ? (
                <DropdownMenuItem>Settings</DropdownMenuItem>
              ) : null}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {isVerified ? (
              <DropdownMenuItem onClick={onLogout}>Log out</DropdownMenuItem>
            ) : (
              <>
                <DropdownMenuItem onClick={() => navigate("/signup")}>
                  Create Account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/login")}>
                  Login
                </DropdownMenuItem>
              </>
            )}
            {!isVerified ? (
              <DropdownMenuItem onClick={() => navigate("/admin/login")}>
                Admin Login
              </DropdownMenuItem>
            ) : null}
            {user?.roles?.includes("admin") ? (
              <DropdownMenuItem onClick={() => navigate("/admin")}>
                Admin Panel
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
        <MobileGrocerySearch
          open={searchModelMob}
          close={setSearchModdelMob}
          searchQueries={searchQueries}
        />
      </div>
    </header>
  );
};

export default NavBar;
