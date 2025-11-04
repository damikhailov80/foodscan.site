import { use } from 'react';
import Link from 'next/link';

export default function ProductPage({ params }: { params: Promise<{ barcode: string }> }) {
  const { barcode } = use(params);
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '1rem',
      gap: '2rem'
    }}>
      <div style={{
        fontSize: '2rem',
        textAlign: 'center'
      }}>
        {barcode}
      </div>
      <Link href="/" style={{
        width: '100%',
        maxWidth: '400px',
        padding: '16px 24px',
        background: 'var(--color-secondary)',
        color: 'var(--color-light)',
        borderRadius: '12px',
        textDecoration: 'none',
        fontSize: '18px',
        fontWeight: '600',
        textAlign: 'center',
        boxShadow: '0 4px 15px rgba(106, 153, 78, 0.4)',
        transition: 'all 0.2s ease',
        display: 'block'
      }}>
        Home
      </Link>
    </div>
  );
}
