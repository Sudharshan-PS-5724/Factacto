const DEFAULT_API = 'http://localhost:3001';

/** Backend base URL (faculty forms post here; login uses the app’s own route). */
function resolveExpressApiBase() {
  const raw = process.env.NEXT_PUBLIC_API_URL || '';
  let u = String(raw).trim().replace(/\/$/, '');
  if (!u || /:(3000)(\b|\/)/.test(u)) {
    return DEFAULT_API;
  }
  return u;
}

export function getApiBase() {
  return resolveExpressApiBase();
}

function apiUrl(path) {
  const base = getApiBase().replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

export async function apiHealth() {
  const res = await fetch(apiUrl('/health'), { cache: 'no-store' });
  if (!res.ok) throw new Error('Could not reach the server');
  return res.json();
}

export async function apiLogin(email, password) {
  const loginUrl =
    typeof window !== 'undefined' ? '/api/auth/login' : apiUrl('/login');
  const res = await fetch(loginUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
    body: JSON.stringify({ email, password }),
    cache: 'no-store',
  });
  const text = await res.text();
  if (res.status === 304 || (res.ok && !String(text || '').trim())) {
    throw new Error('No response from login. Refresh the page and try again.');
  }
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error('Sign-in did not complete. Try again, or contact your administrator.');
  }
  if (!res.ok) {
    throw new Error(data.error || data.message || 'Login failed');
  }
  const role = String(data.role ?? '')
    .trim()
    .toLowerCase();
  if (role !== 'admin' && role !== 'faculty') {
    throw new Error('Sign-in did not complete. Try again, or contact your administrator.');
  }
  return { ...data, role };
}

export async function apiSignUp(name, email, password) {
  const res = await fetch(apiUrl('/sign_up'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || 'Sign up failed');
  }
  return data;
}

/** @returns {Promise<Array<{ name: string, count: number }>>} */
export async function fetchCollections() {
  const res = await fetch(apiUrl('/collections'), { cache: 'no-store' });
  if (!res.ok) throw new Error('Could not load summary data');
  const data = await res.json();
  const list = data.collections;
  if (!Array.isArray(list)) return [];
  return list.map((item) =>
    typeof item === 'string'
      ? { name: item, count: 0 }
      : { name: item.name, count: Number(item.count) || 0 }
  );
}

/**
 * @returns {Promise<Array<{ collection: string, records: unknown[] }>>}
 */
export async function fetchAllData() {
  const res = await fetch(apiUrl('/fetchall'), { cache: 'no-store' });
  if (!res.ok) throw new Error('Could not load records');
  const raw = await res.json();
  if (Array.isArray(raw)) {
    return raw.map((item) => ({
      collection: item.collection,
      records: Array.isArray(item.records) ? item.records : [],
    }));
  }
  if (raw && typeof raw === 'object') {
    return Object.entries(raw)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([collection, records]) => ({
        collection,
        records: Array.isArray(records) ? records : [],
      }));
  }
  return [];
}

export async function submitActivity(payload) {
  const url = apiUrl('/api/activities');
  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`Could not reach the server (${msg}). Check your connection and try again.`);
  }
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    if (!res.ok) {
      const t = text || '';
      if (/PayloadTooLarge|entity too large|PayloadTooLargeError/i.test(t)) {
        throw new Error(
          'This submission is too large. Use smaller files or fewer attachments.'
        );
      }
      const snippet = t.replace(/\s+/g, ' ').slice(0, 180);
      throw new Error(
        snippet || `Save failed (${res.status} ${res.statusText || ''})`.trim()
      );
    }
    throw new Error('The server response was not recognized. Try again.');
  }
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(
        'Saving is not available. Ask your administrator to check the app configuration.'
      );
    }
    throw new Error(
      data.error ||
        data.message ||
        `Save failed (${res.status} ${res.statusText || ''})`.trim()
    );
  }
  return data;
}
