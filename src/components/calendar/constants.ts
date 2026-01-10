import type { Platform, MediaType } from "@/types/calendar";

export const CALENDAR_STRINGS = {
  // Headers
  PAGE_TITLE: "Schedule",
  MONTH_DROPDOWN_LABEL: "Select month",

  // Days of week
  DAYS_SHORT: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const,
  DAYS_FULL: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ] as const,

  // Months
  MONTHS: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ] as const,

  // Filters
  FILTER_CHANNEL: "Channel",
  FILTER_CHANNEL_ALL: "All Channels",
  FILTER_MEDIA: "Media",
  FILTER_MEDIA_ALL: "All media",
  FILTER_DATE_RANGE: "Date Range",

  // View modes
  VIEW_WEEK: "Week",
  VIEW_MONTH: "Month",

  // Actions
  ADD_NEW: "Add New",
  EDIT: "Edit",
  DELETE: "Delete",
  DUPLICATE: "Duplicate",
  RESCHEDULE: "Reschedule",
  SAVE: "Save",
  CANCEL: "Cancel",
  CREATE_POST: "Create Post",
  UPDATE_POST: "Update Post",
  RETRY: "Retry",

  // Post detail
  POST_DETAILS: "Post Details",
  SCHEDULED_FOR: "Scheduled for",
  PLATFORM: "Platform",
  CHANNELS: "Channels",
  MEDIA_TYPE: "Media Type",
  STATUS: "Status",
  CONTENT: "Content",

  // Status labels
  STATUS_DRAFT: "Draft",
  STATUS_SCHEDULED: "Scheduled",
  STATUS_PUBLISHED: "Published",
  STATUS_FAILED: "Failed",

  // Counts
  PUBLICATION: "Publication",
  PUBLICATIONS: "Publications",

  // Navigation
  PREVIOUS_MONTH: "Previous month",
  NEXT_MONTH: "Next month",
  TODAY: "Today",

  // Date picker
  SELECT_START_DATE: "Click to select start date",
  SELECT_END_DATE: "Click to select end date",
  THIS_MONTH: "This Month",
  THIS_WEEK: "This Week",

  // Form labels
  FORM_TITLE: "Title",
  FORM_TITLE_PLACEHOLDER: "Enter post title",
  FORM_CONTENT: "Content",
  FORM_CONTENT_PLACEHOLDER: "Write your post content...",
  FORM_CHANNELS: "Channels",
  FORM_CHANNELS_PLACEHOLDER: "Select channels",
  FORM_SCHEDULED_DATE: "Scheduled Date",
  FORM_SCHEDULED_TIME: "Scheduled Time",
  FORM_STATUS: "Status",
  FORM_FILE: "Attachment",
  FORM_FILE_PLACEHOLDER: "Choose a file",
  FORM_FILE_CHANGE: "Change file",
  FORM_FILE_REMOVE: "Remove",

  // Form validation
  VALIDATION_TITLE_REQUIRED: "Title is required",
  VALIDATION_CHANNELS_REQUIRED: "At least one channel is required",
  VALIDATION_DATE_REQUIRED: "Scheduled date is required",
  VALIDATION_TIME_REQUIRED: "Scheduled time is required",

  // New post drawer
  NEW_POST_TITLE: "New Post",
  EDIT_POST_TITLE: "Edit Post",
  NEW_POST_DESCRIPTION: "Create a new post for your social channels",
  EDIT_POST_DESCRIPTION: "Update your post details",

  // Loading states
  LOADING_POSTS: "Loading posts...",
  LOADING_CREATING: "Creating post...",
  LOADING_UPDATING: "Updating post...",
  LOADING_DELETING: "Deleting post...",

  // Error states
  ERROR_LOADING_POSTS: "Failed to load posts",
  ERROR_CREATING_POST: "Failed to create post",
  ERROR_UPDATING_POST: "Failed to update post",
  ERROR_DELETING_POST: "Failed to delete post",

  // Success messages
  SUCCESS_POST_CREATED: "Post created successfully",
  SUCCESS_POST_UPDATED: "Post updated successfully",
  SUCCESS_POST_DELETED: "Post deleted successfully",

  // Empty states
  EMPTY_POSTS: "No posts scheduled",
  EMPTY_POSTS_DESCRIPTION: "Click 'Add New' to create your first post",

  // Delete confirmation
  DELETE_CONFIRM_TITLE: "Delete Post",
  DELETE_CONFIRM_MESSAGE:
    "Are you sure you want to delete this post? This action cannot be undone.",
  DELETE_CONFIRM_YES: "Yes, delete",
  DELETE_CONFIRM_NO: "Cancel",
} as const;

export const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  twitter: "Twitter",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  pinterest: "Pinterest",
};

export const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
  image: "Image",
  video: "Video",
  carousel: "Carousel",
  story: "Story",
  reel: "Reel",
};

export const PLATFORM_COLORS: Record<Platform, string> = {
  instagram: "platform-instagram",
  facebook: "platform-facebook",
  twitter: "platform-twitter",
  youtube: "platform-youtube",
  linkedin: "platform-linkedin",
  tiktok: "platform-tiktok",
  pinterest: "platform-pinterest",
};

export const PLATFORMS: Platform[] = [
  "instagram",
  "facebook",
  "twitter",
  "youtube",
  "linkedin",
  "tiktok",
  "pinterest",
];
