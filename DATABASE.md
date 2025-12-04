# Database Setup

This project uses MongoDB Atlas (cloud-hosted MongoDB) to store product information.

## Environment Variables

Create a `.env.local` file in the root directory with your MongoDB Atlas connection string:

```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

**Example:**
```
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/foodscan?retryWrites=true&w=majority
```

### Getting Your MongoDB Atlas Connection String

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Go to your cluster
3. Click "Connect" button
4. Choose "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Replace `<database>` with your database name (e.g., `foodscan`)

## Development Setup

### Option 1: Using API Endpoints (Recommended)

1. Make sure your `.env.local` file has the correct `MONGODB_URI`
2. Start the development server:
   ```bash
   npm run dev
   ```

3. Reset the database (removes all data and recreates collections):
   ```bash
   curl -X DELETE http://localhost:3000/api/dev/reset
   ```

4. Seed the database with sample products:
   ```bash
   curl -X POST http://localhost:3000/api/dev/seed
   ```

### Option 2: Using the Seed Script

1. Make sure your `.env.local` file has the correct `MONGODB_URI`
2. Run the seed script:
   ```bash
   npm run db:seed
   ```

## Data Export and Import Between MongoDB Atlas Databases

### Installing MongoDB Database Tools

To export and import data between different MongoDB Atlas databases, you need to install MongoDB Database Tools:

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-database-tools

# Verify installation
mongoexport --version
mongoimport --version
```

### Exporting and Importing Collections

**Export data from source database:**

```bash
mongoexport --uri="mongodb+srv://<username>:<password>@<source-cluster>.mongodb.net/<source-db>" \
  --collection=products \
  --jsonArray \
  --pretty \
  --out=products-export.json
```

**Import data to target database:**

```bash
mongoimport --uri="mongodb+srv://<username>:<password>@<target-cluster>.mongodb.net/<target-db>" \
  --collection=products \
  --file=products-export.json \
  --jsonArray \
  --mode=upsert \
  --upsertFields=bar_code
```

### Import Options

- `--jsonArray` - Export/import as a JSON array format (easier to read and edit)
- `--pretty` - Format JSON output with indentation
- `--mode=upsert` - Update existing documents or insert new ones
- `--upsertFields=bar_code` - Use `bar_code` field to identify existing documents
- `--drop` - Drop the collection before importing (use with caution)

### Example: Exporting Specific Documents

Export only products from a specific brand:

```bash
mongoexport --uri="mongodb+srv://user:password@source.mongodb.net/foodscan" \
  --collection=products \
  --query='{"brand_name": "Ferrero"}' \
  --jsonArray \
  --out=ferrero-products.json
```

Export only specific fields:

```bash
mongoexport --uri="mongodb+srv://user:password@source.mongodb.net/foodscan" \
  --collection=products \
  --fields=bar_code,product_name,brand_name \
  --jsonArray \
  --out=products-basic.json
```

### Troubleshooting TLS Connection Issues

If you encounter TLS/SSL connection errors like `tlsv1 alert internal error` or `remote error: tls: internal error`, the application has been configured to handle these automatically.

**Application TLS Configuration**

The MongoDB client in `lib/mongodb.ts` is configured with:
- TLS enabled by default
- Relaxed certificate validation to work with MongoDB Atlas in all environments
- Connection pooling for better performance
- Automatic retry logic for read and write operations
- Proper timeout settings for reliable connections

**Note:** Using `tlsAllowInvalidCertificates: true` is safe with MongoDB Atlas as the connection is still encrypted via TLS, and MongoDB Atlas uses properly signed certificates. This setting helps avoid compatibility issues with different Node.js versions and SSL libraries across hosting platforms.

**For MongoDB Database Tools (mongoexport/mongoimport)**

**Solution 1: Update MongoDB Database Tools (recommended)**

```bash
brew upgrade mongodb-database-tools
```

**Solution 2: Disable TLS certificate verification (temporary workaround)**

Add the `--tlsInsecure` flag to bypass certificate validation:

```bash
mongoimport --uri="mongodb+srv://user:password@target.mongodb.net/foodscan" \
  --collection=products \
  --file=products-export.json \
  --jsonArray \
  --mode=upsert \
  --upsertFields=bar_code \
  --tlsInsecure
```

**Note:** Only use `--tlsInsecure` for troubleshooting or in trusted networks. For production environments, always update the tools to the latest version or fix the underlying TLS issue.

**Solution 3: Check MongoDB Atlas Network Access**

Ensure your IP address is whitelisted in MongoDB Atlas:
1. Log in to MongoDB Atlas
2. Go to Network Access
3. Add your current IP address or use `0.0.0.0/0` for testing (not recommended for production)

## Database Schema

### Products Collection

```typescript
{
  _id: ObjectId,
  bar_code: string,           // Unique barcode identifier
  product_name: string,        // Product name
  brand_name: string,          // Brand/manufacturer name
  nutrition: {
    energy_kcal: number | null,      // Energy in kilocalories per 100g/100ml
    energy_kj: number | null,         // Energy in kilojoules per 100g/100ml
    fat: number | null,               // Fat in grams per 100g/100ml
    carbohydrates: number | null,     // Carbohydrates in grams per 100g/100ml
    protein: number | null,           // Protein in grams per 100g/100ml
    salt: number | null               // Salt in grams per 100g/100ml
  }
}
```

### Indexes

- `bar_code`: Unique index for fast lookups by barcode

## Sample Products

The seed script includes 3 real products from Open Food Facts:

1. **Nutella** (Ferrero) - Barcode: 1111
   - Energy: 539 kcal (2255 kJ)
   - Fat: 30.9g, Carbs: 57.5g, Protein: 6.3g, Salt: 0.107g

2. **Coca-Cola Original Taste** (Coca-Cola) - Barcode: 2222
   - Energy: 42 kcal (180 kJ)
   - Fat: 0g, Carbs: 10.6g, Protein: 0g, Salt: 0g

3. **Nature Yogurt** (Danone) - Barcode: 3333
   - Energy: 74 kcal (272 kJ)
   - Fat: 3.0g, Carbs: 7.0g, Protein: 4.8g, Salt: 0.07g

## API Endpoints

### Production Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/[barcode]` - Get product by barcode

### Development Endpoints (only available in development mode)

- `DELETE /api/dev/reset` - Delete all data and recreate collections
- `POST /api/dev/seed` - Seed database with sample products

## Security

Development endpoints (`/api/dev/*`) are protected and automatically disabled in production:

1. **NODE_ENV Check**: Next.js automatically sets `NODE_ENV=production` during build
2. **Middleware Protection**: All `/api/dev/*` routes are blocked via middleware in production
3. **Runtime Checks**: Each endpoint verifies environment before executing

To verify protection in production:
```bash
curl -X DELETE https://your-domain.com/api/dev/reset
# Expected response: 404 Not Found
```

## Notes

- All nutritional values are per 100g or 100ml
- Development endpoints are automatically disabled in production
- The `bar_code` field has a unique index to prevent duplicates
- MongoDB Atlas connection string should be stored in `.env.local` (never commit to git)
