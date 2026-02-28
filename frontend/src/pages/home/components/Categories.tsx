import axiosInstance from "@/lib/axios";
import { useEffect, useRef, useState } from "react";
import type { CategoriesType, ErrorToastType } from "@/types";
import { showErrorToast } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const MARQUEE_STYLE = `
@keyframes marquee-scroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.marquee-track {
  animation: marquee-scroll 18s linear infinite;
  will-change: transform;
}
.marquee-track.paused {
  animation-play-state: paused;
}
`;

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoriesType[]>([]);
  const [loaded, setLoaded] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const styleInjected = useRef(false);

  useEffect(() => {
    if (!styleInjected.current) {
      const tag = document.createElement("style");
      tag.textContent = MARQUEE_STYLE;
      document.head.appendChild(tag);
      styleInjected.current = true;
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const getCategoriesList = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/categories", {
          signal: controller.signal,
        });
        if (data.status === "FETCHED") {
          setCategories(data.categories);
          setLoaded(Array(data.categories.length).fill(false));
          setLoading(false);
        }
      } catch (err) {
        showErrorToast(err as ErrorToastType);
      }
    };
    getCategoriesList();
    return () => controller.abort();
  }, []);

  const handleLoad = (index: number) => {
    setLoaded((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  };

  const categoryNavHandler = (cat: string) => {
    navigate(`/search?q=${encodeURIComponent(cat)}`);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 overflow-hidden p-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-[250px] min-w-[185px] rounded-xl shrink-0"
          />
        ))}
      </div>
    );
  }

  const doubled = [...categories, ...categories];

  return (
    <div
      className="relative w-full overflow-hidden p-2"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={`marquee-track flex gap-3 w-max ${paused ? " paused" : ""}`}
      >
        {doubled.map((item, index) => {
          const realIdx = index % categories.length;
          return (
            <button
              key={`${item.name}-${index}`}
              type="button"
              onClick={() => categoryNavHandler(item.name)}
              className="flex flex-col items-center gap-3 h-[250px] max-w-[250px] shrink-0 rounded-xl bg-muted border-0 px-5 py-4 hover:cursor-pointer hover:bg-muted/70 transition-colors overflow-hidden"
            >
              <div className="w-full flex-1 overflow-hidden rounded-lg">
                {!loaded[realIdx] && index < categories.length && (
                  <Skeleton className="h-full w-full" />
                )}
                <img
                  src={
                    item.imageUrl ||
                    "https://placehold.co/200x140?text=Category"
                  }
                  alt={item.name}
                  loading="eager"
                  onLoad={() => {
                    if (index < categories.length) handleLoad(realIdx);
                  }}
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
              <p className="line-clamp-2 text-center text-sm font-medium w-full">
                {item.name}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
