/** Shared core: request(), mock latency and the small in-memory db. (Split from services/api.js — import from '@/services/api', which re-exports everything.) */
import { sleep } from '@/utils/helpers';
import * as demo from '@/data/demoData';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const MOCK_LATENCY = 450;

/** Thin fetch wrapper ready for a real backend. */
export async function request(path, { method = 'GET', body, params, headers } = {}) {
  const url = new URL(API_BASE_URL + path, window.location.origin);
  if (params) Object.entries(params).forEach(([k, v]) => v != null && url.searchParams.set(k, v));
  const token = getStoredToken();
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body && method !== 'GET' ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = new Error(`Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return res.status === 204 ? null : res.json();
}

function getStoredToken() {
  try {
    return JSON.parse(localStorage.getItem('ln.auth') || 'null')?.token;
  } catch {
    return null;
  }
}

/** Simulates network latency and returns a deep copy so callers can't mutate the store. */
export const mock = async (data, ms = MOCK_LATENCY) => {
  await sleep(ms);
  return structuredClone(data);
};

export const instructorName = (id) => demo.instructors.find((i) => i.id === id)?.name ?? 'Unassigned';

// In-memory mutable copies so create/update/delete persist for the session
export const db = {
  courses: demo.courses.map((c) => ({ ...c, instructor: instructorName(c.instructorId) })),
  students: [...demo.students],
  instructors: [...demo.instructors],
  notifications: [...demo.notifications],
};
