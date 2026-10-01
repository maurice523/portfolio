// The site's content as it was before the admin dashboard existed. Used once to fill the D1
// database (see build-seed.ts). After that, edit everything at /admin, not here.
import type { Content } from '../src/shared/schema.ts'

const logos = (names: string[]) => names.map((name) => ({ name, src: `/logos/${name}.svg` }))

export const seed: Content = {
  settings: {
    profile: {
      name: 'Maurice Neme',
      headline: 'Software Developer · Data Analytics & CIS @ Bentley',
      location: 'Boston, MA',
      email: 'mauricenemee@gmail.com',
      photo: '/maurice.jpg',
      links: {
        github: 'https://github.com/maurice523',
        linkedin: 'https://www.linkedin.com/in/maurice-neme-020582317',
        resume: '',
      },
      languages: ['English (Fluent)', 'Spanish (Native)'],
    },
    site: {
      title: 'Maurice Neme | Software Developer',
      description:
        'Maurice Neme: software developer and Data Analytics & CIS student at Bentley University. Projects, experience and contact.',
      footerNote: 'Built with React and Tailwind CSS',
    },
    hero: {
      eyebrow: 'Aspiring Software developer & Data Analyst · Boston, MA',
      heading: 'Hi, I’m Maurice.',
      intro:
        "I build software that turns data into tools people actually use. I'm also a pretty funky bass player.",
      ctaLabel: 'See my projects',
    },
    about: {
      bio: [
        'I’m a Data Analytics and Computer Information Systems student at Bentley University who loves building software that turns data into something people can use.',
        'Most recently I built an AI-powered ERP test data generator at Gemline, and I’m co-founding Move, a ridesharing platform for students. When I’m not coding, I’m teaching bass guitar and music theory.',
      ],
      playgroundLabel: 'Drag things around',
      playgroundWords: ['code', 'data', 'bass'],
      interests: [
        { text: 'Skiing', color: '#6cb4ff', top: 8, left: 6, rotate: -8 },
        { text: 'Wakeboarding', color: '#5ee0f0', top: 14, left: 48, rotate: 10 },
        { text: 'Climbing', color: '#b5e35d', top: 30, left: 20, rotate: 4 },
        { text: 'Bass', color: '#ff6a1f', top: 46, left: 62, rotate: -14 },
        { text: 'Soccer', color: '#f2c46d', top: 52, left: 8, rotate: 12 },
        { text: 'Cars', color: '#c79bff', top: 66, left: 38, rotate: -5 },
        { text: 'Ecuador', color: '#7aa2ff', top: 80, left: 4, rotate: 6 },
        { text: 'Boston', color: '#34f33e', top: 82, left: 62, rotate: -9 },
      ],
      currentlyBuilding: {
        slug: 'move',
        blurb: 'A ridesharing app for students, which I’m co-founding. See the project →',
      },
      techStack: {
        title: 'Tech stack',
        text: 'The languages and tools I reach for most, from data work in Python and SQL to web apps in React.',
        innerRing: logos(['python', 'typescript', 'react', 'java', 'postgresql']),
        outerRing: logos(['javascript', 'fastapi', 'supabase', 'git', 'tailwindcss', 'jupyter']),
      },
    },
    education: {
      school: 'Bentley University',
      degree:
        'B.S. Data Analytics and Computer Information Systems · Minor: Business Administration',
      date: 'Expected May 2027',
      details: [
        'Major GPA: 3.6',
        'Dean’s List: Fall 2024, Fall 2025, Spring 2026',
        'First Place, Data Visualization Competition (Fall 2025)',
      ],
    },
    skills: {
      groups: [
        { name: 'Programming', items: ['Python', 'TypeScript', 'Java', 'SQL', 'HTML/CSS'] },
        { name: 'Frameworks', items: ['React.js', 'React Native', 'FastAPI', 'Streamlit'] },
        {
          name: 'Data',
          items: ['Pandas', 'NumPy', 'Matplotlib', 'Statistical Modeling', 'Data Visualization'],
        },
        { name: 'Tools', items: ['GitHub', 'VS Code', 'Claude Code', 'Supabase', 'Cloudflare'] },
        {
          name: 'Concepts',
          items: ['REST APIs', 'AI/LLM Integration', 'Data Structures & Algorithms'],
        },
      ],
    },
    sections: {
      projects: {
        navLabel: 'Projects',
        title: 'Projects',
        intro: 'Things I’ve built, from internship tools to side projects.',
      },
      about: {
        navLabel: 'About',
        title: 'About me',
        intro: 'A bit about who I am and what I work with.',
      },
      experience: { navLabel: 'Experience', title: 'Experience', intro: '' },
      skills: { navLabel: '', title: 'Skills', intro: '' },
      contact: {
        navLabel: 'Contact',
        title: 'Get in touch',
        intro:
          'Whether it’s an internship, a project idea or just a question about my work, my inbox is open.',
      },
    },
  },

  projects: [
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
      links: { github: '', live: '' },
      date: 'Aug 2026 – Present',
      status: 'in-development',
      featured: true,
    },
    {
      slug: 'order-test-data-generator',
      title: 'ERP Test Data Generator',
      tagline:
        'AI-powered test data integrated into an ERP: from 12 orders an hour to 1,000+ in minutes.',
      description:
        'A four-stage pipeline that turns a plain-English request into realistic orders.\n\n' +
        'Parse: a BAML function calls the OpenAI API to turn a request like “3 sample orders shipping UPS ground to the US” into typed parameters: order count, carrier, country, order type, and line and quantity limits.\n\n' +
        'Extract: those parameters build a PostgreSQL query that pulls the matching historical orders.\n\n' +
        'Analyze: pandas turns that history into frequency tables and conditional probabilities (how often each value appears and which values tend to appear together), plus a distribution of lines per order.\n\n' +
        'Generate: each new order is sampled from those probabilities with weighted random choice, so combinations show up as often as they do in the real data. The output follows the existing JSON order schema and is displayed in a React front end.',
      highlights: [
        'Cut manual order entry from 12 orders per hour to 1,000+ orders in minutes',
        'Data pipeline that generates output based on statistical analysis of historical orders',
        'Presented the product to a companies Executive Leadership Team and Board Chair',
      ],
      image: '/projects/order-test-data-generator.webp',
      imageAlt: 'Screenshot of the ERP Test Data Generator showing generated sales orders',
      tools: ['Python', 'BAML', 'OpenAI API', 'React.js'],
      links: {
        github: 'https://github.com/maurice523/erp-test-data-generator',
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
      imageAlt:
        'Screenshot of the Boston Trees dashboard showing a bar chart of trees per neighborhood',
      tools: ['Python', 'Streamlit', 'Pandas'],
      links: {
        github: 'https://github.com/maurice523/boston-trees-app',
        live: 'https://trees.mauriceneme.com',
      },
      date: 'Jan 2026',
      status: 'completed',
      featured: false,
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
      featured: false,
    },
    {
      slug: 'portfolio',
      title: 'This Portfolio',
      tagline: 'The site you’re on! A portfolio built to grow, designed for web and mobile.',
      description:
        'My personal portfolio for introductions and project display. Everything on it — projects, text and color themes — is edited from an admin dashboard and stored in Cloudflare D1, so updates go live without a redeploy. It is responsive from phone to desktop and runs on Cloudflare Workers.',
      highlights: [
        'Content, projects and color themes edited from a protected /admin dashboard',
        'Cloudflare Workers + D1 + R2, with Cloudflare Access guarding the admin',
        'Mobile-first responsive design with Tailwind CSS',
      ],
      image: '/projects/portfolio.webp',
      imageAlt: 'Screenshot of this portfolio’s hero section with the 3D bass guitar',
      tools: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Cloudflare'],
      links: {
        github: 'https://github.com/maurice523/portfolio',
        live: 'https://mauriceneme.com',
      },
      date: 'Jul 2026 – Present',
      status: 'in-development',
      featured: false,
    },
  ],

  experience: [
    {
      company: 'Gemline',
      role: 'Software Development Intern',
      date: 'Jun 2026 – Aug 2026',
      bullets: [
        'Built an AI-powered ERP test data generator using Python, BAML, the OpenAI API and React.js',
        'Integrated into company production ERP system',
        'Implemented a data pipeline that generated output based on statistical analysis',
        'Cut order entry from 12 orders per hour to 1,000+ orders in minutes',
        'Presented the product to Gemline’s Executive Leadership Team and Board Chair',
      ],
    },
    {
      company: 'Deloitte',
      role: 'Audit & Assurance Intern (Human Capital Analytics)',
      date: 'Jul 2024 – Aug 2024',
      bullets: [
        'Cleaned and analyzed historical employee turnover data to identify drivers of attrition',
        'Modeled incentive structures, projecting an estimated 11% improvement in retention',
        'Produced client-ready visualizations and reports under Deloitte’s analytics standards',
      ],
    },
    {
      company: 'Self-employed',
      role: 'Private Music Tutor',
      date: 'Jul 2023 – Present',
      bullets: [
        'Taught 29+ beginner and intermediate students bass guitar and music theory',
        'Grew my client base mostly through word-of-mouth referrals and reviews',
      ],
    },
  ],

  themes: [
    {
      id: 'ember',
      name: 'Ember',
      scheme: 'dark',
      colors: {
        bg: '#0f131a',
        surface: '#161c26',
        raised: '#1c2330',
        line: '#273142',
        fg: '#e9edf3',
        muted: '#aab4c3',
        accent: '#ff6a1f',
        amber: '#f2c46d',
        green: '#6fcf8f',
      },
      isPublic: true,
      isDefault: true,
    },
    {
      id: 'ocean',
      name: 'Ocean',
      scheme: 'dark',
      colors: {
        bg: '#0b1220',
        surface: '#111a2c',
        raised: '#172238',
        line: '#24324d',
        fg: '#e6edf7',
        muted: '#a3b1c6',
        accent: '#38bdf8',
        amber: '#f2c46d',
        green: '#6fcf8f',
      },
      isPublic: false,
      isDefault: false,
    },
    {
      id: 'paper',
      name: 'Paper',
      scheme: 'light',
      colors: {
        bg: '#f7f5f0',
        surface: '#ffffff',
        raised: '#efece5',
        line: '#dcd7cc',
        fg: '#1b1f27',
        muted: '#5b6472',
        accent: '#d9480f',
        amber: '#a86b00',
        green: '#23794a',
      },
      isPublic: false,
      isDefault: false,
    },
  ],
}
