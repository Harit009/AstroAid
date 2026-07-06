# AstroAid Discovery Database

The Discovery section now uses a local SQLite database through Prisma Client, with the original curated JSON as the source of truth for initial seeding.

## Layers

- `DiscoveryEntity`: curated AstroAid records imported from `src/data/space-entities.json`.
- `NasaEnrichment`: NASA Images API candidates and selected media metadata.
- `AiAnalysis`: synthesized analysis records generated from curated data plus selected NASA enrichment.
- `EntitySource`: source traceability for curated and NASA-derived records.

## Local Setup

```bash
npm run db:setup
```

This generates Prisma Client, creates the SQLite tables, seeds the curated Discovery entities, and creates an offline analysis pass.

## NASA Enrichment

This command accesses the internet and calls NASA Images API:

```bash
npm run db:enrich:nasa
npm run db:analyze
```

Run `db:analyze` again after NASA enrichment so the latest analysis records include NASA context.

## Live AI Analysis

The analysis script supports a live AI pass when `OPENAI_API_KEY` is configured:

```bash
node scripts/analyzeDiscoveryWithAi.mjs --live
```

Without `--live`, the script uses the local `local-rule-synthesizer` so the database remains buildable without external AI access.

## Verification

```bash
npm run db:check
npm test
npm run build
```
