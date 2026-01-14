import { format } from "date-fns";
import { useCalendarStore } from "@/stores/calendarStore";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { SocialIcon } from "./SocialIcon";
import { CALENDAR_STRINGS } from "./constants";
import { cn } from "@/lib/utils";
import type { Post } from "@/types/calendar";

function PostListItem({ post, onClick }: { post: Post; onClick: () => void }) {
  const timeString = format(post.scheduledAt, "hh:mm a");

  const getStatusColor = () => {
    switch (post.status) {
      case "scheduled":
        return "bg-secondary-subtle text-secondary-main";
      case "published":
        return "bg-primary-subtle text-primary-main";
      case "failed":
        return "bg-accent1-subtle text-accent1-main";
      default:
        return "bg-surface-2 text-text-secondary";
    }
  };

  const getStatusLabel = () => {
    switch (post.status) {
      case "scheduled":
        return CALENDAR_STRINGS.STATUS_SCHEDULED;
      case "published":
        return CALENDAR_STRINGS.STATUS_PUBLISHED;
      case "failed":
        return CALENDAR_STRINGS.STATUS_FAILED;
      default:
        return CALENDAR_STRINGS.STATUS_DRAFT;
    }
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg border border-border-default bg-surface-1 p-3",
        "transition-all duration-150 hover:bg-surface-2 hover:shadow-sm",
        "focus:outline-none focus:ring-2 focus:ring-primary-main focus:ring-offset-1 focus:ring-offset-bg"
      )}
    >
      {/* Channel icons */}
      <div className="flex items-center -space-x-1 pt-0.5">
        {post.channels.slice(0, 3).map((channel, index) => (
          <div
            key={channel}
            className="relative rounded-md ring-1 ring-surface-1"
            style={{ zIndex: 3 - index }}
          >
            <SocialIcon platform={channel} size={14} showBackground />
          </div>
        ))}
        {post.channels.length > 3 && (
          <div
            className="relative flex h-6 w-6 items-center justify-center rounded-md bg-surface-3 text-[10px] font-medium text-text-primary ring-1 ring-surface-1"
            style={{ zIndex: 0 }}
          >
            +{post.channels.length - 3}
          </div>
        )}
      </div>

      {/* Post info */}
      <div className="flex flex-1 flex-col items-start gap-1 text-left">
        <span className="text-sm font-medium text-text-primary line-clamp-1">
          {post.title}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary">{timeString}</span>
          <span
            className={cn(
              "inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium",
              getStatusColor()
            )}
          >
            {getStatusLabel()}
          </span>
        </div>
        {post.content && (
          <p className="text-xs text-text-tertiary line-clamp-2 mt-1">
            {post.content}
          </p>
        )}
      </div>
    </button>
  );
}

export function DayPostsDrawer() {
  const { selectedDay, isDayPostsOpen, closeDayPostsDrawer, setSelectedPost } =
    useCalendarStore();

  if (!selectedDay) return null;

  const dateFormatted = format(selectedDay.date, "EEEE, MMMM d, yyyy");
  const postCount = selectedDay.posts.length;
  const publicationText =
    postCount === 1
      ? `${postCount} ${CALENDAR_STRINGS.PUBLICATION}`
      : `${postCount} ${CALENDAR_STRINGS.PUBLICATIONS}`;

  const handlePostClick = (post: Post) => {
    closeDayPostsDrawer();
    setSelectedPost(post);
  };

  return (
    <Sheet open={isDayPostsOpen} onOpenChange={closeDayPostsDrawer}>
      <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle>{dateFormatted}</SheetTitle>
          <SheetDescription>{publicationText}</SheetDescription>
        </SheetHeader>

        <div className="mt-4 flex flex-col gap-2">
          {selectedDay.posts.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-text-secondary">
                {CALENDAR_STRINGS.EMPTY_POSTS}
              </p>
            </div>
          ) : (
            selectedDay.posts.map((post) => (
              <PostListItem
                key={post.id}
                post={post}
                onClick={() => handlePostClick(post)}
              />
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
