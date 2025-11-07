'use client';

import { use, useEffect, useState } from 'react';
import ProductNotFound from '@/app/components/ProductNotFound';
import InvalidBarcode from '@/app/components/InvalidBarcode';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import ProductDisplay from '@/app/components/ProductDisplay';

export default function ProductPage({ params }: { params: Promise<{ barcode: string }> }) {
  const { barcode } = use(params);
  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/lookup?barcode=${barcode}`, {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        
        setStatusCode(response.status);
        
        if (response.status === 202) {
          setIsSearching(true);
          let retries = 0;
          const maxRetries = 60;
          
          const retryFetch = async () => {
            if (retries >= maxRetries) {
              setStatusCode(404);
              setIsSearching(false);
              setLoading(false);
              return;
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            retries++;
            
            try {
              const retryResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/lookup?barcode=${barcode}`, {
                headers: {
                  'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
                  'Content-Type': 'application/json',
                },
              });
              const retryData = await retryResponse.json();
              
              if (retryResponse.status === 202) {
                await retryFetch();
              } else {
                setStatusCode(retryResponse.status);
                setProductData(retryData);
                setIsSearching(false);
                setLoading(false);
              }
            } catch (err) {
              setStatusCode(500);
              setIsSearching(false);
              setLoading(false);
            }
          };
          
          await retryFetch();
        } else {
          setProductData(data);
          setLoading(false);
        }
      } catch (err) {
        setStatusCode(500);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [barcode]);

  if (loading || isSearching) {
    return <LoadingSpinner message={isSearching ? 'Searching for product information...' : 'Loading...'} />;
  }

  if (statusCode === 404) {
    return <ProductNotFound />;
  }

  if (statusCode === 400) {
    return <InvalidBarcode />;
  }

  return <ProductDisplay barcode={barcode} productData={productData} statusCode={statusCode} />;
}
