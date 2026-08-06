# Guide de déploiement — Caroline Senyk

## Environnements

| Environnement | Base de données   | Configuration    | Usage       |
| ------------- | ----------------- | ---------------- | ----------- |
| Développement | branche Neon dev  | `.env.local`     | `pnpm dev`  |
| CI            | PostgreSQL isolé  | secrets GitHub   | tests       |
| Production    | branche Neon main | variables Vercel | déploiement |

## Principe non négociable

Un déploiement ne modifie jamais le contenu métier et ne recrée jamais le compte administrateur. `scripts/vercel-build.js` se limite à :

1. appliquer les migrations validées ;
2. générer le client Prisma ;
3. compiler Next.js.

Le seed est réservé au développement et aux tests. Il exige `ALLOW_CONTENT_SEED=1` et refuse Vercel ou une cible de production.

## Variables requises

```bash
DATABASE_URL="postgresql://..."     # connexion poolée
DIRECT_URL="postgresql://..."       # connexion directe pour les migrations
NEXT_PUBLIC_SITE_URL="https://..."  # domaine canonique
RESEND_API_KEY="re_..."             # envoi du formulaire de contact
BETTER_AUTH_SECRET="..."            # secret long et aléatoire
BLOB_READ_WRITE_TOKEN="..."         # obligatoire pour les uploads en production
```

`BETTER_AUTH_TRUSTED_ORIGINS` peut lister plusieurs origines exactes séparées par des virgules. Aucun wildcard n’est accepté.

## Pipeline Vercel

- un push sur `main` déclenche la production ;
- une autre branche produit une preview ;
- les migrations passent avant le build ;
- aucun seed, import ou bootstrap administrateur n’est exécuté.

## Checklist avant publication

```bash
pnpm security:check
pnpm lint
pnpm exec tsc --noEmit
pnpm db:check
pnpm build
pnpm test:full
```

## Initialisation exceptionnelle d’un administrateur

Cette opération est manuelle, hors pipeline, et seulement si aucun administrateur n’existe :

```bash
ADMIN_EMAIL='…' ADMIN_PASSWORD='…' pnpm admin:bootstrap
```

Le mot de passe doit faire au moins 20 caractères. Les variables ne doivent pas rester dans Vercel après l’opération.

Pour invalider toutes les sessions après rotation d’un secret ou d’un mot de passe :

```bash
CONFIRM_SESSION_INVALIDATION=INVALIDATE_ADMIN_SESSIONS pnpm admin:invalidate-sessions
```

## Sauvegardes

- exporter uniquement les données métier avec `pnpm data:export` ;
- conserver le manifeste SHA-256 avec chaque export ;
- archiver les médias séparément ;
- ne jamais versionner `backups/`, `exports/`, dumps SQL ou archives ;
- ne jamais archiver les tables d’authentification dans le dépôt.

La procédure complète est décrite dans [Gouvernance des données](./data-governance.md).

## Retour arrière

1. revenir au déploiement Vercel précédent ;
2. restaurer les données métier uniquement si elles ont réellement été modifiées ;
3. utiliser un point de restauration Neon pour une migration destructive ;
4. invalider les sessions si un secret a été exposé.

## Monitoring

- Vercel : erreurs, logs, fonctions et Web Vitals ;
- Neon : connexions, requêtes lentes et dérive de schéma ;
- administration : audit, doublons et qualité des données.
