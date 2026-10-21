"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Drone = { start: () => Promise<void>; stop: () => void };

/**
 * Procedural cinematic drone (WebAudio) used as a fallback when
 * /public/audio/cinematic.mp3 is missing, so the toggle always works.
 */
function createDrone(volume: number): Drone | null {
  const AC: typeof AudioContext | undefined =
    window.AudioContext || (window as any).webkitAudioContext;
  if (!AC) return null;
  const ctx = new AC();

  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 520;
  filter.Q.value = 3;
  filter.connect(master);

  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.07;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 280;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start();

  [55, 82.41, 110, 164.81, 220].forEach((f, i) => {
    const o = ctx.createOscillator();
    o.type = i % 2 ? "sawtooth" : "triangle";
    o.frequency.value = f;
    o.detune.value = (i - 2) * 7;
    const g = ctx.createGain();
    g.gain.value = 0.16 / (i + 1);
    o.connect(g);
    g.connect(filter);
    o.start();
  });

  const boom = () => {
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(75, t);
    o.frequency.exponentialRampToValueAtTime(28, t + 0.9);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.6, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.3);
    o.connect(g);
    g.connect(master);
    o.start(t);
    o.stop(t + 1.4);
  };

  let timer: number | undefined;
  return {
    async start() {
      await ctx.resume();
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(volume, ctx.currentTime + 2.5);
      boom();
      timer = window.setInterval(boom, 6000);
    },
    stop() {
      window.clearInterval(timer);
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
      window.setTimeout(() => ctx.suspend(), 700);
    },
  };
}

export function useCinematicAudio(src = "/audio/cinematic.mp3", volume = 0.45) {
  const [playing, setPlaying] = useState(false);
  const [mode, setMode] = useState<"file" | "synth" | null>(null);
  const el = useRef<HTMLAudioElement | null>(null);
  const drone = useRef<Drone | null>(null);
  const fade = useRef<number | undefined>(undefined);

  const fadeTo = useCallback((audio: HTMLAudioElement, to: number, done?: () => void) => {
    window.clearInterval(fade.current);
    fade.current = window.setInterval(() => {
      const next = audio.volume + (to > audio.volume ? 0.03 : -0.05);
      audio.volume = Math.min(1, Math.max(0, next));
      if (Math.abs(audio.volume - to) < 0.04) {
        audio.volume = to;
        window.clearInterval(fade.current);
        done?.();
      }
    }, 60);
  }, []);

  const startSynth = useCallback(async () => {
    if (!drone.current) drone.current = createDrone(volume * 0.6);
    await drone.current?.start();
    setMode("synth");
  }, [volume]);

  const start = useCallback(async () => {
    try {
      if (!el.current) {
        const a = new Audio(src);
        a.loop = true;
        a.volume = 0;
        a.addEventListener("error", () => {
          // file missing / unsupported -> fall back to synth
          el.current = null;
          startSynth().catch(() => undefined);
        });
        el.current = a;
      }
      await el.current.play();
      fadeTo(el.current, volume);
      setMode("file");
    } catch {
      el.current = null;
      try {
        await startSynth();
      } catch {
        setPlaying(false);
        return;
      }
    }
    setPlaying(true);
  }, [src, volume, fadeTo, startSynth]);

  const stop = useCallback(() => {
    if (el.current) {
      const a = el.current;
      fadeTo(a, 0, () => a.pause());
    }
    drone.current?.stop();
    setPlaying(false);
  }, [fadeTo]);

  const toggle = useCallback(() => {
    if (playing) stop();
    else void start();
  }, [playing, start, stop]);

  useEffect(
    () => () => {
      window.clearInterval(fade.current);
      el.current?.pause();
      drone.current?.stop();
    },
    []
  );

  return { playing, mode, toggle, start, stop };
}
