/**
 * ============================================================
 *  EDIT ME — every scene reads from this single file.
 *  Media lives in /public (images/, posters/, videos/, certs/).
 * ============================================================
 */

export type Skill = {
  name: string;
  level: number; // 0..1
  category: "Frontend" | "Backend" | "Database" | "DevOps";
  color: string;
};

export type Experience = {
  period: string;
  role: string;
  company: string;
  location: string;
  points: string[];
  tag: string; // small label on the film frame
  video: string; // reel clip in /public/videos (plays in the frame, full view on click)
  image: string; // fallback still if the video is missing
  imagePosition?: string; // CSS object-position for the fallback still
};

export type Project = {
  title: string;
  tagline: string;
  genre: string;
  year: string;
  runtime: string;
  description: string;
  stack: string[];
  live?: string;
  github?: string;
  poster?: string; // poster image in /public (2:3, e.g. 1200x1800)
  posterHasTitle?: boolean; // true if the poster art already contains its own title text
  video?: string; // optional hover-preview clip in /public/videos
  colors: [string, string]; // gradient fallback when there is no poster
};

export type Certificate = {
  title: string;
  issuer: string;
  date?: string;
  image: string; // image in /public/certs
};

export const profile = {
  name: "Muhammad-ul-Hussain",
  brand: "Hux-Ain", // shown next to the ▶ in the top bar
  titleLines: ["MUHAMMAD-UL", "HUSSAIN"],
  coverName: "Muhammad ul Hussain", // gold foil name on the book cover
  role: "Full Stack Developer",
  presents: "A FULL STACK PRODUCTION",
  tagline: "One developer. Database to deployment. No sequels required.",
  badges: ["MERN", "LARAVEL", "MYSQL", "LINUX VPS"],
  location: "Karachi, Pakistan",
  email: "muhammadulhussain27@gmail.com",
  phone: "0334-1022301",
  links: {
    github: "https://github.com/hux-ain/",
    linkedin: "https://www.linkedin.com/in/muhammad-ul-hussain-6323a8209/",
  },
  heroImage: "/images/hero-cutout.webp", // Scene 1 cut-out, shown beside the title
  aboutImage: "/images/about-portrait.jpg", // photo on the book cover (Scene 2)
  trailerVideo: "/videos/developer.mp4", // "Watch Trailer" (same clip as the Developer reel)
  bio: [
    "Full Stack Developer with hands-on, production experience across the MERN stack and the Laravel/PHP ecosystem.",
    "I design, build, and deploy complete business systems end-to-end — from database schema to UI — including full Linux VPS deployment via GitHub.",
    "Currently pursuing a BS in Software Engineering while working full-time, with a strong record of self-driven learning.",
  ],
  // Book spread 2 (Education)
  education: {
    degree: "BS Software Engineering",
    school: "Iqra University, Karachi",
    status: "7th Semester · In Progress",
    notes: [
      "Studying while working full-time as a sole developer.",
      "Self-driven learning: React, advanced SQL, AI and cybersecurity.",
    ],
  },
  // Book spread 3 (Quote)
  quote: {
    text: "One developer. Database to deployment. No sequels required.",
    by: "Muhammad-ul-Hussain",
  },
  stats: [
    { label: "Role", value: "Sole Dev" },
    { label: "Stacks", value: "MERN + Laravel" },
    { label: "Deploys", value: "Linux VPS" },
    { label: "Semester", value: "7th" },
  ],
};

export const skills: Skill[] = [
  { name: "React", level: 0.9, category: "Frontend", color: "#61dafb" },
  { name: "TypeScript", level: 0.8, category: "Frontend", color: "#3178c6" },
  { name: "JavaScript", level: 0.9, category: "Frontend", color: "#f7df1e" },
  { name: "Blade", level: 0.8, category: "Frontend", color: "#ff7a59" },
  { name: "Node.js", level: 0.85, category: "Backend", color: "#68a063" },
  { name: "Express", level: 0.8, category: "Backend", color: "#b8b8b8" },
  { name: "Laravel", level: 0.9, category: "Backend", color: "#ff2d20" },
  { name: "PHP", level: 0.85, category: "Backend", color: "#8892bf" },
  { name: "REST APIs", level: 0.85, category: "Backend", color: "#E50914" },
  { name: "MySQL", level: 0.9, category: "Database", color: "#00b4d8" },
  { name: "MongoDB", level: 0.7, category: "Database", color: "#4db33d" },
  { name: "Linux VPS", level: 0.75, category: "DevOps", color: "#fcc624" },
  { name: "Git / GitHub", level: 0.85, category: "DevOps", color: "#f05032" },
];

// The reel: exactly three frames, each plays its own clip.
export const experience: Experience[] = [
  {
    period: "Independent Client Project",
    role: "HRMS",
    company: "Human Resource Management System",
    location: "hrms.xperts-global.com",
    tag: "CLIENT PROJECT",
    video: "/videos/hrms.mp4",
    image: "/images/poster-hrms.jpg",
    imagePosition: "center top",
    points: [
      "Complete HRMS: employee records, attendance tracking and HR workflows.",
      "Relational schema and REST APIs with React, TypeScript, Node, Express and MySQL.",
      "Requirements gathering through production deployment and handover.",
      "Deployed on a Linux VPS with releases managed via GitHub.",
    ],
  },
  {
    period: "Aug 2025 — Present",
    role: "Full Stack Developer",
    company: "Gerry's IT",
    location: "Karachi, Pakistan",
    tag: "CURRENT ROLE",
    video: "/videos/developer.mp4",
    image: "/images/full-stack-developer.jpg",
    imagePosition: "center",
    points: [
      "Sole web developer — owning database design, backend logic and frontend UI.",
      "Built the core web platform end-to-end with Laravel, Blade and MySQL.",
      "Routing, authentication and business logic plus responsive internal and customer-facing pages.",
      "Self-managed Linux VPS with version-controlled releases via GitHub.",
    ],
  },
  {
    period: "In Progress · 7th Semester",
    role: "BS Software Engineering",
    company: "Iqra University",
    location: "Karachi",
    tag: "EDUCATION",
    video: "/videos/iqra.mp4",
    image: "/images/bs-software-engineering.jpg",
    imagePosition: "78% center",
    points: [
      "Currently enrolled in the 7th semester.",
      "Studying while working full-time.",
    ],
  },
];

// Exactly three productions. Posters already contain their own title text.
export const projects: Project[] = [
  {
    title: "HRMS",
    tagline: "Every employee. One system.",
    genre: "Corporate Thriller",
    year: "2025",
    runtime: "LIVE",
    description:
      "A complete Human Resource Management System for a client: employees, attendance, leaves, bank details, payroll and payslips, tasks, recruitment, a CV scanner and settings. Relational schema, REST APIs, full Linux VPS deployment and handover.",
    stack: ["React", "TypeScript", "Node.js", "Express", "MySQL"],
    live: "https://hrms.xperts-global.com",
    poster: "/posters/hrms.jpg",
    posterHasTitle: true,
    video: "/videos/hrms.mp4", // plays on poster hover
    colors: ["#E50914", "#1a0003"],
  },
  {
    title: "GERRYS.NET",
    tagline: "The internet was never this fast.",
    genre: "Web Platform",
    year: "2025",
    runtime: "LIVE",
    description:
      "The company website and core web platform for Gerry's IT: services, partners, clients, achievements, testimonials and a live connectivity ROI calculator. Built with Laravel, Blade and MySQL, with auth, routing and business logic, deployed on a self-managed Linux VPS.",
    stack: ["Laravel", "Blade", "MySQL", "Linux VPS"],
    live: "https://gerrys.net",
    poster: "/posters/gerrys-net.jpg",
    posterHasTitle: true,
    colors: ["#ff9900", "#1a0d00"],
    // video: "/videos/gerrys-site.mp4",
  },
  {
    title: "GERRY'S ERP",
    tagline: "The whole network. One portal.",
    genre: "Enterprise System",
    year: "2025",
    runtime: "INTERNAL",
    description:
      "Gerry's internal ERP portal: dashboard, customer creation and info, tickets, survey reports, vendors, POPs, user management, activity log and inventory — one login for the whole network. Designed, developed and deployed end-to-end.",
    stack: ["Laravel", "MySQL"],
    poster: "/posters/gerrys-erp.jpg",
    posterHasTitle: true,
    colors: ["#eab308", "#1a1400"],
    // video: "/videos/gerrys-erp.mp4",
  },
];

export const certificates: Certificate[] = [
  { title: "Claude 101", issuer: "Anthropic", image: "/certs/claude-101.jpg" },
  { title: "Safe and Responsible Use of AI", issuer: "Gerry's IT", date: "16 Oct 2026", image: "/certs/gerrys-safe-ai.jpg" },
  { title: "Phishing and Social Engineering Scams", issuer: "Gerry's IT", date: "16 Oct 2026", image: "/certs/gerrys-phishing.jpg" },
  { title: "Protection Against SMS-Based Fraud and Smishing", issuer: "Gerry's IT", date: "16 Oct 2026", image: "/certs/gerrys-smishing.jpg" },
  { title: "Misinformation and Disinformation", issuer: "Gerry's IT", date: "16 Oct 2026", image: "/certs/gerrys-misinformation.jpg" },
  { title: "Reporting Harmful/Illegal Content to Social Media Platforms", issuer: "Gerry's IT", date: "16 Oct 2026", image: "/certs/gerrys-reporting.jpg" },
  { title: "Advanced SQL", issuer: "Kaggle", image: "/certs/advanced-sql.png" },
  { title: "Understanding the Basics of React", issuer: "10Pearls University", image: "/certs/react-basics.png" },
];

export const scenes = [
  { id: "opening", label: "Opening Title" },
  { id: "about", label: "About Me" },
  { id: "skills", label: "Skills Universe" },
  { id: "experience", label: "Experience Timeline" },
  { id: "projects", label: "Projects Gallery" },
  { id: "certificates", label: "Certificates" },
  { id: "contact", label: "Contact" },
];
