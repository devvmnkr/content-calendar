import { useState } from "react";
import { format } from "date-fns";
import {
  Copy,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useCalendarStore } from "@/stores/calendarStore";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SocialIcon } from "./SocialIcon";
import {
  CALENDAR_STRINGS,
  PLATFORM_LABELS,
  MEDIA_TYPE_LABELS,
} from "./constants";

export function PostDetailSheet() {
  const {
    selectedPost,
    isDetailOpen,
    isSubmitting,
    submitError,
    setIsDetailOpen,
    openNewPostDrawer,
    deletePost,
    clearSubmitError,
  } = useCalendarStore();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!selectedPost) return null;

  const scheduledDate = format(selectedPost.scheduledAt, "EEEE, MMMM d, yyyy");
  const scheduledTime = format(selectedPost.scheduledAt, "hh:mm a");

  const getStatusColor = () => {
    switch (selectedPost.status) {
      case "scheduled":
        return "bg-secondary-subtle text-secondary-main";
      case "published":
        return "bg-primary-subtle text-primary-main";
      case "failed":
        return "bg-accent1-subtle text-accent1-main";
      default:
        return "bg-surface-2 text-text-secondary";
    }
  };

  const getStatusLabel = () => {
    switch (selectedPost.status) {
      case "scheduled":
        return CALENDAR_STRINGS.STATUS_SCHEDULED;
      case "published":
        return CALENDAR_STRINGS.STATUS_PUBLISHED;
      case "failed":
        return CALENDAR_STRINGS.STATUS_FAILED;
      default:
        return CALENDAR_STRINGS.STATUS_DRAFT;
    }
  };

  const handleEdit = () => {
    setIsDetailOpen(false);
    openNewPostDrawer(selectedPost);
  };

  const handleDelete = async () => {
    await deletePost(selectedPost.id);
    setShowDeleteConfirm(false);
  };

  const handleDuplicate = () => {
    // Create a new post with the same data but without id
    setIsDetailOpen(false);
    openNewPostDrawer({
      ...selectedPost,
      id: "", // Clear id to create a new post
      title: `${selectedPost.title} (Copy)`,
    });
  };

  return (
    <Sheet
      open={isDetailOpen}
      onOpenChange={(open) => {
        setIsDetailOpen(open);
        if (!open) {
          setShowDeleteConfirm(false);
          clearSubmitError();
        }
      }}
    >
      <SheetContent className="flex flex-col overflow-y-auto">
        <SheetHeader className="space-y-4">
          {/* Channel icons */}
          <div className="flex items-center gap-3">
            <div className="flex items-center -space-x-1">
              {selectedPost.channels.slice(0, 3).map((channel, index) => (
                <div
                  key={channel}
                  className="relative rounded-md ring-2 ring-bg"
                  style={{ zIndex: 3 - index }}
                >
                  <SocialIcon platform={channel} size={18} showBackground />
                </div>
              ))}
              {selectedPost.channels.length > 3 && (
                <div
                  className="relative flex h-7 w-7 items-center justify-center rounded-md bg-surface-3 text-xs font-medium text-text-primary ring-2 ring-bg"
                  style={{ zIndex: 0 }}
                >
                  +{selectedPost.channels.length - 3}
                </div>
              )}
            </div>
            <div className="flex-1">
              <SheetTitle className="text-left">
                {selectedPost.title}
              </SheetTitle>
              <SheetDescription className="text-left">
                {selectedPost.channels
                  .map((channel) => PLATFORM_LABELS[channel])
                  .join(", ")}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 flex-1 space-y-6">
          {/* Error banner */}
          {submitError && (
            <div className="flex items-center gap-2 rounded-lg bg-accent1-subtle px-4 py-3 text-sm text-accent1-main">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Schedule info */}
          <div className="rounded-lg border border-border-default bg-surface-1 p-4">
            <h3 className="mb-3 text-sm font-medium text-text-secondary">
              {CALENDAR_STRINGS.SCHEDULED_FOR}
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-text-primary">
                <Calendar className="h-4 w-4 text-text-tertiary" />
                <span className="text-sm">{scheduledDate}</span>
              </div>
              <div className="flex items-center gap-2 text-text-primary">
                <Clock className="h-4 w-4 text-text-tertiary" />
                <span className="text-sm">{scheduledTime}</span>
              </div>
            </div>
          </div>

          {/* Status & Media type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="mb-2 text-sm font-medium text-text-secondary">
                {CALENDAR_STRINGS.STATUS}
              </h3>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusColor()}`}
              >
                {getStatusLabel()}
              </span>
            </div>
            {selectedPost.mediaType && (
              <div>
                <h3 className="mb-2 text-sm font-medium text-text-secondary">
                  {CALENDAR_STRINGS.MEDIA_TYPE}
                </h3>
                <span className="inline-flex rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-text-primary">
                  {MEDIA_TYPE_LABELS[selectedPost.mediaType]}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          {selectedPost.content && (
            <div>
              <h3 className="mb-2 text-sm font-medium text-text-secondary">
                {CALENDAR_STRINGS.CONTENT}
              </h3>
              <p className="rounded-lg border border-border-default bg-surface-1 p-4 text-sm leading-relaxed text-text-primary">
                {selectedPost.content}
              </p>
            </div>
          )}

          {/* File attachment */}
          {selectedPost.fileUrl && selectedPost.fileName && (
            <div>
              <h3 className="mb-2 text-sm font-medium text-text-secondary">
                {CALENDAR_STRINGS.FORM_FILE}
              </h3>
              <a
                href={selectedPost.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border-default bg-surface-1 px-4 py-3 text-sm text-primary-main transition-colors hover:bg-surface-2"
              >
                {selectedPost.fileName}
              </a>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-2 border-t border-border-default pt-4">
          {showDeleteConfirm ? (
            <>
              <p className="mb-2 text-sm text-text-secondary">
                {CALENDAR_STRINGS.DELETE_CONFIRM_MESSAGE}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isSubmitting}
                >
                  {CALENDAR_STRINGS.DELETE_CONFIRM_NO}
                </Button>
                <Button
                  className="flex-1 bg-accent1-main text-text-inverse hover:bg-accent1-hover"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {CALENDAR_STRINGS.LOADING_DELETING}
                    </>
                  ) : (
                    CALENDAR_STRINGS.DELETE_CONFIRM_YES
                  )}
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="justify-start gap-2"
                onClick={handleEdit}
                disabled={isSubmitting}
              >
                <Edit2 className="h-4 w-4" />
                {CALENDAR_STRINGS.EDIT}
              </Button>
              <Button
                variant="outline"
                className="justify-start gap-2"
                onClick={handleDuplicate}
                disabled={isSubmitting}
              >
                <Copy className="h-4 w-4" />
                {CALENDAR_STRINGS.DUPLICATE}
              </Button>
              <Button
                variant="outline"
                className="justify-start gap-2 text-accent1-main hover:bg-accent1-subtle hover:text-accent1-main"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isSubmitting}
              >
                <Trash2 className="h-4 w-4" />
                {CALENDAR_STRINGS.DELETE}
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
