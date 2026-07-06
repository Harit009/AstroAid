import { PrismaClient } from '@prisma/client';
import '../scripts/databaseEnv.mjs';
import { buildLocalAnalysis } from '../src/lib/discoveryShared.js';

const prisma = new PrismaClient();
const useLiveAi = process.argv.includes('--live');

function parseJsonBlock(text) {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return JSON.parse(fenced ? fenced[1] : trimmed);
}

async function runLiveAiAnalysis(entity, nasaEnrichment) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is required when using --live.');
  }

  const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
  const prompt = {
    task: 'Merge AstroAid curated discovery data with NASA metadata for a public astronomy database.',
    rules: [
      'Do not invent dates, citations, observations, or discoveries.',
      'Prefer curated AstroAid content when sources conflict.',
      'Use NASA metadata only as supporting context.',
      'Return strict JSON only.',
    ],
    entity,
    nasaEnrichment,
    requiredShape: {
      mergedSummary: 'string',
      beginnerExplanation: 'string',
      scientificNotes: ['string'],
      sourceConflicts: ['string'],
      confidenceScore: 'number from 0 to 1',
    },
  };

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      input: JSON.stringify(prompt),
    }),
  });

  if (!response.ok) {
    throw new Error(`AI analysis failed for ${entity.name}: HTTP ${response.status}`);
  }

  const payload = await response.json();
  const outputText =
    payload.output_text ||
    payload.output?.flatMap((item) => item.content || []).map((content) => content.text || '').join('\n') ||
    '';
  const parsed = parseJsonBlock(outputText);

  return {
    mergedSummary: parsed.mergedSummary,
    beginnerExplanation: parsed.beginnerExplanation,
    scientificNotes: parsed.scientificNotes || [],
    sourceConflicts: parsed.sourceConflicts || [],
    confidenceScore: Number(parsed.confidenceScore || 0.7),
    modelUsed: model,
    promptVersion: 'astroaid-discovery-v1',
    rawOutput: payload,
  };
}

async function main() {
  const entities = await prisma.discoveryEntity.findMany({
    orderBy: { name: 'asc' },
    include: {
      nasaEnrichments: {
        where: { selected: true },
        take: 1,
      },
    },
  });

  for (const entity of entities) {
    const nasaEnrichment = entity.nasaEnrichments[0] || null;
    const analysis = useLiveAi
      ? await runLiveAiAnalysis(entity, nasaEnrichment)
      : buildLocalAnalysis(entity, nasaEnrichment);

    await prisma.aiAnalysis.create({
      data: {
        entityId: entity.id,
        mergedSummary: analysis.mergedSummary,
        beginnerExplanation: analysis.beginnerExplanation,
        scientificNotes: analysis.scientificNotes,
        sourceConflicts: analysis.sourceConflicts,
        confidenceScore: analysis.confidenceScore,
        modelUsed: analysis.modelUsed,
        promptVersion: analysis.promptVersion,
        rawOutput: analysis.rawOutput,
      },
    });

    console.log(`Analysis stored for ${entity.name} using ${analysis.modelUsed}.`);
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
