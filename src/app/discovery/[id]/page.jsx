import Link from 'next/link';
import { getDiscoveryEntityBySlug } from '../../../lib/discoveryRepository';

function highlightedSpecValue(value) {
  return String(value)
    .split(/(km|K|m\/s|M_earth|M_sun|ergs|Gauss|g\/cm|%|GeV|s)/)
    .map((part, index) => (
      /^(km|K|m\/s|M_earth|M_sun|ergs|Gauss|g\/cm|%|GeV|s)$/.test(part)
        ? <span key={index} className="text-[#00E5FF] ml-1">{part}</span>
        : part
    ));
}

export default async function EntityPage({ params }) {
  const { id } = await params;
  const entity = await getDiscoveryEntityBySlug(id);

  if (!entity) {
    return (
      <div className="min-h-[100vh] flex items-center justify-center flex-col text-white">
        <h1 className="text-4xl mb-4 text-[#00E5FF] font-black uppercase tracking-widest drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]">404</h1>
        <p className="mb-6 font-mono text-[#AAAAAA]">Entity Data Not Found in the Archives.</p>
        <Link href="/discovery" className="px-6 py-2 border border-[#00E5FF]/40 text-[#00E5FF] hover:border-[#00E5FF] hover:shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all rounded-full uppercase tracking-widest text-sm font-bold glass-card">
          Return to Database
        </Link>
      </div>
    );
  }

  const bgImage = entity.cardImageUrl || entity.imageUrl || '/cosmic_nebula_bg.png';
  const latestAnalysis = entity.latestAnalysis;
  const selectedNasa = entity.selectedNasa;

  return (
    <div className="min-h-screen bg-[#02050A] text-[#FFFFFF] relative overflow-hidden">
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <div className="absolute top-[40%] -left-[20%] w-[70vw] h-[70vw] bg-[#0A1F44] opacity-20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[10000ms]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] bg-[#00E5FF] opacity-[0.04] rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#02050A_100%)]" />
      </div>

      <div className="relative w-full h-[50vh] min-h-[400px] overflow-hidden">
        <img src={bgImage} alt={entity.name} loading="lazy" decoding="async" className="w-full h-full object-cover opacity-40 mix-blend-screen" />
        <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(0,229,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F44] via-[#0A1F44]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/70 via-transparent to-transparent pt-20 px-10">
          <Link href="/discovery" className="text-[#AAAAAA] hover:text-[#00E5FF] hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.8)] text-sm uppercase tracking-widest font-bold mb-8 inline-block transition-all border-b border-transparent hover:border-[#00E5FF]">
            Back to Database
          </Link>
        </div>

        <div className="absolute bottom-10 left-10 z-20 max-w-5xl pr-10">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="inline-block px-4 py-1.5 glass-card text-[#00E5FF] text-xs font-bold tracking-[0.3em] uppercase shadow-[0_0_15px_rgba(0,229,255,0.2)] rounded-full">
              {entity.category} Classification
            </div>
            {entity.scientificClassification && (
              <div className="inline-block px-4 py-1.5 glass-card text-white text-xs font-bold tracking-[0.2em] uppercase rounded-full">
                {entity.scientificClassification}
              </div>
            )}
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-2 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
            {entity.name}
          </h1>

          <p className="text-[#00E5FF] mb-6 font-mono text-xs md:text-sm tracking-[0.2em] uppercase flex items-center gap-3">
            <span className="w-2 h-2 bg-[#00E5FF] rounded-full animate-pulse shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
            STATUS: {entity.liveStatus || 'UNKNOWN'}
          </p>

          <div className="flex items-center gap-3 text-[#AAAAAA] text-[10px] font-mono tracking-widest glass-card w-max max-w-full px-4 py-2 rounded-xl border border-[rgba(255,255,255,0.1)]">
            Record Reference: {entity.externalCitation || selectedNasa?.title || 'AstroAid Database'}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 pb-32 pt-16">
        <div className="flex flex-col gap-16">
          <div className="glass-panel-subtle p-6">
            <h2 className="text-2xl text-[#00E5FF] mb-6 font-bold uppercase tracking-widest border-l-4 border-[#00E5FF] pl-4 drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">
              Phenomenon Archive
            </h2>
            <div className="flex flex-col gap-6 text-lg text-[#FFFFFF] leading-relaxed font-medium">
              {entity.deepDiveOverview?.map((paragraph, index) => (
                <p key={index} className="text-justify">{paragraph}</p>
              ))}
            </div>
          </div>

          {latestAnalysis && (
            <div className="glass-panel-subtle p-6">
              <h2 className="text-2xl text-[#00E5FF] mb-6 font-bold uppercase tracking-widest border-l-4 border-[#00E5FF] pl-4 drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">
                Hybrid Intelligence Summary
              </h2>
              <p className="text-white text-lg leading-relaxed mb-6">
                {latestAnalysis.mergedSummary}
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[#02050A] p-5 rounded-lg border border-[rgba(0,229,255,0.15)]">
                  <p className="text-[#AAAAAA] text-[10px] uppercase font-bold tracking-widest mb-3">Beginner Explanation</p>
                  <p className="text-[#FFFFFF] text-sm leading-relaxed">{latestAnalysis.beginnerExplanation}</p>
                </div>
                <div className="bg-[#02050A] p-5 rounded-lg border border-[rgba(0,229,255,0.15)]">
                  <p className="text-[#AAAAAA] text-[10px] uppercase font-bold tracking-widest mb-3">Analysis Confidence</p>
                  <p className="tech-mono text-[#00E5FF] text-2xl">
                    {Math.round((latestAnalysis.confidenceScore || 0) * 100)}%
                  </p>
                  <p className="text-[#AAAAAA] text-[10px] uppercase tracking-widest mt-2">
                    Model: {latestAnalysis.modelUsed}
                  </p>
                </div>
              </div>
            </div>
          )}

          {entity.the2026Update && (
            <div className="glass-panel-subtle p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#00E5FF]/20 rounded-full blur-3xl pointer-events-none group-hover:opacity-100 transition-opacity opacity-50" />
              <h3 className="text-sm font-black text-[#00E5FF] uppercase tracking-[0.3em] mb-6 relative z-10 flex items-center gap-3 drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">
                <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
                The 2026 Update
              </h3>
              <p className="text-white text-xl md:text-2xl leading-relaxed italic border-l-2 border-[rgba(0,229,255,0.4)] pl-8 font-serif relative z-10">
                "{entity.the2026Update}"
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {entity.mathematicalFoundation && (
              <div className="glass-panel-subtle p-6 flex flex-col justify-center">
                <h3 className="text-xs font-black text-[#00E5FF] uppercase tracking-widest mb-6 drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">
                  Mathematical Foundation
                </h3>
                <p className="text-white font-mono text-lg md:text-xl tracking-wider select-all text-center">
                  {entity.mathematicalFoundation}
                </p>
              </div>
            )}

            {entity.visualPrompt && (
              <div className="glass-panel-subtle p-6 flex flex-col justify-center">
                <h3 className="text-xs font-black text-[#00E5FF] uppercase tracking-widest mb-6 drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">
                  System Design Cue
                </h3>
                <p className="text-[#FFFFFF] text-xs md:text-sm font-mono leading-relaxed">
                  {entity.visualPrompt}
                </p>
              </div>
            )}
          </div>

          {selectedNasa && (
            <div className="glass-panel-subtle p-6">
              <h3 className="text-sm font-black text-[#00E5FF] uppercase tracking-[0.2em] mb-6 drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">
                NASA Enrichment Layer
              </h3>
              <div className="grid md:grid-cols-[1fr_2fr] gap-6 items-start">
                <div className="bg-[#02050A] p-5 rounded-lg border border-[rgba(0,229,255,0.15)]">
                  <p className="text-[#AAAAAA] text-[10px] uppercase font-bold tracking-widest mb-2">Match Confidence</p>
                  <p className="tech-mono text-[#00E5FF] text-2xl">{Math.round((selectedNasa.confidenceScore || 0) * 100)}%</p>
                  <p className="text-[#AAAAAA] text-[10px] uppercase tracking-widest mt-4">Query: {selectedNasa.query}</p>
                </div>
                <div>
                  <p className="text-white font-bold text-lg mb-3">{selectedNasa.title}</p>
                  <p className="text-[#AAAAAA] text-sm leading-relaxed">{selectedNasa.description}</p>
                  {selectedNasa.center && (
                    <p className="text-[#00E5FF] text-[10px] uppercase tracking-widest mt-4">NASA Center: {selectedNasa.center}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {entity.technicalSpecs && (
            <div className="glass-panel-subtle p-8 border-t-2 border-[#00E5FF] shadow-[0_-5px_20px_rgba(0,229,255,0.1)] mt-8">
              <h3 className="text-sm font-black text-[#00E5FF] uppercase tracking-[0.2em] mb-8 drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">
                System Technical Specifications
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(entity.technicalSpecs).map(([key, value]) => (
                  <div key={key} className="bg-[#02050A] p-5 rounded-lg border border-[rgba(0,229,255,0.15)] flex flex-col justify-between">
                    <p className="text-[#AAAAAA] text-[10px] uppercase font-bold tracking-widest mb-3 border-b border-[rgba(255,255,255,0.1)] pb-2">{key}</p>
                    <p className="tech-mono text-[#FFFFFF] text-sm md:text-base whitespace-pre-wrap break-words leading-relaxed">
                      {highlightedSpecValue(value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {entity.referenceDoi && (
            <div className="w-full mt-12 pt-8 border-t border-[rgba(255,255,255,0.05)] text-center">
              <p className="text-[#AAAAAA] text-[10px] font-bold tracking-[0.3em] uppercase mb-3">Official Citation Database Link</p>
              <a
                href={entity.referenceDoi.startsWith('http') ? entity.referenceDoi : `https://doi.org/${entity.referenceDoi.replace('doi:', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 bg-[#02050A] border border-[#00E5FF]/20 hover:border-[#00E5FF] text-[#00E5FF] tech-mono text-xs transition-colors rounded"
              >
                {entity.referenceDoi}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
