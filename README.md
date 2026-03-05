# Arduino Ressursside

En ressurs-side for studenter som jobber med Arduino og fysisk interaksjon.

Bygget med:

- Next.js
- TypeScript
- TailwindCSS
- Supabase

## Features

- Ressursbibliotek
- Markdown-basert innhold
- Admin-panel
- Bildeopplasting
- Filtrering av ressurser

## Lokal utvikling

Installer dependencies:

```bash
npm install
```

Lag `.env.local` basert på `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Start dev-server:

```bash
npm run dev
```

Åpne:

```
http://localhost:3000
```

## Admin

Admin finnes på:

```
/admin
```

Tilgang styres via Supabase RLS policies.
# arduinoresources
