# FanFlow

Find where Toronto fans are **actually going** to watch FIFA World Cup 2026 matches.

FanFlow layers crowd-intent ("48 Going") on top of venue listings. Venue catalog data is manually curated from [Watch Party Radar](https://watchpartyradar.com/?city=toronto) by Dashmote.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (Auth + PostgreSQL + RLS)
- Vercel (deployment)

## Security & npm

- Only install packages from trusted sources (official Next.js, Supabase, etc.)
- Use `package-lock.json` — run `npm ci` in production, not `npm install`
- Never commit `.env.local` or service role keys
- Run `npm run audit:prod` before deploying

## Local setup

### 1. Install dependencies

```bash
npm ci
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in your Supabase keys:

```bash
cp .env.example .env.local
```

Get keys from **Supabase → Project Settings → API**.

### 3. Run database migrations

In **Supabase → SQL Editor**, run these files **in order**:

1. `supabase/migrations/001_schema.sql`
2. `supabase/migrations/002_rls.sql`
3. `supabase/migrations/003_seed.sql`
4. `supabase/migrations/004_fix_view_security.sql` (if not already run)

### 3b. Update matches during the tournament

See [`supabase/match-updates/README.md`](supabase/match-updates/README.md). Run the latest dated SQL file (e.g. `2026-07-01.sql`) daily to refresh the bracket.

### 4. Configure OAuth (Checkpoint 3)

In Supabase **Authentication → Providers**, enable Google and GitHub.

Add redirect URL: `http://localhost:3000/auth/callback`

### 5. Start dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Add the same env vars from `.env.local`
4. Add production redirect URL in Supabase: `https://your-app.vercel.app/auth/callback`

## Project structure

```
src/app/           Pages and API routes
src/components/    UI components
src/lib/           Supabase clients, validation, helpers
supabase/migrations/  SQL schema, RLS, seed data
```

## License

Private project.
