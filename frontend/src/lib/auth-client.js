/**
 * Lightweight client auth markers (cookie + sessionStorage for display name).
 * Dashboard and admin routes are enforced in `src/proxy.ts` + auth shells.
 * Replace with httpOnly session cookies from the API when hardening for production.
 */

const COOKIE = 'factacto_role';
const USER_KEY = 'factacto_user';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function setAuthCookie(role) {
  if (typeof document === 'undefined') return;
  if (role !== 'admin' && role !== 'faculty') return;
  const secure =
    typeof window !== 'undefined' && window.location?.protocol === 'https:'
      ? '; Secure'
      : '';
  document.cookie = `${COOKIE}=${encodeURIComponent(role)}; path=/; max-age=${MAX_AGE}; SameSite=Lax${secure}`;
}

/**
 * @param {{ role: 'admin' | 'faculty'; name?: string; email?: string }} session
 */
export function setAuthSession(session) {
  const { role, name, email } = session || {};
  if (role === 'admin' || role === 'faculty') {
    setAuthCookie(role);
  }
  if (typeof sessionStorage !== 'undefined') {
    try {
      sessionStorage.setItem(
        USER_KEY,
        JSON.stringify({
          name: name != null ? String(name) : '',
          email: email != null ? String(email) : '',
        }),
      );
    } catch {
      /* ignore quota / private mode */
    }
  }
}

/** @returns {{ name: string; email: string } | null} */
export function getAuthUser() {
  if (typeof sessionStorage === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(USER_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw);
    if (o && typeof o.email === 'string') {
      return { name: typeof o.name === 'string' ? o.name : '', email: o.email };
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function clearAuthCookie() {
  if (typeof document === 'undefined') return;
  document.cookie = `${COOKIE}=; path=/; max-age=0`;
}

export function clearAuthSession() {
  clearAuthCookie();
  try {
    sessionStorage.removeItem(USER_KEY);
  } catch {
    /* ignore */
  }
}

/** @returns {'admin' | 'faculty' | null} */
export function getAuthRoleFromDocument() {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${COOKIE}=([^;]*)`));
  if (!m) return null;
  const v = decodeURIComponent(m[1]);
  if (v === 'admin' || v === 'faculty') return v;
  return null;
}