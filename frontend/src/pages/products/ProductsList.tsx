import ProductCard from "@/components/shared/ProductCard";
import Spinner from "@/components/shared/Spinner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import axiosInstance from "@/lib/axios";
import type { ErrorToastType, ProductType } from "@/types";
import { showErrorToast, titleCase } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { LuArrowLeft } from "react-icons/lu";
import { SlidersHorizontal } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PAGE_LIMIT = 1;
const PRICE_MAX = 100000;

const sortLabel: Record<string, string> = {
  newest: "Newest",
  price_asc: "Price: Low to High",
  price_desc: "Price: High to Low",
  rating_desc: "Top Rated",
  name_asc: "Name: A to Z",
  name_desc: "Name: Z to A",
};

type CategoryType = { _id: string; name: string };

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(Math.max(v, lo), hi);

const ProductsList = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";
  const navigate = useNavigate();

  const [sort, setSort] = useState("newest");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [draftSort, setDraftSort] = useState("newest");
  const [draftCategory, setDraftCategory] = useState("");
  const [draftMin, setDraftMin] = useState(0);
  const [draftMax, setDraftMax] = useState(PRICE_MAX);

  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryType[]>([]);

  useEffect(() => {
    axiosInstance
      .get("/categories")
      .then((res) => {
        if (res.data.status === "FETCHED") {
          setCategories(res.data.categories || []);
        }
      })
      .catch(() => {});
  }, []);

  const handleSheetOpenChange = (open: boolean) => {
    if (open) {
      setDraftSort(sort);
      setDraftCategory(category);
      setDraftMin(minPrice ? Number(minPrice) : 0);
      setDraftMax(maxPrice ? Number(maxPrice) : PRICE_MAX);
    }
    setFiltersOpen(open);
  };

  const applyFilters = () => {
    setSort(draftSort);
    setCategory(draftCategory);
    setMinPrice(draftMin > 0 ? String(draftMin) : "");
    setMaxPrice(draftMax < PRICE_MAX ? String(draftMax) : "");
    setCurrentPage(1);
    setFiltersOpen(false);
  };

  const resetDraft = () => {
    setDraftSort("newest");
    setDraftCategory("");
    setDraftMin(0);
    setDraftMax(PRICE_MAX);
  };

  const resetFilters = () => {
    setSort("newest");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setCurrentPage(1);
  };

  const removeFilter = (key: "sort" | "category" | "minPrice" | "maxPrice") => {
    if (key === "sort") setSort("newest");
    if (key === "category") setCategory("");
    if (key === "minPrice") setMinPrice("");
    if (key === "maxPrice") setMaxPrice("");
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [query, sort, category, minPrice, maxPrice]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/search", {
          params: {
            q: query,
            page: currentPage,
            limit: PAGE_LIMIT,
            sort,
            category: category.trim() || undefined,
            minPrice: minPrice || undefined,
            maxPrice: maxPrice || undefined,
          },
        });
        if (data.status === "FETCHED") {
          setProducts(data.products || []);
          setTotalPages(data.totalPages || 1);
        }
      } catch (error) {
        showErrorToast(error as ErrorToastType);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [query, currentPage, sort, category, minPrice, maxPrice]);

  const pages = useMemo<(number | string)[]>(() => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pageSet = new Set<number>([
      1,
      totalPages,
      currentPage - 1,
      currentPage,
      currentPage + 1,
    ]);
    const normalized = [...pageSet]
      .filter((p) => p >= 1 && p <= totalPages)
      .sort((a, b) => a - b);

    const result: (number | string)[] = [];
    for (let i = 0; i < normalized.length; i++) {
      const cur = normalized[i];
      const prev = normalized[i - 1];
      if (i > 0 && cur - prev > 1) result.push("...");
      result.push(cur);
    }
    return result;
  }, [currentPage, totalPages]);

  const activeFilters = useMemo(() => {
    let n = 0;
    if (sort !== "newest") n++;
    if (category.trim()) n++;
    if (minPrice) n++;
    if (maxPrice) n++;
    return n;
  }, [sort, category, minPrice, maxPrice]);

  if (loading) return <Spinner text="Loading products..." />;

  const rangePercent = (v: number) => ((v / PRICE_MAX) * 100).toFixed(1);

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-colors"
      >
        <LuArrowLeft className="size-4" />
        <span>Back</span>
      </button>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold sm:text-2xl">
          Search Results: {titleCase(query)}
        </h1>

        <Sheet open={filtersOpen} onOpenChange={handleSheetOpenChange}>
          <SheetTrigger asChild>
            <Button variant="outline">
              <SlidersHorizontal className="size-4" />
              Filters {activeFilters ? `(${activeFilters})` : ""}
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="flex w-full flex-col sm:max-w-md"
          >
            <SheetHeader>
              <SheetTitle>Filter Products</SheetTitle>
              <SheetDescription>
                Adjust filters and hit Apply to refresh results.
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="draft-sort">Sort By</Label>
                <select
                  id="draft-sort"
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none cursor-pointer"
                  value={draftSort}
                  onChange={(e) => setDraftSort(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating_desc">Top Rated</option>
                  <option value="name_asc">Name: A to Z</option>
                  <option value="name_desc">Name: Z to A</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="draft-category">Category</Label>
                <select
                  id="draft-category"
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none cursor-pointer"
                  value={draftCategory}
                  onChange={(e) => setDraftCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Price Range</Label>
                  <span className="text-sm font-medium text-muted-foreground">
                    ₹{draftMin.toLocaleString()} — ₹
                    {draftMax === PRICE_MAX
                      ? `${PRICE_MAX.toLocaleString()}+`
                      : draftMax.toLocaleString()}
                  </span>
                </div>

                <div className="relative h-5 flex items-center">
                  <div
                    className="absolute h-1.5 rounded-full bg-primary"
                    style={{
                      left: `${rangePercent(draftMin)}%`,
                      right: `${(100 - Number(rangePercent(draftMax))).toFixed(1)}%`,
                    }}
                  />
                  <div className="absolute inset-x-0 h-1.5 rounded-full bg-muted -z-10" />

                  <input
                    type="range"
                    min={0}
                    max={PRICE_MAX}
                    step={500}
                    value={draftMin}
                    onChange={(e) => {
                      const v = clamp(
                        Number(e.target.value),
                        0,
                        draftMax - 500,
                      );
                      setDraftMin(v);
                    }}
                    className="absolute inset-0 w-full appearance-none bg-transparent cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:size-4
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-primary
                      [&::-webkit-slider-thumb]:border-2
                      [&::-webkit-slider-thumb]:border-background
                      [&::-webkit-slider-thumb]:shadow-sm
                      [&::-webkit-slider-runnable-track]:bg-transparent
                      [&::-moz-range-thumb]:size-4
                      [&::-moz-range-thumb]:rounded-full
                      [&::-moz-range-thumb]:bg-primary
                      [&::-moz-range-thumb]:border-2
                      [&::-moz-range-thumb]:border-background"
                  />

                  <input
                    type="range"
                    min={0}
                    max={PRICE_MAX}
                    step={500}
                    value={draftMax}
                    onChange={(e) => {
                      const v = clamp(
                        Number(e.target.value),
                        draftMin + 500,
                        PRICE_MAX,
                      );
                      setDraftMax(v);
                    }}
                    className="absolute inset-0 w-full appearance-none bg-transparent cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:size-4
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-primary
                      [&::-webkit-slider-thumb]:border-2
                      [&::-webkit-slider-thumb]:border-background
                      [&::-webkit-slider-thumb]:shadow-sm
                      [&::-webkit-slider-runnable-track]:bg-transparent
                      [&::-moz-range-thumb]:size-4
                      [&::-moz-range-thumb]:rounded-full
                      [&::-moz-range-thumb]:bg-primary
                      [&::-moz-range-thumb]:border-2
                      [&::-moz-range-thumb]:border-background"
                  />
                </div>

                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹0</span>
                  <span>₹25k</span>
                  <span>₹50k</span>
                  <span>₹75k</span>
                  <span>₹1L+</span>
                </div>
              </div>
            </div>

            <SheetFooter className="gap-2">
              <Button variant="outline" onClick={resetDraft}>
                Reset
              </Button>
              <Button onClick={applyFilters}>Apply Filters</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {activeFilters ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Active:</span>
          {sort !== "newest" && (
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1 text-xs hover:bg-accent"
              onClick={() => removeFilter("sort")}
            >
              {sortLabel[sort] || sort} ✕
            </button>
          )}
          {category && (
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1 text-xs hover:bg-accent"
              onClick={() => removeFilter("category")}
            >
              {category} ✕
            </button>
          )}
          {minPrice && (
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1 text-xs hover:bg-accent"
              onClick={() => removeFilter("minPrice")}
            >
              Min ₹{Number(minPrice).toLocaleString()} ✕
            </button>
          )}
          {maxPrice && (
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1 text-xs hover:bg-accent"
              onClick={() => removeFilter("maxPrice")}
            >
              Max ₹{Number(maxPrice).toLocaleString()} ✕
            </button>
          )}
          <button
            type="button"
            className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
            onClick={resetFilters}
          >
            Clear all
          </button>
        </div>
      ) : null}

      {!products.length ? (
        <div className="flex min-h-[45vh] items-center justify-center rounded-xl border bg-card/30 text-muted-foreground">
          No products found for "{query || "search"}"
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onOpen={(id) => navigate(`/product/${id}`)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button
                variant="outline"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Prev
              </Button>

              {pages.map((page, i) =>
                page === "..." ? (
                  <span
                    key={`e-${i}`}
                    className="px-2 text-sm text-muted-foreground"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={page}
                    size="icon"
                    variant={page === currentPage ? "default" : "outline"}
                    onClick={() => setCurrentPage(page as number)}
                  >
                    {page}
                  </Button>
                ),
              )}

              <Button
                variant="outline"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductsList;
