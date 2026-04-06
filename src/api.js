const BASE_URL = 'https://internsync-backend-atqp.onrender.com/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Request failed: ${res.status}`);
  }
  // 204 No Content has no body
  if (res.status === 204) return null;
  return res.json();
}

// ── Auth ──────────────────────────────────────────────
export const authAPI = {
  register: (name, email, password, role) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    }),
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

// ── Internships ───────────────────────────────────────
export const internshipAPI = {
  getAll: () => request('/internships'),
  create: (data) => request('/internships', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id) => request(`/internships/${id}`, { method: 'DELETE' }),
};

// ── Applications ──────────────────────────────────────
export const applicationAPI = {
  getAll: () => request('/applications'),
  apply: (internshipId, studentId) =>
    request('/applications', {
      method: 'POST',
      body: JSON.stringify({ internshipId, studentId }),
    }),
  updateStatus: (id, status) =>
    request(`/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// ── Tasks ─────────────────────────────────────────────
export const taskAPI = {
  getAll: () => request('/tasks'),
  create: (data) => request('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id, status) =>
    request(`/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  submitReport: (id, report) =>
    request(`/tasks/${id}/report`, {
      method: 'PATCH',
      body: JSON.stringify({ report }),
    }),
};

// ── Feedbacks ─────────────────────────────────────────
export const feedbackAPI = {
  getAll: () => request('/feedbacks'),
  create: (data) => request('/feedbacks', { method: 'POST', body: JSON.stringify(data) }),
};
