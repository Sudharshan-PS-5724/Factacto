'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { getAuthRoleFromDocument, getAuthUser, clearAuthSession } from '@/lib/auth-client';
import styles from './Navbar.module.css';

export default function Navbar({ variant = 'light' }) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setRole(getAuthRoleFromDocument());
    setUser(getAuthUser());
  }, [pathname]);

  const handleLogout = () => {
    clearAuthSession();
    setRole(null);
    setUser(null);
    setMenuOpen(false);
    router.refresh();
    router.push('/');
  };

  return (
    <nav className={`${styles.navbar} ${variant === 'dark' ? styles.dark : ''}`}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} prefetch={false}>
          <Image src="/images/ssn.jpeg" alt="SSN" width={40} height={40} className={styles.logo} />
          <span className={styles.brandBlock}>
            <span className={styles.brandFactacto}>FACTACTO</span>
            <span className={styles.brandSub}>SSN IT</span>
          </span>
        </Link>

        <button
          type="button"
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`${styles.line} ${menuOpen ? styles.open : ''}`} />
          <span className={`${styles.line} ${menuOpen ? styles.open : ''}`} />
          <span className={`${styles.line} ${menuOpen ? styles.open : ''}`} />
        </button>

        <div className={`${styles.links} ${menuOpen ? styles.active : ''}`}>
          <Link href="/" className={styles.link} prefetch={false} onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          {!role ? (
            <>
              <Link href="/login" className={styles.link} prefetch={false} onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link href="/login" className={styles.link} prefetch={false} onClick={() => setMenuOpen(false)}>
                Admin login
              </Link>
            </>
          ) : (
            <>
              <button type="button" className={styles.linkButton} onClick={() => { handleLogout(); }}>
                Log out
              </button>
              <Link href="/dashboard" className={styles.link} prefetch={false} onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              {role === 'admin' && (
                <Link href="/admin" className={styles.link} prefetch={false} onClick={() => setMenuOpen(false)}>
                  Admin
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}