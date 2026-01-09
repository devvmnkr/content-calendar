import { MESSAGES } from "@/constants/strings";

export function Schedule() {
  return (
    <div className="flex h-full items-center justify-center">
      <h1 className="text-3xl font-semibold text-text-primary">
        {MESSAGES.SCHEDULE_PLACEHOLDER}
      </h1>
    </div>
  );
}
