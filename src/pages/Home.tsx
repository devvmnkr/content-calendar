import { MESSAGES } from "@/constants/strings";

export function Home() {
  return (
    <div className="flex h-full items-center justify-center">
      <h1 className="text-3xl font-semibold text-text-primary">
        {MESSAGES.HELLO_WORLD}
      </h1>
    </div>
  );
}
