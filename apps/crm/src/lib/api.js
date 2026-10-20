/**
 * Skillyards CRM Client API wrapper
 */

export async function apiRequest(endpoint, { method = "GET", body, headers = {} } = {}) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include",
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(endpoint, options);
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    let errorMsg = data?.message || data?.error?.message;
    if (!errorMsg) {
      if (res.status === 500) {
        errorMsg = "Backend API server error (HTTP 500). Please ensure apps/api is running on http://localhost:3000.";
      } else {
        errorMsg = `Request failed with status ${res.status}`;
      }
    }
    const err = new Error(errorMsg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data?.data ?? data;
}

export const crmApi = {
  getMe: () => apiRequest("/api/crm/me"),
  getLeads: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        searchParams.set(key, val);
      }
    });
    const query = searchParams.toString();
    return apiRequest(`/api/crm/leads${query ? `?${query}` : ""}`);
  },
  getLead: (id) => apiRequest(`/api/crm/leads/${id}`),
  createLead: (payload) => apiRequest("/api/crm/leads", { method: "POST", body: payload }),
  updateLead: (id, payload) => apiRequest(`/api/crm/leads/${id}`, { method: "PATCH", body: payload }),
  logCall: (id, payload) => apiRequest(`/api/crm/leads/${id}/calls`, { method: "POST", body: payload }),
  getStaff: () => apiRequest("/api/crm/staff"),
  getDuplicates: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        searchParams.set(key, val);
      }
    });
    const query = searchParams.toString();
    return apiRequest(`/api/crm/duplicates${query ? `?${query}` : ""}`);
  },
  resolveDuplicate: (id, payload) =>
    apiRequest(`/api/crm/duplicates/${id}/resolve`, { method: "POST", body: payload }),
  getQueue: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        searchParams.set(key, val);
      }
    });
    const query = searchParams.toString();
    return apiRequest(`/api/crm/queue${query ? `?${query}` : ""}`);
  },
  claimLead: (id) => apiRequest(`/api/crm/leads/${id}/claim`, { method: "POST" }),
  autoAssignLead: (id) => apiRequest(`/api/crm/leads/${id}/auto-assign`, { method: "POST" }),
  getTeams: () => apiRequest("/api/crm/teams"),
  getFollowUps: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        searchParams.set(key, val);
      }
    });
    const query = searchParams.toString();
    return apiRequest(`/api/crm/follow-ups${query ? `?${query}` : ""}`);
  },
  completeFollowUp: (id, payload) =>
    apiRequest(`/api/crm/follow-ups/${id}`, {
      method: "PATCH",
      body: { action: "complete", ...payload },
    }),
  rescheduleFollowUp: (id, payload) =>
    apiRequest(`/api/crm/follow-ups/${id}`, {
      method: "PATCH",
      body: { action: "reschedule", ...payload },
    }),
  getCounselling: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        searchParams.set(key, val);
      }
    });
    const query = searchParams.toString();
    return apiRequest(`/api/crm/counselling${query ? `?${query}` : ""}`);
  },
  getCounsellingSession: (id) => apiRequest(`/api/crm/counselling/${id}`),
  createCounselling: (payload) =>
    apiRequest("/api/crm/counselling", { method: "POST", body: payload }),
  rescheduleCounselling: (id, payload) =>
    apiRequest(`/api/crm/counselling/${id}/reschedule`, { method: "POST", body: payload }),
  updateCounsellingStatus: (id, payload) =>
    apiRequest(`/api/crm/counselling/${id}/status`, { method: "POST", body: payload }),
  scheduleLeadCounselling: (leadId, payload) =>
    apiRequest(`/api/crm/leads/${leadId}/counselling`, { method: "POST", body: payload }),
  getEodPreview: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        searchParams.set(key, val);
      }
    });
    const query = searchParams.toString();
    return apiRequest(`/api/crm/eod/preview${query ? `?${query}` : ""}`);
  },
  submitEodReport: (payload) =>
    apiRequest("/api/crm/eod-reports", { method: "POST", body: payload }),
  getEodReports: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        searchParams.set(key, val);
      }
    });
    const query = searchParams.toString();
    return apiRequest(`/api/crm/eod-reports${query ? `?${query}` : ""}`);
  },
  getEodReport: (id) => apiRequest(`/api/crm/eod-reports/${id}`),
  amendEodReport: (id, payload) =>
    apiRequest(`/api/crm/eod-reports/${id}/amend`, { method: "POST", body: payload }),
  // Admissions & Student Enrollment
  getAdmissions: () => apiRequest("/api/crm/admissions"),
  enrollStudent: (payload) =>
    apiRequest("/api/crm/admissions", { method: "POST", body: payload }),
  // Bulk Lead Actions
  bulkUpdateLeads: (payload) =>
    apiRequest("/api/crm/leads/bulk", { method: "POST", body: payload }),
  // Single Lead Outreach Logging
  logOutreach: (leadId, payload) =>
    apiRequest(`/api/crm/leads/${leadId}/outreach`, { method: "POST", body: payload }),
  // Course Cohorts & Batch Seat Allocation
  getCohorts: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        searchParams.set(key, val);
      }
    });
    const query = searchParams.toString();
    return apiRequest(`/api/crm/cohorts${query ? `?${query}` : ""}`);
  },
  getCohort: (id) => apiRequest(`/api/crm/cohorts/${id}`),
  createCohort: (payload) =>
    apiRequest("/api/crm/cohorts", { method: "POST", body: payload }),
  assignStudentToCohort: (cohortId, payload) =>
    apiRequest(`/api/crm/cohorts/${cohortId}`, { method: "POST", body: payload }),
  // Lead Nurturing & Drip Cadences
  getCadences: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        searchParams.set(key, val);
      }
    });
    const query = searchParams.toString();
    return apiRequest(`/api/crm/cadences${query ? `?${query}` : ""}`);
  },
  getCadence: (id) => apiRequest(`/api/crm/cadences/${id}`),
  createCadence: (payload) =>
    apiRequest("/api/crm/cadences", { method: "POST", body: payload }),
  updateCadence: (id, payload) =>
    apiRequest(`/api/crm/cadences/${id}`, { method: "PATCH", body: payload }),
  enrollLeadInCadence: (cadenceId, payload) =>
    apiRequest(`/api/crm/cadences/${cadenceId}/enroll`, { method: "POST", body: payload }),
  // Fee Installments & EMI Collections Desk
  getInstallments: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        searchParams.set(key, val);
      }
    });
    const query = searchParams.toString();
    return apiRequest(`/api/crm/installments${query ? `?${query}` : ""}`);
  },
  createInstallment: (payload) =>
    apiRequest("/api/crm/installments", { method: "POST", body: payload }),
  collectInstallment: (payload) =>
    apiRequest("/api/crm/installments/collect", { method: "POST", body: payload }),
  sendInstallmentReminder: (payload) =>
    apiRequest("/api/crm/installments/remind", { method: "POST", body: payload }),
  // Omnichannel Communications & WhatsApp Inbox
  getInboxThreads: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        searchParams.set(key, val);
      }
    });
    const query = searchParams.toString();
    return apiRequest(`/api/crm/inbox${query ? `?${query}` : ""}`);
  },
  getInboxThread: (id) => apiRequest(`/api/crm/inbox/${id}`),
  sendInboxMessage: (id, payload) =>
    apiRequest(`/api/crm/inbox/${id}`, { method: "POST", body: payload }),
  // Marketing Campaign ROI & Lead Attribution Desk
  getCampaigns: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        searchParams.set(key, val);
      }
    });
    const query = searchParams.toString();
    return apiRequest(`/api/crm/campaigns${query ? `?${query}` : ""}`);
  },
  getCampaign: (id) => apiRequest(`/api/crm/campaigns/${id}`),
  createCampaign: (payload) =>
    apiRequest("/api/crm/campaigns", { method: "POST", body: payload }),
  updateCampaign: (id, payload) =>
    apiRequest(`/api/crm/campaigns/${id}`, { method: "PATCH", body: payload }),
};

