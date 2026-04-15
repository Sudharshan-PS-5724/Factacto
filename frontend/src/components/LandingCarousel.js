'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import NextImage from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './LandingCarousel.module.css';

const PRELOAD_TIMEOUT_MS = 12000;

function preloadSlide(src) {
  return new Promise((resolve) => {
    const img = new Image();
    const done = () => resolve();
    img.onload = () => {
      if (typeof img.decode === 'function') {
        img.decode().then(done).catch(done);
      } else {
        done();
      }
    };
    img.onerror = done;
    img.src = src;
  });
}

export default function LandingCarousel({ slides }) {
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [imagesReady, setImagesReady] = useState(false);

  const preloadKey = useMemo(
    () => (slides?.length ? JSON.stringify(slides.map((s) => s.src)) : ''),
    [slides]
  );

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (!preloadKey) {
      setImagesReady(false);
      return undefined;
    }
    const sources = JSON.parse(preloadKey);
    let cancelled = false;
    setImagesReady(false);

    const load = async () => {
      const timeout = new Promise((resolve) => {
        setTimeout(resolve, PRELOAD_TIMEOUT_MS);
      });
      try {
        await Promise.race([Promise.all(sources.map((src) => preloadSlide(src))), timeout]);
      } finally {
        if (!cancelled) setImagesReady(true);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [preloadKey]);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!imagesReady || reduced || slides.length < 2) return undefined;
    const id = setInterval(next, 5200);
    return () => clearInterval(id);
  }, [next, reduced, slides.length, imagesReady]);

  if (!slides?.length) return null;

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.kicker}>Gallery</span>
        <h2 className={styles.title}>Campus, collaboration, and outcomes</h2>
        <p className={styles.sub}>
          Moments from collaboration and activities across the department..        </p>
      </div>

      <div className={styles.stage} aria-busy={!imagesReady}>
        {!imagesReady && (
          <div className={styles.stageSkeleton} aria-hidden>
            <span className={styles.skeletonLabel}>Loading gallery…</span>
          </div>
        )}
        {imagesReady && (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              className={styles.slide}
              initial={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.98, filter: 'blur(6px)' }}
              transition={{ duration: reduced ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <NextImage
                src={slides[index].src}
                alt={slides[index].alt}
                fill
                className={styles.img}
                sizes="(max-width: 960px) 100vw, 960px"
                quality={90}
                priority={index === 0}
              />
              <div className={styles.captionBar}>
                <span className={styles.caption}>{slides[index].caption}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {imagesReady && slides.length > 1 && (
          <>
            <button type="button" className={styles.navBtn} style={{ left: 12 }} onClick={prev} aria-label="Previous slide">
              ‹
            </button>
            <button type="button" className={styles.navBtn} style={{ right: 12 }} onClick={next} aria-label="Next slide">
              ›
            </button>
          </>
        )}
      </div>

      {imagesReady && slides.length > 1 && (
        <div className={styles.dots} role="tablist" aria-label="Carousel slides">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
