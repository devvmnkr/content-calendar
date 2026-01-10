import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useCalendarStore } from "@/stores/calendarStore";
import { CalendarDay } from "./CalendarDay";
import { CALENDAR_STRINGS } from "./constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function ErrorState({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent1-subtle">
        <AlertCircle className="h-6 w-6 text-accent1-main" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-medium text-text-primary">
          {CALENDAR_STRINGS.ERROR_LOADING_POSTS}
        </h3>
        <p className="mt-1 text-sm text-text-secondary">{error}</p>
      </div>
      <Button variant="outline" onClick={onRetry}>
        <RefreshCw className="h-4 w-4" />
        {CALENDAR_STRINGS.RETRY}
      </Button>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary-main" />
      <p className="text-sm text-text-secondary">
        {CALENDAR_STRINGS.LOADING_POSTS}
      </p>
    </div>
  );
}

export function CalendarGrid() {
  const { getCalendarDays, viewMode, isLoading, error, fetchPosts } =
    useCalendarStore();

  // Show error state
  if (error) {
    return (
      <div className="flex-1 overflow-auto">
        {/* Days of week header */}
        <div className="sticky top-0 z-10 grid grid-cols-7 border-b border-border-default bg-bg">
          {CALENDAR_STRINGS.DAYS_SHORT.map((day) => (
            <div
              key={day}
              className="border-r border-border-default px-3 py-3 text-sm font-medium text-text-secondary last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>
        <ErrorState error={error} onRetry={fetchPosts} />
      </div>
    );
  }

  // Show loading state (skeleton or spinner based on whether we have data)
  const days = getCalendarDays();
  const hasExistingData = days.some((day) => day.posts.length > 0);

  return (
    <div className="flex-1 overflow-auto">
      {/* Days of week header */}
      <div className="sticky top-0 z-10 grid grid-cols-7 border-b border-border-default bg-bg">
        {CALENDAR_STRINGS.DAYS_SHORT.map((day) => (
          <div
            key={day}
            className="border-r border-border-default px-3 py-3 text-sm font-medium text-text-secondary last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Show loading indicator while fetching */}
      {isLoading && !hasExistingData ? (
        <LoadingState />
      ) : (
        <div className="relative">
          {/* Loading overlay when refreshing with existing data */}
          {isLoading && hasExistingData && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-bg/50">
              <div className="flex items-center gap-2 rounded-lg bg-surface-1 px-4 py-2 shadow-md">
                <Loader2 className="h-4 w-4 animate-spin text-primary-main" />
                <span className="text-sm text-text-secondary">
                  {CALENDAR_STRINGS.LOADING_POSTS}
                </span>
              </div>
            </div>
          )}

          {/* Calendar grid */}
          <div
            className={cn(
              "grid grid-cols-7",
              viewMode === "week" && "min-h-[calc(100vh-280px)]"
            )}
          >
            {days.map((day, index) => (
              <CalendarDay
                key={index}
                day={day}
                isWeekView={viewMode === "week"}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
