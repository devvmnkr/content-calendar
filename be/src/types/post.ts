export enum Channel {
  TWITTER = "twitter",
  FACEBOOK = "facebook",
  INSTAGRAM = "instagram",
  YOUTUBE = "youtube",
  LINKEDIN = "linkedin",
  TIKTOK = "tiktok",
  PINTEREST = "pinterest",
}

export enum PostStatus {
  DRAFT = "draft",
  SCHEDULED = "scheduled",
  PUBLISHED = "published",
  FAILED = "failed",
}

export interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  channels: Channel[];
  scheduled_time: string;
  file_url: string | null;
  file_name: string | null;
  status: PostStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type PostPublic = Omit<Post, "deleted_at">;

export type PostCreate = Pick<
  Post,
  "title" | "content" | "channels" | "scheduled_time" | "status"
>;

export type PostUpdate = Partial<PostCreate>;
