'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  const images = productData?.data?.images;
  
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handlePrevious = () => {
    if (selectedImageIndex !== null && images && images.length > 0) {
      setSelectedImageIndex((selectedImageIndex - 1 + images.length) % images.length);
    }
  };

  const handleNext = () => {
    if (selectedImageIndex !== null && images && images.length > 0) {
      setSelectedImageIndex((selectedImageIndex + 1) % images.length);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex !== null && images && images.length > 0) {
        if (e.key === 'ArrowLeft') {
          setSelectedImageIndex((selectedImageIndex - 1 + images.length) % images.length);
        } else if (e.key === 'ArrowRight') {
          setSelectedImageIndex((selectedImageIndex + 1) % images.length);
        } else if (e.key === 'Escape') {
          setSelectedImageIndex(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, images]);

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

              {images && images.length > 0 && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Product Images</h2>
                  <div className={styles.imageGallery}>
                    {images.map((imageUrl: string, index: number) => (
                      <div 
                        key={index} 
                        className={styles.imageThumbnail}
                        onClick={() => setSelectedImageIndex(index)}
                      >
                        <Image
                          src={imageUrl}
                          alt={`${productName} - ${index + 1}`}
                          width={150}
                          height={150}
                          className={styles.thumbnailImage}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

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

      {selectedImageIndex !== null && images && images[selectedImageIndex] && (
        <div className={styles.modal} onClick={() => setSelectedImageIndex(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setSelectedImageIndex(null)}>
              ✕
            </button>
            <div className={styles.fullImageWrapper}>
              <Image
                src={images[selectedImageIndex]}
                alt={productName || 'Product image'}
                fill
                className={styles.fullImage}
                sizes="90vw"
              />
            </div>
            {images.length > 1 && (
              <>
                <button 
                  className={`${styles.navButton} ${styles.navButtonLeft}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevious();
                  }}
                >
                  ‹
                </button>
                <button 
                  className={`${styles.navButton} ${styles.navButtonRight}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                >
                  ›
                </button>
                <div className={styles.imageCounter}>
                  {selectedImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

