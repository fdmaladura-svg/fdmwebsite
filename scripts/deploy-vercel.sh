#!/usr/bin/env bash
# Faith Dynamite Ministries — Vercel production deployment runner.
#
# 1) Create a Vercel access token: https://vercel.com/account/tokens
# 2) Run: VERCEL_TOKEN=your_token bash scripts/deploy-vercel.sh
#
# The scope below targets the church team. Your Vercel team id:
# team_X8DHAqnfUk9Wy1kVnN8AT6v3

set -euo pipefail

VERCEL_TOKEN="${VERCEL_TOKEN:?Set VERCEL_TOKEN to your Vercel access token}"
SCOPE="${VERCEL_SCOPE:-team_X8DHAqnfUk9Wy1kVnN8AT6v3}"

echo "→ Deploying to Vercel (scope: ${SCOPE})..."
npx vercel deploy --prod --yes --token "$VERCEL_TOKEN" --scope "$SCOPE"

echo ""
echo "✓ Deployed. Remember to set these environment variables in Vercel:"
echo "    DATABASE_URL  (your Supabase connection string)"
echo "    SESSION_SECRET (long random value, openssl rand -base64 48)"
echo "    NEXT_PUBLIC_SITE_URL (your final domain)"
echo "  Optional: PAYSTACK_SECRET_KEY"
