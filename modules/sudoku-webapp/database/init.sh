#!/bin/bash

# Database initialization script
# Creates PostgreSQL database and initializes schema

set -e

DB_NAME="${DB_NAME:-sudoku_game}"
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"

echo "🗄️  Initializing Sudoku Webapp Database..."
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo "Host: $DB_HOST:$DB_PORT"

# Check if PostgreSQL is running
if ! pg_isready -h "$DB_HOST" -p "$DB_PORT" >/dev/null 2>&1; then
  echo "❌ PostgreSQL is not running or not accessible at $DB_HOST:$DB_PORT"
  echo "Start PostgreSQL and try again."
  exit 1
fi

# Create database if it doesn't exist
echo "📦 Creating database '$DB_NAME' (if not exists)..."
createdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME" 2>/dev/null || echo "Database already exists"

# Run migrations
echo "🔄 Running migrations..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f database/migrations/001-initial-schema.sql

# Optional: Seed initial data
# Uncomment to seed test data
# echo "🌱 Seeding initial data..."
# psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f database/seeds/001-initial-data.sql

echo "✅ Database initialized successfully!"
echo ""
echo "Connection string:"
echo "postgresql://$DB_USER:password@$DB_HOST:$DB_PORT/$DB_NAME"
