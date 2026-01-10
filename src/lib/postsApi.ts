import api from "./axios";
import type {
  Post,
  PostApiResponse,
  PostCreatePayload,
  PostUpdatePayload,
  PostsQueryParams,
} from "@/types/calendar";
import { transformApiPost as transform } from "@/types/calendar";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface PostsResponse {
  posts: PostApiResponse[];
}

interface PostResponse {
  post: PostApiResponse;
}

/**
 * Fetch posts with optional filters
 */
export async function fetchPosts(params?: PostsQueryParams): Promise<Post[]> {
  const queryParams = new URLSearchParams();

  if (params?.channel) {
    queryParams.set("channel", params.channel);
  }
  if (params?.start_date) {
    queryParams.set("start_date", params.start_date);
  }
  if (params?.end_date) {
    queryParams.set("end_date", params.end_date);
  }

  const queryString = queryParams.toString();
  const url = `/posts${queryString ? `?${queryString}` : ""}`;

  const response = await api.get<ApiResponse<PostsResponse>>(url);
  return response.data.data.posts.map(transform);
}

/**
 * Get a single post by ID
 */
export async function getPost(id: string): Promise<Post> {
  const response = await api.get<ApiResponse<PostResponse>>(`/posts/${id}`);
  return transform(response.data.data.post);
}

/**
 * Create a new post
 * Supports both JSON payload and FormData (for file uploads)
 */
export async function createPost(
  data: PostCreatePayload | FormData
): Promise<Post> {
  const isFormData = data instanceof FormData;

  const response = await api.post<ApiResponse<PostResponse>>("/posts", data, {
    headers: isFormData
      ? { "Content-Type": "multipart/form-data" }
      : { "Content-Type": "application/json" },
  });

  return transform(response.data.data.post);
}

/**
 * Update an existing post
 * Supports both JSON payload and FormData (for file uploads)
 */
export async function updatePost(
  id: string,
  data: PostUpdatePayload | FormData
): Promise<Post> {
  const isFormData = data instanceof FormData;

  const response = await api.put<ApiResponse<PostResponse>>(
    `/posts/${id}`,
    data,
    {
      headers: isFormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" },
    }
  );

  return transform(response.data.data.post);
}

/**
 * Delete a post (soft delete)
 */
export async function deletePost(id: string): Promise<void> {
  await api.delete(`/posts/${id}`);
}

/**
 * Helper to create FormData for post with file
 */
export function createPostFormData(
  payload: PostCreatePayload,
  file?: File
): FormData {
  const formData = new FormData();

  formData.append("title", payload.title);
  if (payload.content) {
    formData.append("content", payload.content);
  }
  formData.append("channels", JSON.stringify(payload.channels));
  formData.append("scheduled_time", payload.scheduled_time);
  if (payload.status) {
    formData.append("status", payload.status);
  }
  if (file) {
    formData.append("file", file);
  }

  return formData;
}

/**
 * Helper to create FormData for updating post with file
 */
export function createUpdateFormData(
  payload: PostUpdatePayload,
  file?: File
): FormData {
  const formData = new FormData();

  if (payload.title !== undefined) {
    formData.append("title", payload.title);
  }
  if (payload.content !== undefined) {
    formData.append("content", payload.content);
  }
  if (payload.channels !== undefined) {
    formData.append("channels", JSON.stringify(payload.channels));
  }
  if (payload.scheduled_time !== undefined) {
    formData.append("scheduled_time", payload.scheduled_time);
  }
  if (payload.status !== undefined) {
    formData.append("status", payload.status);
  }
  if (file) {
    formData.append("file", file);
  }

  return formData;
}
