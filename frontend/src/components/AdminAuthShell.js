'use client';

import { Suspense, useLayoutEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getAuthRoleFromDocument } from '@/lib/auth-client';
import Navbar from '@/components/Navbar';
import shellStyles from './DashboardAuthShell.module.css';
import styles from './AdminAuthShell.module.css';

/**
 * Client-side gate for /admin  -  only admin role. Faculty → /dashboard; anonymous → /login.
 */
function AdminAuthInner({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const role = getAuthRoleFromDocument();
    if (!role) {
      const qs = searchParams.toString();
      const full = qs ? `${pathname}?${qs}` : pathname;
      router.replace(`/login?redirect=${encodeURIComponent(full)}`);
      return;
    }
    if (role === 'faculty') {
      router.replace('/dashboard');
      return;
    }
    if (role !== 'admin') {
      router.replace('/login');
      return;
    }
    setReady(true);
  }, [pathname, router, searchParams]);

  if (!ready) {
    return (
      <div className={styles.gate}>
        <div className={styles.spinner} aria-hidden />
        <p className={styles.gateText}>Checking admin access…</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>{children}</main>
    </>
  );
}

export default function AdminAuthShell({ children }) {
  return (
    <Suspense
      fallback={
        <div className={shellStyles.gate}>
          <div className={shellStyles.spinner} aria-hidden />
          <p className={shellStyles.gateText}>Loading…</p>
        </div>
      }
    >
      <AdminAuthInner>{children}</AdminAuthInner>
    </Suspense>
  );
}
