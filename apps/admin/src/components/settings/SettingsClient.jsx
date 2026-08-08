"use client";

import { useState } from "react";
import { updateSetting } from "@/actions/settings";
import { Settings2, Loader2, MessageCircle, Users, Inbox, PhoneCall, ClipboardList, BarChart3, MessageSquare, CalendarRange, Coffee, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

const FEATURE_FLAGS = [
  {
    id: "students_feature",
    title: "Students Module",
    description: "Manage student profiles and enrollment data.",
    icon: Users,
  },
  {
    id: "enquiries_feature",
    title: "Enquiries Module",
    description: "Handle incoming leads and customer queries.",
    icon: Inbox,
  },
  {
    id: "calls_feature",
    title: "Calls Tracking",
    description: "Track and log sales calls made by agents.",
    icon: PhoneCall,
  },
  {
    id: "team_feature",
    title: "Team Directory",
    description: "View internal team members and their statuses.",
    icon: Users,
  },
  {
    id: "eod_feature",
    title: "EOD Reports",
    description: "Allow employees to submit End-of-Day reports.",
    icon: ClipboardList,
  },
  {
    id: "eod_analytics_feature",
    title: "EOD Analytics",
    description: "View performance metrics and EOD statistics.",
    icon: BarChart3,
  },
  {
    id: "chat_feature",
    title: "Chat System",
    description: "Enable the internal chat and direct messaging system for all employees.",
    icon: MessageCircle,
  },
  {
    id: "counselling_feature",
    title: "Counselling",
    description: "Log and manage counselling sessions with students.",
    icon: MessageSquare,
  },
  {
    id: "leaves_feature",
    title: "Leave Management",
    description: "Manage employee leave requests and approvals.",
    icon: CalendarRange,
  },
  {
    id: "breaks_feature",
    title: "Break Management",
    description: "Track and limit employee breaks during shifts.",
    icon: Coffee,
  },
  {
    id: "users_feature",
    title: "User Management",
    description: "Manage roles and access for the administrative team.",
    icon: ShieldCheck,
  },
];

export function SettingsClient({ initialSettings }) {
  const [settings, setSettings] = useState(initialSettings || {});
  const [updating, setUpdating] = useState(null);
  const [confirmDisableFeature, setConfirmDisableFeature] = useState(null);

  const handleToggle = (key, currentValue) => {
    if (currentValue) {
      setConfirmDisableFeature(key);
    } else {
      executeToggle(key, currentValue);
    }
  };

  const executeToggle = async (key, currentValue) => {
    const newValue = !currentValue;
    setUpdating(key);
    
    // Optimistic update
    setSettings(prev => ({ ...prev, [key]: newValue }));

    try {
      const result = await updateSetting(key, newValue);
      if (result?.error) {
        toast.error(result.error);
        // Revert
        setSettings(prev => ({ ...prev, [key]: currentValue }));
      } else {
        toast.success("Settings updated");
      }
    } catch (error) {
      toast.error("Failed to update settings");
      setSettings(prev => ({ ...prev, [key]: currentValue }));
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Settings2 className="w-6 h-6 text-primary" />
            Global Settings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage feature availability across the Skillyards platform.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800/50 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800/50">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Feature Flags</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Turn specific modules on or off. Changes will apply immediately to all users upon refresh.
          </p>
        </div>
        
        <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
          {FEATURE_FLAGS.map((flag) => {
            const Icon = flag.icon;
            // Default to true if not set
            const isEnabled = settings[flag.id] !== false;
            const isUpdating = updating === flag.id;

            return (
              <div key={flag.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl shrink-0 ${isEnabled ? 'bg-primary/10 text-primary' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {flag.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-lg">
                      {flag.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center sm:ml-4 shrink-0">
                  <button
                    onClick={() => handleToggle(flag.id, isEnabled)}
                    disabled={isUpdating}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 ${
                      isEnabled ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                    } ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  {isUpdating && <Loader2 className="w-4 h-4 ml-3 text-primary animate-spin" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {confirmDisableFeature && (
        <ConfirmDialog
          title={`Disable ${FEATURE_FLAGS.find((f) => f.id === confirmDisableFeature)?.title}?`}
          message={
            confirmDisableFeature === "users_feature"
              ? "WARNING: Disabling User Management might lock administrators out of configuring roles or recovering access. Are you absolutely sure?"
              : "Are you sure you want to disable this feature? Users will lose access to this module immediately."
          }
          confirmLabel="Disable Feature"
          variant="danger"
          onConfirm={() => {
            executeToggle(confirmDisableFeature, true);
            setConfirmDisableFeature(null);
          }}
          onCancel={() => setConfirmDisableFeature(null)}
        />
      )}
    </div>
  );
}
