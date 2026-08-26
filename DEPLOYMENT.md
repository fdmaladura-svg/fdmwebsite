# Faith Dynamite Ministries — GitHub, Supabase and Vercel Deployment

This project is a Next.js App Router website and custom CMS using PostgreSQL through Drizzle ORM.

## 1. Push to GitHub

From your computer or deployment terminal:

```bash
git init
git add .
git commit -m "Initial Faith Dynamite Ministries website and CMS"
git branch -M main
git remote add origin https://github.com/YOUR-ORG/YOUR-REPO.git
git push -u origin main
```

If the repository already exists locally, only run:

```bash
git add .
git commit -m "Prepare Supabase and Vercel deployment"
git push
```

## 2. Supabase project — Faith Dynamite Ministries

This project is already connected to the church Supabase project:

```text
Project ref:  tqfoyyliyzxowashczjy
Host:         db.tqfoyyliyzxowashczjy.supabase.co
Port:         5432
Database:     postgres
User:         postgres
```

`DATABASE_URL` for Vercel:

```text
postgresql://postgres:YOUR-DB-PASSWORD@db.tqfoyyliyzxowashczjy.supabase.co:5432/postgres
```

> ⚠️ **IMPORTANT — enable the Connection Pooler.** The direct host (`db.…supabase.co`) is **IPv6-only**, but Vercel serverless functions and most build machines are IPv4-only. To make the app connect reliably:
>
> 1. Supabase dashboard → **Project Settings → Database → Connection Pooling** → enable **Supavisor / Session mode**.
> 2. Copy the pooler **Connection string** (port **6543**, username `postgres.tqfoyyliyzxowashczjy`, host `aws-0-<region>.pooler.supabase.com`).
> 3. Append `?sslmode=no-verify` (the Cloudflare/Supabase certificate chain is not trusted by Node's CA store).
>
> Example:
> ```
> postgresql://postgres.tqfoyyliyzxowashczjy:YOUR-PASSWORD@aws-0-<region>.pooler.supabase.com:6543/postgres?sslmode=no-verify
> ```
>
> 💡 Your password contains special characters (`@`, `!`). The app's `pg` driver handles the plain password, but if a tool rejects it, URL-encode it:
> `HE!S_gVeK8@ibiC` → `HE%21S_gVeK8%40ibiC`
>
> 💡 If you prefer to keep the direct URL, append `?sslmode=no-verify` too — but the app must then run somewhere with IPv6 egress.

### One-command setup

```bash
cp supabase.env.example .env.supabase
# edit .env.supabase and paste the real DATABASE_URL
bash scripts/deploy-supabase.sh
```

The script runs `drizzle-kit push` to create all 26 tables and then seeds the starter website content.

### No-command option (runs on the deployed website)

After the Vercel deployment is live, you can create the schema and seed the content from the deployed app itself:

```bash
curl -X POST https://YOUR-DOMAIN/api/setup \
  -H "x-setup-token: YOUR_DATABASE_SETUP_TOKEN" \
  -H "Content-Type: application/json"
```

`DATABASE_SETUP_TOKEN` is set on Vercel (ask your web administrator for the value). `GET /api/setup` shows the current database status.

## 3. Configure Vercel environment variables

In Vercel:

**Project → Settings → Environment Variables**

Add:

```text
DATABASE_URL=your Supabase PostgreSQL connection string
SESSION_SECRET=a long random secret
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
```

Optional Paystack:

```text
PAYSTACK_SECRET_KEY=sk_test_or_live_xxxxxxxxxxxxxxxxx
```

Generate a strong session secret:

```bash
openssl rand -base64 48
```

## 4. Apply database schema to Supabase

After setting `DATABASE_URL` locally to the Supabase database URL:

```bash
npm install
npx drizzle-kit push
```

Then seed initial website content:

```bash
npx tsx scripts/seed.ts
```

For production, create or replace the real Super Admin account:

```bash
ADMIN_NAME="Church Administrator" \
ADMIN_EMAIL="real-admin@church-domain.org" \
ADMIN_PASSWORD="Use-A-Very-Strong-Password-Here" \
ADMIN_ROLE="super_admin" \
npx tsx scripts/create-admin.ts
```

## 5. Supabase RLS hardening

After Drizzle creates the tables, open Supabase **SQL Editor** and run:

```bash
supabase-setup.sql
```

This enables Row Level Security on the tables. The public website and CMS currently use server-side Drizzle database access, so browser visitors do not query Supabase tables directly.

## 6. Deploy on Vercel

Option A — Git integration (recommended):

1. In Vercel, click **Add New → Project**.
2. Import the GitHub repository (`fdmaladura-svg/fdmwebsite`).
3. Confirm framework is **Next.js** and the team scope is `team_X8DHAqnfUk9Wy1kVnN8AT6v3`.
4. Add the environment variables from step 3.
5. Deploy.

Option B — CLI with a token:

```bash
VERCEL_TOKEN=your_vercel_token bash scripts/deploy-vercel.sh
```

This deploys to the church team scope `team_X8DHAqnfUk9Wy1kVnN8AT6v3`.

Vercel will run:

```bash
npm install
npm run build
```

## 7. Admin login after deployment

Open:

```text
https://your-domain.com/admin/login
```

Use the production Super Admin created with `scripts/create-admin.ts`.

For this prototype only, the seeded demo accounts are:

```text
admin@faithdynamite.org / FaithDynamite2026!
editor@faithdynamite.org / Editor2026!
```

Replace these before public launch.

## 8. Paystack webhook

If Paystack is enabled, set webhook URL in your Paystack dashboard:

```text
https://your-domain.com/api/paystack/webhook
```

The website verifies Paystack webhook signatures server-side and never stores card details.

## 9. GitHub repo

Remote is already configured:

```text
https://github.com/fdmaladura-svg/fdmwebsite.git
```

Push either with a personal access token:

```bash
git push -u origin main
```

or with the deploy SSH key (see the chat about the generated `fdm-deploy-bot` key).

A GitHub Actions CI workflow (`.github/workflows/ci.yml`) validates typegen, TypeScript and the production build on every push.

## 10. Recommended production checklist

- Replace generated placeholder logos with official supplied logo files in **Admin → Settings → Church Information**.
- Replace demo admin passwords.
- Add real church address/contact details.
- Add real bank details or turn bank transfer off.
- Add real social media links.
- Confirm Paystack secret key is set only on Vercel, never in source code.
- Confirm `NEXT_PUBLIC_SITE_URL` matches the final domain.
- Run `npx drizzle-kit push` after every schema change.
- Run `npx tsx scripts/seed.ts` only when you need the starter content.
