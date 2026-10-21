# Hux-Ain — Cinematic Trailer Portfolio

Next.js 14 · React Three Fiber · Framer Motion · GSAP · Tailwind

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Where your content lives — `data/portfolio.ts`

| What | Field | File |
| --- | --- | --- |
| Top-bar name (next to ▶) | `profile.brand` | — |
| Scene 1 cut-out photo | `profile.heroImage` | `public/images/hero-cutout.webp` |
| Book cover photo | `profile.aboutImage` | `public/images/about-portrait.jpg` |
| "Watch Trailer" video | `profile.trailerVideo` | `public/videos/developer.mp4` (same clip as the Developer reel) |
| Book text (bio / education / quote) | `profile.bio`, `profile.education`, `profile.quote` | — |
| The Reel (3 videos) | `experience[].video` | `public/videos/hrms.mp4`, `developer.mp4`, `iqra.mp4` |
| Original Productions posters (3) | `projects[].poster` | `public/posters/*.jpg` (1200×1800) |
| Poster hover preview | `projects[].video` | HRMS plays `hrms.mp4`; add one for the others if you like |
| Certificates | `certificates[]` | `public/certs/*` |
| Background music | — | `public/audio/cinematic.mp3` (falls back to a synthesized drone) |
| GitHub / LinkedIn | `profile.links` | already set (hux-ain / muhammad-ul-hussain) |

Videos: H.264 `.mp4`, ideally under ~15 MB each so they load fast on mobile.

## Brightness

Photos, posters, clips and certificates are dimmed with CSS variables at the top of `app/globals.css`
(`--dim-img`, `--dim-poster`, `--dim-cert`, `--dim-cert-hover`, `--dim-video`). Lower = darker.

## Scenes

1. Opening Title — `scenes/OpeningTitle.tsx`
2. About Me — scroll-driven 3D book: `scenes/About.tsx` + `book/Book.tsx` (cover → 3 spreads → closes). On phones the book shows one page at a time.
3. Skills Universe — `scenes/Skills.tsx` (hex tiles) + `three/SkillCore.tsx` (background core)
4. The Reel — pinned horizontal film strip with video frames: `scenes/ExperienceReel.tsx`
5. Original Productions — `scenes/Projects.tsx`
6. Certificates — horizontal film strip + full-screen viewer: `scenes/Certificates.tsx`
7. Contact — `scenes/Contact.tsx`

Browsers block autoplay with sound, so music starts from the intro gate or the Score toggle.
