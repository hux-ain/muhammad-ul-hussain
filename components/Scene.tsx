"use client";

import { ReactNode } from "react";

export default function Scene({
  id,
  children,
  className = "",
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} data-scene className={`relative min-h-screen w-full ${className}`}>
      {children}
    </section>
  );
}
