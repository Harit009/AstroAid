import { Mail, ExternalLink, Link2 } from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm bg-slate-950/40 p-4" 
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-slate-900/90 border border-zinc-800 rounded-2xl shadow-2xl relative flex flex-col p-8 md:p-10 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors"
          aria-label="Close Modal"
        >
          <span className="font-mono font-bold text-sm tracking-widest">[ X ]</span>
        </button>

        <div className="mb-8 border-b border-zinc-800 pb-6">
          <h2 className="font-mono text-2xl md:text-3xl font-black text-white tracking-widest uppercase">
            Harit Ghetiya
          </h2>
          <p className="text-[#00E5FF] font-mono text-sm tracking-widest uppercase mt-2">
            Diploma in Computer Engineering
          </p>
        </div>

        <div className="flex flex-col gap-8">
          <section>
            <h3 className="font-mono text-zinc-500 text-xs uppercase tracking-widest font-bold mb-3">
              About The App
            </h3>
            <p className="text-zinc-300 leading-relaxed text-sm">
              AstroAid was built as an advanced, high-density telemetry workspace bridging real-time planetary science data from the NASA Open API with global biosphere monitoring systems.
            </p>
          </section>

          <section>
            <h3 className="font-mono text-zinc-500 text-xs uppercase tracking-widest font-bold mb-3">
              Mission Log (Why I Built It)
            </h3>
            <p className="text-zinc-300 leading-relaxed text-sm">
              To design a cohesive, professional mission-control interface that simplifies complex space weather and Earth climate systems into an actionable, elite dashboard for space enthusiasts and researchers.
            </p>
          </section>

          <section>
            <h3 className="font-mono text-zinc-500 text-xs uppercase tracking-widest font-bold mb-4">
              Digital Channels & Contacts
            </h3>
            <div className="flex flex-wrap gap-4">
              <a 
                href="mailto:haritpatel0902@gmail.com" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 bg-slate-800/50 hover:bg-slate-700 hover:border-zinc-500 transition-all text-sm font-mono text-zinc-300 hover:text-white group"
              >
                <Mail className="w-4 h-4 text-zinc-400 group-hover:text-[#00E5FF]" />
                Email
              </a>
              <a 
                href="https://github.com/Harit009" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 bg-slate-800/50 hover:bg-slate-700 hover:border-zinc-500 transition-all text-sm font-mono text-zinc-300 hover:text-white group"
              >
                <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-[#00E5FF]" />
                GitHub
              </a>
              <a 
                href="https://www.linkedin.com/in/harit-ghetiya-b91ab9413" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 bg-slate-800/50 hover:bg-slate-700 hover:border-zinc-500 transition-all text-sm font-mono text-zinc-300 hover:text-white group"
              >
                <Link2 className="w-4 h-4 text-zinc-400 group-hover:text-[#00E5FF]" />
                LinkedIn
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
