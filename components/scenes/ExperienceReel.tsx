"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { AnimatePresence, motion } from "framer-motion";
import Scene from "../Scene";
import Portal from "../Portal";
import ReelIcon from "../ReelIcon";
import { useHorizontalPin } from "@/hooks/useHorizontalPin";
import { useInView } from "@/hooks/useInView";
import { experience, type Experience } from "@/data/portfolio";

/** Clip that plays muted + looped while its frame is on screen; falls back to a still if the file is missing. */
function ReelClip({ e, className = "" }: { e: Experience; className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>("0px");
  const vid = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    if (inView) v.play().catch(() => undefined);
    else v.pause();
  }, [inView]);

  return (
    <div ref={ref} className={`relative overflow-hidden bg-black ${className}`}>
      {failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={e.image} alt={e.role} className="img-dim h-full w-full object-cover" style={{ objectPosition: e.imagePosition ?? "center" }} />
      ) : (
        <video
          ref={vid}
          src={e.video}
          poster={e.image}
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setFailed(true)}
          className="video-dim h-full w-full object-cover"
        />
      )}
    </div>
  );
}

export default function ExperienceReel() {
  const section = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reel = useRef<SVGSVGElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  useHorizontalPin({
    section,
    track,
    priority: 2,
    onProgress: (p) => {
      if (reel.current) gsap.set(reel.current, { rotation: p * 720 });
    },
  });

  useEffect(() => {
    if (open === null) return;
    const onKey = (ev: KeyboardEvent) => ev.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const cur = open !== null ? experience[open] : null;

  return (
    <div ref={section} className="relative">
      <Scene id="experience" className="flex flex-col justify-center overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-24 md:px-12">
          <div>
            <h2 className="poster-title text-5xl md:text-7xl">
              The <span className="text-brand">Reel</span>
            </h2>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.3em] text-white/50">Scroll to roll the film · Tap a frame to watch</p>
          </div>
          <ReelIcon ref={reel} className="hidden h-20 w-20 md:block" />
        </div>

        <div className="mt-6 w-full overflow-visible py-4">
          <div ref={track} className="flex w-max items-stretch gap-0 px-6 will-change-transform md:px-12">
            {experience.map((e, i) => (
              <button
                key={i}
                onClick={() => setOpen(i)}
                className="group relative flex w-[84vw] shrink-0 flex-col border-x-4 border-black bg-[#09090a] text-left transition-colors hover:bg-[#120406] sm:w-[460px]"
              >
                <div className="sprockets mx-3 mt-3" />
                <div className="relative mx-3 mt-2">
                  <ReelClip e={e} className="aspect-video w-full border border-white/10" />
                  <span className="absolute left-3 top-3 bg-black/70 px-2 py-1 font-mono text-[10px] tracking-[0.3em] text-brand">{e.tag}</span>
                  <span className="absolute bottom-2 right-3 font-poster text-5xl leading-none text-white/30">{String(i + 1).padStart(2, "0")}</span>
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/90 text-xl shadow-glow">▶</span>
                  </span>
                </div>
                <div className="flex-1 px-6 pb-3 pt-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand">{e.period}</p>
                  <h3 className="mt-1 font-poster text-3xl tracking-wide md:text-4xl">{e.role}</h3>
                  <p className="font-title text-base text-white/70">{e.company}</p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 group-hover:text-white">Watch &amp; details →</p>
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
          {cur && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(null)}
              className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-4 backdrop-blur"
            >
              <motion.div
                initial={{ scale: 0.92, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(ev) => ev.stopPropagation()}
                className="film-frame max-h-[94vh] w-full max-w-3xl overflow-y-auto shadow-glow"
              >
                <video
                  key={cur.video}
                  src={cur.video}
                  poster={cur.image}
                  controls
                  autoPlay
                  playsInline
                  className="aspect-video max-h-[56vh] w-full bg-black object-contain"
                />
                <div className="p-6">
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand">{cur.period}</p>
                  <h3 className="mt-1 font-poster text-4xl md:text-5xl">{cur.role}</h3>
                  <p className="font-title text-white/70">
                    {cur.company} · {cur.location}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {cur.points.map((p, i) => (
                      <li key={i} className="flex gap-3 text-sm text-white/80 md:text-base">
                        <span className="text-brand">▶</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                  <button className="btn-ghost mt-6" onClick={() => setOpen(null)}>
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>
    </div>
  );
}
