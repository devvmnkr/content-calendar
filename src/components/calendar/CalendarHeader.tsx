import { ChevronDown, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { format } from "date-fns";
import { useCalendarStore } from "@/stores/calendarStore";
import { Button } from "@/components/ui/button";
import { CALENDAR_STRINGS } from "./constants";

export function CalendarHeader() {
  const {
    currentDate,
    viewMode,
    dateRange,
    goToPrevious,
    goToNext,
    openNewPostDrawer,
  } = useCalendarStore();

  const monthName = CALENDAR_STRINGS.MONTHS[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  // For week view, show the date range
  const headerText =
    viewMode === "week"
      ? `${format(dateRange.start, "MMM d")} - ${format(
          dateRange.end,
          "MMM d, yyyy"
        )}`
      : `${monthName} ${year}`;

  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2 sm:px-4 sm:py-3 lg:px-6">
      {/* Navigation */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={goToPrevious}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-1 hover:text-text-primary sm:h-8 sm:w-8"
          aria-label={CALENDAR_STRINGS.PREVIOUS_MONTH}
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        <button
          className="flex items-center gap-0.5 rounded-lg px-1.5 py-1 text-sm font-semibold text-text-primary transition-colors hover:bg-surface-1 sm:gap-1 sm:px-2 sm:text-base lg:text-xl"
          aria-label={CALENDAR_STRINGS.MONTH_DROPDOWN_LABEL}
        >
          {headerText}
          <ChevronDown className="h-4 w-4 text-text-tertiary sm:h-5 sm:w-5" />
        </button>

        <button
          onClick={goToNext}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-1 hover:text-text-primary sm:h-8 sm:w-8"
          aria-label={CALENDAR_STRINGS.NEXT_MONTH}
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>

      {/* Add New button */}
      <Button size="sm" onClick={() => openNewPostDrawer()}>
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">{CALENDAR_STRINGS.ADD_NEW}</span>
      </Button>
    </div>
  );
}
