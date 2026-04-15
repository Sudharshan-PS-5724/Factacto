import Image from 'next/image';
import styles from './FormPageShell.module.css';

export default function FormPageShell({
  breadcrumb,
  title,
  categoryTitle,
  description,
  asideImage,
  children,
}) {
  return (
    <div className={styles.shell}>
      <div className={styles.bgLayer} aria-hidden />
      <div className={styles.bgGrid} aria-hidden />

      <div className={styles.inner}>
        <div className={styles.topBar}>{breadcrumb}</div>

        <div className={styles.grid}>
          <aside className={styles.aside}>
            <p className={styles.kicker}>IT Department</p>
            <h1 className={styles.heroTitle}>{title}</h1>
            {categoryTitle && (
              <p className={styles.categoryLine}>
                Category: <span>{categoryTitle}</span>
              </p>
            )}

            {asideImage && (
              <div className={styles.asideFigure}>
                <Image
                  src={asideImage.src}
                  alt={asideImage.alt}
                  width={400}
                  height={220}
                  className={styles.asideImg}
                  sizes="(max-width: 960px) 100vw, 360px"
                  style={{ width: '100%', height: 'auto' }}
                  priority
                />
              </div>
            )}

            <p className={styles.lead}>
              {description ||
                'This form feeds the department activity database and monthly DOCX summaries. Answer each field as completely as you can.'}
            </p>
            <p className={styles.formHint}>
              Required fields are marked *. Upload supporting files wherever the form asks for proof or attachments.
            </p>
            <ul className={styles.bullets}>
              <li>Data is submitted securely to the department activities workflow.</li>
              <li>Keep descriptions clear for monthly DOCX reports.</li>
              <li>Contact the Admin if you need changes after submission.</li>
            </ul>

          </aside>

          <div className={styles.main}>{children}</div>
        </div>
      </div>
    </div>
  );
}