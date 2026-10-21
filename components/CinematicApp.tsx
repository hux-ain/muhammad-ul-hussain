"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Overlays, SceneNav, TopBar, IntroGate } from "./Overlays";
import OpeningTitle from "./scenes/OpeningTitle";
import About from "./scenes/About";
import Skills from "./scenes/Skills";
import ExperienceReel from "./scenes/ExperienceReel";
import Projects from "./scenes/Projects";
import Certificates from "./scenes/Certificates";
import Contact from "./scenes/Contact";
import { useCinematicAudio } from "@/hooks/useCinematicAudio";
import { scrollStore } from "@/lib/scrollStore";
import { profile } from "@/data/portfolio";

gsap.registerPlugin(ScrollTrigger);
// ignore mobile address-bar resize so pinned scenes do not jump
ScrollTrigger.config({ ignoreMobileResize: true });

const Backdrop = dynamic(() => import("./three/Backdrop"), { ssr: false });

export default function CinematicApp() {
  const [entered, setEntered] = useState(false);
  const audio = useCinematicAudio();

  // global scroll progress + mouse -> 3D camera
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        scrollStore.progress = self.progress;
      },
    });
    const onMove = (e: PointerEvent) => {
      scrollStore.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      scrollStore.mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 600);
    return () => {
      st.kill();
      window.removeEventListener("pointermove", onMove);
      window.clearTimeout(refresh);
    };
  }, []);

  // lock scroll while the intro gate is open
  useEffect(() => {
    document.body.style.overflow = entered ? "" : "hidden";
    if (entered) window.setTimeout(() => ScrollTrigger.refresh(), 100);
  }, [entered]);

  const enter = (withSound: boolean) => {
    if (withSound) void audio.start();
    setEntered(true);
  };

  return (
    <main className="relative">
      <Backdrop />
      <Overlays />
      <IntroGate open={!entered} onEnter={enter} />
      <TopBar playing={audio.playing} mode={audio.mode} onToggle={audio.toggle} brand={profile.brand} />
      <SceneNav />

      <OpeningTitle started={entered} />
      <About />
      <Skills />
      <ExperienceReel />
      <Projects />
      <Certificates />
      <Contact />
    </main>
  );
}
