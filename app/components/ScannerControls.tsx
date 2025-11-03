'use client';

import styles from './ScannerControls.module.css';

interface ScannerControlsProps {
  isScanning: boolean;
  hasStoppedManually: boolean;
  selectedCamera: string | null;
  onStart: () => void;
  onStop: () => void;
}

export default function ScannerControls({
  isScanning,
  hasStoppedManually,
  selectedCamera,
  onStart,
  onStop
}: ScannerControlsProps) {
  if (isScanning) {
    return (
      <button 
        className={`${styles.button} ${styles.buttonStop}`}
        onClick={onStop}
      >
        Stop Scanning
      </button>
    );
  }

  if (hasStoppedManually) {
    return (
      <button 
        className={`${styles.button} ${styles.buttonStart}`}
        onClick={onStart}
        disabled={!selectedCamera}
      >
        Start Scanning
      </button>
    );
  }

  return null;
}
