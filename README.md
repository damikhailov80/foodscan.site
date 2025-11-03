# Food Barcode Scanner

A barcode scanner application for food products to identify allergens, preservatives, and other ingredients.

## Features

- Real-time barcode scanning using device camera
- Product information lookup
- Allergen detection
- Preservative identification
- Mobile-first responsive design

## Technology Stack

- Next.js
- React
- TypeScript
- HTTPS support for camera access

## Getting Started

### Prerequisites

- Node.js installed
- HTTPS certificates for local development (camera access requires secure context)

### Installation

```bash
npm install
```

### HTTPS Setup

Camera access requires HTTPS. Generate local SSL certificates using mkcert:

1. Install mkcert:
```bash
brew install mkcert
mkcert -install
```

2. Create certificates directory:
```bash
mkdir certificates
```

3. Generate certificates for localhost only:
```bash
mkcert -key-file certificates/localhost-key.pem -cert-file certificates/localhost.pem localhost 127.0.0.1 ::1
```

4. For mobile testing, find your local IP address:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

5. Generate certificates including your local IP:
```bash
mkcert -key-file certificates/localhost-key.pem -cert-file certificates/localhost.pem localhost 127.0.0.1 ::1 192.168.x.x
```

Replace `192.168.x.x` with your actual local IP address from step 4.

6. Trust the certificates on your mobile device:
   - The server will display the network URL when started
   - On mobile, you may need to trust the certificate in device settings

### Development

```bash
npm run dev
```

The application will run on:
- Local: `https://localhost:3000`
- Network: `https://[your-local-ip]:3000`

## Usage

1. Open the application on your mobile device or desktop
2. Grant camera permissions when prompted
3. Point your camera at a food product barcode
4. View product information including allergens and preservatives
