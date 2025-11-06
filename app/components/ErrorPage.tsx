import Link from 'next/link';
import ErrorBarcode from './ErrorBarcode';
import styles from './ErrorPage.module.css';

interface ErrorPageProps {
  code: string;
  title: string;
  message: string;
}

export default function ErrorPage({ code, title, message }: ErrorPageProps) {
  return (
    <div className={styles.container}>
      <div className={styles.spacer} />
      
      <div className={styles.content}>
        <ErrorBarcode code={code} />
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.message}>{message}</p>
      </div>

      <div className={styles.spacer} />

      <Link href="/" className={styles.button}>
        Try Again
      </Link>
    </div>
  );
}
