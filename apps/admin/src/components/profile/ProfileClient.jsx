"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  Lock,
  Camera,
  Loader2,
  Save,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Shield,
  Building2,
  Trash2,
} from "lucide-react";
import { updateProfile, changePassword, uploadProfilePhoto, removeProfilePhoto } from "@/actions/profile";

const ROLE_LABELS = {
  ADMIN: "Administrator",
  MANAGER: "Manager",
  SALES: "Sales Associate",
  HR: "HR",
  DEVELOPER: "Developer",
  DIGITAL_MARKETER: "Digital Marketer",
  EDITOR: "Editor",
  OUTSIDE_SALES: "Outside Sales",
};

const TEAM_LABELS = {
  sales: "Sales",
  tech: "Tech",
  hr: "HR",
  ceo_office: "CEO Office",
  admin_head: "Admin Head",
  marketing: "Marketing",
  outside_sales: "Outside Sales",
};

export function ProfileClient({ user }) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || "");
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [removingPhoto, setRemovingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(user.profileImageKey ? `/api/files/${user.profileImageKey}` : null);

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handlePhotoClick = () => fileInputRef.current?.click();

  const handleRemovePhoto = async () => {
    setRemovingPhoto(true);
    try {
      const res = await removeProfilePhoto();
      if (res.success) {
        setPhotoPreview(null);
        toast.success("Photo removed");
      } else {
        toast.error(res.error || "Failed to remove photo");
      }
    } catch {
      toast.error("Failed to remove photo");
    } finally {
      setRemovingPhoto(false);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Photo must be under 2MB");
      return;
    }

    if (!["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file.type)) {
      toast.error("Only PNG, JPEG, and WebP images are allowed");
      return;
    }

    setUploadingPhoto(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadProfilePhoto(formData);
      if (res.success) {
        setPhotoPreview(`/api/files/${res.profileImageKey}`);
        toast.success("Photo updated");
      } else {
        toast.error(res.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!name || !email) {
      toast.error("Name and email are required");
      return;
    }

    setSaving(true);
    try {
      const res = await updateProfile({ name, email, phone });
      if (res.success) {
        toast.success("Profile updated");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update");
      }
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setChangingPassword(true);
    try {
      const res = await changePassword({ currentPassword, newPassword });
      if (res.success) {
        setPasswordSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        toast.success("Password changed");
        setTimeout(() => setPasswordSuccess(false), 3000);
      } else {
        toast.error(res.error || "Failed to change password");
      }
    } catch {
      toast.error("Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal information and security settings.</p>
      </div>

      {/* Photo */}
      <div className="card p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-8 shadow-sm hover:shadow-md transition-all text-center sm:text-left relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none"></div>
        <div className="relative shrink-0">
          <div className="h-28 w-28 sm:h-24 sm:w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-4xl sm:text-3xl overflow-hidden ring-4 ring-background shadow-xl">
            {photoPreview ? (
              <img src={photoPreview} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>
        <div className="flex-1 relative z-10 flex flex-col items-center sm:items-start w-full">
          <h2 className="text-xl sm:text-lg font-bold">{user.name}</h2>
          <div className="text-sm text-muted-foreground flex flex-wrap justify-center sm:justify-start items-center gap-2 mt-1.5">
            <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
              <Shield className="h-3.5 w-3.5" />
              {ROLE_LABELS[user.role] || user.role}
            </span>
            {user.team && (
              <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                <Building2 className="h-3.5 w-3.5" />
                {TEAM_LABELS[user.team] || user.team}
              </span>
            )}
          </div>
          <div className="mt-5 flex items-center justify-center sm:justify-start gap-3 w-full">
            <button
              onClick={handlePhotoClick}
              disabled={uploadingPhoto || removingPhoto}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {uploadingPhoto ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Camera className="h-3.5 w-3.5" />
                  {photoPreview ? "Change Photo" : "Upload Photo"}
                </>
              )}
            </button>
            {photoPreview && (
              <button
                onClick={handleRemovePhoto}
                disabled={uploadingPhoto || removingPhoto}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-600 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {removingPhoto ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Removing...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="card p-5 sm:p-6 space-y-5 shadow-sm hover:shadow-md transition-all">
        <h2 className="text-lg font-semibold flex items-center gap-2 border-b border-border/50 pb-3">
          <User className="h-5 w-5 text-primary" />
          Personal Information
        </h2>

        <div className="space-y-4 pt-1">
          <label className="text-sm font-medium">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              className="input pl-10"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              className="input pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="tel"
              className="input pl-10"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 sm:py-2.5 text-base sm:text-sm rounded-xl font-medium hover:bg-primary/90 transition-all disabled:opacity-50 active:scale-[0.98] cursor-pointer shadow-sm hover:shadow"
          >
            {saving ? <Loader2 className="h-5 w-5 sm:h-4 sm:w-4 animate-spin" /> : <Save className="h-5 w-5 sm:h-4 sm:w-4" />}
            Save Changes
          </button>
        </div>
      </div>

      {/* Password */}
      <div className="card p-5 sm:p-6 space-y-5 shadow-sm hover:shadow-md transition-all border-amber-500/20">
        <h2 className="text-lg font-semibold flex items-center gap-2 border-b border-border/50 pb-3">
          <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-500">
            <Lock className="h-4 w-4" />
          </div>
          Security Settings
        </h2>

        <div className="space-y-4 pt-1">

        {passwordSuccess && (
          <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3 rounded-xl">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Password changed successfully
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Current Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="password"
              className="input pl-10"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">New Password</label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="password"
              className="input pl-10"
              placeholder="Min 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Confirm New Password</label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="password"
              className="input pl-10"
              placeholder="Repeat new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleChangePassword}
            disabled={changingPassword}
            className="w-full flex items-center justify-center gap-2 bg-amber-500 text-white py-3 sm:py-2.5 text-base sm:text-sm rounded-xl font-medium hover:bg-amber-600 transition-all disabled:opacity-50 active:scale-[0.98] cursor-pointer shadow-sm hover:shadow"
          >
            {changingPassword ? <Loader2 className="h-5 w-5 sm:h-4 sm:w-4 animate-spin" /> : <KeyRound className="h-5 w-5 sm:h-4 sm:w-4" />}
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}
