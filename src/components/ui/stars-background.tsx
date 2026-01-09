import { useEffect, useRef, useState, useCallback } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
  animationClass: string;
  animationDelay: string;
}

const STAR_COLORS = [
  "var(--star-1)",
  "var(--star-2)",
  "var(--star-3)",
  "var(--star-4)",
  "var(--star-5)",
];

const ANIMATION_CLASSES = [
  "animate-twinkle",
  "animate-twinkle-slow",
  "animate-twinkle-fast",
];

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    opacity: Math.random(), // Will be scaled by CSS variables
    color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
    animationClass:
      ANIMATION_CLASSES[Math.floor(Math.random() * ANIMATION_CLASSES.length)],
    animationDelay: `${Math.random() * 5}s`,
  }));
}

interface StarsBackgroundProps {
  starCount?: number;
  parallaxStrength?: number;
}

export function StarsBackground({
  starCount = 80,
  parallaxStrength = 20,
}: StarsBackgroundProps) {
  const [stars] = useState<Star[]>(() => generateStars(starCount));
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / rect.width;
      const deltaY = (e.clientY - centerY) / rect.height;

      setOffset({
        x: deltaX * parallaxStrength,
        y: deltaY * parallaxStrength,
      });
    },
    [parallaxStrength]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {stars.map((star) => (
        <div
          key={star.id}
          className={`absolute rounded-full ${star.animationClass}`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: `rgb(${star.color})`,
            opacity: `calc(var(--star-opacity-min) + ${star.opacity} * (var(--star-opacity-max) - var(--star-opacity-min)))`,
            animationDelay: star.animationDelay,
            transform: `translate(${offset.x * (star.size / 3)}px, ${
              offset.y * (star.size / 3)
            }px)`,
            transition: "transform 0.3s ease-out",
          }}
        />
      ))}
    </div>
  );
}
