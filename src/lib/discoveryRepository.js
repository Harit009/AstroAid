import spaceEntitiesData from '../data/space-entities.json';
import { prisma } from './prisma';
import {
  entityRecordToViewModel,
  normalizeJsonEntity,
  toDiscoverySlug,
} from './discoveryShared';

const entityInclude = {
  nasaEnrichments: {
    where: { selected: true },
    orderBy: { retrievedAt: 'desc' },
    take: 1,
  },
  aiAnalyses: {
    orderBy: { generatedAt: 'desc' },
    take: 1,
  },
  sources: {
    orderBy: { retrievedAt: 'desc' },
  },
};

function jsonFallbackEntities() {
  return spaceEntitiesData.map((entity) =>
    entityRecordToViewModel({
      ...normalizeJsonEntity(entity),
      id: toDiscoverySlug(entity.Name),
      nasaEnrichments: [],
      aiAnalyses: [],
      sources: [
        {
          sourceType: 'curated',
          citationLabel: entity.ExternalCitation || 'AstroAid curated archive',
          sourceUrl: entity.ReferenceDOI || null,
        },
      ],
    })
  );
}

async function withDatabaseFallback(operation, fallback) {
  try {
    return await operation();
  } catch (error) {
    console.warn(`Discovery database unavailable; using curated JSON fallback. ${error.message}`);
    return fallback();
  }
}

export async function listDiscoveryEntities() {
  return withDatabaseFallback(async () => {
    const entities = await prisma.discoveryEntity.findMany({
      orderBy: { name: 'asc' },
      include: entityInclude,
    });

    if (entities.length === 0) {
      return jsonFallbackEntities();
    }

    return entities.map(entityRecordToViewModel);
  }, jsonFallbackEntities);
}

export async function getDiscoveryEntityBySlug(slug) {
  return withDatabaseFallback(async () => {
    const entity = await prisma.discoveryEntity.findUnique({
      where: { slug },
      include: entityInclude,
    });

    if (entity) {
      return entityRecordToViewModel(entity);
    }

    return jsonFallbackEntities().find((item) => item.slug === slug) || null;
  }, () => jsonFallbackEntities().find((item) => item.slug === slug) || null);
}
