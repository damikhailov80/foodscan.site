# Database and Storage Setup

Complete guide for MongoDB database and MinIO/Cloudflare R2 storage configuration.

## Table of Contents

- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Storage Setup](#storage-setup)
- [Database Commands](#database-commands)
- [Storage Commands](#storage-commands)
- [Test Data](#test-data)
- [Database Schema](#database-schema)
- [Storage Architecture](#storage-architecture)
- [API Endpoints](#api-endpoints)
- [Production Setup](#production-setup)
- [Data Export/Import](#data-exportimport)
- [Troubleshooting](#troubleshooting)

## Environment Variables

Create `.env.local` in the project root:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/foodscan?retryWrites=true&w=majority

NODE_ENV=development
MINIO_ENDPOINT=http://localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
STORAGE_BUCKET_NAME=foodscan-products
```

## Database Setup

### MongoDB Atlas

1. Create account at [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster
3. Go to Database Access → Add Database User
4. Go to Network Access → Add IP Address (or `0.0.0.0/0` for development)
5. Get connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Add to `.env.local` as `MONGODB_URI`

## Storage Setup

### MinIO (Local Development)

MinIO provides S3-compatible storage for local development:

```bash
npm run storage:setup
```

Access MinIO Console: http://localhost:9001
- Login: `minioadmin` / `minioadmin`

The setup automatically:
- Starts MinIO in Docker
- Creates `foodscan-products` bucket
- Configures public access

## Database Commands

```bash
npm run db:seed          # Seed database with test products
npm run db:clean         # Delete all products from database
```

**`db:seed`** - Adds or updates test products:
- Creates `products` collection if it doesn't exist
- Adds unique index on `bar_code` field
- Inserts/updates 6 test products (3 with full data, 3 minimal)
- Uses upsert - updates existing products or creates new ones
- Safe operation - preserves other products in database

**`db:clean`** - Clears the database:
- Drops the entire `products` collection
- Removes all products and indexes
- Useful for starting fresh
- **Warning:** This deletes all data permanently

## Storage Commands

```bash
npm run storage:setup    # Start MinIO with Docker
npm run storage:stop     # Stop MinIO
npm run storage:download # Download test images from Open Food Facts
npm run storage:upload   # Upload test images to MinIO
npm run storage:reset    # Reset MinIO (delete all data and restart)
```

**Image workflow:**
1. `storage:download` - Downloads 6 product photos to `test-images/products/`
2. `storage:upload` - Uploads images from local folder to MinIO bucket

## Test Data

After running `npm run db:seed` and `npm run storage:upload`, you'll have:

**3 Products:**
1. **Nutella** (Ferrero) - Barcode: 1111
   - Energy: 539 kcal (2255 kJ)
   - Fat: 30.9g, Carbs: 57.5g, Protein: 6.3g, Salt: 0.107g

2. **Coca-Cola Original Taste** (Coca-Cola) - Barcode: 2222
   - Energy: 42 kcal (180 kJ)
   - Fat: 0g, Carbs: 10.6g, Protein: 0g, Salt: 0g

3. **Nature Yogurt** (Danone) - Barcode: 3333
   - Energy: 74 kcal (272 kJ)
   - Fat: 3.0g, Carbs: 7.0g, Protein: 4.8g, Salt: 0.07g

**6 Product Photos:**
- Front labels and nutrition facts for each product
- Downloaded from Open Food Facts
- Stored in MinIO bucket at `products/XXXX-{front|nutrition}.jpg`

## Database Schema

### Products Collection

```typescript
{
  _id: ObjectId,
  bar_code: string,
  product_name: string,
  brand_name: string,
  nutrition: {
    energy_kcal: number | null,
    energy_kj: number | null,
    fat: number | null,
    carbohydrates: number | null,
    protein: number | null,
    salt: number | null
  },
  photos: {
    front: string | null,
    nutrition: string | null
  }
}
```

**Indexes:**
- `bar_code`: Unique index for fast lookups

**Notes:**
- All nutritional values are per 100g or 100ml
- Photo URLs are absolute URLs to MinIO/R2 storage
- `bar_code` field has unique constraint to prevent duplicates

## Storage Architecture

### Local Development (MinIO)

- **Type:** S3-compatible object storage
- **Docker:** Runs in container via `docker-compose.yml`
- **API Endpoint:** `http://localhost:9000`
- **Web Console:** `http://localhost:9001`
- **Credentials:** `minioadmin` / `minioadmin`
- **Bucket:** `foodscan-products`

### Production (Cloudflare R2)

- **Type:** S3-compatible cloud storage
- **Auto-switch:** Based on `NODE_ENV`
- **CDN:** Global edge network
- **Public URLs:** Via custom domain

### Storage Structure

```
Bucket: foodscan-products
└── products/
    ├── 1111-front.jpg
    ├── 1111-nutrition.jpg
    ├── 2222-front.jpg
    ├── 2222-nutrition.jpg
    ├── 3333-front.jpg
    └── 3333-nutrition.jpg
```

### Photo URLs

**Local Development:**
```
http://localhost:9000/foodscan-products/products/{barcode}-{type}.jpg
```

**Production:**
```
https://{R2_PUBLIC_DOMAIN}/products/{barcode}-{type}.jpg
```

## API Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/[barcode]` - Get product by barcode
- `POST /api/products/[barcode]/photo` - Upload product photo

**Upload photo example:**
```bash
curl -X POST http://localhost:3000/api/products/1111/photo \
  -F "photo=@test-images/products/1111-front.jpg" \
  -F "type=front"
```

**Response:**
```json
{
  "success": true,
  "url": "http://localhost:9000/foodscan-products/products/1111-front.jpg",
  "barcode": "1111",
  "type": "front"
}
```

## Production Setup

### MongoDB Atlas (Production)

1. Create production cluster
2. Configure Network Access with allowed IPs
3. Create database user with appropriate permissions
4. Get connection string
5. Add to Vercel environment variables as `MONGODB_URI`

### Cloudflare R2

**1. Create R2 Bucket:**
1. Login to Cloudflare Dashboard
2. Go to R2 Object Storage
3. Create new bucket: `foodscan-products`
4. Configure public access domain

**2. Generate API Tokens:**
1. Go to R2 → Manage R2 API Tokens
2. Create new API token with Object Read & Write permissions
3. Save credentials:
   - Access Key ID
   - Secret Access Key
   - Account ID

**3. Vercel Environment Variables:**

Add to your Vercel project settings:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_PUBLIC_DOMAIN=your_domain.r2.dev
STORAGE_BUCKET_NAME=foodscan-products
```

## Data Export/Import

### Install MongoDB Database Tools

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-database-tools
```

**Verify:**
```bash
mongoexport --version
mongoimport --version
```

### Export Data

**Export all products:**
```bash
mongoexport --uri="mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<db>" \
  --collection=products \
  --jsonArray \
  --pretty \
  --out=products-export.json
```

**Export specific products:**
```bash
mongoexport --uri="mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<db>" \
  --collection=products \
  --query='{"brand_name": "Ferrero"}' \
  --jsonArray \
  --out=ferrero-products.json
```

**Export specific fields:**
```bash
mongoexport --uri="mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<db>" \
  --collection=products \
  --fields=bar_code,product_name,brand_name \
  --jsonArray \
  --out=products-basic.json
```

### Import Data

```bash
mongoimport --uri="mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<db>" \
  --collection=products \
  --file=products-export.json \
  --jsonArray \
  --mode=upsert \
  --upsertFields=bar_code
```

### Import Options

- `--jsonArray` - Export/import as JSON array format
- `--pretty` - Format JSON with indentation
- `--mode=upsert` - Update existing documents or insert new ones
- `--upsertFields=bar_code` - Use `bar_code` field to identify existing documents
- `--drop` - Drop the collection before importing (use with caution)

## Troubleshooting

### MongoDB Connection Issues

**TLS/SSL errors:**

The MongoDB client in `lib/mongodb.ts` is pre-configured with:
- TLS enabled by default
- Relaxed certificate validation for MongoDB Atlas compatibility
- Connection pooling and retry logic
- Proper timeout settings

**For mongoexport/mongoimport tools:**

Update tools:
```bash
brew upgrade mongodb-database-tools
```

Or use `--tlsInsecure` flag (temporary workaround):
```bash
mongoimport --uri="..." --tlsInsecure
```

**IP whitelist:**
1. Log in to MongoDB Atlas
2. Go to Network Access
3. Add your IP or use `0.0.0.0/0` for testing (not for production)

**Connection string issues:**
- Verify username and password are correct
- Ensure special characters in password are URL-encoded
- Check database name is specified
- Verify cluster hostname is correct

### MinIO Issues

**MinIO won't start:**
```bash
docker ps -a
docker-compose down
docker-compose up -d
```

**Upload fails:**
- Check MinIO is running: `docker ps`
- Verify images exist in `test-images/products/`
- Check image format (must be .jpg or .jpeg)
- Check bucket exists and has public policy

**Images not accessible:**
- Visit http://localhost:9001
- Login with `minioadmin` / `minioadmin`
- Check bucket `foodscan-products` exists
- Verify bucket policy allows public read access

**Storage commands fail:**
- Ensure Docker is running
- Check Docker has available resources (CPU, memory, disk)
- Try `npm run storage:reset` to reset everything

### Database Seeding Issues

**Duplicate key error:**
- Run `npm run db:clean` to clear database, then `npm run db:seed` to reseed
- Or manually delete products collection in MongoDB Atlas

**Connection timeout:**
- Check `.env.local` has correct `MONGODB_URI`
- Verify IP is whitelisted in MongoDB Atlas
- Check internet connection

## Security Notes

- Never commit `.env.local` to git
- Use environment-specific credentials
- MongoDB connection is encrypted via TLS
- MinIO credentials are for local development only
- Use strong passwords for production MongoDB users
- Restrict MongoDB Network Access to specific IPs in production

## Implementation Files

**Database:**
- `lib/mongodb.ts` - MongoDB connection with retry logic
- `lib/seed-data.ts` - Test product data
- `scripts/seed-db.ts` - Database seeding script
- `scripts/clean-db.ts` - Database cleanup script

**Storage:**
- `lib/storage.ts` - Storage abstraction (auto-switches MinIO/R2)
- `scripts/download-test-images.ts` - Download images from Open Food Facts
- `scripts/upload-test-images.ts` - Upload images to storage
- `docker-compose.yml` - MinIO Docker configuration
- `app/api/products/[barcode]/photo/route.ts` - Photo upload API

**Types:**
- `types/product.ts` - Product type definitions
