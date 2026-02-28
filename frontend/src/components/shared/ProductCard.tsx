import { Button } from "@/components/ui/button";
import useCart from "@/hooks/useCart";
import type { ProductType } from "@/types";
import { BsCurrencyRupee } from "react-icons/bs";
import { FaRegStar, FaStar, FaStarHalf } from "react-icons/fa6";
import { IoBookmarkOutline } from "react-icons/io5";
import { LuMinus, LuPlus, LuTrash2 } from "react-icons/lu";
import { useMemo, useState } from "react";

type ProductCardProps = {
  product: ProductType;
  onOpen: (id: string) => void;
};

const ProductCard = ({ product, onOpen }: ProductCardProps) => {
  const { addToCart, items, updateQuantity } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);

  const quantity = useMemo(() => {
    const cartItem = items.find((item) => item.product._id === product._id);
    return cartItem?.quantity || 0;
  }, [items, product._id]);

  const isLowStock =
    Number(product.stock || 0) > 0 && Number(product.stock || 0) <= 10;

  if (!imageLoaded) {
    return (
      <div className="relative h-fit overflow-hidden rounded-2xl border bg-card px-2 py-4 shadow-none sm:p-4">
        <div className="h-44 w-full rounded-xl bg-muted animate-pulse" />

        <div className="flex flex-col gap-3 pt-3 px-1">
          <div className="flex flex-col gap-1">
            <div className="w-16 h-2.5 rounded-full bg-muted animate-pulse" />
            <div className="w-3/4 h-4 rounded-full bg-muted animate-pulse" />
            <div className="hidden sm:flex items-center gap-1 mt-0.5">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="size-3 rounded-sm bg-muted animate-pulse"
                />
              ))}
              <div className="ml-1.5 w-6 h-2.5 rounded-full bg-muted animate-pulse" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/50">
            <div className="w-16 h-5 rounded-full bg-muted animate-pulse" />
            <div className="w-14 h-8 rounded-md bg-muted animate-pulse" />
          </div>
        </div>

        <img
          src={
            product.images?.[0] || "https://placehold.co/320x320?text=No+Image"
          }
          alt={product.name}
          loading="eager"
          onLoad={() => setImageLoaded(true)}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div
      className="group relative h-fit cursor-pointer gap-3 overflow-hidden rounded-2xl border bg-card px-2 py-4 shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-4"
      onClick={() => onOpen(product._id)}
      role="button"
    >
      {isLowStock ? (
        <span className="absolute left-2 top-2 rounded-full border bg-background px-2 py-1 text-[10px] font-medium">
          Low Stock
        </span>
      ) : null}
      <Button
        className="absolute right-2 top-2 hidden rounded-sm font-medium opacity-0 transition-opacity sm:inline-flex group-hover:opacity-100"
        variant="ghost"
        id="save"
        onClick={(event) => event.stopPropagation()}
      >
        <IoBookmarkOutline className="fill-primary size-5" />
      </Button>

      <div className="flex h-44 w-full items-center justify-center overflow-hidden rounded-xl bg-muted/30">
        <img
          src={
            product.images?.[0] || "https://placehold.co/320x320?text=No+Image"
          }
          alt={product.name}
          loading="eager"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col gap-3 pt-3 px-1">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground truncate">
            {product.category}
          </p>
          <h3 className="text-sm font-semibold leading-snug line-clamp-1">
            {product.name}
          </h3>
          <div className="hidden sm:flex flex-wrap items-center gap-0.5 mt-0.5">
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1;
              const rating = Number(product.rating || 0);
              if (rating >= starValue) {
                return (
                  <FaStar key={index} size={13} className="text-yellow-500" />
                );
              }
              if (rating >= starValue - 0.5) {
                return (
                  <span key={index} className="relative inline-block">
                    <FaRegStar size={13} className="text-gray-300" />
                    <FaStarHalf
                      size={13}
                      className="text-yellow-500 absolute top-0 left-0"
                    />
                  </span>
                );
              }
              return (
                <FaRegStar key={index} size={13} className="text-gray-300" />
              );
            })}
            <span className="ml-1.5 text-xs text-muted-foreground">
              ({product.totalReviews || 0})
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/50">
          <p className="text-base font-bold inline-flex items-center gap-0.5">
            <BsCurrencyRupee />
            {Number(product.price || 0)}
          </p>

          {quantity > 0 ? (
            <>
              <Button
                className="flex sm:hidden rounded-sm font-medium cursor-pointer bg-red-600 hover:bg-red-600"
                id="addCart"
                size="sm"
                onClick={(event) => {
                  event.stopPropagation();
                  updateQuantity(product._id, quantity - 1);
                }}
              >
                <LuTrash2 />
              </Button>
              <div className="hidden sm:flex items-center gap-1.5">
                <Button
                  className="rounded-sm font-medium cursor-pointer"
                  variant="outline"
                  id="removeQuantity"
                  size="sm"
                  onClick={(event) => {
                    event.stopPropagation();
                    updateQuantity(product._id, quantity - 1);
                  }}
                >
                  <LuMinus />
                </Button>
                <span className="min-w-5 text-center text-sm font-medium">
                  {quantity}
                </span>
                <Button
                  className="rounded-sm font-medium cursor-pointer"
                  variant="outline"
                  id="addQuantity"
                  size="sm"
                  onClick={(event) => {
                    event.stopPropagation();
                    updateQuantity(product._id, quantity + 1);
                  }}
                >
                  <LuPlus />
                </Button>
              </div>
            </>
          ) : (
            <Button
              className="rounded-sm font-medium cursor-pointer text-black"
              id="addCart"
              size="sm"
              onClick={(event) => {
                event.stopPropagation();
                addToCart(product, 1);
              }}
            >
              Add
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
