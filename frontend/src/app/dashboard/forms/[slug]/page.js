'use client';
import { use } from 'react';
import Link from 'next/link';
import { getFormConfig } from '@/lib/formConfigs';
import { getCategoryByFormSlug } from '@/lib/categories';
import { getFormSidebarVisual } from '@/lib/formVisuals';
import FormRenderer from '@/components/FormRenderer';
import FormPageShell from '@/components/FormPageShell';
import styles from './page.module.css';

export default function FormPage({ params }) {
  const { slug } = use(params);
  const config = getFormConfig(slug);
  const category = getCategoryByFormSlug(slug);

  if (!config) {
    return (
      <div className={styles.notFound}>
        <h2>Form not found</h2>
        <p>The form &quot;{slug}&quot; does not exist.</p>
        <Link href="/dashboard" prefetch={false} className="btn btn-primary">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const breadcrumb = (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <Link href="/dashboard" prefetch={false} className={styles.breadcrumbLink}>
        Dashboard
      </Link>
      <span className={styles.breadcrumbSep}>/</span>
      {category && (
        <>
          <span className={styles.breadcrumbMid}>{category.title}</span>
          <span className={styles.breadcrumbSep}>/</span>
        </>
      )}
      <span className={styles.breadcrumbCurrent}>{config.title}</span>
    </nav>
  );

  const asideImage = getFormSidebarVisual(slug, config);

  return (
    <FormPageShell
      breadcrumb={breadcrumb}
      title={config.title}
      categoryTitle={category?.title}
      description={config.description}
      asideImage={asideImage}
    >
      <FormRenderer config={config} slug={slug} />
    </FormPageShell>
  );
}
