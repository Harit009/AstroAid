import { PrismaClient } from '@prisma/client';
import spaceEntities from '../src/data/space-entities.json' with { type: 'json' };
import '../scripts/databaseEnv.mjs';
import { normalizeJsonEntity } from '../src/lib/discoveryShared.js';

const prisma = new PrismaClient();

async function main() {
  let count = 0;

  for (const jsonEntity of spaceEntities) {
    const entity = normalizeJsonEntity(jsonEntity);

    const saved = await prisma.discoveryEntity.upsert({
      where: { slug: entity.slug },
      update: entity,
      create: entity,
    });

    await prisma.entitySource.upsert({
      where: {
        id: `curated-${saved.slug}`,
      },
      update: {
        citationLabel: saved.externalCitation || 'AstroAid curated archive',
        sourceUrl: saved.referenceDoi?.startsWith('http') ? saved.referenceDoi : null,
      },
      create: {
        id: `curated-${saved.slug}`,
        entityId: saved.id,
        sourceType: 'curated',
        citationLabel: saved.externalCitation || 'AstroAid curated archive',
        sourceUrl: saved.referenceDoi?.startsWith('http') ? saved.referenceDoi : null,
      },
    });

    count += 1;
  }

  console.log(`Seeded ${count} curated Discovery entities.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
