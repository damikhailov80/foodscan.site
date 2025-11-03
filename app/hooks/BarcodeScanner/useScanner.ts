import { useRef, useState, useCallback } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { useScannerCleanup } from './useScannerCleanup';

const SCANNER_ID = 'qr-reader';

export function useScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const { stopScanner } = useScannerCleanup(scannerRef);

  const stopScanning = useCallback(async () => {
    await stopScanner();
    setIsScanning(false);
  }, [stopScanner]);

  const startScanning = useCallback(async (
    cameraId: string,
    onSuccess: (decodedText: string) => void
  ) => {
    setError('');

    if (!cameraId) {
      setError('No camera selected');
      return;
    }

    setIsScanning(true);
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(SCANNER_ID);
      }

      const config = {
        fps: 10,
        qrbox: { width: 350, height: 250 },
        aspectRatio: 1.777778,
        formatsToSupport: [
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.CODE_93,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.DATA_MATRIX,
          Html5QrcodeSupportedFormats.AZTEC,
          Html5QrcodeSupportedFormats.PDF_417,
          Html5QrcodeSupportedFormats.ITF,
          Html5QrcodeSupportedFormats.CODABAR
        ],
        videoConstraints: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      await scannerRef.current.start(
        cameraId,
        config,
        async (decodedText) => {
          await stopScanning();
          onSuccess(decodedText);
        },
        () => {}
      );

    } catch (err) {
      setError(`Failed to start camera: ${err instanceof Error ? err.message : String(err)}`);
      setIsScanning(false);
    }
  }, [stopScanning]);

  const reset = useCallback(async (onReset: () => Promise<void>) => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        
        if (state === 2) {
          await scannerRef.current.stop();
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        await scannerRef.current.clear();
      } catch {}
    }
    
    scannerRef.current = null;
    setIsScanning(false);
    
    setTimeout(async () => {
      await onReset();
    }, 300);
  }, []);

  return {
    scannerId: SCANNER_ID,
    isScanning,
    error,
    startScanning,
    stopScanning,
    reset
  };
}
