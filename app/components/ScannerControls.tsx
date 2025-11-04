'use client';

import Button from './Button';

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
      <Button variant="secondary" onClick={onStop}>
        Stop Scanning
      </Button>
    );
  }

  if (hasStoppedManually) {
    return (
      <Button variant="primary" onClick={onStart} disabled={!selectedCamera}>
        Start Scanning
      </Button>
    );
  }

  return null;
}
