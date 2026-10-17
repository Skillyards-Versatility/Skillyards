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
};
