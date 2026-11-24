import { apiRequest } from './api'

function mapOpportunity(opportunity) {
  return {
    id: opportunity.id,
    title: opportunity.title,
    type: opportunity.type,
    organization: opportunity.organization,
    location: opportunity.location ?? 'Remote',
    description: opportunity.description,
    status: opportunity.status === 'open' ? 'Open' : 'Closed',
    tags: [opportunity.type],
  }
}

async function fetchOpportunities() {
  const data = await apiRequest('/opportunities')
  return data.map(mapOpportunity)
}

export function getFacultyOpportunities() {
  return fetchOpportunities()
}

export async function getFacultyTrainingPrograms() {
  const data = await apiRequest('/opportunities?type=FDP')
  return data.map(mapOpportunity)
}

export async function getFacultyCollaborationRequests() {
  const data = await apiRequest('/opportunities?type=Consultancy%20RFP')
  return data.map(mapOpportunity)
}

export async function getRecentFacultyOpportunities() {
  const data = await apiRequest('/opportunities')
  return data.slice(0, 4).map(mapOpportunity)
}

export async function getRecentCollaborationRequests() {
  const data = await apiRequest('/opportunities?type=Consultancy%20RFP')
  return data.slice(0, 4).map(mapOpportunity)
}

export async function getFacultyOpportunitiesSummary() {
  const opportunities = await fetchOpportunities()
  return {
    total: opportunities.length,
    open: opportunities.filter((item) => item.status === 'Open').length,
    types: [...new Set(opportunities.map((item) => item.type))].length,
  }
}

export async function getFacultyTrainingProgramsSummary() {
  const programs = await getFacultyTrainingPrograms()
  return { total: programs.length, open: programs.filter((item) => item.status === 'Open').length }
}

export async function getFacultyCollaborationRequestsSummary() {
  const requests = await getFacultyCollaborationRequests()
  return { total: requests.length, open: requests.filter((item) => item.status === 'Open').length }
}

export async function getFacultyDashboardStats() {
  const [opportunities, applications] = await Promise.all([
    fetchOpportunities(),
    getFacultyOpportunityApplications(),
  ])
  return [
    { id: 'opportunities', label: 'Opportunities', value: String(opportunities.length), detail: 'Open for applications', icon: 'opportunities', tone: 'blue' },
    { id: 'applications', label: 'My Applications', value: String(applications.length), detail: 'Submitted by you', icon: 'applications', tone: 'emerald' },
    { id: 'training', label: 'Training Programs', value: String(opportunities.filter((item) => item.type === 'FDP').length), detail: 'FDP programs', icon: 'training', tone: 'purple' },
    { id: 'collaborations', label: 'Collaborations', value: String(opportunities.filter((item) => item.type === 'Consultancy RFP').length), detail: 'Consultancy RFPs', icon: 'collaboration', tone: 'rose' },
  ]
}

export function createOpportunity(payload) {
  return apiRequest('/opportunities', { method: 'POST', body: payload })
}

export function applyToOpportunity(opportunityId, note) {
  return apiRequest(`/opportunities/${opportunityId}/apply`, {
    method: 'POST',
    body: { note: note ?? null },
  })
}

export async function getFacultyOpportunityApplications() {
  const data = await apiRequest('/opportunities/applications')
  return data.map((application) => ({
    id: application.id,
    opportunity: application.opportunity.title,
    organization: application.opportunity.organization,
    type: application.opportunity.type,
    status: application.status,
    appliedOn: application.applied_date,
  }))
}

export function getFacultyProfileData() {
  return apiRequest('/profiles/me')
}

export function updateFacultyProfile(payload) {
  return apiRequest('/profiles/me', { method: 'PUT', body: payload })
}

// Not implemented server-side yet — empty states keep the pages working.
export function getFacultyNotifications() {
  return Promise.resolve([])
}

export function getFacultyNotificationsSummary() {
  return Promise.resolve({ unread: 0, total: 0 })
}
