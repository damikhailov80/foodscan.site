import { useEffect, RefObject, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export function useScannerCleanup(scannerRef: RefObject<Html5Qrcode | null>) {
  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch {}
    }
  }, [scannerRef]);

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, [stopScanner]);

  return { stopScanner };
}
