"use client";

import { ReactNode } from "react";
import { certificates, profile } from "@/data/portfolio";

/** Page size in px (design size — the whole rig is scaled to the screen by GSAP). */
export const PW = 340;
export const PH = 480;
/** Hard cover overhang around the pages. */
export const PAD = 8;

const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.09 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";
const PAPER_NOISE = NOISE.replace('0.09 0', '0.045 0');

const LEATHER = `${NOISE}, radial-gradient(ellipse at 30% 18%, #202023 0%, #0b0b0c 65%, #050505 100%)`;
const PAGE = `${PAPER_NOISE}, linear-gradient(135deg, #191610 0%, #100f0b 60%, #15130e 100%)`;
const ENDPAPER = `${PAPER_NOISE}, linear-gradient(135deg, #2a0508 0%, #12090a 70%)`;

/* ------------------------------------------------------------------ */
/* One printed side of a leaf. Backface is hidden so front/back never  */
/* show through each other.                                            */
/* ------------------------------------------------------------------ */
function Face({
  side,
  bg,
  inset = 0,
  children,
}: {
  side: "f" | "b";
  bg: string;
  inset?: number;
  children: ReactNode;
}) {
  // spine is on the left edge of a front face, and on the right edge of a (mirrored) back face
  const spineGrad =
    side === "f"
      ? { left: 0, background: "linear-gradient(to right, rgba(0,0,0,.65), transparent)" }
      : { right: 0, background: "linear-gradient(to left, rgba(0,0,0,.65), transparent)" };
  return (
    <div
      className="absolute inset-0 overflow-hidden text-white/85"
      style={{
        background: bg,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: side === "b" ? "rotateY(180deg)" : undefined,
      }}
    >
      <div className="absolute inset-x-0" style={{ top: inset, bottom: inset }}>
        {children}
      </div>
      <div className="pointer-events-none absolute inset-y-0 w-[16%]" style={spineGrad} />
      <div className={`shade-${side} pointer-events-none absolute inset-0 bg-black opacity-0`} />
    </div>
  );
}

function Leaf({
  index,
  cover,
  front,
  back,
  frontBg = PAGE,
  backBg = PAGE,
}: {
  index: number;
  cover?: boolean;
  front: ReactNode;
  back: ReactNode;
  frontBg?: string;
  backBg?: string;
}) {
  const w = cover ? PW + PAD : PW;
  const h = cover ? PH + 2 * PAD : PH;
  return (
    <div
      className={`leaf leaf-${index} absolute`}
      style={{
        left: 0,
        top: cover ? -PAD : 0,
        width: w,
        height: h,
        transformStyle: "preserve-3d",
        transformOrigin: "0% 50%",
      }}
    >
      <Face side="f" bg={frontBg}>
        {front}
      </Face>
      <Face side="b" bg={backBg} inset={cover ? PAD : 0}>
        {back}
      </Face>
    </div>
  );
}

/* ------------------------------ cover ------------------------------ */
function CoverFront() {
  const words = profile.coverName.toUpperCase().split(" ");
  const nameLast = words[words.length - 1];
  const nameTop = words.slice(0, -1).join(" ");
  return (
    <div className="relative h-full w-full" style={{ background: LEATHER }}>
      {/* hinge / spine */}
      <div
        className="absolute inset-y-0 left-0 w-[26px]"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,.7), rgba(255,255,255,.06) 55%, rgba(0,0,0,.55)), repeating-linear-gradient(0deg, transparent 0 22px, rgba(184,137,43,.35) 22px 23px)",
        }}
      />
      {/* gold foil frame */}
      <div
        className="absolute"
        style={{
          inset: "14px 14px 14px 38px",
          border: "1.5px solid #b8892b",
          boxShadow: "inset 0 0 0 4px rgba(0,0,0,.35), inset 0 0 0 5px rgba(184,137,43,.5)",
        }}
      />
      {/* photo */}
      <div
        className="absolute"
        style={{ left: 54, right: 34, top: 38, height: 266, border: "1.5px solid #b8892b", padding: 4, background: "#070707" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.aboutImage}
          alt={profile.coverName}
          className="img-dim h-full w-full object-cover"
          style={{ objectPosition: "50% 22%" }}
        />
        <div
          className="pointer-events-none absolute inset-1"
          style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 55%, rgba(0,0,0,.55) 100%)" }}
        />
      </div>
      {/* title block */}
      <div className="absolute text-center" style={{ left: 38, right: 14, top: 322 }}>
        <p className="font-mono text-[10px] uppercase tracking-[0.55em] text-brand">Starring</p>
        <p className="foil mt-1 font-poster text-[38px] leading-[0.95] tracking-wide">
          <span className="block whitespace-nowrap">{nameTop}</span>
          <span className="block whitespace-nowrap">{nameLast}</span>
        </p>
        <p className="mt-3 font-mono text-[8.5px] uppercase tracking-[0.45em] text-[#b8892b]/80">{profile.presents}</p>
      </div>
      {/* light sweep */}
      <div
        className="gloss pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(105deg, transparent 36%, rgba(255,255,255,.16) 49%, transparent 62%)" }}
      />
    </div>
  );
}

/* ------------------------------ pages ------------------------------ */
const Folio = ({ n }: { n: number }) => (
  <p className="mt-auto pt-2 text-center font-mono text-[10px] tracking-[0.3em] text-white/30">— {n} —</p>
);

/** Spread 1 — left: chapter title page */
function S1Left() {
  return (
    <div className="flex h-full flex-col justify-between p-7">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-brand">Chapter I</p>
        <h3 className="poster-title mt-3 text-[56px]">
          The Story
          <br />
          <span className="text-brand">So Far</span>
        </h3>
      </div>
      <div className="sprockets opacity-30" style={{ height: 12 }} />
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">{profile.location}</p>
        <p className="mt-1 font-title text-sm uppercase tracking-[0.3em] text-white/70">{profile.role}</p>
      </div>
    </div>
  );
}

/** Spread 1 — right: bio */
function S1Right() {
  return (
    <div className="flex h-full flex-col p-7">
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40">The Story</p>
      <div className="mt-4 space-y-3 text-[14.5px] leading-[1.6] text-white/80">
        {profile.bio.map((line, i) => (
          <p key={i}>
            {i === 0 ? (
              <>
                <span className="float-left mr-2 mt-1 font-poster text-[54px] leading-[0.78] text-brand">{line[0]}</span>
                {line.slice(1)}
              </>
            ) : (
              line
            )}
          </p>
        ))}
      </div>
      <Folio n={1} />
    </div>
  );
}

/** Spread 2 — left: chapter title page */
function S2Left() {
  return (
    <div className="relative flex h-full flex-col justify-between p-7">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-brand">Chapter II</p>
        <h3 className="poster-title mt-3 text-[56px]">
          Still In
          <br />
          <span className="text-brand">Session</span>
        </h3>
      </div>
      <p className="font-poster text-[120px] leading-[0.8] tracking-wide text-white/[0.07]">
        7TH
        <br />
        SEM
      </p>
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">Education · Learning</p>
    </div>
  );
}

/** Spread 2 — right: education details + numbers */
function S2Right() {
  const e = profile.education;
  return (
    <div className="flex h-full flex-col p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40">Currently enrolled</p>
      <h4 className="mt-2 font-poster text-[34px] leading-[0.95] tracking-wide text-white">{e.degree}</h4>
      <p className="mt-1 font-title text-[15px] text-white/70">{e.school}</p>
      <p className="mt-2 inline-block self-start border border-brand/70 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.22em] text-brand">
        {e.status}
      </p>
      <ul className="mt-4 space-y-2 text-[13.5px] leading-snug text-white/75">
        {e.notes.map((n) => (
          <li key={n} className="flex gap-2">
            <span className="text-brand">▶</span>
            {n}
          </li>
        ))}
      </ul>
      <div className="mt-auto grid grid-cols-2 gap-2 pt-3">
        {profile.stats.map((s) => (
          <div key={s.label} className="border border-white/10 px-2.5 py-1.5">
            <p className="font-mono text-[8.5px] uppercase tracking-[0.25em] text-white/45">{s.label}</p>
            <p className="font-poster text-[21px] leading-tight text-brand">{s.value}</p>
          </div>
        ))}
      </div>
      <p className="pt-2 text-center font-mono text-[9px] uppercase tracking-[0.25em] text-white/35">
        {certificates.length} certificates earned
      </p>
      <Folio n={2} />
    </div>
  );
}

/** Spread 3 — left: closing chapter page */
function S3Left() {
  return (
    <div className="flex h-full flex-col justify-between p-7">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-brand">Chapter III</p>
        <h3 className="poster-title mt-3 whitespace-nowrap text-[44px]">
          To Be
          <br />
          <span className="text-brand">Continued…</span>
        </h3>
      </div>
      <div className="flex h-[110px] items-center justify-center border border-white/10">
        <span className="font-poster text-[56px] leading-none tracking-widest text-white/10">THE END?</span>
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">Final cut</p>
    </div>
  );
}

/** Spread 3 — right: quote */
function S3Right() {
  const q = profile.quote;
  return (
    <div className="flex h-full flex-col p-6">
      <span className="font-poster text-[84px] leading-[0.6] text-brand">“</span>
      <p className="poster-title mt-1 text-[33px] leading-[1.05]">{q.text}</p>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">— {q.by}</p>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {profile.badges.map((b) => (
          <span key={b} className="border border-white/20 px-2 py-0.5 font-mono text-[9px] tracking-[0.22em] text-white/65">
            {b}
          </span>
        ))}
      </div>
      <div className="mt-auto text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Directed by {profile.coverName}</p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.4em] text-brand">Scroll ↓</p>
      </div>
      <Folio n={3} />
    </div>
  );
}

/* ------------------------------ the book ----------------------------- */
export default function Book() {
  return (
    <div
      className="book absolute"
      style={{ left: 0, top: -PH / 2, width: PW, height: PH, transformStyle: "preserve-3d" }}
    >
      {/* stationary back board */}
      <div
        className="absolute"
        style={{ left: 0, top: -PAD, width: PW + PAD, height: PH + 2 * PAD, transform: "translateZ(-3px)", background: LEATHER }}
      />
      {/* page-block edge (visible when the book is turned) */}
      <div
        className="absolute"
        style={{
          left: PW,
          top: 0,
          width: 14,
          height: PH,
          transformOrigin: "0 0",
          transform: "rotateY(90deg)",
          background: "repeating-linear-gradient(90deg, #4a443a 0 1px, #221f19 1px 3px)",
        }}
      />
      {/* base page = right side of spread 3 */}
      <div className="absolute" style={{ left: 0, top: 0, width: PW, height: PH }}>
        <Face side="f" bg={PAGE}>
          <S3Right />
        </Face>
      </div>

      <Leaf index={2} front={<S2Right />} back={<S3Left />} />
      <Leaf index={1} front={<S1Right />} back={<S2Left />} />
      <Leaf index={0} cover front={<CoverFront />} frontBg={LEATHER} back={<S1Left />} backBg={ENDPAPER} />
    </div>
  );
}
