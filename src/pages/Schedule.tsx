import { useEffect } from "react";
import {
  CalendarToolbar,
  CalendarHeader,
  CalendarGrid,
  PostDetailSheet,
  NewPostSheet,
} from "@/components/calendar";
import { useCalendarStore } from "@/stores/calendarStore";

export function Schedule() {
  const { fetchPosts } = useCalendarStore();

  // Fetch posts on initial load
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="flex h-full flex-col bg-bg">
      {/* Toolbar with filters */}
      <CalendarToolbar />

      {/* Month header with navigation and Add New button */}
      <CalendarHeader />

      {/* Calendar grid */}
      <CalendarGrid />

      {/* Post detail sidebar */}
      <PostDetailSheet />

      {/* New/Edit post drawer */}
      <NewPostSheet />
    </div>
  );
}
