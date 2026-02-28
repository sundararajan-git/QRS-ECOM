import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

type MobileGrocerySearchProps = {
  open: boolean;
  close: Dispatch<SetStateAction<boolean>>;
  searchQueries: string[];
};

const MobileGrocerySearch = ({
  open,
  close,
  searchQueries,
}: MobileGrocerySearchProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");

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
      close(false);
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <CommandDialog
      open={open}
      className="w-full bg-accent shadow-none top-50"
      onOpenChange={close}
    >
      <CommandInput
        placeholder="Search products..."
        value={query}
        onValueChange={setQuery}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            searchHandler(query);
          }
        }}
        className="h-10 w-full rounded-md border-none shadow-none px-3"
      />

      <CommandList>
        <CommandEmpty className="w-full rounded-md shadow-lg px-3 py-2 z-50 text-sm h-60 text-center">
          <span>No products found.</span>
        </CommandEmpty>
        <CommandGroup
          className="w-full rounded-md shadow-lg z-50 h-60 overflow-y-auto"
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
      </CommandList>
    </CommandDialog>
  );
};

export default MobileGrocerySearch;
