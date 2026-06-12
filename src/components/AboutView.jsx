"use client";

import { Code2, Rocket, Cpu, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

// SVG Icons to bypass lucide-react version mismatches
const MailIcon = ({ className, style }) => (
  <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const GitHubIcon = ({ className, style }) => (
  <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 9 18v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedInIcon = ({ className, style }) => (
  <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut', delay: i * 0.12 },
  }),
};

const TECH_STACK = [
  'Next.js 15', 'React 19', 'Tailwind CSS 4', 'Framer Motion',
  'NASA Open API', 'REST / JSON', 'Vercel Edge', 'ESM Modules',
];

const CONTACT_LINKS = [
  {
    label: 'Email',
    href: 'mailto:haritpatel0902@gmail.com',
    display: 'haritpatel0902@gmail.com',
    Icon: MailIcon,
    color: '#00E5FF',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/Harit009',
    display: 'github.com/Harit009',
    Icon: GitHubIcon,
    color: '#C9D1D9',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/harit-ghetiya-b91ab9413',
    display: 'linkedin.com/in/harit-ghetiya',
    Icon: LinkedInIcon,
    color: '#0A66C2',
  },
];

export default function AboutView({ onBack }) {
  return (
    <div className="min-h-[100vh] w-full relative overflow-x-hidden text-white">

      {/* Background gradient layer */}
      <div className="fixed inset-0 z-[-1] bg-gradient-to-br from-[#000000] via-[#040d1a] to-[#000000]" />
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(0,229,255,0.08),transparent)]" />

      <div className="max-w-5xl mx-auto px-6 sm:px-10 md:px-16 py-16 md:py-24 flex flex-col gap-20">

        {/* ── Hero Header ─────────────────────────────────────────────── */}
        <motion.header
          className="flex flex-col gap-4"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
        >
          {/* Back pill */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 w-max text-[#AAAAAA] hover:text-[#00E5FF] transition-colors text-xs font-mono uppercase tracking-widest mb-2 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-200">{"←"}</span>
            {"Back to Dashboard"}
          </button>

          <div className="flex items-center gap-3">
            <div className="w-2 h-10 rounded-full bg-[#00E5FF] shadow-[0_0_16px_rgba(0,229,255,0.8)]" />
            <div>
              <p className="text-[#00E5FF] font-mono text-xs uppercase tracking-[0.3em] mb-1">{"Mission Profile"}</p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-widest uppercase text-white leading-none">
                {"Harit Ghetiya"}
              </h1>
            </div>
          </div>

          <p className="text-[#AAAAAA] font-mono text-sm tracking-widest uppercase ml-5 pl-5 border-l border-[#102A50]">
            {"Diploma in Computer Engineering"}
          </p>
        </motion.header>

        {/* ── Divider ─────────────────────────────────────────────────── */}
        <motion.div
          className="h-px w-full bg-gradient-to-r from-[#00E5FF]/40 via-[#102A50] to-transparent"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        />

        {/* ── Section 1: Project Architecture ─────────────────────────── */}
        <motion.section
          className="flex flex-col gap-6"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
        >
          <div className="flex items-center gap-4">
            <Cpu className="w-6 h-6 text-[#00E5FF] shrink-0 drop-shadow-[0_0_8px_rgba(0,229,255,0.7)]" />
            <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-[#00E5FF] font-bold">
              {"App Concept & Real-time Feeds"}
            </h2>
          </div>

          <div className="pl-10 flex flex-col gap-5 border-l border-[#102A50]">
            <p className="text-[#CCCCCC] leading-[1.9] text-base">
              {"AstroAid is engineered as a high-density, mission-critical telemetry workspace that consolidates and processes raw planetary science matrix configurations in real time. At its core, the application interfaces directly with the NASA Open API ecosystem—pulling live APOD imagery streams, near-Earth object trajectory datasets, and deep-space telemetry signals—and normalises them into a structured, human-readable data layer through a resilient async fetch pipeline."}
            </p>
            <p className="text-[#CCCCCC] leading-[1.9] text-base">
              {"The architecture leverages the Next.js App Router and Edge Runtime to handle all server-side data aggregation with caching headers, ensuring sub-100ms TTFB on Vercel's global CDN. Client-side, React 19 concurrent features keep the UI non-blocking while Framer Motion drives GPU-accelerated animations, maintaining a strict 60fps rendering budget."}
            </p>
          </div>
        </motion.section>

        {/* ── Section 2: Strategic Mission ────────────────────────────── */}
        <motion.section
          className="flex flex-col gap-6"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2}
        >
          <div className="flex items-center gap-4">
            <Rocket className="w-6 h-6 text-[#00E5FF] shrink-0 drop-shadow-[0_0_8px_rgba(0,229,255,0.7)]" />
            <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-[#00E5FF] font-bold">
              {"Core Engineering Mission"}
            </h2>
          </div>

          <div className="pl-10 flex flex-col gap-5 border-l border-[#102A50]">
            <p className="text-[#CCCCCC] leading-[1.9] text-base">
              {"My personal motivation as a computer engineering student was to convert disparate space telemetry streams into a centralized, beautifully integrated dashboard workspace. Planetary science APIs surface thousands of data points that remain inaccessible to most people precisely because they lack a coherent visual grammar."}
            </p>
            <p className="text-[#CCCCCC] leading-[1.9] text-base">
              {"AstroAid was built to be that grammar. Every design decision—from the OLED-native deep navy palette to the monospaced telemetry counters—is deliberate engineering. The interface should feel like a professional mission-control console, yet remain immediately legible to a curious first-time visitor."}
            </p>
            <p className="text-[#CCCCCC] leading-[1.9] text-base">
              {"This project is a living portfolio artifact—continuously iterated, performance-benchmarked, and held to production-grade standards at every commit to prove that elite software isn't just about features, but the precision with which it communicates its purpose."}
            </p>
          </div>
        </motion.section>

        {/* ── Tech Stack Badges ────────────────────────────────────────── */}
        <motion.section
          className="flex flex-col gap-6"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={3}
        >
          <div className="flex items-center gap-4">
            <Code2 className="w-6 h-6 text-[#00E5FF] shrink-0 drop-shadow-[0_0_8px_rgba(0,229,255,0.7)]" />
            <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-[#00E5FF] font-bold">
              {"Core Technology Stack"}
            </h2>
          </div>

          <div className="flex flex-wrap gap-3 pl-10">
            {TECH_STACK.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-lg border border-[#102A50] bg-[#0A1F44]/50 text-[#AAAAAA] font-mono text-xs uppercase tracking-widest hover:border-[#00E5FF]/60 hover:text-[#00E5FF] hover:bg-[#0A1F44]/80 transition-all duration-200 cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.section>

        {/* ── Contact Grid ─────────────────────────────────────────────── */}
        <motion.section
          className="flex flex-col gap-6"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={4}
        >
          <div className="flex items-center gap-4">
            <Globe className="w-6 h-6 text-[#00E5FF] shrink-0 drop-shadow-[0_0_8px_rgba(0,229,255,0.7)]" />
            <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-[#00E5FF] font-bold">
              {"Digital Channels"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pl-0 sm:pl-10">
            {CONTACT_LINKS.map(({ label, href, display, Icon, color }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="group flex flex-col gap-3 p-5 rounded-2xl border border-[#102A50] bg-[#0A1F44]/30 hover:bg-[#0A1F44]/60 hover:border-[#00E5FF]/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,229,255,0.1)]"
              >
                <Icon
                  className="w-6 h-6 transition-colors duration-300"
                  style={{ color: color }}
                />
                <div>
                  <p className="text-white font-bold text-sm uppercase tracking-wider group-hover:text-[#00E5FF] transition-colors">
                    {label}
                  </p>
                  <p className="text-[#AAAAAA] font-mono text-xs mt-1 truncate">
                    {display}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </motion.section>

        {/* ── Footer Rule ──────────────────────────────────────────────── */}
        <motion.div
          className="h-px w-full bg-gradient-to-r from-transparent via-[#102A50] to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        />

        <motion.p
          className="text-center font-mono text-[10px] text-[#444444] uppercase tracking-[0.3em]"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={5}
        >
          {"AstroAid · Built by Harit Ghetiya · Diploma in Computer Engineering"}
        </motion.p>

      </div>
    </div>
  );
}
