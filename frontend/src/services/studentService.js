import { apiRequest } from './api'

// Profile
export function getStudentProfileData() {
  return apiRequest('/profiles/me')
}

export function updateStudentProfile(payload) {
  return apiRequest('/profiles/me', { method: 'PUT', body: payload })
}

export function replaceStudentSkills(skills) {
  return apiRequest('/profiles/me/skills', { method: 'PUT', body: { skills } })
}

// Resumes
export function uploadResume(file) {
  const form = new FormData()
  form.append('file', file)
  return apiRequest('/resumes', { method: 'POST', formData: form })
}

export function getMyResumes() {
  return apiRequest('/resumes/me')
}

export function parseResume(resumeId) {
  return apiRequest(`/resumes/${resumeId}/parse`, { method: 'POST' })
}

// Job recommendations (mapped from /matches to the page's mock shape)
export async function getStudentJobRecommendations() {
  const data = await apiRequest('/matches')
  return data.matches.map((item) => ({
    id: item.job.id,
    title: item.job.title,
    company: item.job.company_name,
    location: item.job.location,
    experience: item.job.experience_level,
    type: item.job.job_type,
    match: item.match_score,
    skills: item.job.required_skills.map((skill) => skill.display_name),
    logo: (item.job.company_name[0] || '?').toUpperCase(),
    logoStyle: 'bg-[#fff] text-[#1260ed]',
  }))
}

// Course recommendations (mapped from /recommendations/courses)
export async function getStudentCourseRecommendations() {
  const data = await apiRequest('/recommendations/courses')
  return data.courses.map((course, index) => ({
    id: course.id,
    title: course.title,
    provider: course.provider,
    rating: course.rating ?? (4.5 + (index % 3) * 0.1),
    duration: course.duration ?? 'Self-paced',
    category: course.matched_skills[0] ?? 'Skills',
    level: course.level ?? 'All levels',
    match: Math.min(99, 70 + course.matched_skills.length * 10),
    description:
      course.description || 'Build in-demand skills with this free course.',
    visual: 'course',
  }))
}

// Applications
export async function getStudentApplicationsData() {
  const data = await apiRequest('/applications')
  return data.map((application) => ({
    id: application.id,
    title: application.job.title,
    company: application.job.company_name,
    location: application.job.location,
    type: application.job.employmentType.split(' • ')[0],
    appliedOn: application.applicationDate,
    status: application.status,
    nextStep: '—',
    logo: (application.job.company_name[0] || '?').toUpperCase(),
    logoStyle: 'text-[#1260ed]',
  }))
}

export function applyToJob(jobId, coverNote) {
  return apiRequest(`/jobs/${jobId}/apply`, {
    method: 'POST',
    body: { cover_note: coverNote ?? null },
  })
}

// Skill analysis — derived from live matches where the API has data;
// historical/static sections fall back to empty states.
export async function getStudentSkillAnalysisData() {
  const data = await apiRequest('/matches?limit=10')
  const matches = data.matches ?? []

  const strengths = []
  const improvementAreas = []
  const seen = new Set()
  for (const match of matches) {
    for (const skill of match.matched_skills) {
      if (!seen.has(skill.skill)) {
        seen.add(skill.skill)
        strengths.push({
          name: skill.skill,
          score: Math.round(skill.similarity * 100),
          level: skill.similarity >= 0.8 ? 'Advanced' : 'Good',
          icon: 'code',
          color: 'text-[#2563eb] bg-[#eff6ff]',
        })
      }
    }
    for (const skill of match.missing_skills) {
      if (!seen.has(skill)) {
        seen.add(skill)
        improvementAreas.push({ name: skill, score: 35, level: 'Low', color: 'red' })
      }
    }
  }

  const overallScore = matches.length
    ? Math.round(matches.reduce((sum, match) => sum + match.match_score, 0) / matches.length)
    : 0

  return {
    updatedAt: new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    summary: {
      overallScore,
      totalSkills: strengths.length + improvementAreas.length,
      strongSkills: strengths.length,
      skillsToImprove: improvementAreas.length,
      learningStreak: 0,
    },
    categories: [
      { name: 'Programming', score: overallScore, color: '#2563eb' },
      { name: 'Data Science', score: overallScore, color: '#10b981' },
      { name: 'Web Development', score: overallScore, color: '#8b5cf6' },
      { name: 'Database', score: overallScore, color: '#f59e0b' },
      { name: 'DevOps', score: overallScore, color: '#ef4444' },
      { name: 'Soft Skills', score: overallScore, color: '#14b8a6' },
    ],
    strengths: strengths.slice(0, 8),
    improvementAreas: improvementAreas.slice(0, 8),
    learningRecommendations: improvementAreas.slice(0, 3).map((item) => ({
      title: `Learn ${item.name}`,
      detail: 'A recommended course is available in Recommended Courses.',
    })),
    progress: [],
    recentActivity: [],
  }
}

// Dashboard — composite of live data
export async function getStudentDashboardData() {
  const [profile, matches, applications, courses] = await Promise.all([
    getStudentProfileData(),
    apiRequest('/matches?limit=10'),
    apiRequest('/applications'),
    apiRequest('/recommendations/courses'),
  ])

  const topMatches = matches.matches ?? []
  const bestMatch = topMatches[0]?.match_score ?? 0
  const missingCount = topMatches.reduce(
    (sum, match) => sum + match.missing_skills.length,
    0
  )

  return {
    studentName: profile.headline || 'Student',
    overviewStats: [
      { id: 'profile-completion', label: 'Profile Completion', value: profile.headline ? 'Complete' : 'Add details', detail: 'Keep your profile fresh', icon: 'profile', color: 'bg-[#edf4ff] text-[#1260ed]' },
      { id: 'skill-match', label: 'Best Match', value: `${bestMatch}%`, detail: 'Across recommended roles', icon: 'match', color: 'bg-[#e9faf6] text-[#0e9c7b]' },
      { id: 'recommended-jobs', label: 'Recommended Jobs', value: String(topMatches.length), detail: 'Matched to your profile', icon: 'jobs', color: 'bg-[#fff5e8] text-[#d88719]' },
      { id: 'recommended-courses', label: 'Recommended Courses', value: String(courses.courses.length), detail: 'To help grow your skills', icon: 'courses', color: 'bg-[#f3efff] text-[#7351c9]' },
    ],
    skillMatch: {
      percentage: bestMatch,
      counts: [
        { label: 'Matched skills', count: topMatches.reduce((sum, m) => sum + m.matched_skills.length, 0), color: 'bg-[#19b596]' },
        { label: 'Skills to improve', count: missingCount, color: 'bg-[#f0b94d]' },
        { label: 'Applications sent', count: applications.length, color: 'bg-[#dce8f5]' },
      ],
    },
    jobRecommendations: topMatches.slice(0, 3).map((item) => ({
      id: item.job.id,
      company: item.job.company_name,
      role: item.job.title,
      location: item.job.location,
      match: item.match_score,
      initials: (item.job.company_name[0] || '?').toUpperCase(),
      color: 'bg-[#eef3ff] text-[#1260ed]',
    })),
    skillGaps: topMatches
      .flatMap((match) => match.missing_skills)
      .filter((skill, index, all) => all.indexOf(skill) === index)
      .slice(0, 3)
      .map((skill) => ({ id: `gap-${skill}`, skill, level: 'Medium', width: '54%', color: 'bg-[#f0b94d]' })),
    courseRecommendations: courses.courses.slice(0, 3).map((course) => ({
      id: course.id,
      title: course.title,
      provider: course.provider,
      rating: course.rating ?? '4.5',
      duration: course.duration ?? 'Self-paced',
      color: 'from-[#6887f5] to-[#7e5ed5]',
      initials: (course.title[0] || 'C').toUpperCase(),
    })),
  }
}

// Not implemented server-side yet — empty states keep the pages working.
export function getStudentSavedJobsData() {
  return Promise.resolve([])
}

export function getStudentNotificationsData() {
  return Promise.resolve([])
}
