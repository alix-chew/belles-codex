# Blue Ocean Kopi & Co.

A warm, modern multi-page website for **Blue Ocean Kopi & Co.**, a neighbourhood plant-based cafe at YKK Street in Singapore.

## Stack

- Vite
- React
- Tailwind CSS
- Supabase Auth
- lucide-react icons

## Supabase

Copy `.env.example` to `.env.local`, then add your Supabase publishable key.

```bash
VITE_SUPABASE_URL=https://zfchieymyntbmpiyixjo.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-public-key-here
```

See `SUPABASE_SETUP.md` for email verification, owner-assigned staff/manager/owner roles, and login-gated purchase setup.

## Run Locally

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

## Notes

The page uses cropped images rendered from the assignment PDF and stored in `public/images/`.

The pitch PRD is saved as `Blue_Ocean_Kopi_PRD_Pitch.pdf`.
