import { PrismaClient } from '@prisma/client';
import '../scripts/databaseEnv.mjs';
import { computeNasaConfidence } from '../src/lib/discoveryShared.js';

const prisma = new PrismaClient();

const NASA_IMAGE_STRATEGY = {
  'Black Hole': {
    queries: ['black hole event horizon', 'black hole accretion disk NASA'],
    positiveKeywords: ['black hole', 'event horizon', 'accretion'],
  },
  Wormhole: {
    queries: ['Wormhole spacetime'],
    positiveKeywords: ['wormhole', 'spacetime'],
  },
  Pulsar: {
    queries: ['pulsar neutron star NASA', 'Crab pulsar NASA'],
    positiveKeywords: ['pulsar', 'neutron star', 'crab'],
  },
  Quasar: {
    queries: ['quasar NASA', 'active galactic nucleus NASA'],
    positiveKeywords: ['quasar', 'active galactic nucleus', 'galaxy'],
  },
  Exoplanet: {
    queries: ['exoplanet artist concept NASA', 'exoplanet NASA'],
    positiveKeywords: ['exoplanet', 'planet', 'artist concept'],
  },
  Nebula: {
    queries: ['nebula NASA', 'Orion nebula NASA'],
    positiveKeywords: ['nebula', 'orion', 'star forming'],
  },
  Supernova: {
    queries: ['supernova remnant NASA', 'Cassiopeia A supernova NASA'],
    positiveKeywords: ['supernova', 'remnant', 'cassiopeia'],
  },
  'Special Relativity': {
    queries: ['Einstein relativity NASA', 'space time NASA'],
    positiveKeywords: ['einstein', 'relativity', 'space-time', 'spacetime'],
  },
  'The Big Bang': {
    queries: ['cosmic microwave background NASA', 'early universe NASA'],
    positiveKeywords: ['cosmic microwave background', 'early universe', 'big bang'],
  },
  'String Theory': {
    queries: ['cosmic strings NASA', 'universe structure NASA'],
    positiveKeywords: ['cosmic string', 'universe', 'structure'],
  },
  'Hawking Radiation': {
    queries: ['black hole NASA', 'black hole accretion disk NASA'],
    positiveKeywords: ['black hole', 'hawking', 'accretion'],
  },
  'The Multiverse': {
    queries: ['deep field galaxies NASA', 'galaxy cluster NASA'],
    positiveKeywords: ['deep field', 'galaxies', 'galaxy cluster'],
  },
  'TRAPPIST-1e': {
    queries: ['TRAPPIST-1e NASA', 'TRAPPIST-1 planets NASA'],
    positiveKeywords: ['trappist', 'exoplanet', 'planet'],
  },
  'James Webb Space Telescope': {
    queries: ['James Webb Space Telescope NASA', 'JWST NASA'],
    positiveKeywords: ['james webb', 'jwst', 'space telescope'],
  },
  'Epoch of Reionization': {
    queries: ['epoch of reionization NASA', 'early galaxies Webb NASA'],
    positiveKeywords: ['reionization', 'early galaxies', 'webb'],
  },
  'Solar Flare': {
    queries: ['solar flare NASA', 'sun solar flare NASA'],
    positiveKeywords: ['solar flare', 'sun', 'solar'],
  },
  Magnetar: {
    queries: ['magnetar NASA', 'magnetar neutron star NASA'],
    positiveKeywords: ['magnetar', 'neutron star', 'magnetic'],
  },
  'Brown Dwarf': {
    queries: ['brown dwarf NASA', 'brown dwarf artist concept NASA'],
    positiveKeywords: ['brown dwarf', 'substellar', 'dwarf'],
  },
  'Rogue Planet': {
    queries: ['exoplanet artist concept NASA', 'planet artist concept NASA', 'dark planet NASA'],
    positiveKeywords: ['exoplanet', 'planet', 'artist concept'],
  },
  'Ocean World': {
    queries: ['ocean world NASA Europa', 'Europa ocean world NASA'],
    positiveKeywords: ['ocean world', 'europa', 'enceladus', 'ocean'],
  },
  'Extreme Weather World': {
    queries: ['exoplanet weather NASA', 'hot jupiter NASA'],
    positiveKeywords: ['exoplanet', 'weather', 'hot jupiter'],
  },
  'Main Sequence Star': {
    queries: ['main sequence star NASA', 'sun NASA'],
    positiveKeywords: ['main sequence', 'star', 'sun'],
  },
  'Red Giant': {
    queries: ['red giant star NASA', 'Betelgeuse red giant NASA'],
    positiveKeywords: ['red giant', 'betelgeuse', 'star'],
  },
  'White Dwarf': {
    queries: ['white dwarf NASA', 'Sirius B white dwarf NASA'],
    positiveKeywords: ['white dwarf', 'sirius', 'star'],
  },
  'Neutron Star': {
    queries: ['neutron star NASA', 'neutron star merger NASA'],
    positiveKeywords: ['neutron star', 'merger', 'pulsar'],
  },
  'General Relativity': {
    queries: ['gravitational lensing NASA', 'Einstein ring NASA'],
    positiveKeywords: ['gravitational lensing', 'einstein ring', 'relativity'],
  },
  'Time Dilation': {
    queries: ['relativity spacetime NASA', 'Einstein relativity NASA'],
    positiveKeywords: ['relativity', 'spacetime', 'einstein'],
  },
  'Dark Matter': {
    queries: ['dark matter map NASA', 'dark matter galaxy cluster NASA'],
    positiveKeywords: ['dark matter', 'galaxy cluster', 'map'],
  },
  'Dark Energy': {
    queries: ['dark energy NASA', 'expanding universe NASA'],
    positiveKeywords: ['dark energy', 'expanding universe', 'universe'],
  },
  'The Cosmic Web': {
    queries: ['cosmic web NASA', 'large scale structure universe NASA'],
    positiveKeywords: ['cosmic web', 'large scale structure', 'galaxies'],
  },
  'Gravitational Lensing': {
    queries: ['gravitational lensing NASA', 'Einstein ring NASA'],
    positiveKeywords: ['gravitational lensing', 'einstein ring', 'lensing'],
  },
  'The Fermi Paradox': {
    queries: ['exoplanets NASA', 'milky way galaxy NASA'],
    positiveKeywords: ['exoplanet', 'milky way', 'galaxy'],
  },
  'The Wow! Signal': {
    queries: ['radio telescope NASA', 'SETI NASA radio signal'],
    positiveKeywords: ['radio telescope', 'radio', 'signal'],
  },
  'The Fate of the Universe (Big Freeze/Big Rip)': {
    queries: ['expanding universe NASA', 'dark energy universe NASA'],
    positiveKeywords: ['expanding universe', 'dark energy', 'universe'],
  },
};

const DEFAULT_NEGATIVE_KEYWORDS = ['earth day', 'logo', 'poster', 'student', 'classroom', 'hurricane', 'aircraft'];

function getImageStrategy(entity) {
  const strategy = NASA_IMAGE_STRATEGY[entity.name] || {
    queries: [`${entity.name} NASA`],
    positiveKeywords: [entity.name],
  };

  return {
    ...strategy,
    negativeKeywords: [
      ...DEFAULT_NEGATIVE_KEYWORDS,
      ...(strategy.negativeKeywords || []),
    ],
  };
}

function toDate(value) {
  const parsed = value ? new Date(value) : null;
  return parsed && !Number.isNaN(parsed.getTime()) ? parsed : null;
}

async function fetchNasaImageCandidates(query) {
  const url = new URL('https://images-api.nasa.gov/search');
  url.searchParams.set('q', query);
  url.searchParams.set('media_type', 'image');
  url.searchParams.set('page_size', '10');

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`NASA Images API failed for "${query}": HTTP ${response.status}`);
  }

  const payload = await response.json();
  return payload.collection?.items || [];
}

async function fetchAllCandidates(entity, strategy) {
  const all = [];
  const seen = new Set();

  for (const query of strategy.queries) {
    const items = await fetchNasaImageCandidates(query);
    for (const item of items) {
      const nasaId = item.data?.[0]?.nasa_id;
      const mediaUrl = item.links?.[0]?.href;
      const key = nasaId || mediaUrl;
      if (!key || seen.has(key)) continue;
      seen.add(key);
      all.push({ query, item });
    }
  }

  return all;
}

async function main() {
  const requestedNames = process.argv.slice(2).map((name) => name.toLowerCase());
  const entities = await prisma.discoveryEntity.findMany({
    where: requestedNames.length > 0
      ? {
          OR: requestedNames.map((name) => ({
            name: {
              equals: name,
              mode: 'insensitive',
            },
          })),
        }
      : undefined,
    orderBy: { name: 'asc' },
  });

  if (requestedNames.length > 0 && entities.length === 0) {
    throw new Error(`No Discovery entities matched: ${process.argv.slice(2).join(', ')}`);
  }

  for (const entity of entities) {
    const strategy = getImageStrategy(entity);
    const candidates = await fetchAllCandidates(entity, strategy);
    const scored = candidates
      .map(({ query, item }) => ({
        query,
        item,
        confidenceScore: computeNasaConfidence(entity.name, item, strategy),
      }))
      .sort((a, b) => b.confidenceScore - a.confidenceScore);

    await prisma.nasaEnrichment.deleteMany({
      where: { entityId: entity.id },
    });
    await prisma.entitySource.deleteMany({
      where: {
        entityId: entity.id,
        sourceType: 'nasa',
      },
    });

    for (let index = 0; index < Math.min(scored.length, 5); index += 1) {
      const { query, item, confidenceScore } = scored[index];
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

    console.log(`NASA enrichment stored for ${entity.name}: ${Math.min(scored.length, 5)} selected from ${scored.length} candidate(s).`);
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
