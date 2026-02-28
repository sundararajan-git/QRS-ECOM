import { CartContext } from "@/context/cart-context";
import { useContext } from "react";

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

export default useCart;
