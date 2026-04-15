'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchAllData } from '@/lib/api';
import {
  IconNavDashboard,
  IconNavData,
  IconNavReport,
  IconNavForms,
  IconNavHome,
} from '@/components/icons/UiIcons';
import {
  generateMonthlyActivitiesDocx,
  fetchAllArrayToResult,
} from '@/lib/reportDocx/generateMonthlyActivitiesDocx';
import AdminLogoutButton from '@/components/AdminLogoutButton';
import styles from '../page.module.css';
import pageStyles from './page.module.css';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function AdminReportsPage() {
  const [reportMonth, setReportMonth] = useState(MONTHS[new Date().getMonth()]);
  const [reportYear, setReportYear] = useState(String(new Date().getFullYear()));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const data = await fetchAllData();
      const result = fetchAllArrayToResult(data);
      await generateMonthlyActivitiesDocx(result, { reportMonth, reportYear });
      setMessage(`Download started: monthly activities for ${reportMonth} ${reportYear}.`);
    } catch (e) {
      setError(e?.message || 'Could not create the report. Try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.admin}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h3 className={styles.sidebarBrand}>SSNCE</h3>
        </div>
        <div className={styles.profile}>
          <Image src="/images/admin.jpg" alt="Admin" width={40} height={40} className={styles.avatar} style={{ height: 'auto' }} />
          <div>
            <p className={styles.profileName}>Admin</p>
            <p className={styles.profileRole}>Administrator</p>
          </div>
        </div>
        <nav className={styles.sidebarNav}>
          <Link href="/admin" prefetch={false} className={styles.navLink}>
            <IconNavDashboard className={styles.navGlyph} aria-hidden />
            Dashboard
          </Link>
          <Link href="/admin/data" prefetch={false} className={styles.navLink}>
            <IconNavData className={styles.navGlyph} aria-hidden />
            User data
          </Link>
          <Link href="/admin/reports" prefetch={false} className={`${styles.navLink} ${styles.active}`}>
            <IconNavReport className={styles.navGlyph} aria-hidden />
            Monthly report
          </Link>
          <Link href="/dashboard" prefetch={false} className={styles.navLink}>
            <IconNavForms className={styles.navGlyph} aria-hidden />
            Forms
          </Link>
          <Link href="/" prefetch={false} className={styles.navLink}>
            <IconNavHome className={styles.navGlyph} aria-hidden />
            Home
          </Link>
        </nav>
        <AdminLogoutButton />
      </aside>

      <div className={styles.content}>
        <header className={styles.topBar}>
          <h2>Monthly DOCX report</h2>
        </header>

        <div className={pageStyles.panel}>
          <p className={pageStyles.lead}>
            Builds a Word document from your saved faculty activities. Pick the month and year for the cover page, then
            generate and download.
          </p>

          <div className={pageStyles.row}>
            <label className={pageStyles.field}>
              <span>Report month</span>
              <select
                className={pageStyles.select}
                value={reportMonth}
                onChange={(e) => setReportMonth(e.target.value)}
              >
                {MONTHS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </label>
            <label className={pageStyles.field}>
              <span>Year</span>
              <input
                className={pageStyles.input}
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={reportYear}
                onChange={(e) => setReportYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
              />
            </label>
          </div>

          <button
            type="button"
            className={pageStyles.generateBtn}
            onClick={handleGenerate}
            disabled={loading || reportYear.length !== 4}
          >
            {loading ? 'Fetching data & building…' : 'Generate & download DOCX'}
          </button>

          {message && <p className={pageStyles.ok}>{message}</p>}
          {error && <p className={pageStyles.err} role="alert">{error}</p>}

          <div className={pageStyles.note}>
            <p>
              Empty sections still appear in the file with a count of zero. If a section is always empty, activity data may use
              different names than this report expects - ask your IT contact to align form categories.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
