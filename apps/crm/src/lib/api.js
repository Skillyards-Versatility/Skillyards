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
    const errorMsg = data?.message || data?.error?.message || `Request failed with status ${res.status}`;
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
};
