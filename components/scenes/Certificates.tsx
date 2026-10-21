"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { AnimatePresence, motion } from "framer-motion";
import Scene from "../Scene";
import Portal from "../Portal";
import ReelIcon from "../ReelIcon";
import { useHorizontalPin } from "@/hooks/useHorizontalPin";
import { certificates } from "@/data/portfolio";

export default function Certificates() {
  const section = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reel = useRef<SVGSVGElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  // film reel: scrolling down moves the strip sideways
  useHorizontalPin({
    section,
    track,
    priority: 1,
    onProgress: (p) => {
      if (reel.current) gsap.set(reel.current, { rotation: p * 720 });
      if (bar.current) gsap.set(bar.current, { scaleX: p });
    },
  });

  const step = useCallback((d: number) => {
    setOpen((i) => (i === null ? i : (i + d + certificates.length) % certificates.length));
  }, []);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  const cur = open !== null ? certificates[open] : null;

  return (
    <div ref={section} className="relative">
      <Scene id="certificates" className="flex flex-col justify-center overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-24 md:px-12">
          <div>
            <h2 className="poster-title text-5xl md:text-7xl">
              Top <span className="text-brand">Moments</span>
            </h2>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.3em] text-white/50">Scroll to roll the film · Tap a certificate to view</p>
          </div>
          <ReelIcon ref={reel} className="hidden h-20 w-20 md:block" />
        </div>

        <div className="mx-6 mt-4 h-[2px] bg-white/10 md:mx-12">
          <div ref={bar} className="h-full origin-left scale-x-0 bg-brand shadow-glow" />
        </div>

        <div className="mt-6 w-full overflow-visible py-4">
          <div ref={track} className="flex w-max items-stretch gap-0 px-6 will-change-transform md:px-12">
            {certificates.map((c, i) => (
              <button
                key={c.image}
                onClick={() => setOpen(i)}
                className="group relative w-[80vw] shrink-0 border-x-4 border-black bg-[#09090a] text-left transition-colors hover:bg-[#120406] sm:w-[440px]"
              >
                <div className="sprockets mx-3 mt-3" />
                <div className="relative mx-3 mt-2 overflow-hidden border border-white/10 bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image} alt={c.title} loading="lazy" className="cert-dim aspect-[1521/1075] w-full object-contain" />
                  <span className="absolute bottom-2 right-3 font-poster text-5xl leading-none text-white/30 mix-blend-difference">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="px-6 pb-3 pt-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand">
                    {c.issuer}
                    {c.date ? ` · ${c.date}` : ""}
                  </p>
                  <p className="mt-1 line-clamp-2 min-h-[2.6em] font-title text-base leading-snug text-white/90">{c.title}</p>
                </div>
                <div className="sprockets mx-3 mb-3" />
              </button>
            ))}
            <div className="w-[15vw] shrink-0" />
          </div>
        </div>
      </Scene>

      <Portal>
        <AnimatePresence>
          {cur && open !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(null)}
              className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-black/95 p-4"
            >
              <button onClick={() => setOpen(null)} className="absolute right-5 top-5 font-mono text-xs uppercase tracking-[0.3em] text-white/70 hover:text-brand">
                Close ✕
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                aria-label="Previous certificate"
                className="absolute left-3 top-1/2 -translate-y-1/2 border border-white/20 bg-black/60 px-4 py-3 text-2xl hover:border-brand md:left-8"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                aria-label="Next certificate"
                className="absolute right-3 top-1/2 -translate-y-1/2 border border-white/20 bg-black/60 px-4 py-3 text-2xl hover:border-brand md:right-8"
              >
                ›
              </button>
              <motion.div
                key={open}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-full max-w-5xl flex-col items-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cur.image} alt={cur.title} className="max-h-[78vh] w-auto max-w-full shadow-glow" style={{ filter: "brightness(0.85)" }} />
                <p className="mt-4 text-center font-title text-lg text-white">{cur.title}</p>
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-brand">
                  {cur.issuer}
                  {cur.date ? ` · ${cur.date}` : ""} · {open + 1}/{certificates.length}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>
    </div>
  );
}
