import { PrismaClient } from '@prisma/client';
import '../scripts/databaseEnv.mjs';
import { computeNasaConfidence } from '../src/lib/discoveryShared.js';

const prisma = new PrismaClient();

function buildQuery(entity) {
  if (entity.name === 'Wormhole') return 'Wormhole spacetime';
  if (entity.name === 'Dark Matter') return 'Dark Matter map';
  if (entity.name === 'The Multiverse') return 'Deep Space galaxy cluster';
  return entity.name;
}

function toDate(value) {
  const parsed = value ? new Date(value) : null;
  return parsed && !Number.isNaN(parsed.getTime()) ? parsed : null;
}

async function fetchNasaImageCandidates(entity) {
  const query = buildQuery(entity);
  const url = new URL('https://images-api.nasa.gov/search');
  url.searchParams.set('q', query);
  url.searchParams.set('media_type', 'image');
  url.searchParams.set('page_size', '5');

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`NASA Images API failed for ${entity.name}: HTTP ${response.status}`);
  }

  const payload = await response.json();
  return {
    query,
    items: payload.collection?.items || [],
  };
}

async function main() {
  const entities = await prisma.discoveryEntity.findMany({
    orderBy: { name: 'asc' },
  });

  for (const entity of entities) {
    const { query, items } = await fetchNasaImageCandidates(entity);
    const scored = items
      .map((item) => ({
        item,
        confidenceScore: computeNasaConfidence(entity.name, item),
      }))
      .sort((a, b) => b.confidenceScore - a.confidenceScore);

    await prisma.nasaEnrichment.updateMany({
      where: { entityId: entity.id },
      data: { selected: false },
    });

    for (let index = 0; index < scored.length; index += 1) {
      const { item, confidenceScore } = scored[index];
      const data = item.data?.[0] || {};
      const mediaUrl = item.links?.[0]?.href || null;

      await prisma.nasaEnrichment.create({
        data: {
          entityId: entity.id,
          query,
          nasaId: data.nasa_id || null,
          title: data.title || null,
          description: data.description || null,
          mediaUrl,
          center: data.center || null,
          keywords: data.keywords || [],
          dateCreated: toDate(data.date_created),
          rawPayload: item,
          confidenceScore,
          selected: index === 0,
        },
      });

      if (index === 0 && mediaUrl) {
        await prisma.entitySource.create({
          data: {
            entityId: entity.id,
            sourceType: 'nasa',
            sourceUrl: mediaUrl,
            citationLabel: data.title || `NASA image result for ${entity.name}`,
          },
        });
      }
    }

    console.log(`NASA enrichment stored for ${entity.name}: ${scored.length} candidate(s).`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
