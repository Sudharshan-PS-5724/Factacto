'use client';
import { useState, useRef } from 'react';
import { submitActivity } from '@/lib/api';
import styles from './FormRenderer.module.css';

/** Shrink very large photos before upload (PDFs are unchanged). */
async function compressImageFileIfNeeded(file) {
  if (!file.type.startsWith('image/')) return file;
  if (file.size < 512 * 1024) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const maxEdge = 1920;
    const { width, height } = bitmap;
    const scale = Math.min(1, maxEdge / Math.max(width, height, 1));
    const w = Math.round(width * scale);
    const h = Math.round(height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('toBlob failed'))),
        'image/jpeg',
        0.82
      );
    });
    const baseName = file.name.replace(/\.[^.]+$/, '') || 'attachment';
    return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' });
  } catch (e) {
    console.warn('Image compression skipped:', e);
    return file;
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target.result;
      const base64Data = String(result).replace(/^.*,/, '');
      const mimeMatch = String(result).match(/^[^;]+/);
      const mimetype = mimeMatch ? mimeMatch[0] : '';
      resolve({ base64: base64Data, mimetype, filename: file.name });
    };
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

export default function FormRenderer({ config, slug }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [googleWarning, setGoogleWarning] = useState(null);
  const formRef = useRef(null);

  if (!config) return <div className={styles.error}>Form not found.</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formEl = formRef.current;
    if (!formEl) return;

    const fileFields = config.fields.filter((f) => f.type === 'file');
    const textFields = config.fields.filter((f) => f.type !== 'file');

    const fieldValues = {};
    for (const f of textFields) {
      const el = formEl.elements.namedItem(f.name);
      fieldValues[f.name] = el && 'value' in el ? el.value : '';
    }

    for (const f of config.fields) {
      if (!f.required) continue;
      if (f.type === 'file') {
        const inp = formEl.elements.namedItem(f.name);
        if (!inp || inp.type !== 'file' || !inp.files?.length) {
          alert(`Please attach: ${f.label}`);
          return;
        }
      } else if (!String(fieldValues[f.name] ?? '').trim()) {
        alert(`Please fill in: ${f.label}`);
        return;
      }
    }

    setSubmitting(true);
    setGoogleWarning(null);

    try {
      const filePayloads = [];
      for (const f of fileFields) {
        const inp = formEl.elements.namedItem(f.name);
        let file = inp && inp.type === 'file' ? inp.files?.[0] : null;
        if (!file) {
          alert(`Missing file: ${f.label}`);
          setSubmitting(false);
          return;
        }
        file = await compressImageFileIfNeeded(file);
        filePayloads.push(await readFileAsDataUrl(file));
      }

      const mongoFiles = filePayloads.map((p) => ({
        filename: p.filename,
        mimetype: p.mimetype,
        dataBase64: p.base64,
      }));

      const appsScriptUrl =
        (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_APPS_SCRIPT_URL) || config.actionUrl;

      const result = await submitActivity({
        slug,
        htmlFileName: config.htmlFileName,
        fields: fieldValues,
        files: mongoFiles,
        appsScriptUrl,
      });

      const sheetOk = result.googleAppsScript?.ok ?? result.forwardedToSheet;
      if (sheetOk === false && (appsScriptUrl || config.actionUrl)) {
        setGoogleWarning(
          result.googleAppsScript?.error ||
            'Your entry was saved, but the copy to Google could not be confirmed. You can try again later if needed.'
        );
      }

      setSubmitted(true);
      formEl.reset();
    } catch (err) {
      console.error('Submit error:', err);
      alert(err.message || 'Something went wrong. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={styles.card}>
        <div className={styles.success}>
          <div className={styles.successIcon} aria-hidden>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className={styles.successTitle}>Submitted successfully</h3>
          <p className={styles.successText}>
            Your {config.title} entry was saved
            {googleWarning ? '.' : ' and sent to Google for filing.'}
          </p>
          {googleWarning && (
            <p className={styles.successText} style={{ color: 'var(--amber-700, #b45309)', marginTop: '0.75rem' }}>
              {googleWarning}
            </p>
          )}
          <button
            type="button"
            className={styles.successBtn}
            onClick={() => {
              setSubmitted(false);
              setGoogleWarning(null);
            }}
          >
            Submit another entry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <header className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>{config.title}</h2>
        {config.description && <p className={styles.cardDesc}>{config.description}</p>}
        <div className={styles.cardAccent} aria-hidden />
      </header>

      <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
        {config.fields.map((field) => (
          <div key={field.name} className={styles.fieldGroup}>
            <label className={styles.label} htmlFor={field.name}>
              {field.label}
              {field.required && <span className={styles.required}>*</span>}
            </label>

            {field.type === 'textarea' ? (
              <textarea
                id={field.name}
                name={field.name}
                className={styles.textarea}
                placeholder={field.placeholder || ''}
                required={field.required}
                rows={4}
              />
            ) : field.type === 'select' ? (
              <select id={field.name} name={field.name} className={styles.select} required={field.required} defaultValue="">
                <option value="" disabled>
                  Select an option
                </option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'file' ? (
              <div className={styles.fileWrap}>
                <input
                  type="file"
                  id={field.name}
                  name={field.name}
                  className={styles.fileInput}
                  required={field.required}
                />
              </div>
            ) : (
              <input
                type={field.type || 'text'}
                id={field.name}
                name={field.name}
                className={styles.input}
                placeholder={field.placeholder || ''}
                required={field.required}
              />
            )}
          </div>
        ))}

        <button type="submit" className={styles.submitBtn} disabled={submitting}>
          {submitting ? (
            <>
              <span className={styles.spinner} />
              Submitting…
            </>
          ) : (
            'Submit activity'
          )}
        </button>
      </form>
    </div>
  );
}
