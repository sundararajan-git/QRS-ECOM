import type { CartItemType, ProductType } from "@/types";
import { createContext } from "react";

export type CartContextType = {
  items: CartItemType[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: ProductType, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextType | null>(null);
