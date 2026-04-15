/** Faculty activity form definitions. */
export const DEFAULT_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxXTTv-S-xyBlaaePZ3Nq29PxqExbtrVjuEX5lsqD1kd_ti4vzEo9Vsa5y3MN1h0mrP/exec';

const APPS_SCRIPT_URL =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_APPS_SCRIPT_URL) || DEFAULT_APPS_SCRIPT_URL;

const YES_NO_OPTIONS = [
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' },
];

export const formConfigs = {
  // ─── 1. External Recognition ────────────────────────────────
  'external-recognition': {
    title: 'External Recognition',
    description:
      'Use this form for rankings, awards, and recognition from agencies outside the college. Name the honour, the conferring body, and attach official proof (letters, certificates, or links).',
    htmlFileName: '1.html',
    actionUrl: APPS_SCRIPT_URL,
    fields: [
      { name: 'name', label: 'Name and Designation', type: 'text', placeholder: 'Ex. Dr. K.L Rahul, ASP/IT', required: true },
      { name: 'activity', label: 'Activity', type: 'textarea', placeholder: 'Describe the recognition activity...', required: true },
      { name: 'file', label: 'Proof', type: 'file', required: true },
    ],
  },

  // ─── 2. International Journal Paper ─────────────────────────
  'international-journal-paper': {
    title: 'International Journal Papers',
    description:
      'Record peer-reviewed papers in international journals. Capture all authors, journal metadata, indexing (Clarivate/Scopus), DOI, publication date, and upload the final proof or acceptance.',
    htmlFileName: '2.html',
    actionUrl: APPS_SCRIPT_URL,
    fields: [
      { name: 'firstauthor', label: 'First Author', type: 'text', placeholder: 'Ex. Dr. K.L Rahul, ASP/IT', required: true },
      { name: 'coauthorssn', label: 'Co-author (SSN Faculty)', type: 'text', placeholder: 'Ex. Dr. Name 1, AP/IT', required: true },
      { name: 'coauthorrs', label: 'Co-author (Research Scholar)', type: 'text', placeholder: 'Enter names' },
      { name: 'coauthorssnstud', label: 'Co-author (SSN Student UG/PG)', type: 'text', placeholder: 'Ex. Name 1, IT', required: true },
      { name: 'coauthoroutsider', label: 'Co-author (Outsider)', type: 'text', placeholder: 'Enter names', required: true },
      { name: 'title', label: 'Title of the Paper', type: 'text', required: true },
      { name: 'monthofpublication', label: 'Month of Publication', type: 'text', placeholder: 'Ex. February', required: true },
      { name: 'yearofpublication', label: 'Year of Publication', type: 'text', placeholder: 'Ex. 2024' },
      { name: 'volumenumber', label: 'Volume Number', type: 'text', required: true },
      { name: 'issuenumber', label: 'Issue Number', type: 'text', required: true },
      { name: 'pagefrom', label: 'Page No (From)', type: 'text', required: true },
      { name: 'pageto', label: 'Page No (To)', type: 'text', required: true },
      { name: 'clarivate', label: 'Indexed in Clarivate', type: 'select', options: YES_NO_OPTIONS },
      { name: 'scopus', label: 'Indexed in Scopus', type: 'select', options: YES_NO_OPTIONS },
      { name: 'nonindexed', label: 'Non-indexed', type: 'select', options: YES_NO_OPTIONS },
      { name: 'nationalpaper', label: 'National Paper', type: 'select', options: YES_NO_OPTIONS },
      { name: 'internationalpaper', label: 'International Paper', type: 'select', options: YES_NO_OPTIONS },
      { name: 'paidpublication', label: 'Paid Publication', type: 'select', options: YES_NO_OPTIONS },
      { name: 'doi', label: 'DOI (Numbers only)', type: 'text', required: true },
      { name: 'dateofpublication', label: 'Date of Publication', type: 'date', required: true },
      { name: 'proof', label: 'Proof', type: 'file', required: true },
    ],
  },

  // ─── 3. National Journal Paper ──────────────────────────────
  'national-journal-paper': {
    title: 'National Journal Papers',
    description:
      'Record publications in national journals. Include volume, issue, pages, indexing status, DOI, and date - plus proof for departmental and NAAC-style reporting.',
    htmlFileName: '3.html',
    actionUrl: APPS_SCRIPT_URL,
    fields: [
      { name: 'name', label: 'First Author', type: 'text', placeholder: 'Ex. Dr. K.L Rahul, ASP/IT', required: true },
      { name: 'authors', label: 'Authors', type: 'text', placeholder: 'Ex. Dr. Name 1, AP/IT' },
      { name: 'title', label: 'Title of the Paper', type: 'text', required: true },
      { name: 'volumenumber', label: 'Volume Number', type: 'text', required: true },
      { name: 'issuenumber', label: 'Issue Number', type: 'text', required: true },
      { name: 'pagefrom', label: 'Page No (From)', type: 'text', required: true },
      { name: 'pageto', label: 'Page No (To)', type: 'text', required: true },
      { name: 'year', label: 'Year', type: 'text', placeholder: 'Ex. 2024', required: true },
      { name: 'indexed', label: 'Indexed', type: 'select', options: [
        { value: 'YES', label: 'Yes' }, { value: 'clarivate', label: 'Clarivate' },
        { value: 'scopus', label: 'Scopus' }, { value: 'NO', label: 'No' },
      ]},
      { name: 'doi', label: 'DOI (Numbers only)', type: 'text', required: true },
      { name: 'dateofpublication', label: 'Date of Publication', type: 'date', required: true },
      { name: 'proof', label: 'Proof', type: 'file', required: true },
    ],
  },

  // ─── 4. Book / Book Chapter ─────────────────────────────────
  'book-chapter': {
    title: 'Book / Book Chapter',
    description:
      'Register full books or book chapters: title, authors, editor, publisher, volume, page range, DOI, and publication proof.',
    htmlFileName: '4.html',
    actionUrl: APPS_SCRIPT_URL,
    fields: [
      { name: 'name', label: 'Name and Designation', type: 'text', placeholder: 'Ex. Dr. K.L Rahul, ASP/IT', required: true },
      { name: 'title', label: 'Title of the Book/Chapter', type: 'text' },
      { name: 'authors', label: 'Authors', type: 'text', placeholder: 'Ex. Dr. Name 1, AP/IT', required: true },
      { name: 'editor', label: 'Editor', type: 'text' },
      { name: 'publishername', label: 'Publisher Name', type: 'text' },
      { name: 'volumenumber', label: 'Volume Number', type: 'text', required: true },
      { name: 'pages', label: 'Page Numbers', type: 'text', required: true },
      { name: 'doi', label: 'DOI (Numbers only)', type: 'text', required: true },
      { name: 'dateofpublication', label: 'Date of Publication', type: 'date', required: true },
      { name: 'proof', label: 'Proof', type: 'file', required: true },
    ],
  },

  // ─── 5. National Conference Attended ────────────────────────
  'national-conference-attended': {
    title: 'National Conference Attended',
    description:
      'Log participation in national conferences. Describe the event, venue, dates, and your role; attach registration, programme, or participation proof.',
    htmlFileName: '5.html',
    actionUrl: APPS_SCRIPT_URL,
    fields: [
      { name: 'name', label: 'Name and Designation', type: 'text', placeholder: 'Ex. Dr. K.L Rahul, ASP/IT', required: true },
      { name: 'details', label: 'Activity Details', type: 'textarea', placeholder: 'Describe conference attendance...', required: true },
      { name: 'file', label: 'Proof', type: 'file', required: true },
    ],
  },

  // ─── 6. International Conference Attended ───────────────────
  'international-conference-attended': {
    title: 'International Conference Attended',
    description:
      'Log participation in international conferences. Include scope, location, dates, and evidence such as programme or certificate.',
    htmlFileName: '6.html',
    actionUrl: APPS_SCRIPT_URL,
    fields: [
      { name: 'name', label: 'Name and Designation', type: 'text', placeholder: 'Ex. Dr. K.L Rahul, ASP/IT', required: true },
      { name: 'details', label: 'Activity Details', type: 'textarea', placeholder: 'Describe conference attendance...', required: true },
      { name: 'file', label: 'Proof', type: 'file', required: true },
    ],
  },

  // ─── 7. Projects Applied ────────────────────────────────────
  'projects-applied': {
    title: 'Projects Applied',
    description:
      'Record funding proposals you have submitted (not yet sanctioned): agency, objectives, duration, requested amount, and proof of submission.',
    htmlFileName: '7.html',
    actionUrl: APPS_SCRIPT_URL,
    fields: [
      { name: 'name', label: 'Name and Designation', type: 'text', required: true },
      { name: 'details', label: 'Project Details', type: 'textarea', required: true },
      { name: 'duration', label: 'Duration', type: 'text', placeholder: 'Ex. 2 years', required: true },
      { name: 'amount', label: 'Amount', type: 'text', placeholder: 'Ex. Rs. 5,00,000', required: true },
      { name: 'file', label: 'Proof', type: 'file', required: true },
    ],
  },

  // ─── 8. Projects Sanctioned ─────────────────────────────────
  'projects-sanctioned': {
    title: 'Projects Sanctioned',
    description:
      'Record sanctioned external projects: funding body, sanctioned amount, duration, milestones, and official sanction or award letters.',
    htmlFileName: '8.html',
    actionUrl: APPS_SCRIPT_URL,
    fields: [
      { name: 'name', label: 'Name and Designation', type: 'text', required: true },
      { name: 'details', label: 'Project Details', type: 'textarea', required: true },
      { name: 'duration', label: 'Duration', type: 'text', placeholder: 'Ex. 2 years', required: true },
      { name: 'amount', label: 'Amount', type: 'text', placeholder: 'Ex. Rs. 5,00,000', required: true },
      { name: 'file', label: 'Proof', type: 'file', required: true },
    ],
  },

  // ─── 9. Internally Funded Projects - Students ──────────────
  'internally-funded-students': {
    title: 'Internally Funded Projects - Students',
    description:
      'Internal seed or institute-funded projects led by or primarily involving students. Capture scope, duration, budget, outcomes, and proof.',
    htmlFileName: '9.html',
    actionUrl: APPS_SCRIPT_URL,
    fields: [
      { name: 'name', label: 'Name and Designation', type: 'text', required: true },
      { name: 'details', label: 'Project Details', type: 'textarea', required: true },
      { name: 'duration', label: 'Duration', type: 'text', required: true },
      { name: 'amount', label: 'Amount', type: 'text', required: true },
      { name: 'file', label: 'Proof', type: 'file', required: true },
    ],
  },

  // ─── 10. Internally Funded Projects - Faculty ──────────────
  'internally-funded-faculty': {
    title: 'Internally Funded Projects - Faculty',
    description:
      'Internal funding for faculty-led R&D or innovation. Document the problem, duration, sanctioned amount, and deliverables with supporting proof.',
    htmlFileName: '10.html',
    actionUrl: APPS_SCRIPT_URL,
    fields: [
      { name: 'name', label: 'Name and Designation', type: 'text', required: true },
      { name: 'details', label: 'Project Details', type: 'textarea', required: true },
      { name: 'duration', label: 'Duration', type: 'text', required: true },
      { name: 'amount', label: 'Amount', type: 'text', required: true },
      { name: 'file', label: 'Proof', type: 'file', required: true },
    ],
  },

  // ─── 11. Patents ────────────────────────────────────────────
  'patents': {
    title: 'Patents',
    description:
      'Patent applications, grants, or filings where you are an inventor. Include title, jurisdiction, status, and official patent office proof.',
    htmlFileName: '11.html',
    actionUrl: APPS_SCRIPT_URL,
    fields: [
      { name: 'name', label: 'Name and Designation', type: 'text', required: true },
      { name: 'details', label: 'Patent Details', type: 'textarea', required: true },
      { name: 'file', label: 'Proof', type: 'file', required: true },
    ],
  },

  // ─── 12. Scholar Info ───────────────────────────────────────
  'scholar-info': {
    title: 'Scholar Info',
    description:
      'Research scholars you supervise: enrolment, thesis topic, progress milestones, and documentation for graduate research reporting.',
    htmlFileName: '12.html',
    actionUrl: APPS_SCRIPT_URL,
    fields: [
      { name: 'name', label: 'Name and Designation', type: 'text', required: true },
      { name: 'details', label: 'Scholar Details', type: 'textarea', required: true },
      { name: 'file', label: 'Proof', type: 'file', required: true },
    ],
  },

  // ─── 13. FDP & STTP Attended ────────────────────────────────
  'fdp-sttp-attended': {
    title: 'FDP & STTP Attended',
    description:
      'Faculty development programmes or STTPs you attended as a participant. Add organizer, duration, mode, and certificate or completion proof.',
    htmlFileName: '13.html',
    actionUrl: APPS_SCRIPT_URL,
    fields: [
      { name: 'name', label: 'Name and Designation', type: 'text', required: true },
      { name: 'details', label: 'Activity Details', type: 'textarea', required: true },
      { name: 'file', label: 'Proof / Certificate', type: 'file', required: true },
    ],
  },

  // ─── 14. Events Attended ────────────────────────────────────
  'events-attended': {
    title: 'Events Attended',
    description:
      'Workshops, webinars, seminars, or similar events you attended (not as organizer). Pick the event type and attach attendance or participation proof.',
    htmlFileName: '14.html',
    actionUrl: APPS_SCRIPT_URL,
    fields: [
      { name: 'name', label: 'Name and Designation', type: 'text', required: true },
      { name: 'details', label: 'Event Details', type: 'textarea', required: true },
      { name: 'type_of_event', label: 'Type of Event', type: 'select', options: [
        { value: 'Workshop', label: 'Workshop' },
        { value: 'Webinar', label: 'Webinar' },
        { value: 'Seminar', label: 'Seminar' },
        { value: 'Other', label: 'Other' },
      ]},
      { name: 'file', label: 'Proof', type: 'file', required: true },
    ],
  },

  // ─── 15. Webinar / Guest Lecture Conducted ──────────────────
  'webinar-guest-lecture-conducted': {
    title: 'Webinar / Guest Lecture Conducted',
    description:
      'Webinars or guest lectures you delivered. Summarize topic, audience, host, and attach brochure, flyer, or schedule as proof.',
    htmlFileName: '15.html',
    actionUrl: APPS_SCRIPT_URL,
    fields: [
      { name: 'name', label: 'Name and Designation', type: 'text', required: true },
      { name: 'details', label: 'Activity Details', type: 'textarea', required: true },
      { name: 'file', label: 'Event Brochure', type: 'file', required: true },
    ],
  },

  // ─── 16. FDP & STTP Conducted ───────────────────────────────
  'fdp-sttp-conducted': {
    title: 'FDP & STTP Conducted',
    description:
      'FDP or STTP programmes you organized or coordinated. Include participant count, sponsors, budget, brochure, and detailed schedule uploads.',
    htmlFileName: '16.html',
    actionUrl: APPS_SCRIPT_URL,
    fields: [
      { name: 'name', label: 'Name and Designation', type: 'text', required: true },
      { name: 'details', label: 'Activity Details', type: 'textarea', required: true },
      { name: 'file', label: 'Event Brochure', type: 'file', required: true },
      { name: 'no_of_participants', label: 'Number of Participants', type: 'text', placeholder: 'Ex. 200', required: true },
      { name: 'eventsched', label: 'Event Schedule (Upload)', type: 'file', required: true },
      { name: 'name_of_sponsor', label: 'Name of Sponsors', type: 'text', required: true },
      { name: 'amnt', label: 'Amount', type: 'text', placeholder: 'Ex. Rs. 5,00,000', required: true },
    ],
  },

  // ─── 17. Seminar Conducted ──────────────────────────────────
  'seminar-conducted': {
    title: 'Seminar Conducted',
    description:
      'Seminars you organized at the department or institute. Describe scope, speakers, audience, and attach brochure or announcement proof.',
    htmlFileName: '17.html',
    actionUrl: APPS_SCRIPT_URL,
    fields: [
      { name: 'name', label: 'Name and Designation', type: 'text', required: true },
      { name: 'details', label: 'Activity Details', type: 'textarea', required: true },
      { name: 'file', label: 'Event Brochure', type: 'file', required: true },
    ],
  },

  // ─── 18. Workshop Conducted ─────────────────────────────────
  'workshop-conducted': {
    title: 'Workshop Conducted',
    description:
      'Hands-on workshops you conducted: theme, duration, target audience, and brochure or report as evidence.',
    htmlFileName: '18.html',
    actionUrl: APPS_SCRIPT_URL,
    fields: [
      { name: 'name', label: 'Name and Designation', type: 'text', required: true },
      { name: 'details', label: 'Activity Details', type: 'textarea', required: true },
      { name: 'file', label: 'Event Brochure', type: 'file', required: true },
    ],
  },

  // ─── 19. National Conference Conducted ──────────────────────
  'national-conference-conducted': {
    title: 'National Conference Conducted',
    description:
      'National conferences hosted or co-hosted by the department. Capture scale, sponsors, budget, participant numbers, brochure, and schedule uploads.',
    htmlFileName: '19.html',
    actionUrl: APPS_SCRIPT_URL,
    fields: [
      { name: 'name', label: 'Name and Designation', type: 'text', required: true },
      { name: 'details', label: 'Activity Details', type: 'textarea', required: true },
      { name: 'file', label: 'Event Brochure', type: 'file', required: true },
      { name: 'no_of_participants', label: 'Number of Participants', type: 'text', required: true },
      { name: 'eventsched', label: 'Event Schedule (Upload)', type: 'file', required: true },
      { name: 'name_of_sponsor', label: 'Name of Sponsors', type: 'text', required: true },
      { name: 'amnt', label: 'Amount', type: 'text', required: true },
    ],
  },

  // ─── 20. International Conference Conducted ─────────────────
  'international-conference-conducted': {
    title: 'International Conference Conducted',
    description:
      'International conferences organized with institute or department involvement. Same evidence as national: outreach, funding, brochure, and schedules.',
    htmlFileName: '20.html',
    actionUrl: APPS_SCRIPT_URL,
    fields: [
      { name: 'name', label: 'Name and Designation', type: 'text', required: true },
      { name: 'details', label: 'Activity Details', type: 'textarea', required: true },
      { name: 'file', label: 'Event Brochure', type: 'file', required: true },
      { name: 'no_of_participants', label: 'Number of Participants', type: 'text', required: true },
      { name: 'eventsched', label: 'Event Schedule (Upload)', type: 'file', required: true },
      { name: 'name_of_sponsor', label: 'Name of Sponsors', type: 'text', required: true },
      { name: 'amnt', label: 'Amount', type: 'text', required: true },
    ],
  },

  // ─── 21. Industry Collaboration ─────────────────────────────
  'industry-collaboration': {
    title: 'Industry Collaboration',
    description:
      'Consulting, sponsored labs, joint projects, or training with industry partners. Describe the partner, scope, outcomes, and MoU or work-order proof.',
    htmlFileName: '21.html',
    actionUrl: APPS_SCRIPT_URL,
    fields: [
      { name: 'name', label: 'Name and Designation', type: 'text', required: true },
      { name: 'details', label: 'Collaboration Details', type: 'textarea', required: true },
      { name: 'file', label: 'Proof', type: 'file', required: true },
    ],
  },

  // ─── 22. MoU Activities ─────────────────────────────────────
  'mou-activities': {
    title: 'MoU Activities',
    description:
      'Activities tied to signed MoUs: partner institution, purpose, visits, exchanges, or joint events - with MoU reference and proof.',
    htmlFileName: '22.html',
    actionUrl: APPS_SCRIPT_URL,
    fields: [
      { name: 'name', label: 'Name and Designation', type: 'text', required: true },
      { name: 'details', label: 'MoU Details', type: 'textarea', required: true },
      { name: 'file', label: 'Proof', type: 'file', required: true },
    ],
  },

  // ─── 23. Alumni Interaction ─────────────────────────────────
  'alumni-interaction': {
    title: 'Alumni Interaction',
    description:
      'Guest talks, mentoring, placements, or events involving alumni. Record the interaction type, alumni details, and photos or reports as proof.',
    htmlFileName: '23.html',
    actionUrl: APPS_SCRIPT_URL,
    fields: [
      { name: 'name', label: 'Name and Designation', type: 'text', required: true },
      { name: 'details', label: 'Interaction Details', type: 'textarea', required: true },
      { name: 'file', label: 'Proof', type: 'file', required: true },
    ],
  },

  // ─── 24. Celebrity Visitor ──────────────────────────────────
  'celebrity-visitor': {
    title: 'Celebrity Visitor',
    description:
      'Distinguished or celebrity visitors to the department. Note the visitor profile, purpose of visit, audience, and photographic or media proof.',
    htmlFileName: '24.html',
    actionUrl: APPS_SCRIPT_URL,
    fields: [
      { name: 'name', label: 'Name and Designation', type: 'text', required: true },
      { name: 'details', label: 'Visit Details', type: 'textarea', required: true },
      { name: 'file', label: 'Proof / Photo', type: 'file', required: true },
    ],
  },

  // ─── 25. Other Activities ───────────────────────────────────
  'other-activities': {
    title: 'Other Activities',
    description:
      'Activities that do not fit other categories but should appear in departmental records. Summarize clearly and attach any available proof.',
    htmlFileName: '25.html',
    actionUrl: APPS_SCRIPT_URL,
    fields: [
      { name: 'name', label: 'Name and Designation', type: 'text', required: true },
      { name: 'details', label: 'Activity Details', type: 'textarea', required: true },
      { name: 'file', label: 'Proof', type: 'file', required: true },
    ],
  },

  // ─── 26. Student Co-curricular ──────────────────────────────
  'student-co-curricular': {
    title: 'Student Co-curricular',
    description:
      'Co-curricular achievements you mentor or sponsor (competitions, clubs, technical events tied to curriculum). Include student names, event, and outcome proof.',
    htmlFileName: '26.html',
    actionUrl: APPS_SCRIPT_URL,
    fields: [
      { name: 'name', label: 'Name and Designation', type: 'text', required: true },
      { name: 'details', label: 'Activity Details', type: 'textarea', required: true },
      { name: 'file', label: 'Proof', type: 'file', required: true },
    ],
  },

  // ─── 27. Student Extra Curricular ───────────────────────────
  'student-extracurricular': {
    title: 'Student Extra Curricular',
    description:
      'Sports, arts, or institute-level extracurricular participation you oversee. Describe the activity, level, and results with certificates or photos.',
    htmlFileName: '27.html',
    actionUrl: APPS_SCRIPT_URL,
    fields: [
      { name: 'name', label: 'Name and Designation', type: 'text', required: true },
      { name: 'details', label: 'Activity Details', type: 'textarea', required: true },
      { name: 'file', label: 'Proof', type: 'file', required: true },
    ],
  },

  // ─── 28. Non Teaching Staff Activities ──────────────────────
  'non-teaching-staff': {
    title: 'Non Teaching Staff Activities',
    description:
      'Professional development, training, or contributions by non-teaching staff that should be credited to the department. Add clear details and proof.',
    htmlFileName: '28.html',
    actionUrl: APPS_SCRIPT_URL,
    fields: [
      { name: 'name', label: 'Name and Designation', type: 'text', required: true },
      { name: 'details', label: 'Activity Details', type: 'textarea', required: true },
      { name: 'file', label: 'Proof', type: 'file', required: true },
    ],
  },
};

export function getFormConfig(slug) {
  return formConfigs[slug] || null;
}

export function getAllFormSlugs() {
  return Object.keys(formConfigs);
}
