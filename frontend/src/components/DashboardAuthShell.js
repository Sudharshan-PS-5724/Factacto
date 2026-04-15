'use client';

import { Suspense, useLayoutEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getAuthRoleFromDocument } from '@/lib/auth-client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './DashboardAuthShell.module.css';

/**
 * Client-side auth gate for /dashboard  -  redirects to /login when no factacto_role cookie.
 * Complements middleware for cases where cookies are not visible yet or dev quirks.
 */
function DashboardAuthInner({ children }) {
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
    setReady(true);
  }, [pathname, router, searchParams]);

  if (!ready) {
    return (
      <div className={styles.gate}>
        <div className={styles.spinner} aria-hidden />
        <p className={styles.gateText}>Checking your session…</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>{children}</main>
      <Footer />
    </>
  );
}

export default function DashboardAuthShell({ children }) {
  return (
    <Suspense fallback={
      <div className={styles.gate}>
        <div className={styles.spinner} aria-hidden />
        <p className={styles.gateText}>Loading…</p>
      </div>
    }>
      <DashboardAuthInner>{children}</DashboardAuthInner>
    </Suspense>
  );
}