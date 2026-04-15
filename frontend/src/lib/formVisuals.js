import { getCategoryByFormSlug } from './categories';

export function getFormSidebarVisual(slug, config) {
  if (config?.sidebarImage) {
    return {
      src: config.sidebarImage,
      alt: `${config.title || 'Activity'}  -  department image`,
    };
  }

  const cat = getCategoryByFormSlug(slug);
  const key = cat ? cat.id.replace(/-/g, '_') : 'default';

  return {
    src: `/images/form-placeholders/${key}.svg`,
    alt: cat ? `${cat.title}  -  illustration` : 'Activity form illustration',
  };
}
