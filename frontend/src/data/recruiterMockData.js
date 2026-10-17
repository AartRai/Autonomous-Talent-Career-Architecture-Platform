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

const candidateHighlightsMap = {
  'talent-1': [
    {
      title: 'High-Concurrency E-Commerce Microservices',
      description:
        'Engineered performant Node.js backend services and responsive React storefront, reducing checkout API latency by 28% and handling peak order surges.',
    },
    {
      title: 'Full-Stack Analytics & Real-Time Dashboard',
      description:
        'Implemented WebSocket updates with PostgreSQL indexing and Tailwind CSS charts for operational monitoring.',
    },
  ],
  'talent-2': [
    {
      title: 'Transformer-Based NLP Summarization Pipeline',
      description:
        'Built and evaluated fine-tuned open-source LLM pipelines in PyTorch to automate domain-specific document extraction.',
    },
    {
      title: 'High-Dimensional Vector Search Engine',
      description:
        'Integrated Dockerized vector database indexing for low-latency semantic document retrieval over 500,000 text embeddings.',
    },
  ],
  'talent-3': [
    {
      title: 'Multi-Region Kubernetes (EKS) Infrastructure',
      description:
        'Provisioned resilient AWS EKS clusters with Terraform Infrastructure-as-Code and implemented zero-downtime rolling deployment strategies.',
    },
    {
      title: 'Automated CI/CD DevSecOps Pipeline',
      description:
        'Constructed automated container vulnerability scanning and branch-level verification pipelines in GitHub Actions.',
    },
  ],
  'talent-4': [
    {
      title: 'Accessible Design System & UI Component Library',
      description:
        'Designed and built 40+ accessible React and TypeScript components adhering to WCAG 2.1 AA guidelines, shared across multiple engineering squads.',
    },
    {
      title: 'Next.js Web Application Performance Optimization',
      description:
        'Achieved a 35% bundle reduction and 400ms improvement in First Contentful Paint through code-splitting and asset prefetching.',
    },
  ],
  'talent-5': [
    {
      title: 'Automated Executive BI & Data Pipeline',
      description:
        'Designed Python ETL jobs extracting transaction data into SQL data warehouses with automated executive Tableau reporting dashboards.',
    },
    {
      title: 'Predictive Retention & Churn Cohort Model',
      description:
        'Performed statistical survival and cohort analysis using Pandas to identify churn risk indicators across user life stages.',
    },
  ],
  'talent-6': [
    {
      title: 'Banking & Payments Microservices Architecture',
      description:
        'Constructed Spring Boot REST microservices with PostgreSQL connection pooling, transactional consistency, and JWT authentication.',
    },
    {
      title: 'Dockerized Container Testing Workflow',
      description:
        'Configured reproducible local development environments and automated unit/integration test suites.',
    },
  ],
  'talent-7': [
    {
      title: 'Enterprise SaaS Onboarding Redesign',
      description:
        'Conducted user interviews, journey mapping, and interactive Figma prototyping to streamline recruiter workspace navigation.',
    },
    {
      title: 'Cross-Platform Design Tokens & Component System',
      description:
        'Created comprehensive typography and color token architectures in Figma and Tailwind CSS.',
    },
  ],
  'talent-8': [
    {
      title: 'Cloud Security Posture & IAM Privilege Auditing',
      description:
        'Automated AWS multi-account role inspection using Python scripts to detect policy over-permissioning.',
    },
    {
      title: 'SIEM Log Correlation & Incident Detection Rules',
      description:
        'Implemented automated security monitoring rules to correlate suspicious network traversal events.',
    },
  ],
}

/**
 * Fictional demonstration candidate profiles for the Candidate Profiles page.
 * These profiles are mock records for local UI evaluation and do not represent real candidate records
 * or real AI match scores.
 */
export const demoCandidateProfiles = [
  ...demoTalentSearchCandidates.map((c) => ({
    id: c.id,
    name: c.name,
    initials: c.initials,
    role: c.role,
    education: c.education,
    educationDegree: c.educationDegree,
    experienceLevel: c.experienceLevel,
    experienceYears: c.experienceYears,
    location: c.location,
    workMode: c.workMode,
    skills: c.skills,
    summary: c.summary,
    tone: c.tone,
    highlights: candidateHighlightsMap[c.id] || [],
  })),
  {
    id: 'talent-7',
    name: 'Ananya Sharma',
    initials: 'AS',
    role: 'UI/UX Designer & Product Specialist',
    education: 'BCA / MCA in Digital Media & Computing',
    educationDegree: 'BCA / MCA',
    experienceLevel: '1–3 years',
    experienceYears: '2.5 years',
    location: 'Pune',
    workMode: 'Remote',
    skills: ['Figma', 'UI/UX Design', 'Wireframing', 'User Research', 'Tailwind CSS', 'Prototyping'],
    summary:
      'User experience designer dedicated to creating intuitive design systems, responsive interfaces, and accessible design patterns for high-growth SaaS applications.',
    tone: 'purple',
    highlights: candidateHighlightsMap['talent-7'] || [],
  },
  {
    id: 'talent-8',
    name: 'Siddharth Verma',
    initials: 'SV',
    role: 'Cybersecurity & Systems Analyst',
    education: 'M.Tech / M.S. in Information Security',
    educationDegree: 'M.Tech / M.S.',
    experienceLevel: '5+ years',
    experienceYears: '5 years',
    location: 'Chennai',
    workMode: 'Hybrid',
    skills: ['Cybersecurity', 'Python', 'Linux', 'Network Security', 'Docker', 'AWS'],
    summary:
      'Information security practitioner experienced in vulnerability assessment, cloud perimeter defense, SIEM monitoring, and secure system architecture.',
    tone: 'emerald',
    highlights: candidateHighlightsMap['talent-8'] || [],
  },
]

/**
 * Fictional demonstration application records for the Applications Management module.
 * These records are mock values for local UI evaluation and pipeline tracking,
 * and do not originate from a live production database or real job applicants.
 */
export const demoApplications = [
  {
    id: 'app-101',
    candidateName: 'Aarav Patel',
    initials: 'AP',
    email: 'aarav.patel@demo-talent.example',
    appliedJob: 'Software Development Engineer Intern',
    department: 'Engineering & Technology',
    applicationDate: 'Oct 14, 2026',
    status: 'Under Review',
    education: 'B.Tech in Computer Science (IIT Bombay)',
    experience: '2 years product software engineering',
    location: 'Bengaluru',
    workMode: 'Hybrid',
    skills: ['React', 'FastAPI', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Docker'],
    summary:
      'Full-stack engineer with 2 years of product engineering experience specializing in responsive React user interfaces, performant Node.js microservices, and PostgreSQL database optimization.',
    coverNote:
      'Excited to contribute to high-performance distributed web services and scalable user-facing web tools.',
    tone: 'blue',
  },
  {
    id: 'app-102',
    candidateName: 'Maya Lin',
    initials: 'ML',
    email: 'maya.lin@demo-talent.example',
    appliedJob: 'AI / Machine Learning Engineer',
    department: 'AI Labs & Research',
    applicationDate: 'Oct 13, 2026',
    status: 'Interview Stage',
    education: 'M.S. in Data Science (UC Berkeley)',
    experience: '1 year applied research & NLP architectures',
    location: 'Remote',
    workMode: 'Remote',
    skills: ['Python', 'PyTorch', 'TensorFlow', 'LLMs', 'Vector DBs', 'FastAPI'],
    summary:
      'AI/ML specialist with applied research background in conversational agents, retrieval-augmented generation (RAG), and parameter-efficient model fine-tuning.',
    coverNote:
      'Keen to drive practical machine learning innovations and agentic pipeline automation in production environments.',
    tone: 'purple',
  },
  {
    id: 'app-103',
    candidateName: 'Devon Vance',
    initials: 'DV',
    email: 'devon.vance@demo-talent.example',
    appliedJob: 'Cloud & DevOps Architect',
    department: 'Infrastructure',
    applicationDate: 'Oct 12, 2026',
    status: 'Shortlisted',
    education: 'B.S. in Information Systems (Georgia Tech)',
    experience: '3 years cloud infrastructure & automation',
    location: 'Bengaluru',
    workMode: 'Hybrid',
    skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD Pipelines', 'Prometheus'],
    summary:
      'Cloud solutions architect focused on automated multi-region deployments, Kubernetes cluster orchestration, and cost-efficient cloud resource management.',
    coverNote:
      'Passionate about zero-downtime deployments, infrastructure-as-code, and robust observability.',
    tone: 'emerald',
  },
  {
    id: 'app-104',
    candidateName: 'Priya Sharma',
    initials: 'PS',
    email: 'priya.sharma@demo-talent.example',
    appliedJob: 'Frontend Developer',
    department: 'Core Web Experience',
    applicationDate: 'Oct 11, 2026',
    status: 'Interview Stage',
    education: 'B.Tech in Computer Science (NIT Karnataka)',
    experience: '3.5 years modern frontend engineering',
    location: 'Hyderabad',
    workMode: 'Remote',
    skills: ['React', 'Next.js', 'TypeScript', 'Redux Toolkit', 'Tailwind CSS', 'Vite'],
    summary:
      'Frontend developer dedicated to crafting fluid web experiences with micro-interactions, robust TypeScript typing, and accessible WCAG design systems.',
    coverNote:
      'Strong advocate for component modularity, design systems, and frontend performance budgets.',
    tone: 'blue',
  },
  {
    id: 'app-105',
    candidateName: 'Alex Chen',
    initials: 'AC',
    email: 'alex.chen@demo-talent.example',
    appliedJob: 'Data Analyst',
    department: 'Business Intelligence',
    applicationDate: 'Oct 10, 2026',
    status: 'Under Review',
    education: 'B.Math in Computer Science & Statistics (Waterloo)',
    experience: '2 years statistical analytics & predictive modeling',
    location: 'Mumbai',
    workMode: 'On-site',
    skills: ['Python', 'SQL', 'Tableau', 'Power BI', 'Statistics', 'Pandas'],
    summary:
      'Analytical thinker with demonstrated experience synthesizing ambiguous enterprise datasets into clear dashboards and actionable growth insights.',
    coverNote:
      'Focused on driving operational efficiency through predictive telemetry and automated reporting pipelines.',
    tone: 'purple',
  },
  {
    id: 'app-106',
    candidateName: 'Ananya Sharma',
    initials: 'AS',
    email: 'ananya.sharma@demo-talent.example',
    appliedJob: 'UI/UX Designer & Product Specialist',
    department: 'Product & Design',
    applicationDate: 'Oct 09, 2026',
    status: 'Shortlisted',
    education: 'BCA / MCA in Digital Media & Computing',
    experience: '2.5 years SaaS product design & wireframing',
    location: 'Pune',
    workMode: 'Remote',
    skills: ['Figma', 'UI/UX Design', 'Wireframing', 'User Research', 'Tailwind CSS', 'Prototyping'],
    summary:
      'User experience designer dedicated to creating intuitive design systems, responsive interfaces, and accessible design patterns for high-growth SaaS applications.',
    coverNote:
      'Committed to bridging user research with developer handoff and cohesive product aesthetics.',
    tone: 'purple',
  },
  {
    id: 'app-107',
    candidateName: 'Siddharth Verma',
    initials: 'SV',
    email: 'siddharth.verma@demo-talent.example',
    appliedJob: 'Cloud & DevOps Architect',
    department: 'Infrastructure',
    applicationDate: 'Oct 08, 2026',
    status: 'Under Review',
    education: 'M.Tech in Information Security',
    experience: '5 years cloud perimeter defense & systems',
    location: 'Chennai',
    workMode: 'Hybrid',
    skills: ['Cybersecurity', 'Python', 'Linux', 'Network Security', 'Docker', 'AWS'],
    summary:
      'Information security practitioner experienced in vulnerability assessment, cloud perimeter defense, SIEM monitoring, and secure system architecture.',
    coverNote:
      'Specialized in SOC2 compliance, automated perimeter scanning, and resilient network topologies.',
    tone: 'emerald',
  },
  {
    id: 'app-108',
    candidateName: 'Marcus Reynolds',
    initials: 'MR',
    email: 'marcus.reynolds@demo-talent.example',
    appliedJob: 'Software Development Engineer Intern',
    department: 'Engineering & Technology',
    applicationDate: 'Oct 07, 2026',
    status: 'Shortlisted',
    education: 'B.S. in Software Engineering (Carnegie Mellon University)',
    experience: 'Final-year student • 1 summer internship',
    location: 'Remote',
    workMode: 'Remote',
    skills: ['Java', 'Python', 'Go', 'Distributed Systems', 'Docker', 'PostgreSQL'],
    summary:
      'Graduating software engineering student with strong fundamentals in data structures, algorithms, and distributed systems engineering.',
    coverNote:
      'Eager to learn from seasoned engineers and contribute clean, tested, and reliable backend services.',
    tone: 'blue',
  },
  {
    id: 'app-109',
    candidateName: 'Elena Rostova',
    initials: 'ER',
    email: 'elena.rostova@demo-talent.example',
    appliedJob: 'AI / Machine Learning Engineer',
    department: 'AI Labs & Research',
    applicationDate: 'Oct 05, 2026',
    status: 'Under Review',
    education: 'M.S. in Machine Learning (ETH Zurich)',
    experience: '2 years computer vision & MLOps research',
    location: 'Bengaluru',
    workMode: 'On-site',
    skills: ['PyTorch', 'Python', 'Computer Vision', 'MLOps', 'TensorFlow', 'ONNX'],
    summary:
      'Machine learning engineer with focus on deep convolutional networks, transformer vision architectures, and low-latency edge deployment.',
    coverNote:
      'Passionate about bringing academic AI discoveries to real-world edge devices and inference pipelines.',
    tone: 'purple',
  },
  {
    id: 'app-110',
    candidateName: 'Rohan Mehra',
    initials: 'RM',
    email: 'rohan.mehra@demo-talent.example',
    appliedJob: 'Frontend Developer',
    department: 'Core Web Experience',
    applicationDate: 'Oct 03, 2026',
    status: 'Interview Stage',
    education: 'B.E. in Computer Engineering',
    experience: '4 years frontend UI architecture & state systems',
    location: 'Hyderabad',
    workMode: 'Hybrid',
    skills: ['React', 'TypeScript', 'GraphQL', 'Tailwind CSS', 'CSS Architecture', 'Webpack'],
    summary:
      'Senior frontend developer experienced in scalable client-side architecture, complex real-time dashboards, and web performance optimization.',
    coverNote:
      'Passionate about clean code, mentoring junior developers, and engineering polished user experiences.',
    tone: 'blue',
  },
]


