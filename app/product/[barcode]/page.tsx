'use client';

import Link from 'next/link';
import { use, useEffect, useState } from 'react';

interface ProductData {
  data?: {
    product?: {
      name?: string;
      brand?: string;
    };
    preference_analysis?: {
      flags?: {
        sugar_free?: boolean;
        palm_oil_free?: boolean;
        gluten_free?: boolean;
      };
    };
    confidence_score?: number;
    external_source?: {
      source?: string;
    };
  };
}

async function getProductData(barcode: string) {
  const url = new URL('https://foodscan-pi.vercel.app/api/v1/products/lookup');  
  url.searchParams.append('barcode', barcode);
  url.searchParams.append('sugar', 'true');
  url.searchParams.append('palm_oil', 'true');
  url.searchParams.append('gluten', 'true');

  console.log('Making request to:', url.toString());

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer TNyD7kvorlqwfyDHdf2AFMNfm4ZCkIdk'
    }
  });

  console.log('Response status:', response.status, response.statusText);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

const StatusBadges = ({ flags }: { flags?: { sugar_free?: boolean; palm_oil_free?: boolean; gluten_free?: boolean } }) => (
  <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    justifyContent: 'center',
    marginBottom: '1.5rem'
  }}>
    <div style={{
      padding: '0.75rem 1.25rem',
      borderRadius: '9999px',
      fontSize: '1rem',
      fontWeight: '600',
      backgroundColor: flags?.sugar_free ? '#D1F5D3' : '#FAD4D4',
      color: flags?.sugar_free ? '#065F46' : '#7F1D1D'
    }}>
      {flags?.sugar_free ? '✓ Sugar Free' : '✗ Contains Sugar'}
    </div>
    
    <div style={{
      padding: '0.75rem 1.25rem',
      borderRadius: '9999px',
      fontSize: '1rem',
      fontWeight: '600',
      backgroundColor: flags?.palm_oil_free ? '#D1F5D3' : '#FAD4D4',
      color: flags?.palm_oil_free ? '#065F46' : '#7F1D1D'
    }}>
      {flags?.palm_oil_free ? '✓ Palm Oil Free' : '✗ Contains Palm Oil'}
    </div>
    
    <div style={{
      padding: '0.75rem 1.25rem',
      borderRadius: '9999px',
      fontSize: '1rem',
      fontWeight: '600',
      backgroundColor: flags?.gluten_free ? '#D1F5D3' : '#FAD4D4',
      color: flags?.gluten_free ? '#065F46' : '#7F1D1D'
    }}>
      {flags?.gluten_free ? '✓ Gluten Free' : '✗ Contains Gluten'}
    </div>
  </div>
);

const ConfidenceCard = ({ confidence, source }: { confidence?: number; source?: string }) => (
  <div style={{
    backgroundColor: '#FFFFFF',
    borderRadius: '0.5rem',
    padding: '1rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    marginBottom: '1.5rem',
    width: '100%'
  }}>
    <div style={{
      fontSize: '1.125rem',
      color: '#4B5563',
      marginBottom: '0.5rem'
    }}>
      <span style={{ fontWeight: '500' }}>Confidence:</span> {Math.round((confidence || 0) * 100)}%
    </div>
    <div style={{
      fontSize: '1.125rem',
      color: '#4B5563'
    }}>
      <span style={{ fontWeight: '500' }}>Source:</span> {source || 'Unknown'}
    </div>
  </div>
);

const HomeButton = () => (
  <Link 
    href="/" 
    style={{
      width: '100%',
      backgroundColor: '#064E3B',
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: '1.25rem',
      padding: '1rem 1.5rem',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      textDecoration: 'none',
      transition: 'background-color 0.2s'
    }}
  >
    <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="currentColor" viewBox="0 0 20 20">
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
    Back to Home
  </Link>
);

const ProductCard = ({ productData }: { productData: ProductData }) => (
  <div style={{
    textAlign: 'center',
    width: '100%',
    maxWidth: '28rem',
    padding: '0 1rem'
  }}>
    <div style={{
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: '#000000'
    }}>
      {productData.data?.product?.name || 'Unknown Product'}
    </div>
    
    <div style={{
      fontSize: '1.5rem',
      color: '#4B5563',
      marginBottom: '1.5rem'
    }}>
      {productData.data?.product?.brand}
    </div>

    <StatusBadges flags={productData.data?.preference_analysis?.flags} />
    
    <ConfidenceCard 
      confidence={productData.data?.confidence_score}
      source={productData.data?.external_source?.source}
    />
  </div>
);

export default function ProductPage({ params }: { params: Promise<{ barcode: string }> }) {
  const { barcode } = use(params);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getProductData(barcode);
        setProductData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [barcode]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #EAF8EA, #F9FFF9)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      gap: '2rem'
    }}>
      <div style={{
        fontSize: '1.125rem',
        color: '#6B7280',
        fontWeight: '500',
        textAlign: 'center'
      }}>
        {barcode}
      </div>
      
      {loading ? (
        <div style={{ fontSize: '1.125rem' }}>Loading...</div>
      ) : error ? (
        <div style={{ 
          color: '#DC2626', 
          textAlign: 'center', 
          fontWeight: '500' 
        }}>
          {error}
        </div>
      ) : productData ? (
        <>
          <ProductCard productData={productData} />
          <div style={{ width: '100%', maxWidth: '28rem', padding: '0 1rem' }}>
            <HomeButton />
          </div>
        </>
      ) : null}
    </div>
  );
}
