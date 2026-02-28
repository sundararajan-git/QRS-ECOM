import { Button } from "@/components/ui/button";
import useCart from "@/hooks/useCart";
import { BsCurrencyRupee } from "react-icons/bs";
import { LuMinus, LuPlus, LuTrash2 } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();

  if (!items.length) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 rounded-xl border bg-card/20">
        <p className="text-lg font-medium">Your cart is empty.</p>
        <p className="text-sm text-muted-foreground">Add products from the catalog to continue.</p>
        <Button onClick={() => navigate("/")}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Shopping Cart</h1>
          <p className="text-sm text-muted-foreground">Review items before checkout</p>
        </div>
        <Button variant="outline" onClick={clearCart}>
          Clear Cart
        </Button>
      </div>

      <div className="flex items-center gap-2 text-xs sm:text-sm">
        <span className="rounded-full bg-primary px-3 py-1 text-primary-foreground">Cart</span>
        <span className="text-muted-foreground">{"->"}</span>
        <span className="rounded-full border px-3 py-1 text-muted-foreground">Checkout</span>
        <span className="text-muted-foreground">{"->"}</span>
        <span className="rounded-full border px-3 py-1 text-muted-foreground">Confirmation</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="space-y-3">
          {items.map((item) => {
            const price = Number(item.product.discountPrice || item.product.price || 0);
            const itemTotal = price * item.quantity;
            return (
              <div key={item.product._id} className="flex gap-3 rounded-xl border bg-card p-3 transition-all hover:shadow-sm sm:p-4">
                <div className="size-[5.5rem] overflow-hidden rounded-lg bg-muted">
                  <img
                    src={item.product.images?.[0] || "https://placehold.co/160x160?text=No+Image"}
                    alt={item.product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between gap-2">
                  <div className="space-y-1">
                    <p className="font-semibold">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">{item.product.category}</p>
                    <p className="inline-flex items-center font-semibold">
                      <BsCurrencyRupee />
                      {price}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      >
                        <LuMinus className="size-4" />
                      </Button>
                      <span className="min-w-6 text-center">{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      >
                        <LuPlus className="size-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-3">
                      <p className="inline-flex items-center font-semibold">
                        <BsCurrencyRupee />
                        {itemTotal.toFixed(2)}
                      </p>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => removeFromCart(item.product._id)}
                      >
                        <LuTrash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <aside className="sticky top-20 h-fit space-y-3 rounded-xl border bg-card p-4">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <div className="flex items-center justify-between text-sm">
            <span>Items</span>
            <span>{totalItems}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Subtotal</span>
            <span className="inline-flex items-center">
              <BsCurrencyRupee />
              {totalPrice.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Delivery</span>
            <span className="text-green-600">Free</span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between text-base font-semibold">
            <span>Total</span>
            <span className="inline-flex items-center">
              <BsCurrencyRupee />
              {totalPrice.toFixed(2)}
            </span>
          </div>
          <Button className="w-full" onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </Button>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
