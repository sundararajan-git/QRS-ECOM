import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import type { ErrorToastType, ProductType } from "@/types";
import { showErrorToast } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import ProductCard from "@/components/shared/ProductCard";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";

const ProductCardSke = () => (
  <Card className="overflow-hidden shadow-none h-fit p-4 gap-3 relative">
    <Skeleton className="w-full h-44 mx-auto rounded-lg animate-pulse" />
    <div className="flex flex-col gap-1 sm:gap-2 mt-2">
      <Skeleton className="w-20 h-3 rounded-full animate-pulse" />
      <Skeleton className="w-32 h-4 rounded-full animate-pulse" />
    </div>
    <div className="flex items-center gap-2 mt-1">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className="size-4 fill-muted stroke-muted animate-pulse"
        />
      ))}
      <Skeleton className="w-12 h-2 rounded-full animate-pulse" />
    </div>
    <div className="flex justify-between items-center mt-2 gap-2">
      <Skeleton className="w-12 h-4 rounded-sm animate-pulse" />
      <Skeleton className="w-20 h-8 rounded-md animate-pulse" />
    </div>
  </Card>
);

const BestSellers = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const getProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/best-sellers", {
          signal: controller.signal,
        });
        if (data.status === "FETCHED") {
          setProducts(data.products);
          setLoading(false);
        }
      } catch (err) {
        showErrorToast(err as ErrorToastType);
      }
    };
    getProducts();
    return () => controller.abort();
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
      <>
        {loading ? (
          <>
            {Array.from({ length: 5 }).map((_, index) => (
              <React.Fragment key={index}>
                <ProductCardSke />
              </React.Fragment>
            ))}
          </>
        ) : (
          <>
            {products.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                onOpen={(id) => navigate(`/product/${id}`)}
              />
            ))}
          </>
        )}
      </>
    </div>
  );
};

export default BestSellers;
