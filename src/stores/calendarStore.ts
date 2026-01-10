import { create } from "zustand";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addWeeks,
  subWeeks,
  format,
} from "date-fns";
import type {
  Post,
  MediaType,
  Platform,
  CalendarDay as CalendarDayType,
  PostCreatePayload,
  PostUpdatePayload,
} from "@/types/calendar";
import * as postsApi from "@/lib/postsApi";

interface CalendarState {
  // Posts data
  posts: Post[];
  isLoading: boolean;
  error: string | null;

  // Current view
  currentDate: Date;
  viewMode: "week" | "month";

  // Filters
  selectedChannelId: Platform | null;
  selectedMediaType: MediaType | null;
  dateRange: {
    start: Date;
    end: Date;
  };

  // Selected post for detail view
  selectedPost: Post | null;
  isDetailOpen: boolean;

  // New post drawer
  isNewPostOpen: boolean;
  editingPost: Post | null;
  isSubmitting: boolean;
  submitError: string | null;

  // Actions - Data
  fetchPosts: () => Promise<void>;
  createPost: (
    data: PostCreatePayload,
    file?: File
  ) => Promise<Post | undefined>;
  updatePost: (
    id: string,
    data: PostUpdatePayload,
    file?: File
  ) => Promise<Post | undefined>;
  deletePost: (id: string) => Promise<boolean>;

  // Actions - Navigation
  setCurrentDate: (date: Date) => void;
  setViewMode: (mode: "week" | "month") => void;
  goToPrevious: () => void;
  goToNext: () => void;
  goToToday: () => void;

  // Actions - Filters
  setSelectedChannelId: (channelId: Platform | null) => void;
  setSelectedMediaType: (mediaType: MediaType | null) => void;
  setDateRange: (start: Date, end: Date) => void;

  // Actions - UI
  setSelectedPost: (post: Post | null) => void;
  setIsDetailOpen: (open: boolean) => void;
  openNewPostDrawer: (post?: Post) => void;
  closeNewPostDrawer: () => void;
  clearSubmitError: () => void;

  // Computed
  getCalendarDays: () => CalendarDayType[];
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  // Initial state - Data
  posts: [],
  isLoading: false,
  error: null,

  // Initial state - View
  currentDate: new Date(),
  viewMode: "month",
  selectedChannelId: null,
  selectedMediaType: null,
  dateRange: {
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  },
  selectedPost: null,
  isDetailOpen: false,

  // Initial state - New post drawer
  isNewPostOpen: false,
  editingPost: null,
  isSubmitting: false,
  submitError: null,

  // Actions - Data
  fetchPosts: async () => {
    const { selectedChannelId, dateRange } = get();

    set({ isLoading: true, error: null });

    try {
      const posts = await postsApi.fetchPosts({
        channel: selectedChannelId || undefined,
        start_date: format(dateRange.start, "yyyy-MM-dd"),
        end_date: format(dateRange.end, "yyyy-MM-dd"),
      });
      set({ posts, isLoading: false });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch posts";
      set({ error: message, isLoading: false });
    }
  },

  createPost: async (data, file) => {
    set({ isSubmitting: true, submitError: null });

    try {
      let post: Post;
      if (file) {
        const formData = postsApi.createPostFormData(data, file);
        post = await postsApi.createPost(formData);
      } else {
        post = await postsApi.createPost(data);
      }

      // Refresh posts list
      await get().fetchPosts();

      set({ isSubmitting: false, isNewPostOpen: false, editingPost: null });
      return post;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create post";
      set({ submitError: message, isSubmitting: false });
      return undefined;
    }
  },

  updatePost: async (id, data, file) => {
    set({ isSubmitting: true, submitError: null });

    try {
      let post: Post;
      if (file) {
        const formData = postsApi.createUpdateFormData(data, file);
        post = await postsApi.updatePost(id, formData);
      } else {
        post = await postsApi.updatePost(id, data);
      }

      // Refresh posts list
      await get().fetchPosts();

      set({
        isSubmitting: false,
        isNewPostOpen: false,
        editingPost: null,
        selectedPost: post,
      });
      return post;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update post";
      set({ submitError: message, isSubmitting: false });
      return undefined;
    }
  },

  deletePost: async (id) => {
    set({ isSubmitting: true, submitError: null });

    try {
      await postsApi.deletePost(id);

      // Refresh posts list and close detail sheet
      await get().fetchPosts();

      set({
        isSubmitting: false,
        isDetailOpen: false,
        selectedPost: null,
      });
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete post";
      set({ submitError: message, isSubmitting: false });
      return false;
    }
  },

  // Actions - Navigation
  setCurrentDate: (date) => set({ currentDate: date }),

  setViewMode: (mode) => {
    const { currentDate, fetchPosts } = get();
    if (mode === "week") {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
      set({
        viewMode: mode,
        dateRange: { start: weekStart, end: weekEnd },
      });
    } else {
      set({
        viewMode: mode,
        dateRange: {
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate),
        },
      });
    }
    // Fetch posts with new date range
    fetchPosts();
  },

  goToPrevious: () => {
    const { currentDate, viewMode, fetchPosts } = get();
    if (viewMode === "week") {
      const newDate = subWeeks(currentDate, 1);
      const weekStart = startOfWeek(newDate, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(newDate, { weekStartsOn: 0 });
      set({
        currentDate: newDate,
        dateRange: { start: weekStart, end: weekEnd },
      });
    } else {
      const newDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
      );
      set({
        currentDate: newDate,
        dateRange: {
          start: startOfMonth(newDate),
          end: endOfMonth(newDate),
        },
      });
    }
    fetchPosts();
  },

  goToNext: () => {
    const { currentDate, viewMode, fetchPosts } = get();
    if (viewMode === "week") {
      const newDate = addWeeks(currentDate, 1);
      const weekStart = startOfWeek(newDate, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(newDate, { weekStartsOn: 0 });
      set({
        currentDate: newDate,
        dateRange: { start: weekStart, end: weekEnd },
      });
    } else {
      const newDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      );
      set({
        currentDate: newDate,
        dateRange: {
          start: startOfMonth(newDate),
          end: endOfMonth(newDate),
        },
      });
    }
    fetchPosts();
  },

  goToToday: () => {
    const { viewMode, fetchPosts } = get();
    const today = new Date();
    if (viewMode === "week") {
      const weekStart = startOfWeek(today, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(today, { weekStartsOn: 0 });
      set({
        currentDate: today,
        dateRange: { start: weekStart, end: weekEnd },
      });
    } else {
      set({
        currentDate: today,
        dateRange: {
          start: startOfMonth(today),
          end: endOfMonth(today),
        },
      });
    }
    fetchPosts();
  },

  // Actions - Filters
  setSelectedChannelId: (channelId) => {
    set({ selectedChannelId: channelId });
    get().fetchPosts();
  },

  setSelectedMediaType: (mediaType) => set({ selectedMediaType: mediaType }),

  setDateRange: (start, end) => {
    set({ dateRange: { start, end } });
    get().fetchPosts();
  },

  // Actions - UI
  setSelectedPost: (post) => set({ selectedPost: post, isDetailOpen: !!post }),

  setIsDetailOpen: (open) =>
    set({ isDetailOpen: open, selectedPost: open ? get().selectedPost : null }),

  openNewPostDrawer: (post) =>
    set({
      isNewPostOpen: true,
      editingPost: post || null,
      submitError: null,
    }),

  closeNewPostDrawer: () =>
    set({
      isNewPostOpen: false,
      editingPost: null,
      submitError: null,
    }),

  clearSubmitError: () => set({ submitError: null }),

  // Computed
  getCalendarDays: () => {
    const { currentDate, viewMode, dateRange, posts, selectedMediaType } =
      get();
    const today = new Date();

    let calendarStart: Date;
    let calendarEnd: Date;

    if (viewMode === "week") {
      calendarStart = dateRange.start;
      calendarEnd = dateRange.end;
    } else {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
      calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    }

    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    // Filter by media type locally (since API doesn't support it)
    let filteredPosts = posts;
    if (selectedMediaType) {
      filteredPosts = posts.filter(
        (post) => post.mediaType === selectedMediaType
      );
    }

    return days.map((date) => ({
      date,
      isCurrentMonth: isSameMonth(date, currentDate),
      isToday: isSameDay(date, today),
      posts: filteredPosts.filter((post) => isSameDay(post.scheduledAt, date)),
    }));
  },
}));
