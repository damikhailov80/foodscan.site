'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Html5Qrcode } from 'html5-qrcode';
import { useCameraDevices } from '../hooks/BarcodeScanner/useCameraDevices';
import { useScannerCleanup } from '../hooks/BarcodeScanner/useScannerCleanup';
import { useScannerInit } from '../hooks/BarcodeScanner/useScannerInit';
import ScannerControls from './ScannerControls';
import styles from './BarcodeScanner.module.css';

export default function BarcodeScanner() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [hasStoppedManually, setHasStoppedManually] = useState(false);
  const hasAutoStarted = useRef(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerId = 'qr-reader';

  const { selectedCamera, permissionDenied } = useCameraDevices();
  const { stopScanner } = useScannerCleanup(scannerRef);

  const stopScanning = async () => {
    await stopScanner();
    setIsScanning(false);
    setHasStoppedManually(true);
  };

  const startScanning = () => {
    setError('');

    if (!selectedCamera) {
      setError('No camera selected');
      return;
    }

    setIsScanning(true);
  };

  useEffect(() => {
    if (selectedCamera && !isScanning && !hasStoppedManually && !hasAutoStarted.current) {
      hasAutoStarted.current = true;
      startScanning();
    }
  }, [selectedCamera]);

  const handleScanSuccess = (decodedText: string) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(200);
    }
    router.push(`/product/${encodeURIComponent(decodedText)}`);
  };

  useScannerInit({
    isScanning,
    selectedCamera,
    scannerRef,
    scannerId,
    onScanSuccess: handleScanSuccess,
    setError,
    setIsScanning,
    stopScanning
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Barcode Scanner</h1>

      {permissionDenied && (
        <div className={styles.error}>
          Camera access denied. Please allow camera permissions in your browser settings to use the scanner.
        </div>
      )}

      <ScannerControls
        isScanning={isScanning}
        hasStoppedManually={hasStoppedManually}
        selectedCamera={selectedCamera}
        onStart={startScanning}
        onStop={stopScanning}
      />

      {isScanning && (
        <div className={styles.videoContainer}>
          <div 
            id={scannerId} 
            style={{ 
              width: '100%',
              maxWidth: '800px',
              margin: '0 auto'
            }}
          ></div>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}
    </div>
  );
}

