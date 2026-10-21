"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Scene from "../Scene";
import Portal from "../Portal";
import { projects, type Project } from "@/data/portfolio";

function Poster({ p, index, onOpen }: { p: Project; index: number; onOpen: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const [hover, setHover] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [videoOk, setVideoOk] = useState(true);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({ x: ((e.clientX - r.left) / r.width - 0.5) * 12, y: -((e.clientY - r.top) / r.height - 0.5) * 12 });
  };

  const enter = () => {
    setHover(true);
    video.current?.play().catch(() => undefined);
  };
  const leave = () => {
    setHover(false);
    setTilt({ x: 0, y: 0 });
    if (video.current) {
      video.current.pause();
      video.current.currentTime = 0;
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.12, duration: 0.7 }}
    >
      <div
        onPointerEnter={enter}
        onPointerLeave={leave}
        onPointerMove={onMove}
        onClick={onOpen}
        style={{ transform: `perspective(900px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) scale(${hover ? 1.03 : 1})`, transition: "transform .2s ease-out" }}
        className="group relative aspect-[2/3] w-full cursor-pointer overflow-hidden border border-white/10 shadow-2xl"
      >
        {p.poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.poster} alt={p.title} className="poster-dim absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 25%, ${p.colors[0]}, ${p.colors[1]} 75%)` }} />
        )}

        {/* hover preview: real clip if provided, otherwise a scanline "playing" effect */}
        {p.video && videoOk ? (
          <video
            ref={video}
            src={p.video}
            muted
            loop
            playsInline
            preload="none"
            onError={() => setVideoOk(false)}
            className={`video-dim absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${hover ? "opacity-100" : "opacity-0"}`}
          />
        ) : (
          <div className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${hover ? "opacity-100" : "opacity-0"}`}>
            <div className="absolute inset-0 animate-scan bg-gradient-to-b from-transparent via-white/15 to-transparent" />
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.25)_0_2px,transparent_2px_4px)]" />
          </div>
        )}

        {/* hover "PREVIEW" badge */}
        <span className={`pointer-events-none absolute bottom-3 left-3 flex items-center gap-2 bg-black/70 px-2 py-1 font-mono text-[10px] tracking-widest text-white transition-opacity duration-300 ${hover ? "opacity-100" : "opacity-0"}`}>
          <span className="h-2 w-2 animate-pulse rounded-full bg-brand" /> PREVIEW
        </span>

        {/* top labels */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/55 to-transparent" />
        <div className="pointer-events-none absolute left-4 right-4 top-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-white/90">
          <span>{p.year}</span>
          <span className={p.runtime === "LIVE" ? "text-brand" : ""}>{p.runtime}</span>
        </div>

        {/* posters without baked-in text get a title block */}
        {!p.posterHasTitle && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/60 to-transparent p-5 pt-16">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/60">{p.genre}</p>
            <h3 className="poster-title mt-1 text-4xl md:text-5xl">{p.title}</h3>
            <p className="mt-1 text-sm italic text-white/70">{p.tagline}</p>
          </div>
        )}
      </div>

      {/* under the poster: stack + links */}
      <div className="mt-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">{p.stack.join(" · ")}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {p.live && (
            <a href={p.live} target="_blank" rel="noreferrer" className="btn-mini solid">
              ▶ Live Demo
            </a>
          )}
          {p.github && (
            <a href={p.github} target="_blank" rel="noreferrer" className="btn-mini">
              GitHub
            </a>
          )}
          <button onClick={onOpen} className="btn-mini">
            Synopsis
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const [open, setOpen] = useState<Project | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <Scene id="projects" className="py-32">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="poster-title text-center text-5xl sm:text-6xl md:text-8xl">
          Original <span className="text-brand">Productions</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-white/60">Hover a poster for the trailer. Tap for the full synopsis.</p>
        <div className="mx-auto mt-14 grid max-w-sm gap-10 sm:max-w-none sm:grid-cols-3 sm:gap-8">
          {projects.map((p, i) => (
            <Poster key={p.title} p={p} index={i} onOpen={() => setOpen(p)} />
          ))}
        </div>
      </div>

      <Portal>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(null)}
              className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-5 backdrop-blur"
            >
              <motion.div
                initial={{ scale: 0.92, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="film-frame max-h-[92vh] w-full max-w-2xl overflow-y-auto p-7 shadow-glow"
              >
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand">
                  {open.genre} · {open.year}
                </p>
                <h3 className="poster-title mt-2 text-5xl md:text-6xl">{open.title}</h3>
                <p className="mt-1 italic text-white/60">{open.tagline}</p>
                <p className="mt-5 text-white/80">{open.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {open.stack.map((s) => (
                    <span key={s} className="border border-white/20 px-3 py-1 font-mono text-[11px] tracking-widest text-white/70">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-7 flex flex-wrap gap-3">
                  {open.live && (
                    <a className="btn-cine" href={open.live} target="_blank" rel="noreferrer">
                      ▶ Live Demo
                    </a>
                  )}
                  {open.github && (
                    <a className="btn-ghost" href={open.github} target="_blank" rel="noreferrer">
                      GitHub
                    </a>
                  )}
                  <button className="btn-ghost" onClick={() => setOpen(null)}>
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>
    </Scene>
  );
}
