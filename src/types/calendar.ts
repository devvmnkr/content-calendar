export type Platform =
  | "instagram"
  | "facebook"
  | "twitter"
  | "youtube"
  | "linkedin"
  | "tiktok"
  | "pinterest";

export type MediaType = "image" | "video" | "carousel" | "story" | "reel";

export type PostStatus = "draft" | "scheduled" | "published" | "failed";

export interface Post {
  id: string;
  userId: string;
  title: string;
  content: string | null;
  channels: Platform[];
  scheduledAt: Date;
  status: PostStatus;
  fileUrl: string | null;
  fileName: string | null;
  mediaType?: MediaType;
  createdAt: string;
  updatedAt: string;
}

// API response type (matches backend)
export interface PostApiResponse {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  channels: Platform[];
  scheduled_time: string;
  file_url: string | null;
  file_name: string | null;
  status: PostStatus;
  created_at: string;
  updated_at: string;
}

// Payload for creating a post
export interface PostCreatePayload {
  title: string;
  content?: string;
  channels: Platform[];
  scheduled_time: string;
  status?: PostStatus;
}

// Payload for updating a post
export interface PostUpdatePayload {
  title?: string;
  content?: string;
  channels?: Platform[];
  scheduled_time?: string;
  status?: PostStatus;
}

// Query params for fetching posts
export interface PostsQueryParams {
  channel?: Platform;
  start_date?: string;
  end_date?: string;
}

export interface Channel {
  id: string;
  name: string;
  platform: Platform;
}

export interface CalendarFilters {
  channelId: string | null;
  mediaType: MediaType | null;
  viewMode: "week" | "month";
  dateRange: {
    start: Date;
    end: Date;
  };
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  posts: Post[];
}

// Helper to derive mediaType from file extension
export function deriveMediaType(
  fileName: string | null
): MediaType | undefined {
  if (!fileName) return undefined;

  const ext = fileName.toLowerCase().split(".").pop();
  const videoExtensions = ["mp4", "mov", "webm", "avi", "mkv"];
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];

  if (videoExtensions.includes(ext || "")) return "video";
  if (imageExtensions.includes(ext || "")) return "image";

  return undefined;
}

// Transform API response to frontend Post type
export function transformApiPost(apiPost: PostApiResponse): Post {
  return {
    id: apiPost.id,
    userId: apiPost.user_id,
    title: apiPost.title,
    content: apiPost.content,
    channels: apiPost.channels,
    scheduledAt: new Date(apiPost.scheduled_time),
    status: apiPost.status,
    fileUrl: apiPost.file_url,
    fileName: apiPost.file_name,
    mediaType: deriveMediaType(apiPost.file_name),
    createdAt: apiPost.created_at,
    updatedAt: apiPost.updated_at,
  };
}
