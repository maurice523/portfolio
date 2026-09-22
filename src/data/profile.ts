// Everything about me that appears on the site. Edit here, not in the components.

export type Experience = {
  company: string
  role: string
  date: string
  bullets: string[]
}

export const profile = {
  name: 'Maurice Neme',
  headline: 'Software Developer · Data Analytics & CIS @ Bentley',
  location: 'Boston, MA',
  email: 'mauricenemee@gmail.com',
  // Put your photo in public/ (e.g. public/maurice.jpg) and set this to '/maurice.jpg'.
  // While it is empty, your initials are shown instead.
  photo: '/maurice.jpg',
  links: {
    github: 'https://github.com/maurice523',
    linkedin: 'https://www.linkedin.com/in/maurice-neme-020582317',
    // Add public/resume.pdf (without your phone number) and set this to '/resume.pdf'
    // to show a "Download resume" button in the Contact section.
    resume: '',
  },
  about: [
    'I’m a Data Analytics and Computer Information Systems student at Bentley University who loves building software that turns data into something people can use.',
    'Most recently I built an AI-powered ERP test data generator at Gemline, and I’m co-founding Move, a ridesharing platform for students. When I’m not coding, I’m teaching bass guitar and music theory.',
  ],
  education: {
    school: 'Bentley University',
    degree: 'B.S. Data Analytics and Computer Information Systems · Minor: Business Administration',
    date: 'Expected May 2027',
    details: [
      'Major GPA: 3.6',
      'Dean’s List: Fall 2024, Fall 2025, Spring 2026',
      'First Place, Data Visualization Competition (Fall 2025)',
    ],
  },
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
  ] satisfies Experience[],
  skills: {
    Programming: ['Python', 'TypeScript', 'Java', 'SQL', 'HTML/CSS'],
    Frameworks: ['React.js', 'React Native', 'FastAPI', 'Streamlit'],
    Data: ['Pandas', 'NumPy', 'Matplotlib', 'Statistical Modeling', 'Data Visualization'],
    Tools: ['GitHub', 'VS Code', 'Claude Code', 'Supabase', 'Cloudflare'],
    Concepts: ['REST APIs', 'AI/LLM Integration', 'Data Structures & Algorithms'],
  },
  languages: ['English (Fluent)', 'Spanish (Native)'],
}
