import LandingPageClient from './LandingPageClient';
import { getCarouselSlides } from '@/lib/getCarouselSlides';

export default function Page() {
  const carouselSlides = getCarouselSlides();
  /** Carousel images are preloaded in LandingCarousel  -  avoid duplicate <link rel="preload"> noise in DevTools. */
  return <LandingPageClient carouselSlides={carouselSlides} />;
}
