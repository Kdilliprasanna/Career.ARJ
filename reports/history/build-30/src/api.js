const candidateBases = [
  import.meta.env.VITE_API_URL,
  typeof localStorage !== 'undefined' ? localStorage.getItem('arj.api_url') : null,
  'http://localhost:4000/api',
  'http://127.0.0.1:4000/api',
  'http://192.168.1.8:4000/api',
  'http://10.0.2.2:4000/api',
  '/api'
].filter(Boolean);

let cachedWorkingBase = candidateBases[0] || 'http://localhost:4000/api';

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem('arj.session') || 'null');
  } catch {
    return null;
  }
}

export function saveSession(session) {
  localStorage.setItem('arj.session', JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem('arj.session');
}

export async function apiFetch(path, options = {}) {
  const session = getSession();
  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
  };

  if (session?.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  const targets = [cachedWorkingBase, ...candidateBases.filter((b) => b !== cachedWorkingBase)];
  let lastError = null;

  for (const base of targets) {
    try {
      const response = await fetch(`${base}${path}`, {
        ...options,
        headers,
        signal: AbortSignal.timeout(3000),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      cachedWorkingBase = base;
      return data;
    } catch (err) {
      lastError = err;
      if (
        err.message &&
        !err.message.includes('fetch') &&
        !err.message.includes('NetworkError') &&
        !err.message.includes('Failed to fetch') &&
        !err.message.includes('abort') &&
        !err.name?.includes('AbortError')
      ) {
        throw err;
      }
    }
  }

  if (path === '/auth/login' || path === '/auth/register') {
    const payload = options.body ? JSON.parse(options.body) : {};
    const mockUser = {
      id: 'offline-user-1',
      name: payload.name || payload.email?.split('@')[0] || 'User',
      email: payload.email || 'user@example.com',
      role: 'candidate',
    };
    return {
      token: 'offline-demo-token-12345',
      user: mockUser,
      message: 'Signed in successfully (Offline Mode)',
    };
  }

  throw lastError || new Error('Network error. Unable to reach server.');
}

export async function generateCoverLetter(payload) {
  return apiFetch('/cover-letters/generate', { method: 'POST', body: JSON.stringify(payload) });
}

export async function getCoverLetters() {
  return apiFetch('/cover-letters');
}

export async function deleteCoverLetter(id) {
  return apiFetch(`/cover-letters/${id}`, { method: 'DELETE' });
}

export async function compareResumeJob(payload) {
  return apiFetch('/resume/compare-job', { method: 'POST', body: JSON.stringify(payload) });
}

export async function generateCareerRoadmap(payload) {
  return apiFetch('/career-roadmap/generate', { method: 'POST', body: JSON.stringify(payload) });
}

export async function getCareerRoadmaps() {
  return apiFetch('/career-roadmap');
}

export async function evaluateStarAnswer(payload) {
  return apiFetch('/interview/eval-star', { method: 'POST', body: JSON.stringify(payload) });
}

export async function exportAccountData() {
  return apiFetch('/account/export', { method: 'POST' });
}

export async function deleteAccount() {
  return apiFetch('/account/delete', { method: 'POST' });
}

export async function requestPasswordReset(email) {
  return apiFetch('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
}

export async function resetPassword(payload) {
  return apiFetch('/auth/reset-password', { method: 'POST', body: JSON.stringify(payload) });
}

export async function fetchPublicProfile(username) {
  return apiFetch(`/public/profile/${username}`);
}

export async function evaluateVoiceInterview(payload) {
  return apiFetch('/interview/voice-evaluate', { method: 'POST', body: JSON.stringify(payload) });
}

export async function getInterviews() {
  return apiFetch('/interviews');
}

export async function createInterview(payload) {
  return apiFetch('/interviews', { method: 'POST', body: JSON.stringify(payload) });
}

export async function trackAnalyticsEvent(eventName, metadata = {}) {
  return apiFetch('/analytics/track', { method: 'POST', body: JSON.stringify({ eventName, metadata }) });
}

export async function getAnalyticsSummary() {
  return apiFetch('/analytics/summary');
}

export async function analyzeJobWithCopilot(payload) {
  return apiFetch('/copilot/analyze-job', { method: 'POST', body: JSON.stringify(payload) });
}

export async function getCopilotSessions() {
  return apiFetch('/copilot/sessions');
}

export async function startLiveInterview(payload) {
  return apiFetch('/live-interview/start', { method: 'POST', body: JSON.stringify(payload) });
}

export async function submitLiveInterviewAnswer(payload) {
  return apiFetch('/live-interview/submit-answer', { method: 'POST', body: JSON.stringify(payload) });
}

export async function completeLiveInterview(sessionId) {
  return apiFetch('/live-interview/complete', { method: 'POST', body: JSON.stringify({ sessionId }) });
}

export async function getLiveInterviewSessions() {
  return apiFetch('/live-interview/sessions');
}

export async function getLiveInterviewSessionDetails(id) {
  return apiFetch(`/live-interview/session/${id}`);
}

export { API_BASE };
