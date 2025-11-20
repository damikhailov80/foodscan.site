'use client';

import Link from 'next/link';
import ErrorBarcode from './ErrorBarcode';
import styles from './ErrorPage.module.css';

interface ProductNotFoundProps {
  barcode: string;
}

export default function ProductNotFound({ barcode }: ProductNotFoundProps) {
  return (
    <div className={styles.container}>
      <div className={styles.spacer} />
      
      <div className={styles.content}>
        <ErrorBarcode code="404" />
        <h1 className={styles.title}>Product Not Found</h1>
        <p className={styles.message}>
          Sorry, we couldn't find the food item you've scanned. Would you like to add it?
        </p>
      </div>

      <div className={styles.spacer} />

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1rem', 
        width: '100%', 
        maxWidth: '400px',
        padding: '0 1rem'
      }}>
        <Link 
          href={`/product/${barcode}/contribute/front`}
          className={styles.button}
          style={{
            background: 'var(--color-secondary)',
            color: 'var(--color-white)',
            border: 'none'
          }}
        >
          📸 Add Product
        </Link>
        
        <Link href="/" className={styles.button}>
          🏠 Go to Home Page
        </Link>
      </div>
    </div>
  );
}
