export function toDiscoverySlug(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function normalizeJsonEntity(entity) {
  return {
    name: entity.Name,
    slug: toDiscoverySlug(entity.Name),
    category: entity.Category,
    imageUrl: entity.ImageURL || null,
    scientificClassification: entity.ScientificClassification || null,
    deepDiveOverview: entity.DeepDiveOverview || [],
    the2026Update: entity.The2026Update || null,
    mathematicalFoundation: entity.MathematicalFoundation || null,
    externalCitation: entity.ExternalCitation || null,
    visualPrompt: entity.VisualPrompt || null,
    liveStatus: entity.LiveStatus || null,
    referenceDoi: entity.ReferenceDOI || null,
    technicalSpecs: entity.TechnicalSpecs || null,
  };
}

export function entityRecordToViewModel(entity) {
  const selectedNasa =
    entity.nasaEnrichments?.find((item) => item.selected) ||
    entity.nasaEnrichments?.[0] ||
    null;
  const latestAnalysis = entity.aiAnalyses?.[0] || null;

  return {
    id: entity.id || entity.slug,
    name: entity.name,
    slug: entity.slug,
    category: entity.category,
    imageUrl: entity.imageUrl,
    cardImageUrl: selectedNasa?.mediaUrl || entity.imageUrl || '/cosmic_nebula_bg.png',
    scientificClassification: entity.scientificClassification,
    deepDiveOverview: entity.deepDiveOverview || [],
    the2026Update: entity.the2026Update,
    mathematicalFoundation: entity.mathematicalFoundation,
    externalCitation: entity.externalCitation,
    visualPrompt: entity.visualPrompt,
    liveStatus: entity.liveStatus,
    referenceDoi: entity.referenceDoi,
    technicalSpecs: entity.technicalSpecs,
    selectedNasa,
    latestAnalysis,
  };
}

function includesPhrase(text, phrase) {
  return text.includes(String(phrase || '').toLowerCase());
}

export function computeNasaConfidence(entityName, item, options = {}) {
  const name = entityName.toLowerCase();
  const positiveKeywords = options.positiveKeywords || [];
  const negativeKeywords = options.negativeKeywords || [];
  const title = String(item?.data?.[0]?.title || '').toLowerCase();
  const description = String(item?.data?.[0]?.description || '').toLowerCase();
  const keywords = (item?.data?.[0]?.keywords || []).map((keyword) => String(keyword).toLowerCase());
  const haystack = `${title} ${description} ${keywords.join(' ')}`;

  let score = 0;
  if (title.includes(name)) score += 0.45;
  if (description.includes(name)) score += 0.25;
  if (keywords.some((keyword) => keyword.includes(name))) score += 0.2;
  for (const keyword of positiveKeywords) {
    if (includesPhrase(title, keyword)) score += 0.2;
    if (includesPhrase(description, keyword)) score += 0.1;
    if (keywords.some((itemKeyword) => includesPhrase(itemKeyword, keyword))) score += 0.12;
  }
  for (const keyword of negativeKeywords) {
    if (includesPhrase(haystack, keyword)) score -= 0.35;
  }
  if (item?.links?.[0]?.href) score += 0.1;

  return Number(Math.max(0, Math.min(score, 1)).toFixed(2));
}

export function buildLocalAnalysis(entity, nasaEnrichment = null) {
  const overview = Array.isArray(entity.deepDiveOverview) ? entity.deepDiveOverview : [];
  const nasaTitle = nasaEnrichment?.title ? ` NASA's closest media match is "${nasaEnrichment.title}".` : '';
  const nasaDescription = nasaEnrichment?.description ? ` NASA describes the related asset as: ${nasaEnrichment.description}` : '';
  const mergedSummary = [
    overview[0] || `${entity.name} is cataloged in AstroAid's discovery archive.`,
    nasaTitle,
    nasaDescription,
  ].join(' ').replace(/\s+/g, ' ').trim();

  return {
    mergedSummary,
    beginnerExplanation:
      `${entity.name} can be understood as ${entity.scientificClassification || 'a space phenomenon'} within the ${entity.category || 'Discovery'} category. AstroAid keeps the curated scientific explanation as the primary source, then uses NASA media metadata as supporting context.`,
    scientificNotes: [
      entity.mathematicalFoundation ? `Mathematical anchor: ${entity.mathematicalFoundation}` : null,
      entity.liveStatus ? `Observed status: ${entity.liveStatus}` : null,
      nasaEnrichment?.center ? `NASA center: ${nasaEnrichment.center}` : null,
    ].filter(Boolean),
    sourceConflicts: [],
    confidenceScore: nasaEnrichment ? Math.max(0.72, nasaEnrichment.confidenceScore) : 0.68,
    modelUsed: 'local-rule-synthesizer',
    promptVersion: 'astroaid-discovery-v1',
    rawOutput: { nasaEnrichmentId: nasaEnrichment?.id || null },
  };
}
