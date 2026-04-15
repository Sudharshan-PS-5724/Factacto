import { NextResponse } from 'next/server';

function resolveExpressBase() {
  const raw = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || '';
  let u = String(raw).trim().replace(/\/$/, '');
  if (!u || /:(3000)(\b|\/)/.test(u)) {
    u = 'http://127.0.0.1:3001';
  }
  return u;
}

function adminRoleEmailFromEnv() {
  return String(process.env.ADMIN_ROLE_EMAIL || 'karthika@ssn.edu.in')
    .trim()
    .toLowerCase();
}

function roleForLoginEmail(email) {
  const e = String(email || '')
    .trim()
    .toLowerCase();
  return e === adminRoleEmailFromEnv() ? 'admin' : 'faculty';
}

export async function POST(request) {
  const bodyText = await request.text();
  const base = resolveExpressBase();
  const url = `${base}/login`;

  let r;
  try {
    r = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
      body: bodyText,
      cache: 'no-store',
    });
  } catch (e) {
    return NextResponse.json(
      {
        error: 'Sign-in service is unavailable. Try again in a moment.',
      },
      { status: 502 },
    );
  }

  const text = await r.text();
  if (r.status === 304) {
    return NextResponse.json(
      { error: 'Upstream returned 304 Not Modified (empty body). Retry login.' },
      { status: 502 },
    );
  }
  let out = {};
  try {
    out = text && text.trim() ? JSON.parse(text) : {};
  } catch {
    return NextResponse.json(
      {
        error: 'Sign-in did not complete. Try again or contact your administrator.',
      },
      { status: 502 },
    );
  }

  /** Ensure role when upstream omits it. */
  if (r.ok && out && typeof out === 'object' && out.ok === true && !out.error) {
    const r0 = String(out.role ?? '')
      .trim()
      .toLowerCase();
    if (r0 !== 'admin' && r0 !== 'faculty') {
      try {
        const body = JSON.parse(bodyText || '{}');
        const fixed = roleForLoginEmail(body.email);
        out = { ...out, role: fixed };
      } catch {
        out = { ...out, role: 'faculty' };
      }
    }
  }

  return NextResponse.json(out, {
    status: r.status,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      Pragma: 'no-cache',
    },
  });
}
