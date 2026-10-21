"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Scene from "../Scene";
import { profile } from "@/data/portfolio";

export default function Contact() {
  const [form, setForm] = useState({ name: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio inquiry from ${form.name || "a visitor"}`);
    const body = encodeURIComponent(form.message);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  return (
    <Scene id="contact" className="flex flex-col items-center justify-center py-32">
      <div className="mx-auto w-full max-w-5xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="poster-title red-glow text-[clamp(3.5rem,12vw,10rem)] text-brand"
        >
          To Be Continued…
        </motion.h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">Have a role, a project or a sequel in mind? Let's make the next scene together.</p>

        <div className="mt-12 grid gap-8 text-left md:grid-cols-2">
          <form onSubmit={submit} className="film-frame space-y-4 p-6">
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
              className="w-full border border-white/15 bg-black/60 px-4 py-3 outline-none transition focus:border-brand"
            />
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Your message"
              className="w-full resize-none border border-white/15 bg-black/60 px-4 py-3 outline-none transition focus:border-brand"
            />
            <button type="submit" className="btn-cine w-full">
              Hire Me ▶
            </button>
          </form>

          <div className="space-y-4">
            {[
              { k: "Email", v: profile.email, href: `mailto:${profile.email}` },
              { k: "Phone", v: profile.phone, href: `tel:${profile.phone.replace(/-/g, "")}` },
              { k: "GitHub", v: "View repositories", href: profile.links.github },
              { k: "LinkedIn", v: "Connect with me", href: profile.links.linkedin },
            ].map((l) => (
              <a
                key={l.k}
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="film-frame group flex items-center justify-between px-5 py-4 transition hover:border-brand hover:shadow-glow"
              >
                <span>
                  <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-brand">{l.k}</span>
                  <span className="break-all text-white/85">{l.v}</span>
                </span>
                <span className="text-white/30 transition group-hover:translate-x-1 group-hover:text-brand">→</span>
              </a>
            ))}
          </div>
        </div>

        <footer className="mt-20 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
          © {new Date().getFullYear()} · Directed by {profile.name} · {profile.location}
        </footer>
      </div>
    </Scene>
  );
}
