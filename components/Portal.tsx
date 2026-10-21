"use client";

import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Renders children directly under <body>. Modals and fixed buttons must live
 * outside pinned (GSAP) sections, otherwise their `position: fixed` breaks.
 */
export default function Portal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? createPortal(children, document.body) : null;
}
