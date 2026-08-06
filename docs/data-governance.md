# Gouvernance des données

## Source de vérité

La base PostgreSQL administrée est l’unique source de vérité métier. Les fichiers de seed servent uniquement à initialiser le développement et les tests ; ils ne sont jamais rejoués pendant un build ou un déploiement.

Les exports sont des sauvegardes hors Git. Ils ne deviennent pas une seconde base éditoriale et ne sont réimportés qu’au moyen d’une procédure explicite avec aperçu du diff.

## Publication et complétude

`isActive` pilote la publication. La présence d’une image, d’une biographie, d’un lien ou d’une collaboration pilote la qualité, jamais la visibilité.

Conséquences :

- un artiste actif sans projet reste visible ;
- une traduction manquante retombe sur le français puis sur le slug ;
- une image manquante affiche un monogramme sobre ;
- les anomalies apparaissent dans `/{locale}/admin/data-quality` ;
- aucune routine de nettoyage ne supprime automatiquement une fiche incomplète.

## Audit

```bash
pnpm data:audit
```

Pour lire la production, une confirmation explicite est obligatoire :

```bash
DATA_ENV=production \
CONFIRM_READ_ONLY_PRODUCTION=READ_PRODUCTION_DATA \
pnpm data:audit
```

Le rapport contrôle notamment les médias absents, traductions, biographies, liens, contributions et références d’assets.

## Export métier

```bash
pnpm data:export -- --output=exports/portfolio-caro-production-YYYY-MM-DD.json
```

L’export exclut systématiquement : utilisateurs, comptes, sessions, invitations, vérifications, journaux d’audit, notifications, preview tokens, historiques d’export et versions internes.

Chaque export est accompagné d’un manifeste contenant le format, la migration la plus récente, les compteurs, la taille et le SHA-256.

## Import contrôlé

L’import commence toujours par un dry-run :

```bash
pnpm data:import -- --file=/chemin/export.json
```

Le rapport fournit une empreinte du plan. L’écriture exige cette empreinte et une confirmation explicite ; en production, la confirmation de cible production est également obligatoire. Aucune suppression globale de collection n’est autorisée.

## Médias

- les chemins sont validés par l’audit ;
- les uploads sont décodés par Sharp, réorientés, limités à 40 mégapixels et 5 Mio, redimensionnés à 2400 px puis encodés en WebP ;
- les SVG sont refusés par la route d’upload ;
- Vercel Blob est obligatoire en production ;
- les doublons d’assets peuvent être fusionnés par la réparation contrôlée, jamais par suppression aveugle.

## Restauration

1. vérifier le SHA-256 de l’export et des volumes médias ;
2. exécuter l’import en dry-run ;
3. faire relire le diff par une seconde personne ;
4. appliquer avec l’empreinte exacte du plan ;
5. relancer `data:audit` et les tests des catalogues FR/EN ;
6. invalider les pages publiques concernées.
