import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type GrocerySearchProps = {
  searchQueries: string[];
};

export const GrocerySearch = ({ searchQueries }: GrocerySearchProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const filteredProducts = useMemo(() => {
    const uniqueProducts = new Set(
      searchQueries.filter((product) =>
        product.toLowerCase().includes(query.toLowerCase()),
      ),
    );
    return [...uniqueProducts];
  }, [query, searchQueries]);

  useEffect(() => {
    if (location.pathname.split("/")[1] !== "search" && query !== "") {
      setQuery("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const searchHandler = (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    setQuery(trimmed);
    if (trimmed) {
      setIsFocused(false);
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto hidden sm:block">
      <Command className="w-full bg-accent shadow-none">
        <CommandInput
          placeholder="Search products..."
          value={query}
          onValueChange={setQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchHandler(query);
            }
          }}
          className="h-10 w-full rounded-md border-none shadow-none px-3"
        />

        {isFocused && filteredProducts.length > 0 ? (
          <CommandGroup
            className="absolute top-full mt-1 w-full bg-background dark:bg-zinc-900 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto"
            heading="Suggestions"
          >
            {filteredProducts.map((product, index) => (
              <CommandItem
                key={`${product}-${index}`}
                value={product}
                onMouseDown={() => {
                  searchHandler(product);
                }}
                className="cursor-pointer px-3 py-2 dark:data-[selected=true]:bg-gray-900 :data-[selected=true]:bg-gray-200"
              >
                {product}
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}

        {isFocused && filteredProducts.length === 0 ? (
          <CommandEmpty className="absolute top-full mt-1 w-full bg-background dark:bg-zinc-900 rounded-md shadow-lg px-3 py-2 z-50 text-sm">
            No products found.
          </CommandEmpty>
        ) : null}
      </Command>
    </div>
  );
};
