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
  const { setSelectedPost, openDayPostsDrawer } = useCalendarStore();
  const dayNumber = day.date.getDate();
  const postCount = day.posts.length;

  const publicationText =
    postCount === 1
      ? `${postCount} ${CALENDAR_STRINGS.PUBLICATION}`
      : `${postCount} ${CALENDAR_STRINGS.PUBLICATIONS}`;

  // In week view, show all posts without limit
  const maxPosts = isWeekView ? day.posts.length : 4;
  const hasMorePosts = !isWeekView && day.posts.length > 4;

  const handleCellClick = () => {
    // Only open the drawer if there are posts to show
    if (day.posts.length > 0) {
      openDayPostsDrawer(day);
    }
  };

  const handlePostClick = (
    e: React.MouseEvent,
    post: CalendarDayType["posts"][0]
  ) => {
    // Stop propagation so it doesn't trigger the cell click
    e.stopPropagation();
    setSelectedPost(post);
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openDayPostsDrawer(day);
  };

  return (
    <div
      onClick={handleCellClick}
      className={cn(
        "flex flex-col border-r border-b border-border-default p-1.5 sm:p-2",
        "min-w-[100px] lg:min-w-0",
        isWeekView ? "min-h-64" : "min-h-28 sm:min-h-32 lg:min-h-36",
        !day.isCurrentMonth && !isWeekView && "bg-surface-1",
        day.posts.length > 0 && "cursor-pointer hover:bg-surface-1/50"
      )}
    >
      {/* Day number */}
      <div className="mb-1 flex items-start justify-between sm:mb-2">
        <span
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium sm:h-7 sm:w-7 sm:text-sm",
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
            onClick={(e) => handlePostClick(e, post)}
          />
        ))}
        {hasMorePosts && (
          <button
            onClick={handleMoreClick}
            className="text-xs text-text-tertiary hover:text-primary-main hover:underline text-left transition-colors"
          >
            +{day.posts.length - 4} more
          </button>
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
