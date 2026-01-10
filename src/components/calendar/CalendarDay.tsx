import type { CalendarDay as CalendarDayType } from "@/types/calendar";
import { PostCard } from "./PostCard";
import { CALENDAR_STRINGS } from "./constants";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/stores/calendarStore";

interface CalendarDayProps {
  day: CalendarDayType;
  isWeekView?: boolean;
}

export function CalendarDay({ day, isWeekView = false }: CalendarDayProps) {
  const { setSelectedPost } = useCalendarStore();
  const dayNumber = day.date.getDate();
  const postCount = day.posts.length;

  const publicationText =
    postCount === 1
      ? `${postCount} ${CALENDAR_STRINGS.PUBLICATION}`
      : `${postCount} ${CALENDAR_STRINGS.PUBLICATIONS}`;

  // In week view, show all posts without limit
  const maxPosts = isWeekView ? day.posts.length : 4;

  return (
    <div
      className={cn(
        "flex flex-col border-r border-b border-border-default p-2",
        isWeekView ? "min-h-64" : "min-h-32 lg:min-h-36",
        !day.isCurrentMonth && !isWeekView && "bg-surface-1"
      )}
    >
      {/* Day number */}
      <div className="mb-2 flex items-start justify-between">
        <span
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium",
            day.isToday
              ? "bg-primary-main text-text-inverse"
              : day.isCurrentMonth || isWeekView
              ? "text-text-primary"
              : "text-text-tertiary"
          )}
        >
          {dayNumber.toString().padStart(2, "0")}
        </span>
      </div>

      {/* Posts */}
      <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto">
        {day.posts.slice(0, maxPosts).map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onClick={() => setSelectedPost(post)}
          />
        ))}
        {!isWeekView && day.posts.length > 4 && (
          <span className="text-xs text-text-tertiary">
            +{day.posts.length - 4} more
          </span>
        )}
      </div>

      {/* Publication count */}
      {postCount > 0 && (day.isCurrentMonth || isWeekView) && (
        <div className="mt-2 border-t border-border-muted pt-1">
          <span className="text-xs text-text-tertiary">{publicationText}</span>
        </div>
      )}
    </div>
  );
}
