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
    <div className="flex items-center justify-between px-4 py-3 lg:px-6">
      {/* Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={goToPrevious}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-1 hover:text-text-primary"
          aria-label={CALENDAR_STRINGS.PREVIOUS_MONTH}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xl font-semibold text-text-primary transition-colors hover:bg-surface-1"
          aria-label={CALENDAR_STRINGS.MONTH_DROPDOWN_LABEL}
        >
          {headerText}
          <ChevronDown className="h-5 w-5 text-text-tertiary" />
        </button>

        <button
          onClick={goToNext}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-1 hover:text-text-primary"
          aria-label={CALENDAR_STRINGS.NEXT_MONTH}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Add New button */}
      <Button size="sm" onClick={() => openNewPostDrawer()}>
        <Plus className="h-4 w-4" />
        {CALENDAR_STRINGS.ADD_NEW}
      </Button>
    </div>
  );
}
