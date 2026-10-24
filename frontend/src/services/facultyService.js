import {
  facultyOverviewStats,
  recentFacultyOpportunities,
  recentCollaborationRequests,
  facultyOpportunitiesData,
  facultyOpportunitiesSummary,
  facultyTrainingProgramsData,
  facultyTrainingProgramsSummary,
  facultyCollaborationRequestsData,
  facultyCollaborationRequestsSummary,
  facultyProfileInitialData,
  facultyNotificationsData,
  facultyNotificationsSummary,
} from '../data/facultyMockData.js'

/**
 * Faculty Service
 *
 * Separates data retrieval from presentation components.
 * Currently serves structured mock demonstration data for local development.
 * Designed to be swapped with HTTP fetch calls to the FastAPI backend
 * once endpoints are available.
 */

export async function getFacultyDashboardStats() {
  return Promise.resolve(facultyOverviewStats)
}

export async function getRecentFacultyOpportunities() {
  return Promise.resolve(recentFacultyOpportunities)
}

export async function getRecentCollaborationRequests() {
  return Promise.resolve(recentCollaborationRequests)
}

export async function getFacultyOpportunities() {
  return Promise.resolve(facultyOpportunitiesData)
}

export async function getFacultyOpportunitiesSummary() {
  return Promise.resolve(facultyOpportunitiesSummary)
}

export async function getFacultyTrainingPrograms() {
  return Promise.resolve(facultyTrainingProgramsData)
}

export async function getFacultyTrainingProgramsSummary() {
  return Promise.resolve(facultyTrainingProgramsSummary)
}

export async function getFacultyCollaborationRequests() {
  return Promise.resolve(facultyCollaborationRequestsData)
}

export async function getFacultyCollaborationRequestsSummary() {
  return Promise.resolve(facultyCollaborationRequestsSummary)
}

export async function getFacultyProfileData() {
  return Promise.resolve(facultyProfileInitialData)
}

export async function getFacultyNotifications() {
  return Promise.resolve(facultyNotificationsData)
}

export async function getFacultyNotificationsSummary() {
  return Promise.resolve(facultyNotificationsSummary)
}





