'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './CategoryActivityCard.module.css';

const ACCENTS = ['a0', 'a1', 'a2', 'a3', 'a4', 'a5'];

function initials(title) {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return title.slice(0, 2).toUpperCase();
}

export default function CategoryActivityCard({ category, index, variants }) {
  const accent = ACCENTS[(category.accent ?? index) % ACCENTS.length];
  const formCount = category.forms?.length ?? 0;

  return (
    <motion.article
      className={`${styles.card} ${styles[accent]}`}
      variants={variants}
    >
      <div className={styles.cardTop}>
        <span className={styles.badge} aria-hidden>
          {initials(category.title)}
        </span>
        <span className={styles.formCount}>{formCount} form{formCount !== 1 ? 's' : ''}</span>
      </div>
      <h3 className={styles.title}>{category.title}</h3>
      <p className={styles.desc}>{category.description}</p>
      <ul className={styles.linkList}>
        {category.forms.map((form) => (
          <li key={form.slug}>
            <Link href={`/dashboard/forms/${form.slug}`} prefetch={false} className={styles.formLink}>
              <span className={styles.formLabel}>{form.label}</span>
              <span className={styles.arrow} aria-hidden>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}
