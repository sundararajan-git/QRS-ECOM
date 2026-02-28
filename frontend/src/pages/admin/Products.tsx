import Spinner from "@/components/shared/Spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/lib/axios";
import type { ErrorToastType, ProductType, CategoriesType } from "@/types";
import { showErrorToast } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

type ProductFormState = {
  _id?: string;
  name: string;
  description: string;
  price: string;
  unit: string;
  stock: string;
  category: string;
  discountPrice: string;
  images: File[];
};

const emptyForm: ProductFormState = {
  name: "",
  description: "",
  price: "",
  unit: "",
  stock: "",
  category: "",
  discountPrice: "",
  images: [],
};

const Products = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<CategoriesType[]>([]);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [dialogOpen, setDialogOpen] = useState(false);

  const isEdit = useMemo(() => Boolean(form._id), [form._id]);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/admin/products", {
        params: {
          pageNo: page,
          limit: 10,
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
  }, [page]);

  const loadCategories = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/categories");
      if (data.status === "FETCHED") {
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Failed to load categories", error);
    }
  }, []);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [loadProducts, loadCategories]);

  const setField = (key: keyof ProductFormState, value: string | File[]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const openEdit = (product: ProductType) => {
    setForm({
      _id: product._id,
      name: product.name,
      description: product.description || "",
      price: String(product.price || ""),
      unit: product.unit || "",
      stock: String(product.stock || ""),
      category: product.category || "",
      discountPrice: String(product.discountPrice || ""),
      images: [],
    });
    setDialogOpen(true);
  };

  const resetForm = () => setForm({ ...emptyForm, images: [] });
  const openCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.price.trim() ||
      !form.unit.trim() ||
      !form.stock.trim() ||
      !form.category.trim() ||
      !form.discountPrice.trim()
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("description", form.description.trim());
      formData.append("price", form.price.trim());
      formData.append("unit", form.unit.trim());
      formData.append("stock", form.stock.trim());
      formData.append("category", form.category.trim());
      formData.append("discountPrice", form.discountPrice.trim());
      form.images.forEach((file) => {
        formData.append("image", file);
      });
      if (form._id) {
        formData.append("_id", form._id);
      }

      const endpoint = "/admin/product";
      const request = form._id
        ? axiosInstance.put(endpoint, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : axiosInstance.post(endpoint, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

      const { data } = await request;
      if (data.status === "CREATED" || data.status === "UPDATED") {
        toast.success(isEdit ? "Product updated" : "Product created");
        resetForm();
        setDialogOpen(false);
        await loadProducts();
      }
    } catch (error) {
      showErrorToast(error as ErrorToastType);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteProduct = async (id: string) => {
    const confirmed = window.confirm("Delete this product?");
    if (!confirmed) return;

    try {
      const { data } = await axiosInstance.delete(`/admin/product/${id}`);
      if (data.status === "DELETED") {
        toast.success("Product deleted");
        setProducts((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (error) {
      showErrorToast(error as ErrorToastType);
    }
  };

  if (loading) {
    return <Spinner text="Loading products..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Manage Products</h1>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              resetForm();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button onClick={openCreate}>Create Product</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl max-h-[90svh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEdit ? "Edit Product" : "Create Product"}
              </DialogTitle>
              <DialogDescription>
                {isEdit
                  ? "Update product details and save changes."
                  : "Add a new product to your catalog."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={submitForm} className="space-y-4">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={form.category}
                    onChange={(e) => setField("category", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    {categories.map((cat, idx) => (
                      <option key={`${cat.name}-${idx}`} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    value={form.unit}
                    onChange={(e) => setField("unit", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    value={form.price}
                    onChange={(e) => setField("price", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="discountPrice">Discount Price</Label>
                  <Input
                    id="discountPrice"
                    type="number"
                    value={form.discountPrice}
                    onChange={(e) => setField("discountPrice", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={form.stock}
                    onChange={(e) => setField("stock", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  className="w-full min-h-24 rounded-md border bg-transparent px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="images">Images</Label>
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    setField("images", Array.from(e.target.files || []))
                  }
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting
                    ? "Saving..."
                    : isEdit
                      ? "Update Product"
                      : "Create Product"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="rounded-xl border p-3 space-y-3 bg-card"
          >
            <div className="flex gap-3">
              <div className="size-16 rounded-md bg-muted overflow-hidden">
                <img
                  src={
                    product.images?.[0] ||
                    "https://placehold.co/120x120?text=No+Image"
                  }
                  alt={product.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="min-w-0">
                <p className="font-semibold line-clamp-1">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  {product.category}
                </p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Price: {product.price} | Discount: {product.discountPrice} |
              Stock: {product.stock} {product.unit}
            </div>
            <div className="inline-flex gap-2">
              <Button variant="outline" onClick={() => openEdit(product)}>
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteProduct(product._id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          disabled={page <= 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Prev
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Products;
