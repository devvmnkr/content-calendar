import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { Upload, X, Loader2, AlertCircle } from "lucide-react";
import { useCalendarStore } from "@/stores/calendarStore";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SocialIcon } from "./SocialIcon";
import { CALENDAR_STRINGS, PLATFORM_LABELS, PLATFORMS } from "./constants";
import { cn } from "@/lib/utils";
import type { Platform, PostStatus } from "@/types/calendar";

interface FormData {
  title: string;
  content: string;
  channels: Platform[];
  scheduledDate: string;
  scheduledTime: string;
  status: PostStatus;
}

interface FormErrors {
  title?: string;
  channels?: string;
  scheduledDate?: string;
  scheduledTime?: string;
}

const STATUS_OPTIONS: { value: PostStatus; label: string }[] = [
  { value: "draft", label: CALENDAR_STRINGS.STATUS_DRAFT },
  { value: "scheduled", label: CALENDAR_STRINGS.STATUS_SCHEDULED },
];

export function NewPostSheet() {
  const {
    isNewPostOpen,
    editingPost,
    isSubmitting,
    submitError,
    closeNewPostDrawer,
    createPost,
    updatePost,
    clearSubmitError,
  } = useCalendarStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
    channels: [],
    scheduledDate: format(new Date(), "yyyy-MM-dd"),
    scheduledTime: "12:00",
    status: "draft",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Consider editing only if post has an id (not a duplicate)
  const isEditing = !!editingPost && !!editingPost.id;

  // Reset form when drawer opens/closes or when editing post changes
  useEffect(() => {
    if (isNewPostOpen) {
      if (editingPost) {
        setFormData({
          title: editingPost.title,
          content: editingPost.content || "",
          channels: editingPost.channels,
          scheduledDate: format(editingPost.scheduledAt, "yyyy-MM-dd"),
          scheduledTime: format(editingPost.scheduledAt, "HH:mm"),
          status: editingPost.status,
        });
      } else {
        setFormData({
          title: "",
          content: "",
          channels: [],
          scheduledDate: format(new Date(), "yyyy-MM-dd"),
          scheduledTime: "12:00",
          status: "draft",
        });
      }
      setFile(null);
      setErrors({});
      clearSubmitError();
    }
  }, [isNewPostOpen, editingPost, clearSubmitError]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = CALENDAR_STRINGS.VALIDATION_TITLE_REQUIRED;
    }

    if (formData.channels.length === 0) {
      newErrors.channels = CALENDAR_STRINGS.VALIDATION_CHANNELS_REQUIRED;
    }

    if (!formData.scheduledDate) {
      newErrors.scheduledDate = CALENDAR_STRINGS.VALIDATION_DATE_REQUIRED;
    }

    if (!formData.scheduledTime) {
      newErrors.scheduledTime = CALENDAR_STRINGS.VALIDATION_TIME_REQUIRED;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const scheduledTime = `${formData.scheduledDate}T${formData.scheduledTime}:00Z`;

    const payload = {
      title: formData.title.trim(),
      content: formData.content.trim() || undefined,
      channels: formData.channels,
      scheduled_time: scheduledTime,
      status: formData.status,
    };

    if (isEditing && editingPost) {
      await updatePost(editingPost.id, payload, file || undefined);
    } else {
      await createPost(payload, file || undefined);
    }
  };

  const toggleChannel = (channel: Platform) => {
    setFormData((prev) => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter((c) => c !== channel)
        : [...prev.channels, channel],
    }));
    if (errors.channels) {
      setErrors((prev) => ({ ...prev, channels: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Sheet open={isNewPostOpen} onOpenChange={closeNewPostDrawer}>
      <SheetContent className="flex flex-col overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            {isEditing
              ? CALENDAR_STRINGS.EDIT_POST_TITLE
              : CALENDAR_STRINGS.NEW_POST_TITLE}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? CALENDAR_STRINGS.EDIT_POST_DESCRIPTION
              : CALENDAR_STRINGS.NEW_POST_DESCRIPTION}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-1 flex-col gap-5"
        >
          {/* Error banner */}
          {submitError && (
            <div className="flex items-center gap-2 rounded-lg bg-accent1-subtle px-4 py-3 text-sm text-accent1-main">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Title */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="title"
              className="text-sm font-medium text-text-primary"
            >
              {CALENDAR_STRINGS.FORM_TITLE}
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, title: e.target.value }));
                if (errors.title) {
                  setErrors((prev) => ({ ...prev, title: undefined }));
                }
              }}
              placeholder={CALENDAR_STRINGS.FORM_TITLE_PLACEHOLDER}
              error={errors.title}
              disabled={isSubmitting}
            />
            {errors.title && (
              <span className="text-xs text-accent1-main">{errors.title}</span>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="content"
              className="text-sm font-medium text-text-primary"
            >
              {CALENDAR_STRINGS.FORM_CONTENT}
            </label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              placeholder={CALENDAR_STRINGS.FORM_CONTENT_PLACEHOLDER}
              disabled={isSubmitting}
            />
          </div>

          {/* Channels */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-primary">
              {CALENDAR_STRINGS.FORM_CHANNELS}
            </label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((platform) => {
                const isSelected = formData.channels.includes(platform);
                return (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => toggleChannel(platform)}
                    disabled={isSubmitting}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                      isSelected
                        ? "border-primary-main bg-primary-subtle text-primary-main"
                        : "border-border-default bg-bg text-text-secondary hover:border-border-strong hover:bg-surface-1"
                    )}
                  >
                    <SocialIcon
                      platform={platform}
                      size={14}
                      showBackground={false}
                    />
                    {PLATFORM_LABELS[platform]}
                  </button>
                );
              })}
            </div>
            {errors.channels && (
              <span className="text-xs text-accent1-main">
                {errors.channels}
              </span>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="scheduledDate"
                className="text-sm font-medium text-text-primary"
              >
                {CALENDAR_STRINGS.FORM_SCHEDULED_DATE}
              </label>
              <Input
                id="scheduledDate"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    scheduledDate: e.target.value,
                  }));
                  if (errors.scheduledDate) {
                    setErrors((prev) => ({
                      ...prev,
                      scheduledDate: undefined,
                    }));
                  }
                }}
                error={errors.scheduledDate}
                disabled={isSubmitting}
              />
              {errors.scheduledDate && (
                <span className="text-xs text-accent1-main">
                  {errors.scheduledDate}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="scheduledTime"
                className="text-sm font-medium text-text-primary"
              >
                {CALENDAR_STRINGS.FORM_SCHEDULED_TIME}
              </label>
              <Input
                id="scheduledTime"
                type="time"
                value={formData.scheduledTime}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    scheduledTime: e.target.value,
                  }));
                  if (errors.scheduledTime) {
                    setErrors((prev) => ({
                      ...prev,
                      scheduledTime: undefined,
                    }));
                  }
                }}
                error={errors.scheduledTime}
                disabled={isSubmitting}
              />
              {errors.scheduledTime && (
                <span className="text-xs text-accent1-main">
                  {errors.scheduledTime}
                </span>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-primary">
              {CALENDAR_STRINGS.FORM_STATUS}
            </label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  status: value as PostStatus,
                }))
              }
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* File upload */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-primary">
              {CALENDAR_STRINGS.FORM_FILE}
            </label>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
              disabled={isSubmitting}
            />
            {file ? (
              <div className="flex items-center gap-2 rounded-lg border border-border-default bg-surface-1 px-4 py-3">
                <span className="flex-1 truncate text-sm text-text-primary">
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={removeFile}
                  className="text-text-tertiary hover:text-text-primary"
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : editingPost?.fileName ? (
              <div className="flex items-center gap-2 rounded-lg border border-border-default bg-surface-1 px-4 py-3">
                <span className="flex-1 truncate text-sm text-text-secondary">
                  {editingPost.fileName}
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-primary-main hover:text-primary-hover"
                  disabled={isSubmitting}
                >
                  {CALENDAR_STRINGS.FORM_FILE_CHANGE}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border-default bg-bg py-8 text-sm text-text-secondary transition-colors hover:border-border-strong hover:bg-surface-1"
                disabled={isSubmitting}
              >
                <Upload className="h-4 w-4" />
                {CALENDAR_STRINGS.FORM_FILE_PLACEHOLDER}
              </button>
            )}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Footer */}
          <SheetFooter className="mt-4 border-t border-border-default pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={closeNewPostDrawer}
              disabled={isSubmitting}
            >
              {CALENDAR_STRINGS.CANCEL}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isEditing
                    ? CALENDAR_STRINGS.LOADING_UPDATING
                    : CALENDAR_STRINGS.LOADING_CREATING}
                </>
              ) : isEditing ? (
                CALENDAR_STRINGS.UPDATE_POST
              ) : (
                CALENDAR_STRINGS.CREATE_POST
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
