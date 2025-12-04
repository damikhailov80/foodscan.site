'use client';

import Link from 'next/link';
import styles from './ProductDetails.module.css';

interface ProductDetailsProps {
  barcode: string;
  productData: any;
  statusCode: number | null;
}

export default function ProductDetails({ barcode, productData, statusCode }: ProductDetailsProps) {
  const product = productData?.product;

  return (
    <div className={styles.container}>
      <div className={styles.dataCard}>
          {statusCode && statusCode !== 200 && (
            <div className={styles.error}>
              Error {statusCode}
            </div>
          )}
          {product && (
            <>
              <div className={styles.productHeader}>
                <h1 className={styles.productName}>{product.product_name}</h1>
                {product.brand_name && (
                  <p className={styles.productBrand}>{product.brand_name}</p>
                )}
              </div>

              {product.nutrition && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Nutrition Information</h2>
                  <div className={styles.flagsGrid}>
                    {product.nutrition.energy_kcal !== null && (
                      <div className={styles.flagPositive}>
                        <span className={styles.flagIcon}>🔥</span>
                        <span>{product.nutrition.energy_kcal} kcal</span>
                      </div>
                    )}
                    {product.nutrition.protein !== null && (
                      <div className={styles.flagPositive}>
                        <span className={styles.flagIcon}>💪</span>
                        <span>{product.nutrition.protein}g protein</span>
                      </div>
                    )}
                    {product.nutrition.fat !== null && (
                      <div className={styles.flagPositive}>
                        <span className={styles.flagIcon}>🥑</span>
                        <span>{product.nutrition.fat}g fat</span>
                      </div>
                    )}
                    {product.nutrition.carbohydrates !== null && (
                      <div className={styles.flagPositive}>
                        <span className={styles.flagIcon}>🌾</span>
                        <span>{product.nutrition.carbohydrates}g carbs</span>
                      </div>
                    )}
                    {product.nutrition.salt !== null && (
                      <div className={styles.flagPositive}>
                        <span className={styles.flagIcon}>🧂</span>
                        <span>{product.nutrition.salt}g salt</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
      </div>

      <Link href="/" className={styles.homeButton}>
        Home
      </Link>
    </div>
  );
}
