import styles from './ErrorBarcode.module.css';

interface ErrorBarcodeProps {
  code: string;
}

export default function ErrorBarcode({ code }: ErrorBarcodeProps) {
  return (
    <svg className={styles.barcode} viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
      <rect className={styles.bar} x="0" y="20" width="5" height="100" />
      <rect className={styles.bar} x="10" y="20" width="10" height="100" />
      <rect className={styles.bar} x="25" y="20" width="5" height="100" />
      <rect className={styles.bar} x="35" y="20" width="10" height="100" />
      <rect className={styles.bar} x="55" y="20" width="15" height="100" />
      <rect className={styles.bar} x="75" y="20" width="5" height="100" />
      <rect className={styles.bar} x="85" y="20" width="10" height="100" />
      <rect className={styles.bar} x="100" y="20" width="5" height="100" />
      <rect className={styles.bar} x="110" y="20" width="5" height="100" />
      <rect className={styles.bar} x="120" y="20" width="10" height="100" />
      <rect className={styles.bar} x="135" y="20" width="5" height="100" />
      <rect className={styles.bar} x="145" y="20" width="15" height="100" />
      <rect className={styles.bar} x="165" y="20" width="5" height="100" />
      <rect className={styles.bar} x="175" y="20" width="10" height="100" />
      <text className={styles.code} x="90" y="105">
        {code}
      </text>
    </svg>
  );
}
