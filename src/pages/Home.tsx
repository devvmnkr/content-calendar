import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarsBackground } from "@/components/ui/stars-background";
import { HERO } from "@/constants/strings";

export function Home() {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-4">
      <StarsBackground starCount={120} parallaxStrength={30} />

      {/* Hero Content */}
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        {/* Title */}
        <h1 className="mb-6 text-4xl font-bold leading-tight text-text-primary sm:text-5xl lg:text-6xl">
          {HERO.TITLE}
          <br />
          <span className="bg-linear-to-r from-primary-main to-secondary-main bg-clip-text text-transparent">
            {HERO.TITLE_HIGHLIGHT}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mb-10 max-w-xl text-lg text-text-secondary lg:text-xl">
          {HERO.SUBTITLE}
        </p>

        {/* CTA Button */}
        <Button asChild size="lg" className="gap-2">
          <Link to="/auth">
            {HERO.CTA}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>

      {/* Decorative gradient orbs */}
      <div
        className="pointer-events-none absolute -left-32 top-1/4 h-64 w-64 rounded-full opacity-30 blur-3xl"
        style={{ backgroundColor: "rgb(var(--primary-main))" }}
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-1/4 h-64 w-64 rounded-full opacity-30 blur-3xl"
        style={{ backgroundColor: "rgb(var(--secondary-main))" }}
      />
    </div>
  );
}
