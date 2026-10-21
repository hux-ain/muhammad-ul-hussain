"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { AnimatePresence, motion } from "framer-motion";
import Scene from "../Scene";
import Portal from "../Portal";
import { profile } from "@/data/portfolio";

function TrailerModal({ onClose }: { onClose: () => void }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[95] flex items-center justify-center bg-black/90 p-4 backdrop-blur"
    >
      <motion.div
        initial={{ scale: 0.92 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl border border-white/10 bg-black shadow-glow"
      >
        <button
          onClick={onClose}
          aria-label="Close trailer"
          className="absolute -top-11 right-0 font-mono text-xs uppercase tracking-[0.3em] text-white/70 hover:text-brand"
        >
          Close ✕
        </button>
        {failed ? (
          <div className="flex aspect-video flex-col items-center justify-center gap-3 p-8 text-center">
            <p className="poster-title text-4xl text-brand">Trailer unavailable</p>
            <p className="max-w-md text-white/60">
              Could not play <code className="text-white">public{profile.trailerVideo}</code>. Check that the file exists and is an H.264 .mp4.
            </p>
          </div>
        ) : (
          <video
            src={profile.trailerVideo}
            className="mx-auto aspect-video max-h-[82vh] w-full bg-black object-contain"
            controls
            autoPlay
            playsInline
            onError={() => setFailed(true)}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

export default function OpeningTitle({ started }: { started: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [trailer, setTrailer] = useState(false);
  const [glitchOn, setGlitchOn] = useState(false);

  useEffect(() => {
    if (!started || !wrap.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3, onComplete: () => setGlitchOn(true) });
      tl.fromTo(".o-hero", { opacity: 0, x: 80, scale: 1.05 }, { opacity: 1, x: 0, scale: 1, duration: 1.8, ease: "power3.out" })
        .fromTo(".o-presents", { opacity: 0, letterSpacing: "1.1em" }, { opacity: 1, letterSpacing: "0.5em", duration: 1.4, ease: "power2.out" }, 0.2)
        .fromTo(
          ".o-letter",
          { opacity: 0, y: 60, scale: 1.5, filter: "blur(14px)" },
          { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.9, stagger: 0.045, ease: "power4.out" },
          "-=0.9"
        )
        .fromTo(".o-role", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.2")
        .fromTo(".o-tag", { opacity: 0 }, { opacity: 1, duration: 1 }, "-=0.2")
        .fromTo(".o-cta", { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.6 }, "-=0.4");
    }, wrap);
    return () => ctx.revert();
  }, [started]);

  return (
    <Scene id="opening" className="flex items-center">
      <div
        ref={wrap}
        className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-4 px-6 pb-16 pt-28 md:grid-cols-[1.15fr_1fr] md:gap-0 md:px-10"
      >
        {/* text */}
        <div className="order-2 text-center md:order-1 md:text-left">
          <p className="o-presents mb-5 font-mono text-[10px] uppercase text-white/70 opacity-0 md:text-sm">{profile.presents}</p>

          {/* Each line is nowrap and carries its own glitch layer, so the title can never break mid-word. */}
          <h1 className="poster-title text-[clamp(2.6rem,11.5vw,4.6rem)] text-white md:text-[clamp(3.2rem,6.6vw,7.5rem)]">
            {profile.titleLines.map((line) => (
              <span key={line} className={`mx-auto block w-fit whitespace-nowrap md:mx-0 ${glitchOn ? "glitch" : ""}`} data-text={line}>
                {line.split("").map((ch, i) => (
                  <span key={i} className="o-letter inline-block opacity-0">
                    {ch}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <div className="o-role mt-6 flex items-center justify-center gap-4 opacity-0 md:justify-start">
            <span className="h-px w-10 bg-brand md:w-16" />
            <p className="font-title text-sm uppercase tracking-[0.35em] text-brand red-glow md:text-xl">{profile.role}</p>
          </div>

          <p className="o-tag mx-auto mt-5 max-w-xl text-sm italic text-white/70 opacity-0 md:mx-0 md:text-lg">“{profile.tagline}”</p>

          <div className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start">
            {profile.badges.map((b) => (
              <span key={b} className="o-cta border border-white/25 px-3 py-1 font-mono text-[10px] tracking-[0.25em] text-white/70 opacity-0">
                {b}
              </span>
            ))}
          </div>

          <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:justify-start">
            <button onClick={() => setTrailer(true)} className="btn-cine o-cta opacity-0">
              ▶ Watch Trailer
            </button>
            <a href="#projects" className="btn-ghost o-cta opacity-0">
              View Projects
            </a>
          </div>
        </div>

        {/* cut-out portrait */}
        <div className="o-hero relative order-1 mx-auto h-[52vh] w-full max-w-[420px] opacity-0 md:order-2 md:h-[84vh] md:max-w-none">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,rgba(229,9,20,0.35),transparent_65%)]" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.heroImage}
            alt={profile.name}
            className="img-dim relative h-full w-full object-contain object-bottom"
          />
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 text-center font-mono text-[10px] uppercase tracking-[0.4em] text-white/50 md:block"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        Scroll ↓
      </motion.div>

      <Portal>
        <AnimatePresence>{trailer && <TrailerModal onClose={() => setTrailer(false)} />}</AnimatePresence>
      </Portal>
    </Scene>
  );
}
