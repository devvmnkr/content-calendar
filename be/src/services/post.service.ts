import { getSupabaseClient, getSupabaseAdmin } from "../db/supabase.js";
import { ERROR_CODES } from "../constants/index.js";
import { AppError } from "../middleware/index.js";
import { Post, PostPublic, Channel, PostStatus } from "../types/index.js";
import {
  CreatePostInput,
  UpdatePostInput,
  GetPostsQuery,
} from "../models/post.model.js";

const STORAGE_BUCKET = "content-calendar-attachments";

interface UploadResult {
  fileUrl: string;
  fileName: string;
}

// Helper to build public URL for stored file
function getPublicUrl(filePath: string): string {
  const supabase = getSupabaseAdmin();
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

// Upload file to Supabase Storage (uses admin client to bypass RLS)
export async function uploadFile(
  userId: string,
  postId: string,
  file: Express.Multer.File
): Promise<UploadResult> {
  const supabase = getSupabaseAdmin();

  // Generate file path: users/{user_id}/posts/{post_id}/{filename}
  const fileExtension = file.originalname.split(".").pop() || "";
  const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
  const filePath = `users/${userId}/posts/${postId}/${sanitizedFileName}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) {
    console.error("Supabase storage upload error:", error);
    throw new AppError(ERROR_CODES.FILE_UPLOAD_FAILED, 500);
  }

  return {
    fileUrl: getPublicUrl(filePath),
    fileName: file.originalname,
  };
}

// Delete file from Supabase Storage (uses admin client to bypass RLS)
export async function deleteFile(filePath: string): Promise<void> {
  const supabase = getSupabaseAdmin();

  // Extract path from full URL
  const pathMatch = filePath.match(/content-calendar-attachments\/(.+)$/);
  if (!pathMatch) return;

  const storagePath = pathMatch[1];

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([storagePath]);

  if (error) {
    // Log error but don't throw - file deletion failure shouldn't block the operation
    console.error("Failed to delete file:", error);
  }
}

// Create a new post
export async function createPost(
  userId: string,
  input: CreatePostInput,
  file?: Express.Multer.File
): Promise<PostPublic> {
  const supabase = getSupabaseClient();

  // First, insert the post to get the ID
  const { data: post, error: insertError } = await supabase
    .from("posts")
    .insert({
      user_id: userId,
      title: input.title,
      content: input.content || null,
      channels: input.channels,
      scheduled_time: input.scheduled_time,
      status: input.status || PostStatus.DRAFT,
    })
    .select("*")
    .single<Post>();

  if (insertError || !post) {
    throw new AppError(ERROR_CODES.DATABASE_ERROR, 500);
  }

  // If file provided (with actual content), upload it and update the post
  if (file && file.buffer && file.buffer.length > 0) {
    const { fileUrl, fileName } = await uploadFile(userId, post.id, file);

    const { data: updatedPost, error: updateError } = await supabase
      .from("posts")
      .update({
        file_url: fileUrl,
        file_name: fileName,
      })
      .eq("id", post.id)
      .select("*")
      .single<Post>();

    if (updateError || !updatedPost) {
      throw new AppError(ERROR_CODES.DATABASE_ERROR, 500);
    }

    return toPostPublic(updatedPost);
  }

  return toPostPublic(post);
}

// Get posts with optional filters
export async function getPosts(
  userId: string,
  query: GetPostsQuery
): Promise<PostPublic[]> {
  const supabase = getSupabaseClient();

  let queryBuilder = supabase
    .from("posts")
    .select("*")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("scheduled_time", { ascending: true });

  // Filter by channel (check if channel is in the channels array)
  if (query.channel) {
    queryBuilder = queryBuilder.contains("channels", [query.channel]);
  }

  // Filter by date range
  if (query.start_date) {
    const startDate = new Date(query.start_date);
    startDate.setHours(0, 0, 0, 0);
    queryBuilder = queryBuilder.gte("scheduled_time", startDate.toISOString());
  }

  if (query.end_date) {
    const endDate = new Date(query.end_date);
    endDate.setHours(23, 59, 59, 999);
    queryBuilder = queryBuilder.lte("scheduled_time", endDate.toISOString());
  }

  const { data: posts, error } = await queryBuilder.returns<Post[]>();

  if (error) {
    throw new AppError(ERROR_CODES.DATABASE_ERROR, 500);
  }

  return (posts || []).map(toPostPublic);
}

// Get a single post by ID
export async function getPostById(
  userId: string,
  postId: string
): Promise<PostPublic> {
  const supabase = getSupabaseClient();

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .is("deleted_at", null)
    .single<Post>();

  if (error || !post) {
    throw new AppError(ERROR_CODES.POST_NOT_FOUND, 404);
  }

  // Check ownership
  if (post.user_id !== userId) {
    throw new AppError(ERROR_CODES.POST_ACCESS_DENIED, 403);
  }

  return toPostPublic(post);
}

// Update a post
export async function updatePost(
  userId: string,
  postId: string,
  input: UpdatePostInput,
  file?: Express.Multer.File
): Promise<PostPublic> {
  const supabase = getSupabaseClient();

  // First, get the existing post to verify ownership
  const { data: existingPost, error: fetchError } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .is("deleted_at", null)
    .single<Post>();

  if (fetchError || !existingPost) {
    throw new AppError(ERROR_CODES.POST_NOT_FOUND, 404);
  }

  if (existingPost.user_id !== userId) {
    throw new AppError(ERROR_CODES.POST_ACCESS_DENIED, 403);
  }

  // Build update object
  const updateData: Record<string, unknown> = {};

  if (input.title !== undefined) updateData.title = input.title;
  if (input.content !== undefined) updateData.content = input.content;
  if (input.channels !== undefined) updateData.channels = input.channels;
  if (input.scheduled_time !== undefined)
    updateData.scheduled_time = input.scheduled_time;
  if (input.status !== undefined) updateData.status = input.status;

  // Handle file upload (only if file has actual content)
  if (file && file.buffer && file.buffer.length > 0) {
    // Delete old file if exists
    if (existingPost.file_url) {
      await deleteFile(existingPost.file_url);
    }

    const { fileUrl, fileName } = await uploadFile(userId, postId, file);
    updateData.file_url = fileUrl;
    updateData.file_name = fileName;
  }

  // Only update if there are changes
  if (Object.keys(updateData).length === 0) {
    return toPostPublic(existingPost);
  }

  const { data: updatedPost, error: updateError } = await supabase
    .from("posts")
    .update(updateData)
    .eq("id", postId)
    .select("*")
    .single<Post>();

  if (updateError || !updatedPost) {
    throw new AppError(ERROR_CODES.DATABASE_ERROR, 500);
  }

  return toPostPublic(updatedPost);
}

// Soft delete a post
export async function deletePost(
  userId: string,
  postId: string
): Promise<void> {
  const supabase = getSupabaseClient();

  // First, get the existing post to verify ownership
  const { data: existingPost, error: fetchError } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .is("deleted_at", null)
    .single<Post>();

  if (fetchError || !existingPost) {
    throw new AppError(ERROR_CODES.POST_NOT_FOUND, 404);
  }

  if (existingPost.user_id !== userId) {
    throw new AppError(ERROR_CODES.POST_ACCESS_DENIED, 403);
  }

  // Delete file from storage if exists
  if (existingPost.file_url) {
    await deleteFile(existingPost.file_url);
  }

  // Soft delete the post
  const { error: deleteError } = await supabase
    .from("posts")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", postId);

  if (deleteError) {
    throw new AppError(ERROR_CODES.DATABASE_ERROR, 500);
  }
}

// Helper to convert Post to PostPublic
function toPostPublic(post: Post): PostPublic {
  const { deleted_at, ...publicPost } = post;
  return publicPost;
}
