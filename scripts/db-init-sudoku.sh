#!/bin/bash

# Database init script for Sudoku Webapp
# Creates and initializes PostgreSQL database

set -e

cd modules/sudoku-webapp

echo "🗄️  Initializing database..."

# Source .env.local if exists
if [ -f .env.local ]; then
  export $(cat .env.local | xargs)
fi

# Run database init script
bash database/init.sh

echo ""
echo "✅ Database setup completed!"
