"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import LiveMissionControl from '../components/LiveMissionControl';

export default function Home() {
  const [apodData, setApodData] = useState(null);
  const [isApodLoading, setIsApodLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  
  const { scrollY } = useScroll();
  // Very subtle parallax effect for the stars
  const yParallax = useTransform(scrollY, [0, 2000], [0, 80]);

  useEffect(() => {
    const fetchApod = async () => {
      try {
        const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=lAdhdmrRy8SIyfx43g1gs6Hht1n6bcmpS1RtK70z');
        if (!response.ok) throw new Error('APOD failed');
        const data = await response.json();
        setApodData(data);
      } catch (err) {} finally {
        setIsApodLoading(false);
      }
    };
    fetchApod();
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      router.push(`/discovery?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-[100vh] flex flex-col relative text-[#FFFFFF]">
      {/* High Performance Parallax Background */}
      <motion.div 
        style={{ y: yParallax }} 
        className="fixed inset-0 z-[-1] w-full h-[120vh] -top-[10vh]"
      >
        <Image 
          src="/cosmic_nebula_bg.png" 
          alt="Cosmic Nebula Starfield" 
          fill
          priority
          quality={100}
          className="object-cover opacity-80"
          sizes="100vw"
        />
        {/* OLED deep blend layer to maintain contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/60 via-[#0A1F44]/50 to-[#000000]/90 mix-blend-multiply"></div>
      </motion.div>
      
      <div className="flex flex-col items-center justify-center p-6 sm:p-12 md:p-20 z-10 w-full max-w-6xl mx-auto gap-24">
          {/* Hero Section */}
          <section className="w-full flex flex-col items-center text-center mt-12">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-widest mb-6 uppercase w-full">
              AstroAid: 
              <span className="block text-2xl sm:text-3xl md:text-4xl text-[#00E5FF] mt-3 font-bold tracking-widest drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]">
                Astronomical Intelligence
              </span>
            </h1>
            <p className="text-sm md:text-base text-[#AAAAAA] font-medium max-w-2xl leading-relaxed mb-12">
              Harit Ghetiya welcomes you to this portal mapping deep-space phenomena. Explore cosmic entities, real-time trajectory arrays, and NASA's daily scientific registry.
            </p>

            {/* Search Bar - Glassmorphism */}
            <div className="w-full max-w-4xl relative group">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-[#AAAAAA] group-focus-within:text-[#00E5FF] transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search entities, theories, or categories (Press Enter)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full bg-[#0A1F44]/40 backdrop-blur-xl text-white text-lg pl-16 pr-6 py-5 md:py-6 rounded-2xl border border-[#102A50] group-focus-within:border-[#00E5FF] group-focus-within:shadow-[0_0_30px_rgba(0,229,255,0.2)] focus:outline-none transition-all duration-500 placeholder:text-[#AAAAAA]"
              />
            </div>
          </section>

          {/* New Live Mission Control Section (Moved from Tracker) */}
          <section className="w-full">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-3 h-3 bg-[#00E5FF] rounded-full animate-pulse shadow-[0_0_10px_#00E5FF]"></div>
              <h2 className="text-3xl font-black uppercase tracking-widest text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                Live Mission Control
              </h2>
            </div>
            <LiveMissionControl />
          </section>

          {/* NASA APOD Section - Glassmorphism */}
          <section className="w-full">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#102A50]"></div>
              <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]">
                Intel Registry
              </h2>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#102A50]"></div>
            </div>
            
            {isApodLoading ? (
              <div className="glass-card w-full h-64 rounded-3xl flex items-center justify-center">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-[#00E5FF] border-t-transparent inline-block animate-spin rounded-full"></div>
                  <span className="text-[#00E5FF] font-mono text-sm tracking-widest uppercase">Connecting to Payload...</span>
                </div>
              </div>
            ) : apodData ? (
              <div className="glass-card w-full rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/2 aspect-video overflow-hidden rounded-xl border border-[#102A50] bg-black">
                  {apodData.media_type === "video" ? (
                    <iframe src={apodData.url} title={apodData.title} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" allowFullScreen />
                  ) : (
                    <img src={apodData.url} alt={apodData.title} loading="lazy" decoding="async" onError={(e) => { e.target.onerror = null; e.target.src = '/cosmic_nebula_bg.png'; }} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
                  )}
                </div>
                <div className="w-full md:w-1/2 flex flex-col justify-center">
                  <div className="inline-block px-3 py-1 bg-[#0A1F44] border border-[#102A50] rounded-full w-max text-[10px] text-[#00E5FF] font-bold tracking-widest uppercase mb-4 shadow-[0_0_10px_rgba(0,229,255,0.2)]">Picture of the Day</div>
                  <h3 className="text-2xl md:text-3xl font-bold glass-title mb-4 uppercase leading-tight drop-shadow-md">{apodData.title}</h3>
                  <p className="text-[#AAAAAA] leading-relaxed text-sm md:text-base font-medium overflow-y-auto max-h-48 pr-2">
                    {apodData.explanation}
                  </p>
                </div>
              </div>
            ) : null}
          </section>

      </div>
    </div>
  );
}
