/**
 * Category → Form mapping for the Faculty Activities Management System.
 * Each category groups related activity forms together.
 */
export const categories = [
  {
    id: 'external-recognition',
    title: 'External Recognition',
    accent: 0,
    description: 'Track faculty recognition from external bodies and institutions.',
    forms: [
      { label: 'External Recognition', slug: 'external-recognition' },
    ],
  },
  {
    id: 'research-activity',
    title: 'Research Activity',
    accent: 1,
    description: 'Manage journal publications, books, and book chapters.',
    forms: [
      { label: 'National Journal Paper', slug: 'national-journal-paper' },
      { label: 'International Journal Paper', slug: 'international-journal-paper' },
      { label: 'Book / Book Chapter', slug: 'book-chapter' },
    ],
  },
  {
    id: 'conference-activity',
    title: 'Conference Activity',
    accent: 2,
    description: 'Record national and international conference participation.',
    forms: [
      { label: 'National Conference Attended', slug: 'national-conference-attended' },
      { label: 'International Conference Attended', slug: 'international-conference-attended' },
    ],
  },
  {
    id: 'project-news',
    title: 'Project News',
    accent: 3,
    description: 'Track project applications, sanctions, and funded research.',
    forms: [
      { label: 'Projects Sanctioned', slug: 'projects-sanctioned' },
      { label: 'Projects Applied', slug: 'projects-applied' },
      { label: 'Internally Funded - Students', slug: 'internally-funded-students' },
      { label: 'Internally Funded - Faculty', slug: 'internally-funded-faculty' },
    ],
  },
  {
    id: 'patent-info',
    title: 'Patent Info',
    accent: 4,
    description: 'Log patent filings and intellectual property.',
    forms: [
      { label: 'Patents', slug: 'patents' },
    ],
  },
  {
    id: 'scholar-related',
    title: 'Scholar Related',
    accent: 5,
    description: 'Record Ph.D. scholar milestones and activities.',
    forms: [
      { label: 'Scholar Info', slug: 'scholar-info' },
    ],
  },
  {
    id: 'fdp-attended',
    title: 'FDP / WS / Webinar Attended',
    accent: 0,
    description: 'Track FDPs, workshops, and webinars attended by faculty.',
    forms: [
      { label: 'FDP & STTP Attended', slug: 'fdp-sttp-attended' },
      { label: 'Events Attended', slug: 'events-attended' },
    ],
  },
  {
    id: 'events-conducted',
    title: 'Events Conducted',
    accent: 1,
    description: 'Record events organized by the department.',
    forms: [
      { label: 'Webinar / Guest Lecture', slug: 'webinar-guest-lecture-conducted' },
      { label: 'FDP & STTP Conducted', slug: 'fdp-sttp-conducted' },
      { label: 'Seminar Conducted', slug: 'seminar-conducted' },
      { label: 'Workshop Conducted', slug: 'workshop-conducted' },
      { label: 'National Conference Conducted', slug: 'national-conference-conducted' },
      { label: 'International Conference Conducted', slug: 'international-conference-conducted' },
    ],
  },
  {
    id: 'industry-collaboration',
    title: 'Industry Collaboration',
    accent: 2,
    description: 'MoU and industry partnership activities.',
    forms: [
      { label: 'Industry Collaboration', slug: 'industry-collaboration' },
      { label: 'MoU Activities', slug: 'mou-activities' },
    ],
  },
  {
    id: 'alumni-interaction',
    title: 'Alumni Interaction',
    accent: 3,
    description: 'Alumni engagement and interaction events.',
    forms: [
      { label: 'Alumni Interaction', slug: 'alumni-interaction' },
    ],
  },
  {
    id: 'notable-visitors',
    title: 'Notable Visitors',
    accent: 4,
    description: 'Distinguished guests and celebrity visitors.',
    forms: [
      { label: 'Celebrity Visitor', slug: 'celebrity-visitor' },
    ],
  },
  {
    id: 'other-items',
    title: 'Other Items',
    accent: 5,
    description: 'Miscellaneous activities and student engagement.',
    forms: [
      { label: 'Other Activities', slug: 'other-activities' },
      { label: 'Student Co-curricular', slug: 'student-co-curricular' },
      { label: 'Student Extra Curricular', slug: 'student-extracurricular' },
      { label: 'Non Teaching Staff', slug: 'non-teaching-staff' },
    ],
  },
];

/**
 * Get all form slugs for static generation
 */
export function getAllFormSlugs() {
  return categories.flatMap(cat => cat.forms.map(f => f.slug));
}

/**
 * Find category by form slug
 */
export function getCategoryByFormSlug(slug) {
  return categories.find(cat => cat.forms.some(f => f.slug === slug));
}
