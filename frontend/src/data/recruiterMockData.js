/**
 * Mock demonstration data for the Recruiter Dashboard.
 * These mock values serve as temporary placeholders until real backend API integration.
 */

export const recruiterStatsData = [
  {
    id: 'total-candidates',
    title: 'Total Candidates',
    value: '1,248',
    icon: 'candidates',
    tone: 'blue',
    trend: {
      value: '+12%',
      label: 'vs last month',
      isPositive: true,
    },
  },
  {
    id: 'new-applications',
    title: 'New Applications',
    value: '134',
    icon: 'applications',
    tone: 'emerald',
    trend: {
      value: '+28',
      label: 'new this week',
      isPositive: true,
    },
  },
  {
    id: 'active-jobs',
    title: 'Active Job Posts',
    value: '12',
    icon: 'jobs',
    tone: 'purple',
    trend: {
      value: '3 roles',
      label: 'closing soon',
      isPositive: null,
    },
  },
  {
    id: 'top-matches',
    title: 'Top Matches',
    value: '86',
    icon: 'matches',
    tone: 'rose',
    trend: {
      value: '>85%',
      label: 'skill alignment',
      isPositive: true,
    },
  },
]

/**
 * Fictional demonstration candidates for the Recruiter Dashboard.
 * Skill-match scores are mock values for UI demonstration and do not reflect real AI model calculations.
 */
export const recentCandidatesData = [
  {
    id: 'cand-1',
    name: 'Aarav Patel',
    initials: 'AP',
    role: 'Full-Stack Software Engineer',
    experience: 'B.Tech in Computer Science, IIT Bombay • 2 yrs experience',
    skills: ['React', 'FastAPI', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    matchScore: 96,
    shortlisted: false,
    tone: 'blue',
  },
  {
    id: 'cand-2',
    name: 'Maya Lin',
    initials: 'ML',
    role: 'AI / Machine Learning Engineer',
    experience: 'M.S. in Data Science, UC Berkeley • 1 yr research & NLP',
    skills: ['Python', 'PyTorch', 'TensorFlow', 'LLMs', 'Vector DBs'],
    matchScore: 92,
    shortlisted: false,
    tone: 'purple',
  },
  {
    id: 'cand-3',
    name: 'Devon Vance',
    initials: 'DV',
    role: 'Cloud & DevOps Architect',
    experience: 'B.S. in Information Systems, Georgia Tech • 3 yrs experience',
    skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD Pipelines'],
    matchScore: 89,
    shortlisted: true,
    tone: 'emerald',
  },
]

/**
 * Fictional demonstration job postings for the Recruiter Dashboard.
 * Application counts, statuses, and dates are mock values for UI demonstration
 * and do not originate from a live production database.
 */
export const recentJobsData = [
  {
    id: 'job-101',
    title: 'Software Development Engineer Intern',
    department: 'Engineering & Technology',
    employmentType: 'Internship • Hybrid',
    applicationsCount: 48,
    newApplications: 12,
    status: 'Active',
    postedDate: 'Oct 10, 2026',
  },
  {
    id: 'job-102',
    title: 'Data Analyst',
    department: 'Business Intelligence',
    employmentType: 'Full-time • On-site',
    applicationsCount: 35,
    newApplications: 6,
    status: 'Paused',
    postedDate: 'Oct 04, 2026',
  },
  {
    id: 'job-103',
    title: 'Frontend Developer',
    department: 'Core Web Experience',
    employmentType: 'Full-time • Remote',
    applicationsCount: 51,
    newApplications: 0,
    status: 'Closed',
    postedDate: 'Sep 22, 2026',
  },
]

/**
 * Fictional demonstration data for the Candidate Skill Distribution chart.
 * Counts and percentages are mock estimates for UI demonstration
 * and do not represent actual live database query results.
 */
export const skillDistributionData = [
  {
    id: 'skill-react',
    skill: 'React',
    candidateCount: 840,
    percentage: 67,
    tone: 'blue',
  },
  {
    id: 'skill-python',
    skill: 'Python',
    candidateCount: 790,
    percentage: 63,
    tone: 'blue',
  },
  {
    id: 'skill-ml',
    skill: 'Machine Learning',
    candidateCount: 620,
    percentage: 50,
    tone: 'purple',
  },
  {
    id: 'skill-aws',
    skill: 'AWS',
    candidateCount: 540,
    percentage: 43,
    tone: 'emerald',
  },
  {
    id: 'skill-sysdesign',
    skill: 'System Design',
    candidateCount: 460,
    percentage: 37,
    tone: 'rose',
  },
]

/**
 * Fictional demonstration candidates for the Recruiter Talent Search feature.
 * These records and sample match indicators are mock values for local UI evaluation
 * and do not originate from live AI inference, vector databases, or real candidate profiles.
 */
export const demoTalentSearchCandidates = [
  {
    id: 'talent-1',
    name: 'Aarav Patel',
    initials: 'AP',
    role: 'Full-Stack Software Engineer',
    education: 'B.Tech / B.E. in Computer Science (IIT Bombay)',
    educationDegree: 'B.Tech / B.E.',
    experienceLevel: '1–3 years',
    experienceYears: '2 years',
    location: 'Bengaluru',
    workMode: 'Hybrid',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Tailwind CSS', 'AWS'],
    demoMatchScore: 96,
    summary:
      'Full-stack engineer with 2 years of product engineering experience specializing in responsive React user interfaces, performant Node.js microservices, and PostgreSQL database optimization.',
    tone: 'blue',
  },
  {
    id: 'talent-2',
    name: 'Maya Lin',
    initials: 'ML',
    role: 'AI / Machine Learning Engineer',
    education: 'M.Tech / M.S. in Data Science & AI',
    educationDegree: 'M.Tech / M.S.',
    experienceLevel: '0–1 years',
    experienceYears: '1 year',
    location: 'Hyderabad',
    workMode: 'Remote',
    skills: ['Python', 'Machine Learning', 'PyTorch', 'TensorFlow', 'SQL', 'Docker'],
    demoMatchScore: 92,
    summary:
      'Research-oriented ML engineer with hands-on expertise building transformer pipelines, fine-tuning open-source LLMs, and deploying model serving containers.',
    tone: 'purple',
  },
  {
    id: 'talent-3',
    name: 'Devon Vance',
    initials: 'DV',
    role: 'Cloud & DevOps Architect',
    education: 'B.Tech / B.E. in Information Technology',
    educationDegree: 'B.Tech / B.E.',
    experienceLevel: '3–5 years',
    experienceYears: '3.5 years',
    location: 'Pune',
    workMode: 'On-site',
    skills: ['AWS', 'DevOps', 'Docker', 'Kubernetes', 'Python', 'CI/CD'],
    demoMatchScore: 89,
    summary:
      'DevOps specialist with over 3 years managing AWS multi-account infrastructure, Kubernetes cluster operations, Infrastructure-as-Code, and automated CI/CD security scanning.',
    tone: 'emerald',
  },
  {
    id: 'talent-4',
    name: 'Priya Deshmukh',
    initials: 'PD',
    role: 'Senior Frontend Engineer',
    education: 'B.Tech / B.E. in Computer Engineering',
    educationDegree: 'B.Tech / B.E.',
    experienceLevel: '3–5 years',
    experienceYears: '4 years',
    location: 'Bengaluru',
    workMode: 'Remote',
    skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'GraphQL', 'Next.js'],
    demoMatchScore: 94,
    summary:
      'Frontend architect passionate about responsive component libraries, accessible web standards, micro-frontends, and client-side performance optimization.',
    tone: 'blue',
  },
  {
    id: 'talent-5',
    name: 'Karthik Nair',
    initials: 'KN',
    role: 'Data Analyst & BI Specialist',
    education: 'B.Sc / M.Sc Computer Science',
    educationDegree: 'B.Sc / M.Sc Computer Science',
    experienceLevel: '1–3 years',
    experienceYears: '2 years',
    location: 'Delhi NCR',
    workMode: 'Hybrid',
    skills: ['Python', 'SQL', 'Data Analytics', 'Tableau', 'Pandas', 'Power BI'],
    demoMatchScore: 87,
    summary:
      'Analytical problem solver with 2 years analyzing user retention metrics, orchestrating ETL workflows, and building automated executive reporting dashboards.',
    tone: 'amber',
  },
  {
    id: 'talent-6',
    name: 'Rohan Gupta',
    initials: 'RG',
    role: 'Backend Java Developer',
    education: 'BCA / MCA in Computer Applications',
    educationDegree: 'BCA / MCA',
    experienceLevel: 'Fresher (0 years)',
    experienceYears: 'Fresher (0 years)',
    location: 'Mumbai',
    workMode: 'On-site',
    skills: ['Java', 'SQL', 'Spring Boot', 'REST APIs', 'Git', 'Docker'],
    demoMatchScore: 84,
    summary:
      'Recent MCA graduate with strong foundations in Java OOP design patterns, relational schema design, RESTful microservices, and Docker containerization.',
    tone: 'rose',
  },
]
