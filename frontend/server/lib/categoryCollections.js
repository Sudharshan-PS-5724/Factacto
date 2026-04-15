'use strict';

/**
 * Mirrors frontend/src/lib/categories.js  -  each form slug maps to one category.
 * MongoDB collection name: category id with hyphens → underscores (no prefix).
 * e.g. external-recognition → external_recognition
 */

const CATEGORIES = [
  {
    id: 'external-recognition',
    title: 'External Recognition',
    slugs: ['external-recognition'],
  },
  {
    id: 'research-activity',
    title: 'Research Activity',
    slugs: ['national-journal-paper', 'international-journal-paper', 'book-chapter'],
  },
  {
    id: 'conference-activity',
    title: 'Conference Activity',
    slugs: ['national-conference-attended', 'international-conference-attended'],
  },
  {
    id: 'project-news',
    title: 'Project News',
    slugs: [
      'projects-sanctioned',
      'projects-applied',
      'internally-funded-students',
      'internally-funded-faculty',
    ],
  },
  {
    id: 'patent-info',
    title: 'Patent Info',
    slugs: ['patents'],
  },
  {
    id: 'scholar-related',
    title: 'Scholar Related',
    slugs: ['scholar-info'],
  },
  {
    id: 'fdp-attended',
    title: 'FDP / WS / Webinar Attended',
    slugs: ['fdp-sttp-attended', 'events-attended'],
  },
  {
    id: 'events-conducted',
    title: 'Events Conducted',
    slugs: [
      'webinar-guest-lecture-conducted',
      'fdp-sttp-conducted',
      'seminar-conducted',
      'workshop-conducted',
      'national-conference-conducted',
      'international-conference-conducted',
    ],
  },
  {
    id: 'industry-collaboration',
    title: 'Industry Collaboration',
    slugs: ['industry-collaboration', 'mou-activities'],
  },
  {
    id: 'alumni-interaction',
    title: 'Alumni Interaction',
    slugs: ['alumni-interaction'],
  },
  {
    id: 'notable-visitors',
    title: 'Notable Visitors',
    slugs: ['celebrity-visitor'],
  },
  {
    id: 'other-items',
    title: 'Other Items',
    slugs: [
      'other-activities',
      'student-co-curricular',
      'student-extracurricular',
      'non-teaching-staff',
    ],
  },
];

const slugToCategory = new Map();
for (const c of CATEGORIES) {
  for (const s of c.slugs) {
    slugToCategory.set(s, c);
  }
}

/**
 * @param {string} slug  -  form slug from FACTACTO
 * @returns {{ id: string, title: string } | null}
 */
function resolveCategoryForSlug(slug) {
  return slugToCategory.get(slug) || null;
}

/**
 * Stable MongoDB collection name for this category (one collection per category).
 * @param {string} slug
 * @returns {string}
 */
function collectionNameForSlug(slug) {
  const cat = resolveCategoryForSlug(slug);
  if (!cat) return 'unknown_slug';
  return cat.id.replace(/-/g, '_');
}

/** One MongoDB collection name per category (sorted). */
function getCategoryCollectionNames() {
  return [...new Set(CATEGORIES.map((c) => c.id.replace(/-/g, '_')))].sort();
}

module.exports = {
  CATEGORIES,
  resolveCategoryForSlug,
  collectionNameForSlug,
  getCategoryCollectionNames,
};
