'use client';

import Link from 'next/link';
import styles from './ProductDetails.module.css';

interface ProductDetailsProps {
  barcode: string;
  productData: any;
  statusCode: number | null;
}

export default function ProductDetails({ barcode, productData, statusCode }: ProductDetailsProps) {
  const productName = productData?.data?.product_name;
  const brandName = productData?.data?.brand_name;
  const nutrition = productData?.data?.nutrition;

  return (
    <div className={styles.container}>
      <div className={styles.dataCard}>
          {statusCode && statusCode !== 200 && (
            <div className={styles.error}>
              Error {statusCode}
            </div>
          )}
          {productName && (
            <>
              <div className={styles.productHeader}>
                <h1 className={styles.productName}>{productName}</h1>
                {brandName && (
                  <p className={styles.productBrand}>{brandName}</p>
                )}
              </div>

              {nutrition && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Nutrition Information</h2>
                  <div className={styles.nutritionGrid}>
                    {nutrition.calories !== undefined && (
                      <div className={styles.nutritionItem}>
                        <div className={styles.nutritionIcon}>🔥</div>
                        <div className={styles.nutritionContent}>
                          <span className={styles.nutritionLabel}>Calories</span>
                          <span className={styles.nutritionValue}>{nutrition.calories} kcal</span>
                        </div>
                      </div>
                    )}
                    {nutrition.protein !== undefined && (
                      <div className={styles.nutritionItem}>
                        <div className={styles.nutritionIcon}>💪</div>
                        <div className={styles.nutritionContent}>
                          <span className={styles.nutritionLabel}>Protein</span>
                          <span className={styles.nutritionValue}>{nutrition.protein} g</span>
                        </div>
                      </div>
                    )}
                    {nutrition.fat !== undefined && (
                      <div className={styles.nutritionItem}>
                        <div className={styles.nutritionIcon}>🥑</div>
                        <div className={styles.nutritionContent}>
                          <span className={styles.nutritionLabel}>Fat</span>
                          <span className={styles.nutritionValue}>{nutrition.fat} g</span>
                        </div>
                      </div>
                    )}
                    {nutrition.carbohydrates !== undefined && (
                      <div className={styles.nutritionItem}>
                        <div className={styles.nutritionIcon}>🌾</div>
                        <div className={styles.nutritionContent}>
                          <span className={styles.nutritionLabel}>Carbohydrates</span>
                          <span className={styles.nutritionValue}>{nutrition.carbohydrates} g</span>
                        </div>
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

