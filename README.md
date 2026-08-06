# Portfolio Caroline Senyk

[![CI](https://github.com/YoannDrx/portfolio-caro/actions/workflows/ci.yml/badge.svg)](https://github.com/YoannDrx/portfolio-caro/actions/workflows/ci.yml)

Portfolio professionnel multilingue (FR/EN) pour Caroline Senyk, gestionnaire de droits musicaux. La base administrée est la source de vérité des œuvres, artistes, labels et expertises.

## Stack

- **Framework**: Next.js 16 + React 19
- **Database**: PostgreSQL (Neon) + Prisma 6.19
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Auth**: Better Auth + 2FA
- **Tests**: Playwright
- **Hosting**: Vercel

## Quick Start

```bash
# Install
pnpm install

# Setup database
pnpm db:setup

# Development
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Scripts

| Script                | Description                                      |
| --------------------- | ------------------------------------------------ |
| `pnpm dev`            | Serveur de développement                         |
| `pnpm build`          | Build de production, sans seed                   |
| `pnpm db:setup`       | Reset + seed de la base locale uniquement        |
| `pnpm data:audit`     | Rapport qualité et intégrité des données         |
| `pnpm data:export`    | Export métier sans données d’authentification    |
| `pnpm security:check` | Contrôle secrets, archives suivies et build seed |
| `pnpm test:full`      | Tests E2E                                        |
| `pnpm lint`           | ESLint                                           |

## Documentation

Voir le dossier [`/docs`](./docs) pour la documentation complete:

- [Architecture](./docs/architecture.md)
- [Admin Guide](./docs/admin-guide.md)
- [Design System](./docs/design-system.md)
- [Deployment](./docs/deployment.md)
- [Gouvernance des données](./docs/data-governance.md)
- [API Reference](./docs/api-reference.md)
- [Contributing](./docs/contributing.md)

## Environnement

Copier `.env.example` vers `.env.local` et configurer:

```bash
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
BETTER_AUTH_SECRET="..."
RESEND_API_KEY="..."
```

## Structure

```
/app          # Next.js App Router
/components   # Composants React
/lib          # Utilitaires
/prisma       # Schema + migrations
/docs         # Documentation
/e2e          # Tests Playwright
```

## License

Private - All rights reserved.
