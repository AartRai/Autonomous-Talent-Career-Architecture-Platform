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



