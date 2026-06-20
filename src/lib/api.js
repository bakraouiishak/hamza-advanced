/**
 * Thin fetch wrapper for the Hamza marketplace API.
 *
 *  • Reads the JWT from localStorage and attaches it as
 *    `Authorization: Bearer <token>` on every call.
 *  • Serialises JSON bodies, but lets the caller pass a FormData instance
 *    untouched (for multipart uploads — products + profile picture).
 *  • Normalises errors into a thrown `ApiError` with .status and .body so
 *    UI code can do `try { … } catch (e) { if (e.status === 409) … }`.
 *
 * No external deps — pure fetch.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'hamza:token';

export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

export function getToken() {
  try { return localStorage.getItem(TOKEN_KEY); }
  catch { return null; }
}
export function setToken(t) {
  try {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else   localStorage.removeItem(TOKEN_KEY);
  } catch {}
}

async function request(path, { method = 'GET', body, headers = {}, signal } = {}) {
  const isFormData = body instanceof FormData;
  const init = {
    method,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
    signal,
  };
  const token = getToken();
  if (token) init.headers.Authorization = `Bearer ${token}`;
  if (body != null) init.body = isFormData ? body : JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, init);

  // Try to parse JSON; tolerate empty 204 responses.
  let data = null;
  const text = await res.text();
  if (text) {
    try { data = JSON.parse(text); }
    catch { data = text; }
  }

  if (!res.ok) {
    const msg = (data && data.message) || `Request failed (${res.status})`;
    throw new ApiError(msg, res.status, data);
  }
  return data;
}

/* ── public helpers ─────────────────────────────────────────────────────── */
export const api = {
  get:    (path, opts)       => request(path, { ...opts, method: 'GET' }),
  post:   (path, body, opts) => request(path, { ...opts, method: 'POST',  body }),
  patch:  (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
  put:    (path, body, opts) => request(path, { ...opts, method: 'PUT',   body }),
  del:    (path, opts)       => request(path, { ...opts, method: 'DELETE' }),
};

export const API_BASE_URL = BASE_URL;
