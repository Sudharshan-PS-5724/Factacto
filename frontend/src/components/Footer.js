import styles from './Footer.module.css';

const marqueeItems = [
  'FACTACTO', '•',
  'Faculty Activity Tracking & Collaboration', '•',
  'SSN College of Engineering', '•',
  'Department of Information Technology', '•',
  'Research • Publications • Patents • Conferences • FDP', '•',
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.topBar}>
        <div className={styles.topBarTrack}>
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className={styles.topBarItem}>{item}</span>
          ))}
        </div>
      </div>
      <div className={styles.inner}>
        <div className={styles.left}>
          <p className={styles.factacto}>FACTACTO</p>
          <p className={styles.brand}>SSN College of Engineering</p>
          <p className={styles.sub}>Department of Information Technology, Kalavakkam - 603 110</p>
        </div>
        <div className={styles.right}>
          <p>&copy; {new Date().getFullYear()} FACTACTO · Faculty Activities · SSN IT</p>
        </div>
      </div>
    </footer>
  );
}
