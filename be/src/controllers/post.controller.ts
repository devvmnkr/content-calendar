import { Request, Response, NextFunction } from "express";
import { MESSAGES } from "../constants/index.js";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../services/post.service.js";
import { sendSuccess } from "../utils/index.js";
import {
  CreatePostInput,
  UpdatePostInput,
  GetPostsQuery,
  PostIdParam,
} from "../models/post.model.js";
import { UserPublic } from "../types/index.js";

export async function createPostHandler(
  req: Request<unknown, unknown, CreatePostInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = req.user as UserPublic;
    const file = req.file;
    const input = req.body;

    const post = await createPost(user.id, input, file);
    sendSuccess(res, MESSAGES.POST_CREATED, { post }, 201);
  } catch (error) {
    next(error);
  }
}

export async function getPostsHandler(
  req: Request<unknown, unknown, unknown, GetPostsQuery>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = req.user as UserPublic;
    const query = req.query;

    const posts = await getPosts(user.id, query);
    sendSuccess(res, MESSAGES.POSTS_FETCHED, { posts });
  } catch (error) {
    next(error);
  }
}

export async function getPostByIdHandler(
  req: Request<PostIdParam>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = req.user as UserPublic;
    const { id } = req.params;

    const post = await getPostById(user.id, id);
    sendSuccess(res, MESSAGES.POST_FETCHED, { post });
  } catch (error) {
    next(error);
  }
}

export async function updatePostHandler(
  req: Request<PostIdParam, unknown, UpdatePostInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = req.user as UserPublic;
    const { id } = req.params;
    const file = req.file;
    const input = req.body;

    const post = await updatePost(user.id, id, input, file);
    sendSuccess(res, MESSAGES.POST_UPDATED, { post });
  } catch (error) {
    next(error);
  }
}

export async function deletePostHandler(
  req: Request<PostIdParam>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = req.user as UserPublic;
    const { id } = req.params;

    await deletePost(user.id, id);
    sendSuccess(res, MESSAGES.POST_DELETED);
  } catch (error) {
    next(error);
  }
}
