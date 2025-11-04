import { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export function useCameraDevices() {
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        const backCamera = devices.find(d => 
          d.label.toLowerCase().includes('back') || 
          d.label.toLowerCase().includes('rear')
        );
        setSelectedCamera(backCamera?.id || devices[0].id);
        setPermissionDenied(false);
      }
    }).catch((err) => {
      if (err?.name === 'NotAllowedError' || err?.message?.includes('Permission')) {
        setPermissionDenied(true);
      }
    });
  }, []);

  return { selectedCamera, permissionDenied };
}
