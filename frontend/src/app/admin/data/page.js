'use client';
import { useState } from 'react';
import Link from 'next/link';
import { fetchAllData } from '@/lib/api';
import styles from './page.module.css';

export default function AdminDataPage() {
  const [data, setData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setLoading(true);
    try {
      const result = await fetchAllData();
      setData(result);
    } catch (err) {
      alert('Could not load data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data?.filter(item =>
    !searchTerm || item.collection.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>User Data Viewer</h1>
          <p className={styles.subtitle}>Browse saved submissions by category</p>
        </div>
        <Link href="/admin" prefetch={false} className="btn btn-outline">← Back to Dashboard</Link>
      </div>

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Filter by collection name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <button onClick={handleFetch} className="btn btn-primary" disabled={loading}>
          {loading ? 'Fetching...' : 'Fetch All Records'}
        </button>
      </div>

      {filteredData && filteredData.map(item => (
        <div key={item.collection} className={styles.collectionCard}>
          <h3 className={styles.collectionTitle}>
            {item.collection}
            <span className={styles.count}>{item.records.length} records</span>
          </h3>
          {item.records.length > 0 && (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {Object.keys(item.records[0]).filter(k => k !== '_id').map(key => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {item.records.map((record, idx) => (
                    <tr key={idx}>
                      {Object.entries(record).filter(([k]) => k !== '_id').map(([key, value]) => (
                        <td key={key}>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}

      {data && filteredData?.length === 0 && (
        <p className={styles.empty}>No collections match your search.</p>
      )}
    </div>
  );
}
