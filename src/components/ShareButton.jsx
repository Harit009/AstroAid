"use client";

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-950/80 backdrop-blur-xl border border-cyan-500/50 hover:bg-cyan-900 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all duration-300 text-sm font-bold tracking-wider uppercase text-cyan-200 group"
    >
      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />}
      {copied ? "Link Copied!" : "Share Archive"}
    </button>
  );
}
