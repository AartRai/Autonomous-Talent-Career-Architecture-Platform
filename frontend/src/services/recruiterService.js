import { apiRequest } from './api'

// Recruiter dashboard — response shapes mirror the API contracts.
export function getRecruiterDashboardStats() {
  return apiRequest('/recruiter/dashboard/stats')
}

export function getRecentCandidates() {
  return apiRequest('/recruiter/candidates/recent')
}

export function getRecentJobs() {
  return apiRequest('/recruiter/jobs/recent')
}

export function getSkillDistribution() {
  return apiRequest('/recruiter/analytics/skills')
}

export function getRecruiterApplications() {
  return apiRequest('/recruiter/applications')
}

export function updateRecruiterProfile(payload) {
  return apiRequest('/profiles/me', { method: 'PUT', body: payload })
}

export function updateApplicationStatus(applicationId, status) {
  return apiRequest(`/recruiter/applications/${applicationId}/status`, {
    method: 'PATCH',
    body: { status },
  })
}

export function talentSearch({ q = '', skills = '', limit = 20 } = {}) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (skills) params.set('skills', skills)
  if (limit !== 20) params.set('limit', String(limit))
  const suffix = params.toString() ? `?${params}` : ''
  return apiRequest(`/recruiter/talent-search${suffix}`)
}

export async function postJob(formData) {
  const body = {
    title: formData.jobTitle,
    company_name: formData.companyName,
    location: formData.location,
    work_mode: formData.workMode,
    job_type: formData.jobType,
    experience_level: formData.experienceLevel,
    salary_range: formData.salaryRange || null,
    openings_count: Number(formData.openingsCount),
    description: formData.jobDescription,
    responsibilities: formData.responsibilities,
    qualifications: formData.qualifications,
    required_skills: formData.requiredSkills,
    preferred_skills: formData.preferredSkills,
  }
  return apiRequest('/recruiter/jobs', { method: 'POST', body })
}
