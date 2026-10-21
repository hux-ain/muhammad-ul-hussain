<div align="center">

# Muhammad-ul Hussain

**Cinematic Portfolio**

A scroll-driven developer portfolio, built like a film.

[Live Site](https://muhammad-ul-hussain.vercel.app/) &nbsp;·&nbsp; [GitHub](https://github.com/hux-ain/) &nbsp;·&nbsp; [LinkedIn](https://www.linkedin.com/in/muhammad-ul-hussain-6323a8209/)

<br>

![Next.js](https://img.shields.io/badge/Next.js_14-111?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-111?style=flat-square&logo=typescript&logoColor=3178C6)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-111?style=flat-square&logo=tailwindcss&logoColor=06B6D4)
![GSAP](https://img.shields.io/badge/GSAP-111?style=flat-square&logo=greensock&logoColor=88CE02)
![Three.js](https://img.shields.io/badge/Three.js-111?style=flat-square&logo=threedotjs&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-111?style=flat-square&logo=vercel&logoColor=white)

</div>

<br>

## Overview

Instead of static sections, the site unfolds as a sequence of scenes as you scroll, with motion, video, 3D and sound working together.

| Scene | Description |
|:--|:--|
| **Opening Title** | Animated title card with an ambient soundtrack |
| **About** | A book that centres on screen, opens across three spreads and closes |
| **Skills** | Interactive tiles over a 3D backdrop |
| **Experience** | A film reel of project footage, expandable with sound |
| **Projects** | Work presented as posters, with video previews on hover |
| **Certificates** | Horizontal scroll gallery with full-screen view |
| **Contact** | Closing section with links |

## Tech Stack

- **Framework:** Next.js 14 (App Router), TypeScript
- **Styling:** Tailwind CSS
- **Animation:** GSAP with scroll-based pinning
- **3D:** Three.js
- **Hosting:** Vercel

## Getting Started

```bash
git clone https://github.com/hux-ain/muhammad-ul-hussain.git
cd muhammad-ul-hussain
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Customisation

| What | Where |
|:--|:--|
| Content, links, projects, certificates | `data/portfolio.ts` |
| Brightness levels | `--dim-*` variables in `app/globals.css` |
| Background music | `public/audio/cinematic.mp3` |
| Videos and posters | `public/` |

## Project Structure

```
app/            Layout and global styles
components/     Scenes, book and 3D components
data/           Portfolio content
hooks/          Audio, scroll and visibility hooks
lib/            Shared scroll state
public/         Media assets
```

<br>

<div align="center">
<sub>Designed and developed by Muhammad-ul Hussain</sub>
</div>
