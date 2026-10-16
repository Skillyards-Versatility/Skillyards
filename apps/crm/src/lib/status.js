/**
 * Single source of truth helper mapping CRM domain statuses to classes defined in globals.css
 */

export const STATUS_CLASSES = {
  new: "crm-badge crm-badge-new",
  contacted: "crm-badge crm-badge-contacted",
  follow_up: "crm-badge crm-badge-follow_up",
  counselling_scheduled: "crm-badge crm-badge-counselling_scheduled",
  counselled: "crm-badge crm-badge-counselled",
  qualified: "crm-badge crm-badge-qualified",
  converted: "crm-badge crm-badge-converted",
  cold: "crm-badge crm-badge-cold",
  lost: "crm-badge crm-badge-lost",

  // Counselling Outcomes
  session_booked: "crm-badge crm-badge-counselling_scheduled",
  scheduled: "crm-badge crm-badge-counselling_scheduled",
  completed: "crm-badge crm-badge-completed",
  enrolled: "crm-badge crm-badge-converted",
  not_interested: "crm-badge crm-badge-lost",
  no_response: "crm-badge crm-badge-cold",
  cancelled: "crm-badge crm-badge-lost",
  no_show: "crm-badge crm-badge-danger",

  // Sources
  walk_in: "crm-badge crm-badge-info",
  phone: "crm-badge crm-badge-contacted",
  referral: "crm-badge crm-badge-follow_up",
};

export function getStatusBadgeClass(status) {
  return STATUS_CLASSES[status] || "crm-badge crm-badge-cold";
}

export function formatStatusLabel(status) {
  if (!status) return "";
  return status.replace(/_/g, " ");
}
