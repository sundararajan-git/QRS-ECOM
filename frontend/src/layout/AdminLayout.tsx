import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { clearJWT } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { SiSinglestore } from "react-icons/si";
import { LuListTree, LuPackage, LuLogOut, LuMenu } from "react-icons/lu";
import { useState } from "react";

const adminLinks = [
  { title: "Categories", to: "/admin/categories", icon: LuListTree },
  { title: "Products", to: "/admin/products", icon: LuPackage },
];

const AdminLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { clearUser } = useAuth();
  const [open, setOpen] = useState(false);

  const logout = () => {
    clearJWT();
    clearUser();
    navigate("/");
  };

  return (
    <div className="min-h-screen grid md:grid-cols-[250px_1fr] bg-muted/10 transition-all duration-300">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col border-r bg-background/95 backdrop-blur-sm px-4 py-6 sticky top-0 h-screen">
        <div className="flex flex-col h-full">
          <button
            type="button"
            className="text-xl flex items-center gap-3 font-semibold hover:cursor-pointer mb-8 px-2 tracking-tight"
            onClick={() => {
              navigate("/");
              setOpen(false);
            }}
          >
            <SiSinglestore className="size-8 text-primary" />
            <span className="font-bold">QRS Ecom</span>
            <span className="text-[10px] uppercase font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-sm ml-auto">
              Admin
            </span>
          </button>
          <nav className="space-y-1.5 flex-1">
            {adminLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.to);
              return (
                <Button
                  key={link.to}
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 h-11 ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold hover:bg-primary/20"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  onClick={() => {
                    navigate(link.to);
                    setOpen(false);
                  }}
                >
                  <Icon className="size-5" />
                  {link.title}
                </Button>
              );
            })}
          </nav>
          <div className="pt-4 mt-auto">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-11 text-red-500 hover:text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-950/50 transition-colors"
              onClick={logout}
            >
              <LuLogOut className="size-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header & Main Content */}
      <div className="flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between h-16 px-4 border-b bg-background/95 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center gap-2 font-bold text-lg">
            <SiSinglestore className="size-6 text-primary" />
            <span className="tracking-tight">QRS Ecom</span>
            <span className="text-[10px] uppercase font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-sm ml-1">
              Admin
            </span>
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden -mr-2">
                <LuMenu className="size-6" />
                <span className="sr-only">Toggle Admin Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[280px] p-6 border-r shadow-2xl"
            >
              <div className="flex flex-col h-full">
                <button
                  type="button"
                  className="text-xl flex items-center gap-3 font-semibold hover:cursor-pointer mb-8 px-2 tracking-tight"
                  onClick={() => {
                    navigate("/");
                    setOpen(false);
                  }}
                >
                  <SiSinglestore className="size-8 text-primary" />
                  <span className="font-bold">QRS Ecom</span>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-sm ml-auto">
                    Admin
                  </span>
                </button>
                <nav className="space-y-1.5 flex-1">
                  {adminLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname.startsWith(link.to);
                    return (
                      <Button
                        key={link.to}
                        variant={isActive ? "secondary" : "ghost"}
                        className={`w-full justify-start gap-3 h-11 ${
                          isActive
                            ? "bg-primary/10 text-primary font-semibold hover:bg-primary/20"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                        onClick={() => {
                          navigate(link.to);
                          setOpen(false);
                        }}
                      >
                        <Icon className="size-5" />
                        {link.title}
                      </Button>
                    );
                  })}
                </nav>
                <div className="pt-4 mt-auto">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-11 text-red-500 hover:text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-950/50 transition-colors"
                    onClick={logout}
                  >
                    <LuLogOut className="size-5" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto w-full animate-in fade-in duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
