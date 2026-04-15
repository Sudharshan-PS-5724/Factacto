'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import LandingCarousel from '@/components/LandingCarousel';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import { motion } from 'framer-motion';
import {
  IconUsers,
  IconClipboard,
  IconChartBar,
  IconLayers,
  IconForm,
  IconAnalytics,
  IconDocument,
  IconShield,
} from '@/components/icons/UiIcons';
import styles from './page.module.css';
import { getAuthUser, getAuthRoleFromDocument } from '@/lib/auth-client';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const stats = [
  { number: '24+', label: 'Faculty Members', Icon: IconUsers },
  { number: '28', label: 'Activity Forms', Icon: IconClipboard },
  { number: '50+', label: 'Records Managed', Icon: IconChartBar },
  { number: '12', label: 'Categories', Icon: IconLayers },
];

const features = [
  {
    Icon: IconForm,
    title: 'Smart Form Submission',
    desc: 'Submit and track 28 different types of faculty activities with intelligent validation and real-time feedback.',
    gradient: 'linear-gradient(135deg, #3B5FD4, #6B8CE5)',
  },
  {
    Icon: IconAnalytics,
    title: 'Analytics Dashboard',
    desc: 'Real-time charts and statistics to visualize department performance and activity trends at a glance.',
    gradient: 'linear-gradient(135deg, #E84393, #FD79A8)',
  },
  {
    Icon: IconDocument,
    title: 'Report Generation',
    desc: 'Automated monthly DOCX reports consolidating all department activities into formatted documents.',
    gradient: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
  },
  {
    Icon: IconShield,
    title: 'Secure & Reliable',
    desc: 'Cloud-hosted MongoDB with encrypted credentials, bcrypt hashing, and role-based access control.',
    gradient: 'linear-gradient(135deg, #06B6D4, #3B5FD4)',
  },
];

const marqueeItems = [
  'Research Publications', '•', 'Conference Activity', '•', 'Patent Filing', '•',
  'Industry Collaboration', '•', 'FDP & STTP', '•', 'Alumni Interaction', '•',
  'Event Management', '•', 'Scholar Info', '•', 'MoU Activities', '•',
  'Guest Lectures', '•', 'Workshops', '•', 'Student Activities', '•',
];

const quotes = [
  { text: "Research is formalized curiosity. It is poking and prying with a purpose.", author: "Zora Neale Hurston" },
  { text: "The function of education is to teach one to think intensively and critically.", author: "Martin Luther King Jr." },
];

const whyBlocks = [
  {
    title: 'One pipeline for every activity',
    text: 'From external recognition and journal papers to conferences, projects, patents, and student events - FACTACTO keeps every submission in a single, traceable pipeline.',
  },
  {
    title: 'Built for reporting cycles',
    text: 'Structured fields and monthly DOCX exports align with departmental reporting. Less time formatting, more time on teaching and research.',
  },
  {
    title: 'Role-aware access',
    text: 'Faculty use dashboards and forms; administrators access analytics and Mongo-backed data. Sign in controls who sees what.',
  },
];

const workflowSteps = [
  { step: '01', label: 'Sign in', detail: 'Faculty or admin credentials' },
  { step: '02', label: 'Choose a form', detail: 'Pick the category that matches your activity' },
  { step: '03', label: 'Submit & attach proof', detail: 'Files go with your record' },
  { step: '04', label: 'Reports & analytics', detail: 'Monthly DOCX and charts for leadership' },
];

const HEADLINE_WORDS = ['Your', 'one', 'platform', 'for'];

const LANDING_CHAPTERS = [
  { refKey: 'heroRef', label: 'Overview' },
  { refKey: 'marqueeRef', label: 'Activity pulse' },
  { refKey: 'carouselRef', label: 'Gallery' },
  { refKey: 'whyRef', label: 'Why FACTACTO' },
  { refKey: 'flowRef', label: 'Workflow' },
  { refKey: 'statsRef', label: 'By the numbers' },
  { refKey: 'aboutRef', label: 'The story' },
  { refKey: 'quote1Ref', label: 'Inspiration' },
  { refKey: 'featuresRef', label: 'Capabilities' },
  { refKey: 'quote2Ref', label: 'Reflection' },
  { refKey: 'ctaSectionRef', label: 'Get started' },
];

export default function LandingPageClient({ carouselSlides }) {
  const [welcomeUser, setWelcomeUser] = useState(null);
  const [authRole, setAuthRole] = useState(null);

  useEffect(() => {
    setWelcomeUser(getAuthUser());
    setAuthRole(getAuthRoleFromDocument());
  }, []);

  const pageShellRef = useRef(null);
  const scrollAmbientRef = useRef(null);
  const scrollSubjectLabelRef = useRef(null);
  const heroRef = useRef(null);
  const marqueeRef = useRef(null);
  const carouselRef = useRef(null);
  const whyRef = useRef(null);
  const flowRef = useRef(null);
  const statsRef = useRef(null);
  const aboutRef = useRef(null);
  const quote1Ref = useRef(null);
  const featuresRef = useRef(null);
  const quote2Ref = useRef(null);
  const ctaSectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const heroCtaRef = useRef(null);
  const badgeRef = useRef(null);
  const appNameRef = useRef(null);

  const chapterRefs = {
    heroRef,
    marqueeRef,
    carouselRef,
    whyRef,
    flowRef,
    statsRef,
    aboutRef,
    quote1Ref,
    featuresRef,
    quote2Ref,
    ctaSectionRef,
  };

  useEffect(() => {
    const root = heroRef.current;
    if (!root) return undefined;

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(badgeRef.current,
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6 }
      )
      .fromTo(appNameRef.current,
        { opacity: 0, y: 24, letterSpacing: '0.5em' },
        { opacity: 1, y: 0, letterSpacing: '0.22em', duration: 1, ease: 'power3.out' },
        '-=0.35'
      );

      if (!reduceMotion && titleRef.current) {
        const words = titleRef.current.querySelectorAll(`.${styles.word}`);
        const highlight = titleRef.current.querySelector(`.${styles.highlight}`);
        tl.from(words, {
          opacity: 0,
          y: 20,
          stagger: 0.05,
          duration: 0.5,
          ease: 'power2.out',
        }, '-=0.3');
        if (highlight) {
          tl.from(highlight, {
            opacity: 0,
            y: 20,
            duration: 0.55,
            ease: 'power2.out',
          }, '-=0.25');
        }
      }

      tl.fromTo(subtitleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8 },
        reduceMotion ? '-=0.35' : '-=0.6'
      )
      .fromTo(heroCtaRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.4'
      );

      // Parallax dots
      gsap.utils.toArray(`.${styles.floatingDot}`).forEach((dot, i) => {
        gsap.to(dot, {
          y: -80 * (i + 1) * 0.4,
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      });

      // Number counters
      gsap.utils.toArray(`.${styles.statNumber}`).forEach(el => {
        const target = el.getAttribute('data-target');
        if (!target) return;
        const num = parseInt(target);
        if (isNaN(num)) return;
        
        gsap.fromTo(el, { innerText: 0 }, {
          innerText: num,
          duration: 2,
          ease: 'power2.out',
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          onUpdate: function() {
            el.innerText = Math.floor(el.innerText) + (target.includes('+') ? '+' : '');
          }
        });
      });

      gsap.to(`.${styles.heroMesh}`, {
        backgroundPosition: '100% 50%',
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      });

    }, root);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return undefined;

    const whyRoot = whyRef.current;
    if (!whyRoot) return undefined;

    const ctx = gsap.context(() => {
      gsap.utils.toArray(`.${styles.revealCard}`).forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            delay: i * 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          },
        );
      });
    }, whyRoot);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const shell = pageShellRef.current;
    const ambient = scrollAmbientRef.current;
    const labelEl = scrollSubjectLabelRef.current;
    if (!shell || !ambient || !labelEl) return undefined;

    const ctx = gsap.context(() => {
      const setLabel = (text) => {
        if (!labelEl || labelEl.textContent === text) return;
        if (mq.matches) {
          labelEl.textContent = text;
          return;
        }
        gsap.killTweensOf(labelEl);
        gsap.to(labelEl, {
          opacity: 0,
          y: 6,
          duration: 0.14,
          ease: 'power2.in',
          onComplete: () => {
            labelEl.textContent = text;
            gsap.fromTo(
              labelEl,
              { opacity: 0, y: -6 },
              { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out' },
            );
          },
        });
      };

      LANDING_CHAPTERS.forEach(({ refKey, label }) => {
        const ref = chapterRefs[refKey];
        const triggerEl = ref?.current;
        if (!triggerEl) return;
        ScrollTrigger.create({
          trigger: triggerEl,
          start: 'top 56%',
          end: 'bottom 44%',
          onEnter: () => setLabel(label),
          onEnterBack: () => setLabel(label),
        });
      });

      if (mq.matches) {
        ambient.style.setProperty('--ambient-hue', '258');
        return;
      }

      ScrollTrigger.create({
        trigger: shell,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.65,
        onUpdate: (self) => {
          const h = gsap.utils.interpolate(218, 328, self.progress);
          ambient.style.setProperty('--ambient-hue', String(h));
        },
      });
    }, shell);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Navbar variant="dark" />
      <div className={styles.noiseOverlay} />

      <div ref={pageShellRef} className={styles.pageShell}>
        <div ref={scrollAmbientRef} className={styles.scrollAmbient} aria-hidden />
        <div className={styles.scrollSubject} role="status" aria-live="polite">
          <span className={styles.scrollSubjectKicker}>Now showing</span>
          <span ref={scrollSubjectLabelRef} className={styles.scrollSubjectLabel}>
            Overview
          </span>
        </div>

      {/* ─── Hero Section ───────────────────────────────────────── */}
      <section ref={heroRef} className={styles.hero}>
        <div className={styles.heroPhotoBg} aria-hidden />
        <div className={styles.heroPhotoScrim} aria-hidden />
        <div className={styles.heroMesh} aria-hidden />
        {/* Animated gradient orbs */}
        <div className={styles.orbContainer}>
          <div className={`${styles.orb} ${styles.orb1}`} />
          <div className={`${styles.orb} ${styles.orb2}`} />
          <div className={`${styles.orb} ${styles.orb3}`} />
        </div>

        {/* Floating dots */}
        <div className={`${styles.floatingDot} ${styles.dot1}`} />
        <div className={`${styles.floatingDot} ${styles.dot2}`} />
        <div className={`${styles.floatingDot} ${styles.dot3}`} />
        <div className={`${styles.floatingDot} ${styles.dot4}`} />
        <div className={`${styles.floatingDot} ${styles.dot5}`} />

        {/* Grid lines */}
        <div className={styles.gridLines} />

        <div className={styles.heroContent}>
          <div ref={badgeRef} className={styles.heroBadge}>
            <span className={styles.badgeDot} />
            SSN College of Engineering · IT Department
          </div>

          {welcomeUser?.email ? (
            <p className={styles.heroWelcome}>
              Welcome, <strong>{welcomeUser.name?.trim() || 'there'}</strong>
              <span className={styles.heroWelcomeEmail}> · {welcomeUser.email}</span>
            </p>
          ) : null}

          <p ref={appNameRef} className={styles.appName}>
            FACTACTO
          </p>
          <p className={styles.appTagline}>Faculty Activity Tracking & Collaboration</p>

          <h1 ref={titleRef} className={styles.heroTitle}>
            <span className={styles.heroHeadRow}>
              {HEADLINE_WORDS.map((word, i) => (
                <span key={`${word}-${i}`} className={styles.word}>
                  {word}
                </span>
              ))}
            </span>
            <span className={styles.highlightWrap}>
              <span className={styles.highlight}>FACULTY ACTIVITIES</span>
            </span>
          </h1>

          <p ref={subtitleRef} className={styles.heroSubtitle}>
            The official workspace for the IT Department: capture every publication, event, project, and
            student-facing activity in one place. FACTACTO connects structured forms to MongoDB-backed
            analytics and monthly DOCX reports - so leadership can review outcomes without chasing spreadsheets.
          </p>

          <div ref={heroCtaRef} className={styles.heroCta}>
            {authRole ? (
              <>
                <Link href="/dashboard" prefetch={false} className="btn btn-primary btn-lg">
                  Faculty dashboard
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
                {authRole === 'admin' ? (
                  <Link href="/admin" prefetch={false} className="btn btn-ghost btn-lg">
                    Admin dashboard
                  </Link>
                ) : null}
              </>
            ) : (
              <>
                <Link href="/login" prefetch={false} className="btn btn-primary btn-lg">
                  Get Started
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
                <Link href="/login?redirect=/dashboard" prefetch={false} className="btn btn-ghost btn-lg">
                  Open dashboard
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ─── Marquee ────────────────────────────────────────────── */}
      <section ref={marqueeRef} className={styles.marqueeSection}>
        <div className={styles.marqueeTrack}>
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className={item === '•' ? styles.marqueeDot : styles.marqueeItem}>
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* ─── Image carousel ─────────────────────────────────────── */}
      <section ref={carouselRef} className={styles.carouselSection}>
        <LandingCarousel slides={carouselSlides} />
      </section>

      {/* ─── Why FACTACTO ───────────────────────────────────────── */}
      <section ref={whyRef} className={styles.whySection}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionKicker}>Why FACTACTO</span>
          <h2 className={styles.sectionHeading}>
            Purpose-built for <span className={styles.gradText}>departmental rhythm</span>
          </h2>
          <p className={styles.sectionLead}>
            Departments juggle accreditation, annual reports, and day-to-day coordination. FACTACTO turns
            scattered emails and attachments into consistent records - so HoD reviews and institute-level
            summaries rest on the same underlying data faculty already submit.
          </p>
        </div>
        <div className={styles.whyGrid}>
          {whyBlocks.map((b) => (
            <motion.div
              key={b.title}
              className={`${styles.revealCard} ${styles.whyCard}`}
              initial={{ opacity: 0.85, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            >
              <div className={styles.whyCardBar} />
              <h3>{b.title}</h3>
              <p>{b.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Workflow ───────────────────────────────────────────── */}
      <section ref={flowRef} className={styles.flowSection}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionKicker}>Flow</span>
          <h2 className={styles.sectionHeading}>From login to leadership-ready output</h2>
        </div>
        <div className={styles.flowTrack}>
          {workflowSteps.map((s, i) => (
            <motion.div
              key={s.step}
              className={styles.flowStep}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <span className={styles.flowNum}>{s.step}</span>
              <div>
                <strong>{s.label}</strong>
                <p>{s.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Stats Section ──────────────────────────────────────── */}
      <section ref={statsRef} className={styles.statsSection}>
        <div className={styles.statsInner}>
          <ScrollReveal animation="fadeUp" stagger={0.12}>
            {stats.map((stat) => (
              <div key={stat.label} className={styles.statCard}>
                <stat.Icon className={styles.statIconSvg} aria-hidden />
                <span
                  className={styles.statNumber}
                  data-target={stat.number}
                >
                  {stat.number}
                </span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* ─── About Section ──────────────────────────────────────── */}
      <section ref={aboutRef} className={styles.aboutSection}>
        <div className={styles.aboutInner}>
          <ScrollReveal animation="slideLeft">
            <div className={styles.aboutText}>
              <div className={`glow-line ${styles.aboutLine}`} />
              <h2 className={styles.sectionTitle}>
                Streamlining Faculty<br />
                <span className="text-gradient-animated">Activity Management</span>
              </h2>
              <p className={styles.aboutDesc}>
                FACTACTO is the IT Department&apos;s Faculty Activity Tracking &amp; Collaboration platform:
                it standardizes how we record research, conferences, funded projects, patents, FDPs, industry
                partnerships, alumni sessions, and student co-curricular achievements. Each form maps to the
                same reporting story HoD and institute bodies expect.
              </p>
              <p className={styles.aboutDesc}>
                Behind the scenes, submissions connect to MongoDB collections for analytics and to automated
                monthly DOCX generation - so you spend less time retyping data into Word and more time on
                teaching, mentoring, and research.
              </p>
              <p className={styles.aboutDesc}>
                Whether you are filing a new journal paper or logging a guest lecture, the workflow stays
                familiar: sign in, pick the right template, attach proof, and submit. Administrators sign in
                separately to review aggregates and export reports.
              </p>

              {/* Quick links */}
              <div className={styles.quickLinks}>
                <Link href="/dashboard" prefetch={false} className={styles.quickLink}>
                  <IconForm className={styles.quickLinkIcon} aria-hidden />
                  Submit activity
                </Link>
                <Link href="/login?redirect=/admin" prefetch={false} className={styles.quickLink}>
                  <IconAnalytics className={styles.quickLinkIcon} aria-hidden />
                  Admin sign-in
                </Link>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal animation="slideRight">
            <div className={styles.aboutImageColumn}>
              <div className={styles.aboutImageWrap}>
                <div className={styles.aboutImageGlow} aria-hidden />
                <Image
                  src="/images/ssn.jpeg"
                  alt="SSN College of Engineering"
                  width={840}
                  height={640}
                  className={styles.aboutImage}
                  style={{ width: '100%', height: 'auto' }}
                  sizes="(max-width: 768px) 100vw, min(420px, 42vw)"
                  quality={90}
                />
                <div className={styles.aboutImageBorder} aria-hidden />
              </div>
              <div className={styles.aboutThumbWrap}>
                <Image
                  src="/images/it_ssnd.jpg"
                  alt="IT Department"
                  width={560}
                  height={360}
                  className={styles.aboutThumbImage}
                  style={{ width: '100%', height: 'auto' }}
                  sizes="280px"
                  quality={95}
                />
                <p className={styles.aboutThumbCaption}>IT Department</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Quote Section ──────────────────────────────────────── */}
      <section ref={quote1Ref} className={styles.quoteSection}>
        <ScrollReveal animation="fadeUp">
          <div className={styles.quoteCard}>
            <div className={styles.quoteMark}>&ldquo;</div>
            <blockquote className={styles.quoteText}>
              {quotes[0].text}
            </blockquote>
            <cite className={styles.quoteAuthor}>- {quotes[0].author}</cite>
          </div>
        </ScrollReveal>
      </section>

      {/* ─── Features Section ───────────────────────────────────── */}
      <section ref={featuresRef} className={styles.featuresSection}>
        <ScrollReveal animation="fadeUp">
          <div className={`glow-line glow-line-center ${styles.featureLine}`} />
          <h2 className={`${styles.sectionTitle} text-center`}>
            Designed for <span className="text-gradient">Efficiency</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            FACTACTO brings forms, dashboards, and exports together - so you spend less time on paperwork and
            more on teaching and research.
          </p>
        </ScrollReveal>

        <ScrollReveal animation="fadeUp" stagger={0.1} className={styles.featuresGrid}>
          {features.map((feature, i) => (
            <div key={feature.title} className={styles.featureCard}>
              <div className={styles.featureIconWrap} style={{ background: feature.gradient }}>
                <feature.Icon className={styles.featureIconSvg} aria-hidden />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
              <div className={styles.featureNumber}>0{i + 1}</div>
            </div>
          ))}
        </ScrollReveal>
      </section>

      {/* ─── Second Quote ───────────────────────────────────────── */}
      <section ref={quote2Ref} className={styles.quoteSection2}>
        <ScrollReveal animation="scale">
          <div className={styles.quoteInline}>
            <span className={styles.quoteInlineMark}>&ldquo;</span>
            <p>{quotes[1].text}</p>
            <cite>- {quotes[1].author}</cite>
          </div>
        </ScrollReveal>
      </section>

      {/* ─── CTA Section ────────────────────────────────────────── */}
      <section ref={ctaSectionRef} className={styles.ctaSection}>
        <ScrollReveal animation="scale">
          <div className={styles.ctaCard}>
            <div className={styles.ctaOrb1} />
            <div className={styles.ctaOrb2} />
            <div className={styles.ctaContent}>
              <p className={styles.ctaEyebrow}>FACTACTO</p>
              <h2>Start with a single sign-in</h2>
              <p>
                Faculty use FACTACTO to file activities; administrators authenticate separately to open
                analytics, raw data, and monthly DOCX exports. No guest access to admin - use your institute
                credentials.
              </p>
              <div className={styles.ctaButtons}>
                <Link href="/login" prefetch={false} className="btn btn-primary btn-lg">
                  Faculty login
                </Link>
                <Link href="/login?redirect=/admin" prefetch={false} className={`btn btn-ghost btn-lg ${styles.ctaOutline}`}>
                  Admin login
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
      </div>
    </>
  );
}
