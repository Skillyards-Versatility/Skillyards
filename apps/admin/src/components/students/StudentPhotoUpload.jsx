"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, Trash2, Loader2, User } from "lucide-react";
import { toast } from "sonner";
import { uploadStudentPhoto, updateStudentPhoto } from "@/actions/student";

export function StudentPhotoUpload({
  photoKey = null,
  name = "",
  onChange = null,
  studentId = null,
  autoSave = false,
  onSuccess = null,
  canEdit = true,
  size = "lg",
  showLabel = true,
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [currentKey, setCurrentKey] = useState(photoKey);
  const [previewUrl, setPreviewUrl] = useState(
    photoKey ? `/files/${photoKey}` : null,
  );

  useEffect(() => {
    setCurrentKey(photoKey);
    setPreviewUrl(photoKey ? `/files/${photoKey}` : null);
  }, [photoKey]);

  const initials = (name || "")
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .toUpperCase()
    .slice(0, 2) || "S";

  const sizeClasses = {
    sm: "h-10 w-10 text-xs",
    md: "h-16 w-16 text-lg",
    lg: "h-24 w-24 text-2xl",
    xl: "h-28 w-28 text-3xl",
    "2xl": "h-32 w-32 sm:h-36 sm:w-36 text-4xl",
    "3xl": "h-36 w-36 sm:h-44 sm:w-44 text-5xl",
  }[size] || "h-24 w-24 text-2xl";

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-6 h-6",
    "2xl": "w-7 h-7",
    "3xl": "w-8 h-8",
  }[size] || "w-5 h-5";

  const badgeIconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
    xl: "w-4 h-4",
    "2xl": "w-4.5 h-4.5",
    "3xl": "w-5 h-5",
  }[size] || "w-3.5 h-3.5";

  const badgePadding = {
    sm: "p-1",
    md: "p-1.5",
    lg: "p-2",
    xl: "p-2",
    "2xl": "p-2 sm:p-2.5",
    "3xl": "p-2.5 sm:p-3",
  }[size] || "p-1.5";

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Photo must be under 2MB");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (
      !["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(
        file.type,
      )
    ) {
      toast.error("Only PNG, JPEG, and WebP images are allowed");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploading(true);
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadStudentPhoto(formData);
      if (!res.success) {
        setPreviewUrl(currentKey ? `/files/${currentKey}` : null);
        toast.error(res.error || "Failed to upload photo");
        return;
      }

      setCurrentKey(res.photoKey);
      setPreviewUrl(`/files/${res.photoKey}`);

      if (onChange) {
        onChange(res.photoKey);
      }

      if (autoSave && studentId) {
        await updateStudentPhoto(studentId, res.photoKey);
        toast.success("Student photo updated");
        onSuccess?.(res.photoKey);
      } else {
        toast.success("Photo uploaded");
      }
    } catch (err) {
      console.error("Photo upload error:", err);
      setPreviewUrl(currentKey ? `/files/${currentKey}` : null);
      toast.error("Failed to upload photo");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = async (e) => {
    e.stopPropagation();
    if (!currentKey && !previewUrl) return;

    setRemoving(true);
    try {
      if (autoSave && studentId) {
        await updateStudentPhoto(studentId, null);
        toast.success("Student photo removed");
        onSuccess?.(null);
      } else {
        toast.success("Photo removed");
      }

      setCurrentKey(null);
      setPreviewUrl(null);
      if (onChange) {
        onChange(null);
      }
    } catch (err) {
      console.error("Failed to remove photo:", err);
      toast.error("Failed to remove photo");
    } finally {
      setRemoving(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-start sm:items-center gap-3.5 sm:gap-4">
      {/* Avatar Container */}
      <div className="relative group shrink-0">
        <div
          className={`${sizeClasses} rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-muted border border-border shadow-xs flex items-center justify-center font-bold text-primary overflow-hidden select-none transition-all ${
            canEdit ? "cursor-pointer group-hover:ring-2 group-hover:ring-primary/40" : ""
          }`}
          onClick={() => canEdit && !uploading && !removing && fileInputRef.current?.click()}
          title={canEdit ? "Click to change photo" : undefined}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={name || "Student Photo"}
              className="h-full w-full object-cover"
              onError={() => setPreviewUrl(null)}
            />
          ) : (
            <span>{initials}</span>
          )}

          {/* Uploading Overlay */}
          {(uploading || removing) && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center text-white z-10">
              <Loader2 className={`${iconSizes} animate-spin text-primary-foreground`} />
            </div>
          )}

          {/* Hover Camera Overlay on Editable Avatar */}
          {canEdit && !uploading && !removing && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <Camera className={iconSizes} />
            </div>
          )}
        </div>

        {/* Small badge camera button */}
        {canEdit && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || removing}
            className={`absolute -bottom-1 -right-1 ${badgePadding} bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-md border-2 border-background transition-transform active:scale-95 disabled:opacity-50 cursor-pointer`}
            title="Upload new photo"
          >
            <Camera className={badgeIconSizes} />
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Label and Actions */}
      {showLabel && (
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-foreground">
            Student Photo
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            PNG, JPEG or WebP up to 2MB. Square image recommended.
          </p>

          {canEdit && (
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || removing}
                className="px-3 py-1.5 text-xs font-semibold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Camera className="w-3.5 h-3.5" />
                    {previewUrl ? "Change Photo" : "Upload Photo"}
                  </>
                )}
              </button>

              {previewUrl && (
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={uploading || removing}
                  className="px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10 border border-destructive/25 rounded-lg transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  {removing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  Remove
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
