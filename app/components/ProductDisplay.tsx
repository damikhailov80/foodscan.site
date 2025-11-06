'use client';

import Link from 'next/link';
import styles from './ProductDisplay.module.css';

interface ProductDisplayProps {
  barcode: string;
  productData: any;
  statusCode: number | null;
}

export default function ProductDisplay({ barcode, productData, statusCode }: ProductDisplayProps) {
  const product = productData?.data?.product;
  const preferenceAnalysis = productData?.data?.preference_analysis;
  const confidenceScore = productData?.data?.confidence_score;
  const externalSource = productData?.data?.external_source;

  const allChecksPassed = preferenceAnalysis?.flags?.sugar_free && 
                          preferenceAnalysis?.flags?.palm_oil_free && 
                          preferenceAnalysis?.flags?.gluten_free;

  return (
    <div className={`${styles.container} ${allChecksPassed ? styles.containerSuccess : styles.containerDanger}`}>
      <div className={styles.dataCard}>
          {statusCode && statusCode !== 200 && (
            <div className={styles.error}>
              Error {statusCode}
            </div>
          )}
          {product && (
            <>
              <div className={styles.productHeader}>
                <h1 className={styles.productName}>{product.name}</h1>
                {product.brand && (
                  <p className={styles.productBrand}>{product.brand}</p>
                )}
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Product Flags</h2>
                <div className={styles.flagsGrid}>
                  <div className={preferenceAnalysis?.flags?.sugar_free ? styles.flagPositive : styles.flagNegative}>
                    <span className={styles.flagIcon}>{preferenceAnalysis?.flags?.sugar_free ? '✓' : '✗'}</span>
                    <span>Sugar Free</span>
                  </div>
                  <div className={preferenceAnalysis?.flags?.palm_oil_free ? styles.flagPositive : styles.flagNegative}>
                    <span className={styles.flagIcon}>{preferenceAnalysis?.flags?.palm_oil_free ? '✓' : '✗'}</span>
                    <span>Palm Oil Free</span>
                  </div>
                  <div className={preferenceAnalysis?.flags?.gluten_free ? styles.flagPositive : styles.flagNegative}>
                    <span className={styles.flagIcon}>{preferenceAnalysis?.flags?.gluten_free ? '✓' : '✗'}</span>
                    <span>Gluten Free</span>
                  </div>
                </div>
              </div>

              {confidenceScore !== undefined && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Confidence</h2>
                  <div className={styles.confidenceBar}>
                    <div 
                      className={styles.confidenceFill} 
                      style={{ width: `${confidenceScore * 100}%` }}
                    />
                  </div>
                  <p className={styles.confidenceText}>
                    {(confidenceScore * 100).toFixed(1)}%
                  </p>
                </div>
              )}

              {externalSource && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Source of Information</h2>
                  <div className={styles.sourceInfo}>
                    <p className={styles.sourceName}>{externalSource.source}</p>
                    {externalSource.retrieved_at && (
                      <p className={styles.sourceDate}>
                        Retrieved: {new Date(externalSource.retrieved_at).toLocaleString()}
                      </p>
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
