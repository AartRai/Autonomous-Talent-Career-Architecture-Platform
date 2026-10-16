/**
 * Fictional student demonstration data. These values are for UI development
 * only and are not connected to a live student database.
 */
export const studentDashboardData = {
  studentName: 'Aarti Rai',
  overviewStats: [
    {
      id: 'profile-completion',
      label: 'Profile Completion',
      value: '85%',
      detail: 'Almost there — add a project',
      icon: 'profile',
      color: 'bg-[#edf4ff] text-[#1260ed]',
    },
    {
      id: 'skill-match',
      label: 'Skill Match',
      value: '72%',
      detail: 'Across your target roles',
      icon: 'match',
      color: 'bg-[#e9faf6] text-[#0e9c7b]',
    },
    {
      id: 'recommended-jobs',
      label: 'Recommended Jobs',
      value: '24',
      detail: 'Matched to your profile',
      icon: 'jobs',
      color: 'bg-[#fff5e8] text-[#d88719]',
    },
    {
      id: 'recommended-courses',
      label: 'Recommended Courses',
      value: '12',
      detail: 'To help grow your skills',
      icon: 'courses',
      color: 'bg-[#f3efff] text-[#7351c9]',
    },
  ],
  skillMatch: {
    percentage: 72,
    counts: [
      { label: 'Matched skills', count: 18, color: 'bg-[#19b596]' },
      { label: 'Skills to improve', count: 6, color: 'bg-[#f0b94d]' },
      { label: 'New skills to learn', count: 4, color: 'bg-[#dce8f5]' },
    ],
  },
  jobRecommendations: [
    {
      id: 'student-job-1',
      company: 'Google',
      role: 'AI Engineer',
      location: 'Mountain View, CA · Hybrid',
      match: 92,
      initials: 'G',
      color: 'bg-[#eef3ff] text-[#4285f4]',
    },
    {
      id: 'student-job-2',
      company: 'Microsoft',
      role: 'Machine Learning Intern',
      location: 'Redmond, WA · Remote',
      match: 88,
      initials: 'M',
      color: 'bg-[#fff5ed] text-[#e55b27]',
    },
    {
      id: 'student-job-3',
      company: 'Amazon',
      role: 'Data Analyst',
      location: 'Seattle, WA · Hybrid',
      match: 84,
      initials: 'a',
      color: 'bg-[#fff7e8] text-[#e89119]',
    },
  ],
  skillGaps: [
    { id: 'aws-cloud', skill: 'AWS Cloud Computing', level: 'High', width: '78%', color: 'bg-[#ef7373]' },
    { id: 'system-design', skill: 'System Design', level: 'Medium', width: '54%', color: 'bg-[#f0b94d]' },
    { id: 'mlops', skill: 'MLOps', level: 'Medium', width: '42%', color: 'bg-[#f0b94d]' },
  ],
  courseRecommendations: [
    {
      id: 'student-course-1',
      title: 'AWS Certified Cloud Practitioner',
      provider: 'Amazon Web Services',
      rating: '4.8',
      duration: '6 weeks',
      color: 'from-[#ffb76b] to-[#ef7c55]',
      initials: 'aws',
    },
    {
      id: 'student-course-2',
      title: 'Machine Learning Specialization',
      provider: 'DeepLearning.AI',
      rating: '4.9',
      duration: '3 months',
      color: 'from-[#6887f5] to-[#7e5ed5]',
      initials: 'ML',
    },
    {
      id: 'student-course-3',
      title: 'System Design for Interviews',
      provider: 'Educative',
      rating: '4.7',
      duration: '8 weeks',
      color: 'from-[#36bda8] to-[#168f9e]',
      initials: 'SD',
    },
  ],
}

export const studentProfileData = {
  details: {
    name: 'Aarti Rai',
    education: 'Final Year CSE Student',
    email: 'aarti.rai@example.com',
    phone: '+91 90000 00000',
    location: 'Bangalore, India',
    about:
      'Passionate Computer Science student with interest in AI/ML, Full Stack Development and Data Analytics.',
  },
  completion: 85,
  dateOfBirth: '12 May 2004',
  gender: 'Female',
  languages: ['English', 'Hindi'],
  resume: {
    name: 'Aarti_Rai_Resume.pdf',
    uploadedAt: 'Oct 10, 2024',
  },
  tabs: {
    Education: [
      {
        id: 'education-1',
        title: 'Bachelor of Technology, Computer Science',
        subtitle: 'Sample University · 2021 – 2025',
        detail: 'Final year · Coursework in machine learning, data structures, and cloud computing.',
      },
    ],
    Skills: ['Python', 'JavaScript', 'React', 'Machine Learning', 'SQL', 'Data Analysis'],
    Projects: [
      {
        id: 'project-1',
        title: 'Student Career Matcher',
        subtitle: 'React · Python · Machine Learning',
        detail: 'A sample project that recommends career paths from a student’s skills and interests.',
      },
      {
        id: 'project-2',
        title: 'Campus Event Portal',
        subtitle: 'React · Node.js · PostgreSQL',
        detail: 'A sample web app for discovering and registering for campus events.',
      },
    ],
    Certifications: [
      {
        id: 'certification-1',
        title: 'Introduction to Machine Learning',
        subtitle: 'Sample Learning Platform · 2024',
        detail: 'Foundational course covering supervised learning and model evaluation.',
      },
      {
        id: 'certification-2',
        title: 'Web Development Fundamentals',
        subtitle: 'Sample Learning Platform · 2023',
        detail: 'Course completion certificate.',
      },
    ],
  },
}
