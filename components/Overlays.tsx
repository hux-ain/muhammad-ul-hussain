"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { scenes } from "@/data/portfolio";

/** Film grain, vignette, flicker, letterbox bars, scroll progress. */
export function Overlays() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <>
      <div className="grain" />
      <div className="vignette" />
      <div className="flicker" />
      <div className="letterbox top-0" />
      <div className="letterbox bottom-0" />
      <motion.div
        style={{ scaleX }}
        className="fixed left-0 right-0 top-0 z-[70] h-[3px] origin-left bg-brand shadow-glow"
      />
    </>
  );
}

/** Right-side scene dots. */
export function SceneNav() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(els.indexOf(e.target as HTMLElement));
        });
      },
      { threshold: 0.45 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav className="fixed right-4 top-1/2 z-[65] hidden -translate-y-1/2 flex-col items-end gap-3 md:flex" aria-label="Scenes">
      {scenes.map((s, i) => (
        <button
          key={s.id}
          onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })}
          className="group flex items-center gap-3"
          aria-label={s.label}
        >
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/0 transition-all group-hover:text-white/80">
            {s.label}
          </span>
          <span
            className={`block h-2 rounded-full transition-all ${
              active === i ? "w-8 bg-brand shadow-glow" : "w-2 bg-white/30 group-hover:bg-white/70"
            }`}
          />
        </button>
      ))}
    </nav>
  );
}

/** Top bar: monogram + music toggle. */
export function TopBar({
  playing,
  mode,
  onToggle,
  brand,
}: {
  playing: boolean;
  mode: "file" | "synth" | null;
  onToggle: () => void;
  brand: string;
}) {
  return (
    <header className="fixed left-0 right-0 top-0 z-[65] flex items-center justify-between px-5 pb-3 pt-6 md:px-10">
      <a href="#opening" className="font-poster text-2xl tracking-widest text-white">
        <span className="text-brand">▶</span> {brand}
      </a>
      <button
        onClick={onToggle}
        aria-pressed={playing}
        aria-label={playing ? "Mute background music" : "Play background music"}
        title={mode === "synth" && playing ? "Synth score (add public/audio/cinematic.mp3 for your own)" : ""}
        className="flex items-center gap-3 border border-white/20 bg-black/50 px-4 py-2 backdrop-blur transition hover:border-brand hover:shadow-glow"
      >
        <span className="flex h-4 items-end gap-[3px]">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`block w-[3px] origin-bottom bg-brand ${playing ? "animate-bar" : "scale-y-[0.3]"}`}
              style={{ height: "100%", animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/80">
          Score {playing ? "On" : "Off"}
        </span>
      </button>
    </header>
  );
}

/** Splash gate — gives a user gesture so audio is allowed to start. */
export function IntroGate({
  open,
  onEnter,
}: {
  open: boolean;
  onEnter: (withSound: boolean) => void;
}) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (!open) return;
    const id = window.setInterval(() => setPct((p) => (p >= 100 ? 100 : p + Math.ceil(Math.random() * 9))), 90);
    return () => window.clearInterval(id);
  }, [open]);

  return (
    <motion.div
      initial={false}
      animate={{ opacity: open ? 1 : 0 }}
      transition={{ duration: 0.8 }}
      style={{ pointerEvents: open ? "auto" : "none" }}
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-black px-6 text-center"
    >
      <p className="mb-6 font-mono text-xs uppercase tracking-[0.4em] text-white/50">Loading trailer… {Math.min(pct, 100)}%</p>
      <div className="mb-10 h-[2px] w-56 bg-white/10">
        <div className="h-full bg-brand shadow-glow transition-all" style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
      <h1 className="poster-title text-5xl text-white md:text-7xl">Best experienced with sound</h1>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <button className="btn-cine" disabled={pct < 100} style={{ opacity: pct < 100 ? 0.4 : 1 }} onClick={() => onEnter(true)}>
          ▶ Enter with sound
        </button>
        <button className="btn-ghost" disabled={pct < 100} style={{ opacity: pct < 100 ? 0.4 : 1 }} onClick={() => onEnter(false)}>
          Enter silent
        </button>
      </div>
    </motion.div>
  );
}
