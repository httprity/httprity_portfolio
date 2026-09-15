/**
 * Single source of truth for all portfolio content.
 * Presentation components read from here and never hard-code copy.
 *
 * Anything marked TODO is a placeholder for you to replace.
 */

export const identity = {
  name: 'Samprity Haque',
  /** Short symbol used in the nav / footer mark. */
  mark: 'SH',
  eyebrow: 'PRODUCT · AI/ML · DEVELOPMENT · RESEARCH',
  headline: 'I turn pixels into products and models into experiences.',
  body:
    'I’m a product designer and AI developer who likes being involved in the entire journey — from finding the problem and shaping the product to designing, building, and making technology feel a little more human.',
  supporting: 'Based in Dhaka · Building at the intersection of design, AI & software.',
  primaryCta: { label: 'View my work', href: '#work' },
  secondaryCta: { label: 'Let’s talk', href: '#contact' },
  /** Portrait rendered by <HalftonePortrait>. Drop the file into /public. */
  portrait: {
    src: '/portrait-source.jpeg',
    alt: 'Pink ASCII and pixel-art portrait of Samprity Haque, looking at the camera with a slight smile.',
  },
  footerLine: 'Product · AI/ML · Development',
} as const;

export const nav = [
  { label: 'Work', href: '#work' },
  { label: 'Expertise', href: '#expertise' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
] as const;

/* ------------------------------------------------------------------ */

export type Capability = { title: string; detail: string };

export type Expertise = {
  index: string;
  title: string;
  capabilities: Capability[];
};

export const expertise: Expertise[] = [
  {
    index: '01',
    title: 'Product',
    capabilities: [
      {
        title: 'UI/UX Design',
        detail: 'Figma, user flows, SaaS interfaces, dashboards, landing pages, visual hierarchy',
      },
      {
        title: 'Product Design & Strategy',
        detail: 'Problem discovery, feature planning, MVP definition, product workflows',
      },
      {
        title: 'Figma & Visual Design',
        detail: 'Interface design, typography, composition, design-to-development handoff',
      },
      {
        title: 'Product Research',
        detail: 'User problems, competitor analysis, solution validation, product opportunities',
      },
    ],
  },
  {
    index: '02',
    title: 'AI & ML',
    capabilities: [
      { title: 'Machine Learning', detail: 'Model training, experimentation, inference, evaluation' },
      {
        title: 'ML Model Integration',
        detail: 'Deploying models into applications, inference pipelines, connecting models with APIs',
      },
      { title: 'LLM Development', detail: 'RAG, AI agents, prompting, structured LLM workflows' },
      {
        title: 'AI/ML Research & Evaluation',
        detail: 'Model comparison, quantization, evaluation methodology, statistical analysis',
      },
    ],
  },
  {
    index: '03',
    title: 'Development',
    capabilities: [
      { title: 'Frontend Development', detail: 'HTML, CSS, JavaScript, modern web development' },
      {
        title: 'React & TypeScript',
        detail: 'React, TypeScript, Vite, Tailwind CSS, component-based development',
      },
      {
        title: 'AI-Native Development',
        detail: 'Claude Code, AI-assisted coding, debugging, implementation and iteration',
      },
      {
        title: 'Backend & API Integration',
        detail: 'REST APIs, FastAPI, databases, AI API integration',
      },
    ],
  },
  {
    index: '04',
    title: 'Research & Problem Solving',
    capabilities: [
      { title: 'Problem Discovery', detail: 'Finding the actual problem before designing the solution' },
      { title: 'Experimentation', detail: 'Building small things to test bigger ideas' },
      { title: 'AI Evaluation', detail: 'Understanding where models work, fail, and why' },
      {
        title: 'Systems Thinking',
        detail: 'Connecting product decisions with the technology behind them',
      },
    ],
  },
];

/* ------------------------------------------------------------------ */

export type Project = {
  index: string;
  slug: string;
  name: string;
  summary: string;
  tags: string[];
  cta: string;
  /** TODO: add a preview image to /public/work/<slug>.jpg and set this. */
  image?: string;
};

export const projects: Project[] = [
  {
    index: '001',
    slug: 'deshly',
    name: 'Deshly Studio',
    summary: 'AI product photography that preserves identity and keeps campaigns editable.',
    tags: ['Product', 'Computer Vision', 'AI', '3D'],
    cta: 'Explore Deshly',
  },
  {
    index: '002',
    slug: 'agrisense',
    name: 'AgriSense AI',
    summary: 'Turns a farmer’s needs into grounded, actionable season plans.',
    tags: ['AI', 'RAG', 'Agriculture', 'Decision Support'],
    cta: 'Explore AgriSense',
  },
  {
    index: '003',
    slug: 'bikolpo',
    name: 'Bikolpo',
    summary: 'Predicts rain-disrupted trips and finds safer alternatives.',
    tags: ['Geospatial AI', 'Routing', 'Climate'],
    cta: 'Explore Bikolpo',
  },
  {
    index: '004',
    slug: 'safaitrack',
    name: 'SafaiTrack',
    summary: 'Sensor-free waste collection powered by forecasting, routing, and grounded AI.',
    tags: ['Forecasting', 'Optimization', 'Civic Tech'],
    cta: 'Explore SafaiTrack',
  },
  {
    index: '005',
    slug: 'markable',
    name: 'Markable',
    summary: 'Reveals hidden inconsistencies in human marking without replacing teachers.',
    tags: ['AI', 'Education', 'Evaluation', 'Human-AI'],
    cta: 'Explore Markable',
  },
];

/** Section outline for project detail pages (content to be written per project). */
export const caseStudyOutline = [
  'Problem',
  'Idea',
  'Solution',
  'How it works',
  'Design',
  'Building it',
  'Results',
  'What I learned',
  'What’s next',
] as const;

/* ------------------------------------------------------------------ */

export type Experience = {
  period: string;
  company: string;
  role: string;
  description?: string;
};

export const experience: Experience[] = [
  {
    period: 'Sep 2025 — Present',
    company: 'Expresso Soft',
    role: 'UI/UX Designer',
    description:
      'Designing digital products and web experiences across SaaS, landing pages, and template products — while increasingly working across the boundary between design and implementation.',
  },
  {
    period: 'Jun 2025 — Sep 2025',
    company: 'Expresso Soft',
    role: 'UI/UX Intern',
  },
];

/* ------------------------------------------------------------------ */

export type Achievement = {
  index: string;
  /** The result, split into display lines. */
  result: string[];
  event: string;
  category?: string;
};

export const achievements: Achievement[] = [
  { index: '01', result: ['2nd', 'Runner-Up'], event: 'IUT 12th ICT Fest', category: 'GameJam' },
  { index: '02', result: ['Top 20', '/ 700+'], event: 'IUT 12th ICT Fest', category: 'Hackathon' },
  {
    index: '03',
    result: ['Finalist'],
    event: 'VisionX 2025',
    category: 'National AI-Powered Innovation Challenge',
  },
  { index: '04', result: ['Finalist'], event: 'The Infinity AI BuildFest 2026' },
];

/* ------------------------------------------------------------------ */

export const about = {
  eyebrow: '05 / A little about me',
  heading: 'I’m interested in what happens between an idea and a finished product.',
  paragraphs: [
    'I’m a Computer Science & Engineering student at Ahsanullah University of Science & Technology. I started with design, moved deeper into development and AI, and eventually realised that I enjoy the space between all three.',
    'I like understanding the problem, designing the experience, building the system, and then asking whether it actually works.',
  ],
  exploringLabel: 'Currently exploring',
  exploring: ['Computer Vision', 'AI Product Development', 'Machine Learning', 'Product Engineering'],
} as const;

export const contact = {
  eyebrow: '06 / Let’s talk',
  heading: 'Have something worth building?',
  supporting:
    'I’m interested in ambitious products, difficult problems, and opportunities where I can design, build, and learn.',
  cta: 'Get in touch',
} as const;

/**
 * TODO: replace every href below with your real links.
 * Placeholders are intentionally obvious so nothing fake ships.
 */
export const socials = [
  { label: 'GitHub', href: 'https://github.com/TODO-your-handle' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/TODO-your-handle' },
  { label: 'Email', href: 'mailto:TODO@example.com' },
] as const;

export const emailHref = socials[2].href;
