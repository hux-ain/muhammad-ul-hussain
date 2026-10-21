"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { motion } from "framer-motion";
import Scene from "../Scene";
import { skills, type Skill } from "@/data/portfolio";
import { useInView } from "@/hooks/useInView";

const SkillCore = dynamic(() => import("../three/SkillCore"), { ssr: false });

const categories = ["All", "Frontend", "Backend", "Database", "DevOps"] as const;
const groups = ["Frontend", "Backend", "Database", "DevOps"] as const;

const HEX = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

/**
 * Layers, back to front:
 *   glow   – blurred coloured hex, only ever visible OUTSIDE the tile outline
 *   border – coloured hex
 *   base   – fully opaque dark hex (nothing from the 3D core can show through)
 *   tint   – subtle colour wash on hover (kept dark, so white text always stays readable)
 *   text   – always on top
 */
function HexTile({ skill, dimmed, i }: { skill: Skill; dimmed: boolean; i: number }) {
  const [hover, setHover] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: i * 0.04, type: "spring", stiffness: 160, damping: 16 }}
    >
      <div
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        className="relative isolate h-[150px] w-[130px] cursor-default transition-all duration-300 sm:h-[162px] sm:w-[140px]"
        style={{
          opacity: dimmed ? 0.2 : 1,
          filter: dimmed ? "grayscale(1)" : "none",
          transform: hover ? "scale(1.08) translateY(-4px)" : "none",
          zIndex: hover ? 5 : 1,
        }}
      >
        {/* glow (outside only). The hex is clipped INSIDE the blurred wrapper, otherwise clip-path would cut the blur into a hard grey outline. */}
        <div
          className="pointer-events-none absolute -inset-2 -z-10 transition-opacity duration-300"
          style={{ filter: "blur(16px)", opacity: hover ? 0.55 : 0 }}
        >
          <div className="h-full w-full" style={{ clipPath: HEX, background: skill.color }} />
        </div>
        {/* border */}
        <div className="absolute inset-0" style={{ clipPath: HEX, background: hover ? skill.color : `${skill.color}99` }} />
        {/* opaque base */}
        <div className="absolute inset-[2px]" style={{ clipPath: HEX, background: "#0a0a0c" }} />
        {/* hover tint, mixed into dark so it never gets bright */}
        <div
          className="absolute inset-[2px] transition-opacity duration-300"
          style={{
            clipPath: HEX,
            background: `radial-gradient(circle at 50% 38%, color-mix(in srgb, ${skill.color} 22%, #0a0a0c), #0a0a0c 78%)`,
            opacity: hover ? 1 : 0,
          }}
        />
        {/* text */}
        <div className="absolute inset-[2px] z-10 flex flex-col items-center justify-center px-4 text-center">
          <p className="font-poster text-[1.45rem] leading-[1.02] tracking-wide text-white">{skill.name}</p>
          <p className="mt-1 font-mono text-[11px] tracking-widest" style={{ color: skill.color }}>
            {Math.round(skill.level * 100)}%
          </p>
          <div className="mt-2 h-[3px] w-14 bg-white/10">
            <div className="h-full" style={{ width: `${skill.level * 100}%`, background: skill.color }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const [active, setActive] = useState<(typeof categories)[number]>("All");
  const { ref, inView } = useInView<HTMLDivElement>();
  let n = 0;

  return (
    <Scene id="skills" className="flex flex-col pb-24 pt-32">
      <div className="mx-auto w-full max-w-6xl px-6 text-center">
        <h2 className="poster-title text-6xl md:text-8xl">
          Skills <span className="text-brand">Universe</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-white/60">Every skill orbits one core. Hover a tile to light it up.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.25em] transition ${
                active === c ? "border-brand bg-brand text-white shadow-glow" : "border-white/20 text-white/60 hover:border-white/60"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div ref={ref} className="relative mx-auto mt-10 w-full max-w-5xl px-4">
        {/* orbiting core: dim, centred and faded at the edges so it stays a backdrop */}
        <div
          className="pointer-events-none absolute inset-0 opacity-45"
          style={{
            WebkitMaskImage: "radial-gradient(ellipse at center, #000 20%, transparent 72%)",
            maskImage: "radial-gradient(ellipse at center, #000 20%, transparent 72%)",
          }}
        >
          <SkillCore inView={inView} />
        </div>

        <div className="relative z-10 space-y-10">
          {groups.map((g) => {
            const list = skills.filter((s) => s.category === g);
            return (
              <div key={g}>
                <div className="mb-4 flex items-center justify-center gap-4">
                  <span className="h-px w-10 bg-brand/60" />
                  <p className="font-mono text-xs uppercase tracking-[0.4em] text-white/70">{g}</p>
                  <span className="h-px w-10 bg-brand/60" />
                </div>
                <div className="flex flex-wrap justify-center gap-x-3 gap-y-2">
                  {list.map((s) => (
                    <HexTile key={s.name} skill={s} i={n++} dimmed={active !== "All" && s.category !== active} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Scene>
  );
}
