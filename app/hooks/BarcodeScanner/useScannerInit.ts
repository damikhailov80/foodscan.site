import { useEffect, RefObject } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

interface UseScannerInitProps {
  isScanning: boolean;
  selectedCamera: string;
  scannerRef: RefObject<Html5Qrcode | null>;
  scannerId: string;
  onScanSuccess: (decodedText: string) => void;
  setError: (error: string) => void;
  setIsScanning: (isScanning: boolean) => void;
  stopScanning: () => Promise<void>;
}

export function useScannerInit({
  isScanning,
  selectedCamera,
  scannerRef,
  scannerId,
  onScanSuccess,
  setError,
  setIsScanning,
  stopScanning
}: UseScannerInitProps) {

  useEffect(() => {
    if (!isScanning || !selectedCamera) return;

    const initScanner = async () => {
      try {
        if (!scannerRef.current) {
          scannerRef.current = new Html5Qrcode(scannerId);
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
          selectedCamera,
          config,
          async (decodedText) => {
            await stopScanning();
            onScanSuccess(decodedText);
          },
          () => {}
        );

      } catch (err) {
        setError(`Failed to start camera: ${err instanceof Error ? err.message : String(err)}`);
        setIsScanning(false);
      }
    };

    initScanner();
  }, [isScanning, selectedCamera, scannerRef, scannerId, onScanSuccess, setError, setIsScanning, stopScanning]);
}
