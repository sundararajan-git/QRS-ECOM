import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import EmailVerify from "./pages/auth/EmailVerify";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import AuthLayout from "./layout/AuthLayout";
import { Toaster } from "react-hot-toast";
import { useTheme } from "./hooks/useTheme";
import Home from "./pages/home/Home";
import ProductsList from "./pages/products/ProductsList";
import ProductDetails from "./pages/products/ProductDetails";
import AppLayout from "./layout/AppLayout";
import AuthGuard from "./guards/AuthGuard";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminGuard from "./guards/AdminGuard";
import AdminLayout from "./layout/AdminLayout";
import Categories from "./pages/admin/Categories";
import Products from "./pages/admin/Products";
import { useAuth } from "./hooks/useAuth";
import Spinner from "./components/shared/Spinner";
import Cart from "./pages/cart/Cart";
import RequireAuth from "./guards/RequireAuth";
import Checkout from "./pages/checkout/Checkout";
import Profile from "./pages/profile/Profile";

const App = () => {
  const { theme } = useTheme();
  const { authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="w-full h-screen items-center justify-center">
        <Spinner text="Loading.." />
      </div>
    );
  }

  return (
    <div>
      <Routes>
        <Route element={<AuthGuard />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<ProductsList />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route element={<RequireAuth />}>
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />

          <Route element={<AuthLayout />}>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify/:token" element={<EmailVerify />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Route>
        </Route>

        <Route path="/admin" element={<AdminGuard />}>
          <Route element={<AdminLayout />}>
            <Route
              index
              element={<Navigate to="/admin/categories" replace />}
            />
            <Route path="categories" element={<Categories />} />
            <Route path="products" element={<Products />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: theme === "dark" ? "#030712" : "#fff",
            color: theme === "dark" ? "#fff" : "#000",
            padding: "10px 20px 10px 20px",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          },
        }}
      />
    </div>
  );
};
export default App;
