import { MESSAGES } from "@/constants/strings";

export function NotFound() {
  return (
    <div className="flex h-full items-center justify-center">
      <h1 className="animate-slide-up animate-fade-in animate-glitch text-4xl font-bold text-text-primary md:text-6xl">
        {MESSAGES.PAGE_NOT_FOUND}
      </h1>
    </div>
  );
}
