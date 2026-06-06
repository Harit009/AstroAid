"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Telescope, Search, Radar, Home, User } from 'lucide-react';
import AboutModal from './AboutModal';

export default function Navigation() {
  const pathname = usePathname();
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const isActive = (path) => pathname === path || (path !== '/' && pathname?.startsWith(path));

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Discovery', path: '/discovery', icon: Search },
    { name: 'Tracker', path: '/tracker', icon: Radar },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="w-[260px] bg-[#0A1F44]/40 backdrop-blur-[15px] border-r border-[#102A50] flex-col justify-between hidden md:flex fixed top-0 bottom-0 left-0 z-50">
        <div>
          <div className="flex items-center gap-4 px-8 py-10 border-b border-[#102A50] shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            <Telescope className="w-8 h-8 text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
            <span className="text-2xl font-bold tracking-widest text-white uppercase">AstroAid</span>
          </div>
          
          <div className="flex flex-col gap-2 px-4 mt-8">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
              <Link 
                key={link.name}
                href={link.path}
                className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 ${isActive(link.path) ? 'bg-[#00E5FF]/10 text-[#00E5FF] font-bold shadow-[inset_4px_0_0_0_#00E5FF]' : 'text-[#AAAAAA] hover:text-[#00E5FF] hover:bg-[#0A1F44]/60 font-medium'}`}
              >
                <Icon className={`w-5 h-5 ${isActive(link.path) ? 'text-[#00E5FF] drop-shadow-[0_0_5px_rgba(0,229,255,0.6)]' : ''}`} />
                <span className="tracking-wider uppercase text-sm">{link.name}</span>
              </Link>
              );
            })}
          </div>
        </div>

        {/* Profile Avatar Placeholder */}
        <div className="p-6 border-t border-[#102A50] shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setIsAboutOpen(true)}>
            <div className="w-10 h-10 rounded-full bg-[#00E5FF]/10 border-2 border-[#00E5FF]/40 group-hover:border-[#00E5FF] transition-colors flex items-center justify-center overflow-hidden shrink-0 shadow-[0_0_10px_rgba(0,229,255,0.2)]">
               <User className="w-5 h-5 text-[#00E5FF] group-hover:text-white transition-colors" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-white text-sm font-bold uppercase tracking-wider group-hover:text-[#00E5FF] transition-colors truncate">Harit Ghetiya</span>
              <span className="text-[#AAAAAA] text-[10px] font-mono group-hover:text-[#00E5FF]/80 transition-colors truncate">Diploma in Computer Engineering</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Header (Brand & Profile) */}
      <nav className="w-full bg-[#0A1F44]/80 backdrop-blur-[15px] border-b border-[#102A50] md:hidden fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2">
          <Telescope className="w-6 h-6 text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
          <span className="text-sm font-bold tracking-widest text-white uppercase truncate max-w-[80px]">AstroAid</span>
        </div>
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setIsAboutOpen(true)}>
            <div className="flex flex-col overflow-hidden text-right">
              <span className="text-white text-[10px] font-bold uppercase tracking-wider group-hover:text-[#00E5FF] transition-colors truncate">Harit Ghetiya</span>
              <span className="text-[#AAAAAA] text-[8px] font-mono group-hover:text-[#00E5FF]/80 transition-colors truncate">Diploma in Computer Eng.</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/40 flex items-center justify-center shrink-0">
               <User className="w-4 h-4 text-[#00E5FF]" />
            </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="w-full bg-[#0A1F44]/80 backdrop-blur-[15px] border-t border-[#102A50] md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center py-4 px-2 safe-area-bottom shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
          <Link 
            key={link.name}
            href={link.path}
            className={`flex flex-col items-center gap-1.5 transition-colors p-2 ${isActive(link.path) ? 'text-[#00E5FF]' : 'text-[#AAAAAA] hover:text-white'}`}
          >
            <Icon className={`w-6 h-6 ${isActive(link.path) ? 'drop-shadow-[0_0_6px_rgba(0,229,255,0.6)]' : ''}`} />
            <span className="text-[10px] uppercase font-bold tracking-widest">{link.name}</span>
          </Link>
          );
        })}
      </nav>

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </>
  );
}
