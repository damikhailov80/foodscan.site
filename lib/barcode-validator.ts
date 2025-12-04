const DEV_EXCEPTIONS = ['11', '22', '33', '44', '111', '222', '333', '444', '1111', '2222', '3333', '4444'];

function calculateEAN13Checksum(barcode: string): number {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(barcode[i]);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  return (10 - (sum % 10)) % 10;
}

function calculateEAN8Checksum(barcode: string): number {
  let sum = 0;
  for (let i = 0; i < 7; i++) {
    const digit = parseInt(barcode[i]);
    sum += i % 2 === 0 ? digit * 3 : digit;
  }
  return (10 - (sum % 10)) % 10;
}

function calculateUPCAChecksum(barcode: string): number {
  let sum = 0;
  for (let i = 0; i < 11; i++) {
    const digit = parseInt(barcode[i]);
    sum += i % 2 === 0 ? digit * 3 : digit;
  }
  return (10 - (sum % 10)) % 10;
}

export function validateBarcodeChecksum(barcode: string): boolean {
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev && DEV_EXCEPTIONS.includes(barcode)) {
    return true;
  }

  if (!/^\d+$/.test(barcode)) {
    return false;
  }

  const length = barcode.length;

  if (length === 13) {
    const checksum = calculateEAN13Checksum(barcode);
    return checksum === parseInt(barcode[12]);
  }

  if (length === 8) {
    const checksum = calculateEAN8Checksum(barcode);
    return checksum === parseInt(barcode[7]);
  }

  if (length === 12) {
    const checksum = calculateUPCAChecksum(barcode);
    return checksum === parseInt(barcode[11]);
  }

  return false;
}
