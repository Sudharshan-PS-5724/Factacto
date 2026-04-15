'use client';

import { useRouter } from 'next/navigation';
import { clearAuthSession } from '@/lib/auth-client';
import styles from './AdminLogoutButton.module.css';

export default function AdminLogoutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      className={styles.btn}
      onClick={() => {
        clearAuthSession();
        router.push('/');
      }}
    >
      Log out
    </button>
  );
}