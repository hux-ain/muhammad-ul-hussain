"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Scene from "../Scene";
import Portal from "../Portal";
import Book, { PH, PW } from "../book/Book";
import { profile } from "@/data/portfolio";

gsap.registerPlugin(ScrollTrigger);

const N = 3; // movable leaves (cover + 2 pages); the 4th sheet is the fixed base page
const DZ = 1.6; // tiny z-gap between leaves so they never z-fight

/**
 * SCENE 2 — scroll-driven book.
 *  0.0  card on the left, intro text on the right
 *  1.8  background blurs, book dollies to centre (closed, cinematic tilt)
 *  4.7  cover opens            -> spread 1 (bio)
 *  7.4  page turns             -> spread 2 (education)
 * 10.1  page turns             -> spread 3 (quote)
 * 12.9  book closes, blur clears, scroll continues
 */
export default function About() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    let ctx: gsap.Context | null = null;
    let lastW = window.innerWidth;

    const build = () => {
      ctx = gsap.context(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const mobile = vw < 768;
        // s1: size of the open book. Desktop shows the full spread; mobile shows one page at a time.
        const s1 = mobile ? Math.min((0.94 * vw) / PW, (0.7 * vh) / PH, 1.25) : Math.min((0.9 * vw) / (2 * PW), (0.8 * vh) / PH, 1.4);
        const s0 = s1 * (mobile ? 0.8 : 0.72);
        const startX = mobile ? 0 : -vw * 0.2;
        const startY = mobile ? -vh * 0.1 : 0;
        const openX = mobile ? -PW / 2 : 0; // spine at centre (desktop) / right page centred (mobile)
        const closedX = -PW / 2;

        // ---- initial state -------------------------------------------------
        // xPercent/yPercent are pinned to 0 on purpose: in dev (React StrictMode runs this effect twice) GSAP can
        // misread a leftover "-170px" (= exactly -50% of the book width) as xPercent:-50 and shift the book twice.
        gsap.set(".rig", { x: startX, y: startY, xPercent: 0, yPercent: 0, scale: s0, rotationX: 0, rotationY: 0 });
        gsap.set(".book", { x: closedX, y: 0, xPercent: 0, yPercent: 0 });
        gsap.set(".book-shadow", { scaleX: 0.55, opacity: 0.9 });
        gsap.set(".shade-b", { opacity: 0.75 });
        for (let i = 0; i < N; i++) gsap.set(`.leaf-${i}`, { rotationY: 0, z: (N - i) * DZ });
        gsap.set(".veil", { opacity: 0 });
        gsap.set(".stage", { opacity: 1, scale: 1 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut", immediateRender: false },
          scrollTrigger: {
            id: "about-book",
            trigger: el,
            start: "top top",
            end: "+=" + vh * 8,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: 3,
            onToggle: (self) => setActive(self.isActive),
          },
        });

        const flip = (i: number, at: number, dur: number, open: boolean) => {
          const z = open ? i * DZ : (N - i) * DZ;
          tl.fromTo(`.leaf-${i}`, { rotationY: open ? 0 : -180, z: open ? (N - i) * DZ : i * DZ }, { rotationY: open ? -180 : 0, z, duration: dur }, at);
          // darken the face that is turning away
          tl.fromTo(`.leaf-${i} .shade-f`, { opacity: open ? 0 : 0.75 }, { opacity: open ? 0.75 : 0, duration: dur, ease: "none" }, at);
          tl.fromTo(`.leaf-${i} .shade-b`, { opacity: open ? 0.75 : 0 }, { opacity: open ? 0 : 0.75, duration: dur, ease: "none" }, at);
        };

        // ---- 0 → 1.8  intro fades, blur in, book dollies to centre --------
        tl.to(".intro", { opacity: 0, x: mobile ? 0 : 60, y: mobile ? 30 : 0, duration: 1.2, ease: "power1.in" }, 0)
          .to(".hint", { opacity: 0, duration: 0.4 }, 0)
          .fromTo(".veil", { opacity: 0 }, { opacity: 1, duration: 1.6 }, 0)
          .fromTo(
            ".rig",
            { x: startX, y: startY, scale: s0, rotationX: 0, rotationY: 0 },
            { x: 0, y: 0, scale: s1, rotationX: 6, rotationY: -18, duration: 1.8, ease: "power2.out" },
            0
          )
          // ---- 1.8 → 2.7  slow orbit + light sweep across the cover ------
          .fromTo(".rig", { rotationX: 6, rotationY: -18 }, { rotationX: 10, rotationY: -8, duration: 0.9, ease: "sine.inOut" }, 1.8)
          .fromTo(".gloss", { xPercent: -130 }, { xPercent: 130, duration: 1.4, ease: "none" }, 1.2);

        // ---- 2.7 → 4.7  cover opens ---------------------------------------
        flip(0, 2.7, 2, true);
        tl.fromTo(".book", { x: closedX }, { x: openX, duration: 2 }, 2.7)
          .fromTo(".book-shadow", { scaleX: 0.55 }, { scaleX: 1, duration: 2 }, 2.7)
          .fromTo(".rig", { rotationX: 10, rotationY: -8 }, { rotationX: 4, rotationY: 0, duration: 2 }, 2.7);

        // ---- turn pages (reading holds in between) -------------------------
        flip(1, 6.2, 1.2, true);
        flip(2, 8.9, 1.2, true);

        // ---- 11.6 → 12.9  close the book -----------------------------------
        flip(2, 11.6, 0.7, false);
        flip(1, 11.85, 0.7, false);
        flip(0, 12.1, 0.8, false);
        tl.fromTo(".book", { x: openX }, { x: closedX, duration: 1.3 }, 11.6)
          .fromTo(".book-shadow", { scaleX: 1 }, { scaleX: 0.55, duration: 1.3 }, 11.6)
          .fromTo(".rig", { rotationX: 4, rotationY: 0 }, { rotationX: 8, rotationY: -10, duration: 1.3 }, 11.6)
          // ---- 12.9 → 13.9  blur clears, book fades, scroll moves on -------
          .fromTo(".veil", { opacity: 1 }, { opacity: 0, duration: 1 }, 12.9)
          .fromTo(".stage", { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.9, duration: 1 }, 12.9);
      }, el);
    };

    build();

    // rebuild when the width changes (rotation / window resize) so sizes stay correct
    let t: number | undefined;
    const onResize = () => {
      if (window.innerWidth === lastW) return;
      lastW = window.innerWidth;
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        ctx?.revert();
        build();
        ScrollTrigger.refresh();
      }, 250);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", onResize);
      ctx?.revert();
    };
  }, []);

  const skip = () => {
    const st = ScrollTrigger.getById("about-book");
    if (st) window.scrollTo({ top: st.end + 2, behavior: "smooth" });
  };

  return (
    <div ref={root} className="relative">
      <Scene id="about" className="!min-h-0 h-[100svh] overflow-hidden motion-reduce:h-auto motion-reduce:!min-h-screen motion-reduce:overflow-visible">
        {/* reduced-motion fallback: plain readable content, no pin */}
        <div className="hidden px-6 py-28 motion-reduce:block">
          <div className="mx-auto max-w-2xl space-y-5">
            <h2 className="poster-title text-6xl">
              The Story <span className="text-brand">So Far</span>
            </h2>
            {profile.bio.map((l) => (
              <p key={l} className="text-lg text-white/80">
                {l}
              </p>
            ))}
            <p className="font-title text-xl text-white">
              {profile.education.degree} · {profile.education.school} · {profile.education.status}
            </p>
            <p className="poster-title text-3xl">“{profile.quote.text}”</p>
          </div>
        </div>

        {/* cinematic version */}
        <div className="absolute inset-0 motion-reduce:hidden">
          {/* intro text (right of the card) */}
          <div className="intro absolute inset-x-6 bottom-[9svh] z-10 text-center md:inset-x-auto md:bottom-auto md:right-[6vw] md:top-1/2 md:w-[40vw] md:max-w-xl md:-translate-y-1/2 md:text-left">
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-brand">{profile.location}</p>
            <h2 className="poster-title mt-3 text-5xl md:text-7xl">
              The Story <span className="text-brand">So Far</span>
            </h2>
            <p className="mt-4 hidden text-lg leading-relaxed text-white/75 md:block">{profile.bio[0]}</p>
          </div>

          {/* focus-pull: blur + darken everything behind the book */}
          <div
            className="veil pointer-events-none absolute inset-0 z-20 backdrop-blur-md"
            style={{ background: "radial-gradient(ellipse at center, rgba(5,5,5,.55), rgba(5,5,5,.92))" }}
          />

          {/* the 3D book */}
          <div className="stage absolute inset-0 z-30" style={{ perspective: "2200px" }}>
            <div className="rig absolute left-1/2 top-1/2 h-0 w-0" style={{ transformStyle: "preserve-3d" }}>
              <div
                className="book-shadow pointer-events-none absolute"
                style={{
                  left: -PW * 1.1,
                  top: PH / 2 + 26,
                  width: PW * 2.2,
                  height: 46,
                  background: "radial-gradient(ellipse at center, rgba(0,0,0,.85), rgba(0,0,0,0) 70%)",
                }}
              />
              <div
                className="pointer-events-none absolute"
                style={{
                  left: -PW * 1.3,
                  top: -PH * 0.8,
                  width: PW * 2.6,
                  height: PH * 1.6,
                  background: "radial-gradient(ellipse at center, rgba(229,9,20,.16), transparent 62%)",
                  transform: "translateZ(-40px)",
                }}
              />
              <Book />
            </div>
          </div>

          <p className="hint pointer-events-none absolute bottom-7 left-1/2 z-40 -translate-x-1/2 animate-bounce font-mono text-[10px] uppercase tracking-[0.4em] text-white/60">
            Scroll to open the book ↓
          </p>
        </div>
      </Scene>

      {/* skip button — outside the pinned element so position: fixed works */}
      <Portal>
        {active && (
          <button
            onClick={skip}
            className="btn-mini fixed bottom-6 right-5 z-[66] bg-black/60 backdrop-blur md:right-10"
          >
            Skip ↓
          </button>
        )}
      </Portal>
    </div>
  );
}
