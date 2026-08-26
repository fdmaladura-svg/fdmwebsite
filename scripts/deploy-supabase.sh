#!/usr/bin/env bash
# Faith Dynamite Ministries — Supabase setup runner.
#
# 1) Copy supabase.env.example -> .env.supabase
# 2) Paste your real Supabase connection string into .env.supabase
# 3) Run: bash scripts/deploy-supabase.sh
#
# This applies the database schema (drizzle-kit push) and seeds the
# starter website content. It must run on a machine with IPv6 access
# (the Supabase direct host is IPv6-only) or with the pooler enabled.

set -euo pipefail

if [ ! -f .env.supabase ]; then
  echo "Missing .env.supabase"
  echo "Run: cp supabase.env.example .env.supabase"
  exit 1
fi

set -a
# shellcheck disable=SC1091
. ./.env.supabase
set +a

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is not set inside .env.supabase"
  exit 1
fi

echo "→ Applying database schema to Supabase..."
npx drizzle-kit push

echo "→ Seeding the starter website content..."
npx tsx scripts/seed.ts

echo ""
echo "✓ Supabase is ready."
echo "  Admin login: https://YOUR-DOMAIN/admin/login"
echo "  Demo Super Admin: admin@faithdynamite.org / FaithDynamite2026!"
echo "  IMPORTANT: replace the demo password before public launch:"
echo "    ADMIN_EMAIL=real@church.org ADMIN_PASSWORD=VeryStrong123! npx tsx scripts/create-admin.ts"
