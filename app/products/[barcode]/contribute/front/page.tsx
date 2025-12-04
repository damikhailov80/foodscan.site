'use client';

import { use, useState, useRef, useEffect, DragEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './UploadPhoto.module.css';

export default function UploadFrontPhotoPage({ params }: { params: Promise<{ barcode: string }> }) {
  const { barcode } = use(params);
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleChoosePhoto = () => {
    fileInputRef.current?.click();
  };

  const handleMakePhoto = () => {
    cameraInputRef.current?.click();
  };

  const handleSendPhoto = async () => {
    if (!selectedFile || !selectedImage) {
      alert('Please select a photo first');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('barcode', barcode);
      formData.append('type', 'front');
      formData.append('photo', selectedFile);

      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percentComplete);
        }
      });

      // Handle response
      const uploadPromise = new Promise((resolve, reject) => {
        xhr.addEventListener('load', () => {
          if (xhr.status === 202) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (e) {
              reject(new Error('Invalid response format'));
            }
          } else if (xhr.status === 409) {
            reject(new Error('Duplicate barcode'));
          } else if (xhr.status === 400) {
            reject(new Error('Invalid data'));
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Network error'));
        });

        xhr.addEventListener('abort', () => {
          reject(new Error('Upload aborted'));
        });
      });

      xhr.open('POST', `${process.env.NEXT_PUBLIC_EXTERNAL_API_URL}/api/v1/contributions`);
      xhr.send(formData);

      const response = await uploadPromise as { submission_id: string };
      
      router.push(`/products/${barcode}/contribute/${response.submission_id}/verify`);
      
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload photo. Please try again.';
      alert(errorMessage);
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button 
          onClick={() => router.back()} 
          className={styles.backButton}
          aria-label="Go back"
        >
          ← Back
        </button>
        <h1 className={styles.title}>Upload Front Photo</h1>
      </div>

      <div 
        className={`${styles.dropZone} ${isDragging ? styles.dragging : ''} ${selectedImage ? styles.hasImage : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {selectedImage ? (
          <div className={styles.imagePreview}>
            <img src={selectedImage} alt="Selected product" />
            <button 
              className={styles.removeButton}
              onClick={() => {
                setSelectedImage(null);
                setSelectedFile(null);
              }}
            >
              ✕ Remove
            </button>
          </div>
        ) : (
          <div className={styles.dropZoneContent}>
            <div className={styles.uploadIcon}>📸</div>
            <p className={styles.dropZoneText}>
              Drag and drop photo here
            </p>
            <p className={styles.dropZoneSubtext}>
              or use buttons below
            </p>
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <div className={styles.buttonGroup}>
          {isMobile && (
            <button 
              className={`${styles.button} ${styles.buttonCamera}`}
              onClick={handleMakePhoto}
              disabled={isUploading}
            >
              📷 Make Photo
            </button>
          )}
          
          <button 
            className={`${styles.button} ${styles.buttonChoose}`}
            onClick={handleChoosePhoto}
            disabled={isUploading}
          >
            🖼️ Choose Photo
          </button>
        </div>

        <button 
          className={`${styles.button} ${styles.buttonSend}`}
          onClick={handleSendPhoto}
          disabled={!selectedImage || isUploading}
        >
          {isUploading ? 'Uploading...' : '✓ Send Photo'}
        </button>

        {isUploading && (
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className={styles.progressText}>{uploadProgress}%</p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
    </div>
  );
}

