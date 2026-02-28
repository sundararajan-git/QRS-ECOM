import ProductCard from "@/components/shared/ProductCard";
import Spinner from "@/components/shared/Spinner";
import { Button } from "@/components/ui/button";
import useCart from "@/hooks/useCart";
import axiosInstance from "@/lib/axios";
import type { ErrorToastType, ProductType } from "@/types";
import { showErrorToast } from "@/lib/utils";
import { useEffect, useState } from "react";
import { BsCurrencyRupee } from "react-icons/bs";
import { FaRegStar, FaStar, FaStarHalf } from "react-icons/fa6";
import { LuArrowLeft, LuMinus, LuPlus } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";

const ProductDetails = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { addToCart, items, updateQuantity } = useCart();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductType | null>(null);
  const [similarProducts, setSimilarProducts] = useState<ProductType[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const productRes = await axiosInstance.get(`/product/${id}`);
        if (productRes.data.status === "FETCHED") {
          const item = productRes.data.product as ProductType;
          setProduct(item);
          setSelectedImage(0);

          if (item?.category) {
            const similarRes = await axiosInstance.get(
              "/products/similar-products",
              {
                params: { category: item.category, id: item._id },
              },
            );
            if (similarRes.data.status === "FETCHED") {
              setSimilarProducts(similarRes.data.products || []);
            }
          }
        }
      } catch (error) {
        showErrorToast(error as ErrorToastType);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return <Spinner text="Loading product..." />;
  }

  if (!product) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center rounded-xl border text-muted-foreground">
        Product not found.
      </div>
    );
  }

  const rating = Number(product.rating || 0);
  const cartItem = items.find((item) => item.product._id === product._id);
  const quantity = cartItem?.quantity || 0;
  const inStock = Number(product.stock || 0) > 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-colors"
        >
          <LuArrowLeft className="size-4" />
          <span>Back</span>
        </button>
        <button
          type="button"
          className="hover:text-foreground"
          onClick={() => navigate("/")}
        >
          Home
        </button>
        <span>{">"}</span>
        <button
          type="button"
          className="hover:text-foreground"
          onClick={() =>
            navigate(`/search?q=${encodeURIComponent(product.category)}`)
          }
        >
          {product.category}
        </button>
        <span>{">"}</span>
        <span className="text-foreground line-clamp-1">{product.name}</span>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-3 md:flex-row-reverse">
          <div className="w-full rounded-xl border bg-card p-4">
            <img
              src={product.images?.[selectedImage] || product.images?.[0]}
              alt={product.name}
              className="mx-auto max-h-[460px] w-full object-contain"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto md:w-[5.5rem] md:flex-col md:overflow-visible">
            {(product.images || []).map((image, index) => (
              <button
                type="button"
                key={`${image}-${index}`}
                className={`size-[4.5rem] shrink-0 overflow-hidden rounded-lg border bg-card ${
                  index === selectedImage ? "border-primary" : ""
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={image}
                  alt={`${product.name}-${index}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 lg:sticky lg:top-22 lg:h-fit">
          <div className="space-y-4 rounded-2xl border bg-card/70 p-5">
            <p className="text-sm uppercase tracking-wide text-muted-foreground">
              {product.category}
            </p>
            <h1 className="text-3xl font-semibold">{product.name}</h1>

            <div className="inline-flex items-center text-2xl font-bold">
              <BsCurrencyRupee />
              {Number(product.price || 0)}
            </div>

            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                if (rating >= starValue) {
                  return (
                    <FaStar key={index} className="size-4 text-yellow-500" />
                  );
                }
                if (rating >= starValue - 0.5) {
                  return (
                    <span key={index} className="relative inline-block">
                      <FaRegStar className="size-4 text-gray-300" />
                      <FaStarHalf className="absolute left-0 top-0 size-4 text-yellow-500" />
                    </span>
                  );
                }
                return (
                  <FaRegStar key={index} className="size-4 text-gray-300" />
                );
              })}
              <span className="ml-2 text-sm text-muted-foreground">
                ({product.totalReviews || 0} reviews)
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  inStock
                    ? "bg-primary/15 text-primary"
                    : "bg-destructive/15 text-destructive"
                }`}
              >
                {inStock
                  ? `In Stock (${product.stock} ${product.unit})`
                  : "Out of Stock"}
              </span>
              <span className="rounded-full border px-3 py-1 text-xs">
                Fast shipping
              </span>
            </div>

            <p className="leading-7 text-muted-foreground">
              {product.description}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {quantity > 0 ? (
                <div className="inline-flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(product._id, quantity - 1)}
                  >
                    <LuMinus className="size-4" />
                  </Button>
                  <span className="min-w-8 text-center font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(product._id, quantity + 1)}
                  >
                    <LuPlus className="size-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => addToCart(product, 1)}
                  disabled={!inStock}
                >
                  {inStock ? "Add To Cart" : "Out of Stock"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {similarProducts.length ? (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Related Products</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {similarProducts.map((item) => (
              <ProductCard
                key={item._id}
                product={item}
                onOpen={(nextId) => navigate(`/product/${nextId}`)}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default ProductDetails;
