'use client';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Wraps children in a scroll-triggered animation.
 * @param {'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scale'} animation
 * @param {number} delay - delay in seconds
 * @param {number} duration - animation duration
 */
export default function ScrollReveal({
  children,
  animation = 'fadeUp',
  delay = 0,
  duration = 0.8,
  className = '',
  stagger = 0,
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const animations = {
      fadeUp: { from: { opacity: 0, y: 60 }, to: { opacity: 1, y: 0 } },
      fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
      slideLeft: { from: { opacity: 0, x: -60 }, to: { opacity: 1, x: 0 } },
      slideRight: { from: { opacity: 0, x: 60 }, to: { opacity: 1, x: 0 } },
      scale: { from: { opacity: 0, scale: 0.9 }, to: { opacity: 1, scale: 1 } },
    };

    const anim = animations[animation] || animations.fadeUp;
    const targets = stagger > 0 ? ref.current.children : ref.current;

    gsap.set(targets, anim.from);

    const tl = gsap.to(targets, {
      ...anim.to,
      duration,
      delay,
      stagger: stagger || 0,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === ref.current) trigger.kill();
      });
    };
  }, [animation, delay, duration, stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
