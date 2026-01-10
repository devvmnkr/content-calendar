import { format } from "date-fns";
import type { Post } from "@/types/calendar";
import { SocialIcon } from "./SocialIcon";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  onClick?: () => void;
}

const MAX_VISIBLE_CHANNELS = 3;

export function PostCard({ post, onClick }: PostCardProps) {
  const timeString = format(post.scheduledAt, "hh:mm a");
  const visibleChannels = post.channels.slice(0, MAX_VISIBLE_CHANNELS);
  const remainingCount = post.channels.length - MAX_VISIBLE_CHANNELS;

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg border border-border-default bg-surface-1 px-2 py-1.5",
        "transition-all duration-150 hover:bg-surface-2 hover:shadow-sm",
        "focus:outline-none focus:ring-2 focus:ring-primary-main focus:ring-offset-1"
      )}
    >
      {/* Channel icons - stacked with overlap */}
      <div className="flex items-center -space-x-1">
        {visibleChannels.map((channel, index) => (
          <div
            key={channel}
            className="relative rounded-md ring-1 ring-surface-1"
            style={{ zIndex: MAX_VISIBLE_CHANNELS - index }}
          >
            <SocialIcon platform={channel} size={12} showBackground />
          </div>
        ))}
        {remainingCount > 0 && (
          <div
            className="relative flex h-5 w-5 items-center justify-center rounded-md bg-surface-3 text-[10px] font-medium text-text-primary ring-1 ring-surface-1"
            style={{ zIndex: 0 }}
          >
            +{remainingCount}
          </div>
        )}
      </div>

      <span className="text-xs font-medium text-text-primary">
        {timeString}
      </span>
    </button>
  );
}
