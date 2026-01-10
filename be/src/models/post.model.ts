import { z } from "zod";
import { Channel, PostStatus } from "../types/post.js";

// Channel enum values for validation
const channelValues = Object.values(Channel) as [string, ...string[]];
const postStatusValues = Object.values(PostStatus) as [string, ...string[]];

// Schema for creating a post
export const createPostSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().optional(),
  channels: z
    .array(z.enum(channelValues))
    .min(1, "At least one channel is required"),
  scheduled_time: z.string().refine(
    (val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    },
    { message: "Invalid date format. Use ISO 8601 format." }
  ),
  status: z.enum(postStatusValues).optional().default(PostStatus.DRAFT),
});

// Schema for updating a post (all fields optional)
export const updatePostSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  content: z.string().optional(),
  channels: z
    .array(z.enum(channelValues))
    .min(1, "At least one channel is required")
    .optional(),
  scheduled_time: z
    .string()
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      { message: "Invalid date format. Use ISO 8601 format." }
    )
    .optional(),
  status: z.enum(postStatusValues).optional(),
});

// Schema for query parameters when getting posts
export const getPostsQuerySchema = z.object({
  channel: z.enum(channelValues).optional(),
  start_date: z
    .string()
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      { message: "Invalid start_date format. Use YYYY-MM-DD." }
    )
    .optional(),
  end_date: z
    .string()
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      { message: "Invalid end_date format. Use YYYY-MM-DD." }
    )
    .optional(),
});

// Schema for post ID parameter
export const postIdParamSchema = z.object({
  id: z.string().uuid("Invalid post ID format"),
});

// Infer types from schemas
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type GetPostsQuery = z.infer<typeof getPostsQuerySchema>;
export type PostIdParam = z.infer<typeof postIdParamSchema>;
