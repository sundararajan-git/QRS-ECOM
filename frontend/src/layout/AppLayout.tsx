import Footer from "@/components/shared/Footer";
import NavBar from "@/components/shared/NavBar";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <NavBar />
      <main className="flex-1 w-full">
        <div className="mx-auto w-full max-w-[1400px] px-2 pb-8 pt-4 sm:px-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
