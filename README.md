<div align="center">

# MUHAMMAD-UL HUSSAIN
### A Cinematic Portfolio

*A developer portfolio told like a film: scroll-driven scenes, film-reel projects and a book that opens itself.*

<br>

![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white)

[**GitHub**](https://github.com/hux-ain/) · [**LinkedIn**](https://www.linkedin.com/in/muhammad-ul-hussain-6323a8209/)

</div>

---

## The Scenes

| # | Scene | What happens |
|:-:|:--|:--|
| 01 | **Opening Title** | Glitch-in title card with an ambient score |
| 02 | **About** | A photo-covered book centres on screen, opens across three spreads, then closes |
| 03 | **Skills** | Glowing tiles over a live 3D core |
| 04 | **Experience Reel** | Film frames playing real project footage, expandable with sound |
| 05 | **Original Productions** | Projects presented as movie posters, with hover previews |
| 06 | **Certificates** | A horizontal scroll reel, full-screen on click |
| 07 | **Contact** | The closing credits |

## Tech

**Next.js 14** (App Router) · **TypeScript** · **Tailwind CSS** · **GSAP** for scroll choreography · **Three.js** for the 3D backdrop · Web Audio for the fallback soundtrack

## Getting Started

```bash
git clone https://github.com/hux-ain/muhammad-ul-hussain.git
cd muhammad-ul-hussain
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000). For a production build, run `npm run build && npm start`.

## Structure

```
app/            layout, global styles, dimming variables
components/
  scenes/       one file per scene
  book/         the About book
  three/        3D backdrop and skill core
data/           portfolio.ts — all content lives here
hooks/          audio, horizontal pinning, in-view detection
public/         videos, posters, audio
```

## Make It Yours

- **Content**: every name, link, project and certificate is in `data/portfolio.ts`.
- **Brightness**: tune the `--dim-*` variables at the top of `app/globals.css`.
- **Music**: drop a track at `public/audio/cinematic.mp3`. Without one, a generated drone plays.

## Deploy

Built for [Vercel](https://vercel.com): import the repo, keep the defaults, deploy. No environment variables needed.

---

<div align="center">

Written, directed and developed by **Muhammad-ul Hussain**

</div>
