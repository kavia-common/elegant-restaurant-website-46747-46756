import { getApiBase } from './env';

/**
 * Normalize errors into a consistent shape.
 */
function normalizeError(err) {
  if (!err) return { message: 'Unknown error', status: 0 };
  if (typeof err === 'string') return { message: err, status: 0 };
  if (err instanceof Error) return { message: err.message, status: err.status || 0 };
  if (typeof err === 'object') {
    return {
      message: err.message || 'Request failed',
      status: err.status || 0,
      ...err,
    };
  }
  return { message: 'Unexpected error', status: 0 };
}

/**
 * Build final URL using base + path, ensuring single slash.
 */
function buildUrl(path) {
  const base = getApiBase();
  const cleanPath = String(path || '').replace(/^\/+/, '');
  if (!base) return ''; // indicates mock usage
  return `${base}/${cleanPath}`;
}

/**
 * Process fetch response: attempt JSON parse; if fails, return text; throw on !ok
 */
async function processResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const body = isJson ? await res.json().catch(() => ({})) : await res.text().catch(() => '');
  if (!res.ok) {
    const message =
      (body && typeof body === 'object' && (body.error || body.message)) ||
      (typeof body === 'string' && body) ||
      `Request failed with status ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    error.data = body;
    throw error;
  }
  return body;
}

/**
 * PUBLIC_INTERFACE
 * get
 * JSON GET request helper. When API base URL is not set, falls back to a mocked response.
 */
export async function get(path, { headers = {}, mockData = {}, signal } = {}) {
  const url = buildUrl(path);
  if (!url) {
    // Mock behavior when base URL is empty
    await new Promise((r) => setTimeout(r, 300));
    return mockData;
  }
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...headers,
    },
    signal,
  });
  return processResponse(res);
}

/**
 * PUBLIC_INTERFACE
 * post
 * JSON POST request helper. When API base URL is not set, falls back to a mocked success.
 */
export async function post(path, data, { headers = {}, signal, mockData = { ok: true } } = {}) {
  const url = buildUrl(path);
  if (!url) {
    await new Promise((r) => setTimeout(r, 400));
    return mockData;
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    },
    body: data != null ? JSON.stringify(data) : undefined,
    signal,
  });
  return processResponse(res);
}

/**
 * PUBLIC_INTERFACE
 * request
 * Low-level generic request helper. Consumers should prefer get/post.
 */
export async function request(path, { method = 'GET', headers = {}, body, signal } = {}) {
  const url = buildUrl(path);
  if (!url) {
    await new Promise((r) => setTimeout(r, 300));
    return { ok: true };
  }
  const res = await fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body != null && typeof body === 'object' && !(body instanceof FormData)
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...headers,
    },
    body:
      body != null && typeof body === 'object' && !(body instanceof FormData)
        ? JSON.stringify(body)
        : body,
    signal,
  });
  return processResponse(res);
}

// PUBLIC_INTERFACE
// Default export convenience
const api = { get, post, request };
export default api;
