import type { Project } from '@/types/project'

// To add a project: put an image in public/projects/ and add one object to this list.
export const projects: Project[] = [
  {
    slug: 'move',
    title: 'Move',
    tagline: 'Student ridesharing that connects verified student drivers with student commuters.',
    description:
      'A full-stack web and mobile ridesharing platform I am co-founding. Students sign up with their university (.edu) email, which creates trust-based, community-driven access to shared rides.',
    highlights: [
      'Architecting the full system: ride posting and discovery with location and time filtering',
      'In-app messaging plus a rating and review system for both drivers and riders',
      'Leading frontend (React Native / React.js) and backend (FastAPI + Supabase) development',
    ],
    image: '/projects/move.svg',
    imageAlt: 'Move — coming soon',
    tools: ['React Native', 'React.js', 'TypeScript', 'FastAPI', 'Supabase', 'Cloudflare'],
    links: {},
    date: 'Aug 2026 – Present',
    status: 'in-development',
    featured: true,
  },
  {
    slug: 'gemline-test-data-generator',
    title: 'ERP Test Data Generator',
    tagline: 'AI-powered test data for Gemline’s ERP: from 12 orders an hour to 1,000+ in minutes.',
    description:
      'Built during my software development internship at Gemline. The tool uses AI and a data pipeline based on statistical analysis to generate ERP test orders, replacing slow manual order entry.',
    highlights: [
      'Cut manual order entry from 12 orders per hour to 1,000+ orders in minutes',
      'Data pipeline that generates output based on statistical analysis of historical orders',
      'Presented the product to Gemline’s Executive Leadership Team and Board Chair',
    ],
    image: '/projects/gemline-test-data-generator.webp',
    imageAlt: 'Screenshot of the ERP Test Data Generator showing generated sales orders',
    tools: ['Python', 'BAML', 'OpenAI API', 'React.js'],
    links: {
      github: 'https://github.com/maurice523/order-tester-gem',
      live: 'https://orders.mauriceneme.com',
    },
    date: 'Jun 2026 – Aug 2026',
    status: 'completed',
    featured: true,
  },
  {
    slug: 'boston-trees',
    title: 'Boston Trees',
    tagline: 'Interactive map of the trees planted across Boston, with user-controlled filters.',
    description:
      'A data visualization app that maps trees planted across Boston. Users control the filters and the map to explore the data. Frontend and backend are built entirely in Python with Streamlit.',
    highlights: [
      'Interactive mapping with user-controlled filtering',
      'Managed both frontend and backend entirely in Python',
    ],
    image: '/projects/boston-trees.webp',
    imageAlt: 'Screenshot of the Boston Trees dashboard showing a bar chart of trees per neighborhood',
    tools: ['Python', 'Streamlit', 'Pandas'],
    links: {
      github: 'https://github.com/maurice523/boston-trees-app',
      live: 'https://trees.mauriceneme.com',
    },
    date: 'Jan 2026',
    status: 'completed',
  },
  {
    slug: 'excel-io',
    title: 'Excel-io',
    tagline:
      'A spreadsheet built from scratch in Java, with its own formula language. Playable in your browser.',
    description:
      'A desktop spreadsheet written in Java: a grid you type into, a formula bar, and formulas that reference other cells and ranges. The formula language is hand-written — a lexer turns the text into tokens, a parser builds a tree that respects operator precedence, and an evaluator walks it. The browser demo runs the real app with CheerpJ.',
    highlights: [
      'Hand-written lexer, parser and evaluator — no spreadsheet libraries',
      '12 functions including SUM, AVG, IF, ROUND and CONCAT',
      'Changing a cell recalculates everything that depends on it',
      'Swing interface with a formula bar, plus save and open',
    ],
    image: '/projects/excel-io.webp',
    imageAlt: 'Screenshot of the Excel-io spreadsheet grid running in the browser',
    tools: ['Java', 'Swing', 'JUnit', 'Gradle'],
    links: {
      github: 'https://github.com/maurice523/excel-io',
      live: 'https://excelio.mauriceneme.com',
    },
    date: 'Nov 2025',
    status: 'completed',
  },
  {
    slug: 'portfolio',
    title: 'This Portfolio',
    tagline: 'The site you’re on! A portfolio built to grow, designed for web and mobile.',
    description:
      'My personal portfolio for introductions and project display. Projects are data-driven, so adding a new one means adding a single entry. It is responsive from phone to desktop and deployed on Cloudflare.',
    highlights: [
      'Data-driven project list: one entry per project, no component changes',
      'Mobile-first responsive design with Tailwind CSS',
    ],
    image: '/projects/portfolio.webp',
    imageAlt: 'Screenshot of this portfolio’s hero section with the 3D bass guitar',
    tools: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Cloudflare'],
    links: {
      github: 'https://github.com/maurice523/personal-portfolio',
      live: 'https://mauriceneme.com',
    },
    date: 'Jul 2026 – Present',
    status: 'in-development',
  },
]

/** All projects, featured ones first (otherwise in the order listed above). */
export function getProjects(): Project[] {
  return [...projects].sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false))
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}
