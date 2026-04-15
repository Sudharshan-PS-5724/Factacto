import { getFormConfig } from '@/lib/formConfigs';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const config = getFormConfig(slug);
  if (!config) {
    return {
      title: 'Form not found',
      robots: { index: false, follow: true },
    };
  }
  const desc = config.description
    ? String(config.description).replace(/\s+/g, ' ').trim().slice(0, 160)
    : `Submit “${config.title}” for departmental records in FACTACTO.`;
  return {
    title: config.title,
    description: desc,
    openGraph: {
      title: `${config.title} · FACTACTO`,
      description: desc,
    },
  };
}

export default function ActivityFormLayout({ children }) {
  return children;
}
