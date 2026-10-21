"use client";

import { RefObject, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Pins `section` and moves `track` sideways while the page scrolls down
 * (the "film reel" behaviour used by Experience and Certificates).
 * `priority`: higher = refreshed first. Give earlier-on-the-page pins a higher number.
 */
export function useHorizontalPin({
  section,
  track,
  priority = 0,
  onProgress,
}: {
  section: RefObject<HTMLElement>;
  track: RefObject<HTMLElement>;
  priority?: number;
  onProgress?: (p: number) => void;
}) {
  const cb = useRef(onProgress);
  cb.current = onProgress;

  useLayoutEffect(() => {
    const s = section.current;
    const t = track.current;
    if (!s || !t) return;
    const ctx = gsap.context(() => {
      const dist = () => Math.max(0, t.scrollWidth - window.innerWidth);
      gsap.to(t, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: s,
          start: "top top",
          end: () => "+=" + (dist() + window.innerHeight * 0.5),
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: priority,
          onUpdate: (self) => cb.current?.(self.progress),
        },
      });
    }, s);
    return () => ctx.revert();
  }, [section, track, priority]);
}
