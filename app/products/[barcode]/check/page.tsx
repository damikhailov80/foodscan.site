'use client';

import { use, useEffect, useState } from 'react';
import ProductNotFound from '@/app/components/ProductNotFound';
import InvalidBarcode from '@/app/components/InvalidBarcode';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import ProductDetails from '@/app/components/ProductDetails';

export default function ProductPage({ params }: { params: Promise<{ barcode: string }> }) {
  const { barcode } = use(params);
  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${barcode}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        
        setStatusCode(response.status);
        setProductData(data);
        setLoading(false);
      } catch (err) {
        setStatusCode(500);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [barcode]);

  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }

  if (statusCode === 404) {
    return <ProductNotFound barcode={barcode} />;
  }

  if (statusCode === 400) {
    return <InvalidBarcode />;
  }

  return <ProductDetails barcode={barcode} productData={productData} statusCode={statusCode} />;
}

