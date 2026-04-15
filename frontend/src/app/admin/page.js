'use client';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { fetchCollections } from '@/lib/api';
import {
  IconDatabase,
  IconLayers,
  IconChartBar,
  IconTrend,
  IconNavDashboard,
  IconNavData,
  IconNavForms,
  IconNavReport,
  IconNavHome,
} from '@/components/icons/UiIcons';
import AdminLogoutButton from '@/components/AdminLogoutButton';
import styles from './page.module.css';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, ArcElement, Title, Tooltip, Legend, Filler
);

export default function AdminDashboard() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections()
      .then((list) => setCollections(list))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const widgets = useMemo(() => {
    const placeholder = (v) => (loading ? '…' : v);
    if (!collections.length) {
      return [
        { label: 'Data groups', value: placeholder('0'), Icon: IconLayers },
        { label: 'Total documents', value: placeholder('0'), Icon: IconDatabase },
        { label: 'Average per group', value: '-', Icon: IconChartBar },
        { label: 'Largest collection (count)', value: '-', Icon: IconTrend },
      ];
    }
    const total = collections.reduce((s, c) => s + c.count, 0);
    const top = collections.reduce((a, b) => (a.count >= b.count ? a : b));
    const mean = Math.round(total / collections.length);
    const shortName = top.name.length > 22 ? `${top.name.slice(0, 22)}…` : top.name;
    return [
      { label: 'Data groups', value: String(collections.length), Icon: IconLayers },
      { label: 'Total documents', value: String(total), Icon: IconDatabase },
      { label: 'Average per group', value: String(mean), Icon: IconChartBar },
      { label: `Top: ${shortName}`, value: String(top.count), Icon: IconTrend },
    ];
  }, [collections, loading]);

  const barData = {
    labels: collections.length > 0 ? collections.map(c => c.name) : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [{
      label: 'Count',
      data: collections.length > 0 ? collections.map(c => c.count) : [2, 5, 15, 20, 25, 23, 27],
      backgroundColor: 'rgba(59, 95, 212, 0.15)',
      borderColor: 'rgba(59, 95, 212, 1)',
      borderWidth: 1.5,
      borderRadius: 6,
    }],
  };

  const lineData = {
    labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025'],
    datasets: [
      {
        label: 'Past Years',
        data: [90, 120, 155, 125, 170, 165, 185],
        backgroundColor: 'rgba(59, 95, 212, 0.1)',
        borderColor: 'rgba(59, 95, 212, 0.8)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Current Year',
        data: [99, 135, 170, 130, 190, 180, 270],
        backgroundColor: 'rgba(232, 67, 147, 0.08)',
        borderColor: 'rgba(232, 67, 147, 0.8)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const pieData = {
    labels: collections.length > 0 ? collections.slice(0, 6).map(c => c.name) : ['Research', 'Events', 'Patents', 'FDP', 'Projects'],
    datasets: [{
      data: collections.length > 0 ? collections.slice(0, 6).map(c => c.count) : [55, 49, 44, 24, 15],
      backgroundColor: [
        'rgba(59, 95, 212, 0.7)', 'rgba(232, 67, 147, 0.6)',
        'rgba(107, 140, 229, 0.5)', 'rgba(253, 121, 168, 0.5)',
        'rgba(59, 95, 212, 0.3)', 'rgba(232, 67, 147, 0.3)',
      ],
      borderWidth: 0,
    }],
  };

  return (
    <div className={styles.admin}>
      {/* Sidebar */}
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
          <Link href="/admin" prefetch={false} className={`${styles.navLink} ${styles.active}`}>
            <IconNavDashboard className={styles.navGlyph} aria-hidden />
            Dashboard
          </Link>
          <Link href="/admin/data" prefetch={false} className={styles.navLink}>
            <IconNavData className={styles.navGlyph} aria-hidden />
            User data
          </Link>
          <Link href="/admin/reports" prefetch={false} className={styles.navLink}>
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

      {/* Main Content */}
      <div className={styles.content}>
        <header className={styles.topBar}>
          <h2>Admin Dashboard</h2>
        </header>

        {/* Widgets */}
        <div className={styles.widgetGrid}>
          {widgets.map(w => (
            <div key={w.label} className={styles.widget}>
              <w.Icon className={styles.widgetGlyph} aria-hidden />
              <div>
                <p className={styles.widgetValue}>{w.value}</p>
                <p className={styles.widgetLabel}>{w.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className={styles.chartGrid}>
          <div className={styles.chartCard}>
            <h4>Collection Counts</h4>
            <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
          <div className={styles.chartCard}>
            <h4>Year-over-Year Trends</h4>
            <Line data={lineData} options={{ responsive: true }} />
          </div>
        </div>

        <div className={styles.chartGrid}>
          <div className={styles.chartCard}>
            <h4>Activity Distribution</h4>
            <Pie data={pieData} options={{ responsive: true }} />
          </div>
          <div className={styles.chartCard}>
            <h4>Category Breakdown</h4>
            <Doughnut data={pieData} options={{ responsive: true }} />
          </div>
        </div>

        {/* Data table */}
        {collections.length > 0 && (
          <div className={styles.tableCard}>
            <h4>Collection Summary</h4>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Collection</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {collections.map(c => (
                    <tr key={c.name}>
                      <td>{c.name}</td>
                      <td>{c.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
