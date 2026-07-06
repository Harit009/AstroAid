import { PrismaClient } from '@prisma/client';
import '../scripts/databaseEnv.mjs';

const prisma = new PrismaClient();

async function main() {
  const [entities, nasaEnrichments, aiAnalyses] = await Promise.all([
    prisma.discoveryEntity.count(),
    prisma.nasaEnrichment.count(),
    prisma.aiAnalysis.count(),
  ]);

  console.log(JSON.stringify({ entities, nasaEnrichments, aiAnalyses }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
