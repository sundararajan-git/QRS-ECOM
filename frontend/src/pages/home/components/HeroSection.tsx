import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

const heroImages = [
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1600&q=90",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=90",
  "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1600&q=90",
  "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=1600&q=90",
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [imageLoad, setImageLoad] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-[60vh] relative overflow-hidden rounded-lg">
      {!imageLoad && <Skeleton className="h-full w-full" />}
      {heroImages.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`slide-${index}`}
          loading="eager"
          onLoad={() => setImageLoad(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity brightness-65 duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          } ${imageLoad ? "block" : "hidden"}`}
        />
      ))}
      {imageLoad && (
        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white/90 to-transparent rounded-b-lg dark:from-black/90" />
      )}
    </div>
  );
};

export default HeroSection;
