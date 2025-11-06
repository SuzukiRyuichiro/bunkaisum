# Bunkaisum

A Nuxt 4 application with Prisma ORM and Cloudflare D1 database.

## Prerequisites

- [Bun](https://bun.sh/) (package manager)
- [Cloudflare account](https://dash.cloudflare.com/) (for D1 database)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

## Setup

Make sure to install dependencies:

```bash
bun install
```

## Database Setup

This project uses **Prisma ORM** with:
- **Local Development:** SQLite database (`prisma/dev.db`)
- **Production:** Cloudflare D1 database

### Initial Setup

1. **Create your local database:**
```bash
# Generate Prisma Client and create local database
bunx prisma generate
bunx prisma migrate dev --name init
```

2. **Seed the database (optional):**
```bash
bunx prisma db seed
```

### Local Development Workflow

For local development, use standard Prisma commands:

```bash
# Create a new migration after schema changes
bunx prisma migrate dev --name your_migration_name

# Open Prisma Studio to view/edit data
bunx prisma studio

# Reset database (delete all data and re-run migrations)
bunx prisma migrate reset
```

Your local database is stored at `prisma/dev.db` and configured via `DATABASE_URL` in `.env`.

### Production (Cloudflare D1) Setup

#### One-time Setup

1. **Create a D1 database:**
```bash
bunx wrangler d1 create bunkaisum-db
```

2. **Copy the database ID** from the output and update `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "bunkaisum-db"
database_id = "your-database-id-here"  # Replace with actual ID
```

#### Applying Migrations to D1

When you create a new migration locally, you need to apply it to D1:

**Option 1: Generate and Apply SQL (Recommended)**

```bash
# 1. Create migration locally (if not done already)
bunx prisma migrate dev --name your_migration_name

# 2. Generate SQL for D1 from your latest migration
bunx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel ./prisma/schema.prisma \
  --script \
  --output migrations/d1_migration.sql

# 3. Apply to D1 (remote/production)
bunx wrangler d1 execute bunkaisum-db --remote --file=migrations/d1_migration.sql
```

**Option 2: Apply All Migrations at Once**

If you have multiple Prisma migrations to sync:

```bash
# Apply all migration files to D1
for file in ./prisma/migrations/*/migration.sql; do
  echo "Applying migration: $file"
  bunx wrangler d1 execute bunkaisum-db --remote --file="$file"
done
```

#### Checking D1 Database

```bash
# List all D1 databases
bunx wrangler d1 list

# Check database schema
bunx wrangler d1 execute bunkaisum-db --remote --command="SELECT name FROM sqlite_master WHERE type='table';"

# View table structure
bunx wrangler d1 execute bunkaisum-db --remote --command="PRAGMA table_info(User);"
```

### Migration Workflow Summary

```
┌─────────────────────────────────────────────────────────────┐
│                   Development Workflow                       │
└─────────────────────────────────────────────────────────────┘

1. Edit prisma/schema.prisma
2. Run: prisma migrate dev --name description
   → Creates migration files in prisma/migrations/
   → Applies to local SQLite (prisma/dev.db)
3. Test locally with: bun run dev

┌─────────────────────────────────────────────────────────────┐
│                   Production Deployment                      │
└─────────────────────────────────────────────────────────────┘

1. Generate SQL for D1:
   prisma migrate diff --from-empty --to-schema-datamodel \
     ./prisma/schema.prisma --script --output migrations/d1.sql

2. Apply to D1:
   wrangler d1 execute bunkaisum-db --remote --file=migrations/d1.sql

3. Deploy application:
   bun run build
   bunx wrangler --cwd .output deploy
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
bun run dev
```

## Production

Build the application for production:

```bash
bun run build
```

Deploy to Cloudflare Workers:

```bash
bunx wrangler --cwd .output deploy
```

Locally preview production build:

```bash
bun run preview
```

Check out the [Nuxt deployment documentation](https://nuxt.com/docs/getting-started/deployment) and [Cloudflare Workers documentation](https://developers.cloudflare.com/workers/) for more information.
