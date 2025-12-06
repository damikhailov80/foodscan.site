# FoodScan

Barcode scanner application for product information.

## PWA Installation

The app can be installed on mobile and desktop devices:

1. Open the app in a browser (Chrome, Safari, Edge)
2. A prompt will appear at the bottom of the screen
3. Click "Install" to add the app to your home screen

### Manual Installation

**iOS (Safari):**
1. Tap the Share button
2. Scroll down and tap "Add to Home Screen"
3. Tap "Add"

**Android (Chrome):**
1. Tap the menu (three dots)
2. Tap "Add to Home Screen"
3. Tap "Add"

**Desktop (Chrome/Edge):**
1. Click the install icon in the address bar
2. Or visit `chrome://apps` to manage installed apps

### Uninstall PWA

**Desktop:**
1. Visit `chrome://apps` (or `edge://apps`)
2. Right-click on FoodScan → Uninstall
3. Or click the install icon in address bar → Uninstall

**Mobile:**
1. Long press the app icon on home screen
2. Select "Uninstall" or "Remove"

## Development

### Quick Start

```bash
npm install
npm run storage:setup
npm run storage:download
npm run storage:upload
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

See [DATABASE.md](DATABASE.md) for detailed setup instructions.

### Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/foodscan?retryWrites=true&w=majority

NODE_ENV=development
MINIO_ENDPOINT=http://localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
STORAGE_BUCKET_NAME=foodscan-products
```

See [DATABASE.md](DATABASE.md) for MongoDB Atlas setup.

### Running the App

**HTTP (development):**
```bash
npm run dev
```

**HTTPS (for camera access):**
```bash
npm run dev:https
```

### Build

```bash
npm run build
npm start
```

### Available Commands

```bash
npm run dev              # Start development server (HTTP)
npm run dev:https        # Start development server (HTTPS)
npm run build            # Build for production
npm run start            # Start production server

npm run db:seed          # Seed database with test data
npm run db:reset         # Delete all data and reseed

npm run storage:setup    # Start MinIO (local storage)
npm run storage:stop     # Stop MinIO
npm run storage:download # Download test images
npm run storage:upload   # Upload test images
npm run storage:reset    # Reset MinIO
```

## PWA Features

- Offline support with service worker
- Install prompt for easy home screen addition
- Standalone display mode
- Optimized for mobile devices

## Icons

Replace placeholder icons in `/public`:
- `icon-192.png` - 192x192px
- `icon-512.png` - 512x512px
