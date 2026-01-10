import { useState, useCallback } from "react";
import { Calendar } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  isBefore,
  isAfter,
} from "date-fns";
import * as Popover from "@radix-ui/react-popover";
import { useCalendarStore } from "@/stores/calendarStore";
import { Button } from "@/components/ui/button";
import { CALENDAR_STRINGS } from "./constants";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

type SelectionState = "idle" | "selecting-start" | "selecting-end";

export function DateRangePicker() {
  const { dateRange, setDateRange, setCurrentDate } = useCalendarStore();
  const [isOpen, setIsOpen] = useState(false);
  const [pickerMonth, setPickerMonth] = useState(dateRange.start);
  const [selectionState, setSelectionState] = useState<SelectionState>("idle");
  const [tempStart, setTempStart] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const dateRangeText = `${format(dateRange.start, "dd MMM, yyyy")} - ${format(
    dateRange.end,
    "dd MMM, yyyy"
  )}`;

  // Generate days for the picker
  const monthStart = startOfMonth(pickerMonth);
  const monthEnd = endOfMonth(pickerMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const handleDayClick = useCallback(
    (day: Date) => {
      if (selectionState === "idle" || selectionState === "selecting-end") {
        // Start new selection
        setTempStart(day);
        setSelectionState("selecting-start");
      } else if (selectionState === "selecting-start" && tempStart) {
        // Complete selection
        const start = isBefore(day, tempStart) ? day : tempStart;
        const end = isAfter(day, tempStart) ? day : tempStart;
        setDateRange(start, end);
        setCurrentDate(start);
        setSelectionState("idle");
        setTempStart(null);
        setIsOpen(false);
      }
    },
    [selectionState, tempStart, setDateRange, setCurrentDate]
  );

  const handleDayHover = useCallback((day: Date) => {
    setHoverDate(day);
  }, []);

  const isInRange = useCallback(
    (day: Date) => {
      if (selectionState === "selecting-start" && tempStart && hoverDate) {
        const start = isBefore(hoverDate, tempStart) ? hoverDate : tempStart;
        const end = isAfter(hoverDate, tempStart) ? hoverDate : tempStart;
        return isWithinInterval(day, { start, end });
      }
      return isWithinInterval(day, {
        start: dateRange.start,
        end: dateRange.end,
      });
    },
    [selectionState, tempStart, hoverDate, dateRange]
  );

  const isRangeStart = useCallback(
    (day: Date) => {
      if (selectionState === "selecting-start" && tempStart && hoverDate) {
        const start = isBefore(hoverDate, tempStart) ? hoverDate : tempStart;
        return isSameDay(day, start);
      }
      return isSameDay(day, dateRange.start);
    },
    [selectionState, tempStart, hoverDate, dateRange]
  );

  const isRangeEnd = useCallback(
    (day: Date) => {
      if (selectionState === "selecting-start" && tempStart && hoverDate) {
        const end = isAfter(hoverDate, tempStart) ? hoverDate : tempStart;
        return isSameDay(day, end);
      }
      return isSameDay(day, dateRange.end);
    },
    [selectionState, tempStart, hoverDate, dateRange]
  );

  const goToPreviousMonth = () => {
    setPickerMonth(
      new Date(pickerMonth.getFullYear(), pickerMonth.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setPickerMonth(
      new Date(pickerMonth.getFullYear(), pickerMonth.getMonth() + 1, 1)
    );
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setPickerMonth(dateRange.start);
      setSelectionState("idle");
      setTempStart(null);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-text-tertiary">
        {CALENDAR_STRINGS.FILTER_DATE_RANGE}
      </span>
      <Popover.Root open={isOpen} onOpenChange={handleOpenChange}>
        <Popover.Trigger asChild>
          <button className="flex h-10 items-center gap-2 rounded-lg border border-border-default bg-bg px-3 text-sm text-text-primary transition-colors hover:bg-surface-1">
            {dateRangeText}
            <Calendar className="h-4 w-4 text-text-tertiary" />
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className="z-50 rounded-xl border border-border-default bg-bg p-4 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
            sideOffset={8}
            align="end"
          >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={goToPreviousMonth}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-1 hover:text-text-primary"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium text-text-primary">
                {CALENDAR_STRINGS.MONTHS[pickerMonth.getMonth()]}{" "}
                {pickerMonth.getFullYear()}
              </span>
              <button
                onClick={goToNextMonth}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-1 hover:text-text-primary"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Day names */}
            <div className="mb-2 grid grid-cols-7 gap-1">
              {CALENDAR_STRINGS.DAYS_SHORT.map((day) => (
                <div
                  key={day}
                  className="flex h-8 w-8 items-center justify-center text-xs font-medium text-text-tertiary"
                >
                  {day.charAt(0)}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const inCurrentMonth = isSameMonth(day, pickerMonth);
                const inRange = isInRange(day);
                const isStart = isRangeStart(day);
                const isEnd = isRangeEnd(day);
                const isSelecting = selectionState === "selecting-start";

                return (
                  <button
                    key={index}
                    onClick={() => handleDayClick(day)}
                    onMouseEnter={() => handleDayHover(day)}
                    disabled={!inCurrentMonth}
                    className={cn(
                      "relative flex h-8 w-8 items-center justify-center text-sm transition-all duration-150",
                      !inCurrentMonth && "text-text-tertiary opacity-40",
                      inCurrentMonth && "text-text-primary hover:bg-surface-1",
                      // Range background with animation
                      inRange &&
                        inCurrentMonth &&
                        !isStart &&
                        !isEnd &&
                        cn("bg-primary-subtle", isSelecting && "animate-pulse"),
                      // Start of range
                      isStart &&
                        inCurrentMonth &&
                        "rounded-l-full bg-primary-main text-text-inverse",
                      // End of range
                      isEnd &&
                        inCurrentMonth &&
                        "rounded-r-full bg-primary-main text-text-inverse",
                      // Both start and end (single day)
                      isStart && isEnd && "rounded-full"
                    )}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Selection hint */}
            <div className="mt-4 text-center text-xs text-text-tertiary">
              {selectionState === "selecting-start"
                ? CALENDAR_STRINGS.SELECT_END_DATE
                : CALENDAR_STRINGS.SELECT_START_DATE}
            </div>

            {/* Quick actions */}
            <div className="mt-3 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => {
                  const today = new Date();
                  setDateRange(startOfMonth(today), endOfMonth(today));
                  setCurrentDate(today);
                  setIsOpen(false);
                }}
              >
                {CALENDAR_STRINGS.THIS_MONTH}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => {
                  const today = new Date();
                  setDateRange(
                    startOfWeek(today, { weekStartsOn: 0 }),
                    endOfWeek(today, { weekStartsOn: 0 })
                  );
                  setCurrentDate(today);
                  setIsOpen(false);
                }}
              >
                {CALENDAR_STRINGS.THIS_WEEK}
              </Button>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
