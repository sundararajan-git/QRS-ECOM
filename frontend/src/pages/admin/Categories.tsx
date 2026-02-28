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
import type { CategoriesType, ErrorToastType } from "@/types";
import { showErrorToast } from "@/lib/utils";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Categories = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<CategoriesType[]>([]);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/categories");
      if (data.status === "FETCHED") {
        setCategories(data.categories || []);
      }
    } catch (error) {
      showErrorToast(error as ErrorToastType);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const createCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!category.trim()) {
      toast.error("Category is required");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("category", category.trim());
      if (image) {
        formData.append("image", image);
      }

      const { data } = await axiosInstance.post("/admin/category", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.status === "CREATED") {
        toast.success("Category created");
        setCategories((prev) => [...prev, data.addedCategory]);
        setCategory("");
        setImage(null);
        setCreateOpen(false);
      }
    } catch (error) {
      showErrorToast(error as ErrorToastType);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Spinner text="Loading categories..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Manage Categories</h1>
        <Dialog
          open={createOpen}
          onOpenChange={(open) => {
            setCreateOpen(open);
            if (!open) {
              setCategory("");
              setImage(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>Create Category</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Category</DialogTitle>
              <DialogDescription>
                Add a new category with optional image.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={createCategory} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Fruits, Vegetables..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category-image">Category Image</Label>
                <Input
                  id="category-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat, index) => (
          <div key={`${cat.name}-${index}`} className="rounded-xl border p-3 bg-card">
            <div className="h-28 rounded-md bg-muted overflow-hidden">
              <img
                src={cat.imageUrl || "https://placehold.co/300x150?text=Category"}
                alt={cat.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <p className="mt-2 font-medium text-sm line-clamp-2">{cat.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
