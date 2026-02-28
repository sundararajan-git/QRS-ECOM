import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useCart from "@/hooks/useCart";
import axiosInstance from "@/lib/axios";
import type { ErrorToastType } from "@/types";
import { showErrorToast } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import toast from "react-hot-toast";
import { BsCurrencyRupee } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [shippingData, setShippingData] = useState<{
    street: string;
    city: string;
    state: string;
    pincode: string;
  } | null>(null);

  const handleCheckoutSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!items.length) {
      toast.error("Cart is empty");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const shippingAddress = {
      street: String(formData.get("street") || ""),
      city: String(formData.get("city") || ""),
      state: String(formData.get("state") || ""),
      pincode: String(formData.get("pincode") || ""),
    };

    setShippingData(shippingAddress);
    setPaymentOpen(true);
  };

  const processMockPaymentAndOrder = async () => {
    if (!shippingData) return;

    try {
      setPaymentProcessing(true);
      // Simulate payment delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Payment processed successfully!");

      setPaymentOpen(false);
      setLoading(true);
      const { data } = await axiosInstance.post("/order", {
        items: items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.discountPrice || item.product.price,
        })),
        paymentMethod: "card", // Mock payment changed to card
        shippingAddress: shippingData,
      });

      if (data.status === "CREATED") {
        toast.success("Order placed successfully");
        clearCart();
        navigate("/profile");
      }
    } catch (error) {
      showErrorToast(error as ErrorToastType);
    } finally {
      setLoading(false);
      setPaymentProcessing(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <p className="text-sm text-muted-foreground">
          Confirm shipping details and place your order.
        </p>
      </div>
      <div className="flex items-center gap-2 text-xs sm:text-sm">
        <span className="rounded-full border px-3 py-1 text-muted-foreground">
          Cart
        </span>
        <span className="text-muted-foreground">{"->"}</span>
        <span className="rounded-full bg-primary px-3 py-1 text-primary-foreground">
          Checkout
        </span>
        <span className="text-muted-foreground">{"->"}</span>
        <span className="rounded-full border px-3 py-1 text-muted-foreground">
          Confirmation
        </span>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <form
          onSubmit={handleCheckoutSubmit}
          className="space-y-4 rounded-xl border bg-card p-4 sm:p-5"
        >
          <h2 className="text-lg font-semibold">Shipping Address</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="street">Street</Label>
              <Input id="street" name="street" required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="state">State</Label>
              <Input id="state" name="state" required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="pincode">Pincode</Label>
              <Input id="pincode" name="pincode" required />
            </div>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Placing Order..." : "Place Order"}
          </Button>
        </form>

        <aside className="sticky top-20 h-fit space-y-3 rounded-xl border bg-card p-4">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <p className="text-sm text-muted-foreground">
            Total products: {items.length}
          </p>
          <div className="space-y-1">
            {items.slice(0, 3).map((item) => (
              <p
                key={item.product._id}
                className="line-clamp-1 text-sm text-muted-foreground"
              >
                {item.quantity} x {item.product.name}
              </p>
            ))}
            {items.length > 3 ? (
              <p className="text-xs text-muted-foreground">
                +{items.length - 3} more items
              </p>
            ) : null}
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between font-semibold">
            <span>Total</span>
            <span className="inline-flex items-center">
              <BsCurrencyRupee />
              {totalPrice.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            A mock payment screen will appear to simulate checkout.
          </p>
        </aside>
      </div>

      <Dialog
        open={paymentOpen}
        onOpenChange={(open) => !paymentProcessing && setPaymentOpen(open)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mock Payment</DialogTitle>
            <DialogDescription>
              Complete your payment of{" "}
              <BsCurrencyRupee className="inline-block -mt-0.5" />
              {totalPrice.toFixed(2)} to place the order.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6 space-y-4 bg-muted/50 rounded-lg border border-dashed">
            {paymentProcessing ? (
              <>
                <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-medium">
                  Processing payment safely...
                </p>
              </>
            ) : (
              <>
                <div className="size-12 bg-primary/20 text-primary flex items-center justify-center rounded-full text-2xl font-bold">
                  ₹
                </div>
                <p className="text-sm text-center text-muted-foreground">
                  Click 'Pay Now' to simulate a successful transaction and
                  confirm your order.
                </p>
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPaymentOpen(false)}
              disabled={paymentProcessing}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={processMockPaymentAndOrder}
              disabled={paymentProcessing}
            >
              {paymentProcessing ? "Paying..." : "Pay Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checkout;
