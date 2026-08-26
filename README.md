# Faith Dynamite Ministries (Aladura)

A production-ready Next.js website and custom CMS for **Faith Dynamite Ministries (Aladura)**, a member of **Cherubim and Seraphim Movement Church (Ayo Ni O)**.

## Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- PostgreSQL via Drizzle ORM
- Supabase-ready database deployment
- Vercel-ready hosting
- Server-side Paystack integration

## Local development

```bash
npm install
npx drizzle-kit push
npx tsx scripts/seed.ts
npm run dev
```

Open:

```text
http://localhost:3000
http://localhost:3000/admin/login
```

Demo admin accounts:

```text
Super Admin: admin@faithdynamite.org / FaithDynamite2026!
Editor: editor@faithdynamite.org / Editor2026!
```

## Production deployment

See [`DEPLOYMENT.md`](./DEPLOYMENT.md).
