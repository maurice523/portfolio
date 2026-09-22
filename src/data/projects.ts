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
    imageAlt: 'Move project preview',
    tools: ['React Native', 'React.js', 'TypeScript', 'FastAPI', 'Supabase', 'Vercel'],
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
    image: '/projects/gemline-test-data-generator.svg',
    imageAlt: 'ERP Test Data Generator project preview',
    tools: ['Python', 'BAML', 'OpenAI API', 'React.js'],
    links: { live: 'https://orders.mauriceneme.com' },
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
    image: '/projects/boston-trees.svg',
    imageAlt: 'Boston Trees project preview',
    tools: ['Python', 'Streamlit', 'Pandas'],
    links: {},
    date: 'Jan 2026',
    status: 'completed',
  },
  {
    slug: 'excel-io',
    title: 'Excel-io',
    tagline:
      'A working spreadsheet application in Java, with a formula bar and built-in functions.',
    description:
      'A fully functioning spreadsheet application written in Java. It features a formula bar and built-in functions.',
    highlights: ['Formula bar for entering and editing formulas', 'Built-in spreadsheet functions'],
    image: '/projects/excel-io.svg',
    imageAlt: 'Excel-io project preview',
    tools: ['Java'],
    links: {},
    date: 'Nov 2025',
    status: 'completed',
  },
  {
    slug: 'portfolio',
    title: 'This Portfolio',
    tagline: 'The site you’re on: a portfolio built to grow, designed for phone and desktop.',
    description:
      'My personal portfolio for introductions and project display. Projects are data-driven, so adding a new one means adding a single entry. It is responsive from phone to desktop and deployed on Cloudflare.',
    highlights: [
      'Data-driven project list: one entry per project, no component changes',
      'Mobile-first responsive design with Tailwind CSS',
    ],
    image: '/projects/portfolio.svg',
    imageAlt: 'Portfolio project preview',
    tools: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Cloudflare'],
    links: {},
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
