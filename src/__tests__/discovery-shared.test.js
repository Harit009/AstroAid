import {
  buildLocalAnalysis,
  computeNasaConfidence,
  normalizeJsonEntity,
  toDiscoverySlug,
} from '../lib/discoveryShared';

describe('Discovery database shared utilities', () => {
  it('creates stable URL slugs for entity names', () => {
    expect(toDiscoverySlug('The Fate of the Universe (Big Freeze/Big Rip)')).toBe(
      'the-fate-of-the-universe-big-freeze-big-rip'
    );
    expect(toDiscoverySlug('TRAPPIST-1e')).toBe('trappist-1e');
  });

  it('normalizes current JSON records into database-shaped records', () => {
    const normalized = normalizeJsonEntity({
      Name: 'Black Hole',
      Category: 'Object',
      ImageURL: '/black-hole.png',
      ScientificClassification: 'Spacetime Singularity',
      DeepDiveOverview: ['Overview'],
    });

    expect(normalized).toMatchObject({
      name: 'Black Hole',
      slug: 'black-hole',
      category: 'Object',
      imageUrl: '/black-hole.png',
      scientificClassification: 'Spacetime Singularity',
      deepDiveOverview: ['Overview'],
    });
  });

  it('scores NASA candidates higher when the title and description match the entity', () => {
    const score = computeNasaConfidence('Black Hole', {
      data: [{
        title: 'Black Hole Visualization',
        description: 'A NASA visualization of a black hole accretion disk.',
        keywords: ['black holes'],
      }],
      links: [{ href: 'https://images-assets.nasa.gov/black-hole.jpg' }],
    });

    expect(score).toBeGreaterThan(0.7);
  });

  it('builds an auditable local analysis record from curated and NASA data', () => {
    const analysis = buildLocalAnalysis(
      {
        name: 'Nebula',
        category: 'Object',
        scientificClassification: 'Interstellar Medium Cloud',
        deepDiveOverview: ['A nebula is a cloud of gas and dust.'],
        mathematicalFoundation: 'M = rho V',
        liveStatus: 'Active Phenomenon',
      },
      {
        id: 'nasa-1',
        title: 'Orion Nebula',
        description: 'NASA image metadata for Orion.',
        center: 'GSFC',
        confidenceScore: 0.82,
      }
    );

    expect(analysis).toMatchObject({
      modelUsed: 'local-rule-synthesizer',
      promptVersion: 'astroaid-discovery-v1',
      confidenceScore: 0.82,
    });
    expect(analysis.mergedSummary).toContain('Orion Nebula');
    expect(analysis.scientificNotes).toContain('NASA center: GSFC');
  });
});
