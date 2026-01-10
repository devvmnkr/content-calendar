import { CalendarDays, Calendar } from "lucide-react";
import { useCalendarStore } from "@/stores/calendarStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CALENDAR_STRINGS,
  PLATFORM_LABELS,
  MEDIA_TYPE_LABELS,
} from "./constants";
import { DateRangePicker } from "./DateRangePicker";
import { cn } from "@/lib/utils";
import type { Platform, MediaType } from "@/types/calendar";

const PLATFORMS: Platform[] = [
  "instagram",
  "facebook",
  "twitter",
  "youtube",
  "linkedin",
  "tiktok",
  "pinterest",
];

const MEDIA_TYPES: MediaType[] = [
  "image",
  "video",
  "carousel",
  "story",
  "reel",
];

export function CalendarToolbar() {
  const {
    selectedChannelId,
    selectedMediaType,
    viewMode,
    setSelectedChannelId,
    setSelectedMediaType,
    setViewMode,
  } = useCalendarStore();

  return (
    <div className="flex flex-col gap-3 border-b border-border-default px-4 py-3 lg:flex-row lg:items-center lg:justify-between lg:px-6">
      {/* Left side - View toggle (hidden as per requirements) */}
      <div className="hidden" />

      {/* Right side - Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Channel filter */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-text-tertiary">
            {CALENDAR_STRINGS.FILTER_CHANNEL}
          </span>
          <Select
            value={selectedChannelId || "all"}
            onValueChange={(value) =>
              setSelectedChannelId(value === "all" ? null : (value as Platform))
            }
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder={CALENDAR_STRINGS.FILTER_CHANNEL_ALL} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {CALENDAR_STRINGS.FILTER_CHANNEL_ALL}
              </SelectItem>
              {PLATFORMS.map((platform) => (
                <SelectItem key={platform} value={platform}>
                  {PLATFORM_LABELS[platform]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Media filter */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-text-tertiary">
            {CALENDAR_STRINGS.FILTER_MEDIA}
          </span>
          <Select
            value={selectedMediaType || "all"}
            onValueChange={(value) =>
              setSelectedMediaType(
                value === "all" ? null : (value as MediaType)
              )
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder={CALENDAR_STRINGS.FILTER_MEDIA_ALL} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {CALENDAR_STRINGS.FILTER_MEDIA_ALL}
              </SelectItem>
              {MEDIA_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {MEDIA_TYPE_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Week/Month toggle */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-text-tertiary">
            {CALENDAR_STRINGS.VIEW_WEEK}/{CALENDAR_STRINGS.VIEW_MONTH}
          </span>
          <div className="flex items-center rounded-lg border border-border-default bg-bg">
            <button
              onClick={() => setViewMode("week")}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-l-lg transition-colors",
                viewMode === "week"
                  ? "bg-primary-subtle text-primary-main"
                  : "text-text-tertiary hover:bg-surface-1 hover:text-text-primary"
              )}
              aria-label={CALENDAR_STRINGS.VIEW_WEEK}
            >
              <CalendarDays className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("month")}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-r-lg transition-colors",
                viewMode === "month"
                  ? "bg-primary-subtle text-primary-main"
                  : "text-text-tertiary hover:bg-surface-1 hover:text-text-primary"
              )}
              aria-label={CALENDAR_STRINGS.VIEW_MONTH}
            >
              <Calendar className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Date range */}
        <DateRangePicker />
      </div>
    </div>
  );
}
