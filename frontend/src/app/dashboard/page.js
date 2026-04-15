'use client';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { categories } from '@/lib/categories';
import { fetchCollections, apiHealth } from '@/lib/api';
import CategoryActivityCard from '@/components/CategoryActivityCard';
import styles from './page.module.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.34, 1.56, 0.64, 1] },
  },
};

export default function DashboardPage() {
  const [apiStatus, setApiStatus] = useState('checking');
  const [collections, setCollections] = useState(null);
  const [loadError, setLoadError] = useState(null);

  const totalForms = useMemo(
    () => categories.reduce((sum, c) => sum + c.forms.length, 0),
    []
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await apiHealth();
        if (!cancelled) setApiStatus('live');
        const list = await fetchCollections();
        if (!cancelled) {
          setCollections(list);
          setLoadError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setApiStatus('offline');
          setLoadError(e.message || 'Could not load dashboard data');
          setCollections(null);
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const totalDbDocs = collections?.reduce((s, c) => s + c.count, 0);
  const collectionCount = collections?.length;

  return (
    <div className={styles.dashboard}>
      <section className={styles.header}>
        <div className={styles.headerOrb} />
        <div className={styles.headerContent}>
          <p className={styles.kicker}>IT Department · Faculty workspace</p>
          <h1 className={styles.title}>
            <span className={styles.titleLine}>ACTIVITY FORMS</span>
            <span className={styles.titleAccent}>Submit and track your records</span>
          </h1>
          <p className={styles.subtitle}>
            Choose a category, open a form, and send your entry. Everything stays aligned with the
            department reporting workflow.
          </p>

          <div className={styles.metaRow}>
            <div className={styles.metaChip}>
              <span className={styles.metaLabel}>Categories</span>
              <span className={styles.metaValue}>{categories.length}</span>
            </div>
            <div className={styles.metaChip}>
              <span className={styles.metaLabel}>Forms</span>
              <span className={styles.metaValue}>{totalForms}</span>
            </div>
            {collectionCount != null && (
              <div className={styles.metaChip}>
                <span className={styles.metaLabel}>DB collections</span>
                <span className={styles.metaValue}>{collectionCount}</span>
              </div>
            )}
            <div className={`${styles.metaChip} ${styles[`api_${apiStatus}`]}`}>
              <span className={styles.metaLabel}>API</span>
              <span className={styles.metaValue}>
                {apiStatus === 'checking' && 'Checking…'}
                {apiStatus === 'live' && 'Connected'}
                {apiStatus === 'offline' && 'Unavailable'}
              </span>
            </div>
          </div>

          {loadError && (
            <p className={styles.apiError} role="status">
              {loadError} You can still open and submit forms.
            </p>
          )}
        </div>
      </section>

      <section className={styles.categoriesSection} aria-labelledby="categories-heading">
        <div className={styles.sectionIntro}>
          <h2 id="categories-heading" className={styles.sectionTitle}>
            Categories
          </h2>
          <p className={styles.sectionSub}>
            Each card groups related forms. Pick a row to go straight to submission.
          </p>
        </div>

        <motion.div
          className={styles.grid}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {categories.map((cat, i) => (
            <CategoryActivityCard
              key={cat.id}
              category={cat}
              index={i}
              variants={fadeInUp}
            />
          ))}
        </motion.div>
      </section>
    </div>
  );
}
