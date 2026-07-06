"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

const EntityCard = ({ entity }) => {
  const [bgImage, setBgImage] = useState(entity.cardImageUrl || entity.imageUrl || '/cosmic_nebula_bg.png');

  return (
    <Link href={`/discovery/${entity.slug}`}>
      <div className="glass-card relative rounded-3xl overflow-hidden group min-h-[400px] flex flex-col justify-end cursor-pointer h-full">
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <img
            src={bgImage}
            alt={entity.name}
            loading="lazy"
            decoding="async"
            onError={() => setBgImage('/cosmic_nebula_bg.png')}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-30 mix-blend-screen"
          />
        </div>

        <div className="relative z-10 p-6 flex flex-col gap-3">
          <h3 className="text-2xl md:text-3xl font-bold text-[#00E5FF] tracking-wide transition-colors drop-shadow-md">
            {entity.name}
          </h3>
          <p className="text-sm md:text-base text-[#FFFFFF] leading-relaxed font-medium line-clamp-3">
            {entity.latestAnalysis?.mergedSummary || entity.deepDiveOverview?.[0] || 'Classification data available.'}
          </p>
          <div className="mt-4 pt-4 border-t border-[rgba(0,229,255,0.2)] flex justify-between items-center gap-4">
            <span className="text-[10px] uppercase tracking-widest text-[#AAAAAA] font-mono truncate">
              {entity.selectedNasa ? 'NASA Enriched' : 'Curated'}
            </span>
            <button className="px-6 py-2 bg-[#00E5FF] text-[#000000] font-black uppercase tracking-widest text-xs rounded-full shadow-[0_0_15px_rgba(0,229,255,0.4)] group-hover:shadow-[0_0_20px_rgba(0,229,255,0.8)] transition-all">
              Explore
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function DiscoveryClient({ initialEntities, initialQuery = '' }) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const filteredEntities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return initialEntities;

    return initialEntities.filter((entity) => (
      entity.name.toLowerCase().includes(query) ||
      entity.scientificClassification?.toLowerCase().includes(query) ||
      entity.category.toLowerCase().includes(query) ||
      entity.latestAnalysis?.mergedSummary?.toLowerCase().includes(query)
    ));
  }, [initialEntities, searchQuery]);

  return (
    <div className="min-h-screen bg-transparent font-sans px-6 sm:px-10 pt-10 pb-24 md:pb-10">
      <div className="w-full max-w-7xl mx-auto flex flex-col mt-12">
        <h1 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-widest mb-10 border-b border-[#102A50] pb-6 drop-shadow-[0_0_10px_rgba(0,229,255,0.2)]">
          Cosmic Discovery Database
        </h1>

        <div className="relative w-full md:w-96 mb-12 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#AAAAAA] group-focus-within:text-[#00E5FF] transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Filter database..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full bg-[#0A1F44]/40 backdrop-blur-md text-white text-md pl-12 pr-4 py-4 border border-[#102A50] focus:outline-none focus:border-[#00E5FF] focus:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all rounded-xl placeholder:text-[#555555]"
            suppressHydrationWarning
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredEntities.length > 0 ? (
            filteredEntities.map((entity) => (
              <EntityCard key={entity.slug} entity={entity} />
            ))
          ) : (
            <div className="glass-card col-span-full p-10 rounded-2xl flex items-center justify-center">
              <p className="text-[#AAAAAA] font-mono tracking-widest text-lg">No matching records found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
