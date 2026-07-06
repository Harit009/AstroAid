import { PrismaClient } from '@prisma/client';
import '../scripts/databaseEnv.mjs';

const prisma = new PrismaClient();

const statements = [
  `CREATE TABLE IF NOT EXISTS "DiscoveryEntity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "imageUrl" TEXT,
    "scientificClassification" TEXT,
    "deepDiveOverview" TEXT NOT NULL,
    "the2026Update" TEXT,
    "mathematicalFoundation" TEXT,
    "externalCitation" TEXT,
    "visualPrompt" TEXT,
    "liveStatus" TEXT,
    "referenceDoi" TEXT,
    "technicalSpecs" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "DiscoveryEntity_name_key" ON "DiscoveryEntity"("name")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "DiscoveryEntity_slug_key" ON "DiscoveryEntity"("slug")`,
  `CREATE INDEX IF NOT EXISTS "DiscoveryEntity_category_idx" ON "DiscoveryEntity"("category")`,
  `CREATE TABLE IF NOT EXISTS "NasaEnrichment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "entityId" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "nasaId" TEXT,
    "title" TEXT,
    "description" TEXT,
    "mediaUrl" TEXT,
    "center" TEXT,
    "keywords" TEXT,
    "dateCreated" DATETIME,
    "rawPayload" TEXT,
    "confidenceScore" REAL NOT NULL DEFAULT 0,
    "selected" BOOLEAN NOT NULL DEFAULT false,
    "retrievedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "NasaEnrichment_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "DiscoveryEntity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS "NasaEnrichment_entityId_idx" ON "NasaEnrichment"("entityId")`,
  `CREATE INDEX IF NOT EXISTS "NasaEnrichment_selected_idx" ON "NasaEnrichment"("selected")`,
  `CREATE TABLE IF NOT EXISTS "AiAnalysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "entityId" TEXT NOT NULL,
    "mergedSummary" TEXT NOT NULL,
    "beginnerExplanation" TEXT NOT NULL,
    "scientificNotes" TEXT NOT NULL,
    "sourceConflicts" TEXT NOT NULL,
    "confidenceScore" REAL NOT NULL,
    "modelUsed" TEXT NOT NULL,
    "promptVersion" TEXT NOT NULL,
    "rawOutput" TEXT,
    "generatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AiAnalysis_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "DiscoveryEntity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS "AiAnalysis_entityId_idx" ON "AiAnalysis"("entityId")`,
  `CREATE INDEX IF NOT EXISTS "AiAnalysis_generatedAt_idx" ON "AiAnalysis"("generatedAt")`,
  `CREATE TABLE IF NOT EXISTS "EntitySource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "entityId" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "citationLabel" TEXT,
    "retrievedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EntitySource_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "DiscoveryEntity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS "EntitySource_entityId_idx" ON "EntitySource"("entityId")`,
  `CREATE INDEX IF NOT EXISTS "EntitySource_sourceType_idx" ON "EntitySource"("sourceType")`,
];

async function main() {
  for (const statement of statements) {
    await prisma.$executeRawUnsafe(statement);
  }

  console.log('Discovery SQLite schema bootstrapped.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
