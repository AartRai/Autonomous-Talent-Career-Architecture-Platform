import {
  studentDashboardData,
  studentCourseRecommendations,
  studentApplicationsData,
  studentJobRecommendations,
  studentNotificationsData,
  studentProfileData,
  studentSavedJobsData,
  studentSkillAnalysisData,
} from '../data/studentMockData.js'

/**
 * Student Service
 *
 * Returns fictional student mock data using the same retrieval pattern as the
 * recruiter service. These functions can be replaced with API calls later.
 */
export async function getStudentDashboardData() {
  return Promise.resolve(studentDashboardData)
}

export async function getStudentJobRecommendations() {
  return Promise.resolve(studentJobRecommendations)
}

export async function getStudentCourseRecommendations() {
  return Promise.resolve(studentCourseRecommendations)
}

export async function getStudentApplicationsData() {
  return Promise.resolve(studentApplicationsData)
}

export async function getStudentSavedJobsData() {
  return Promise.resolve(studentSavedJobsData)
}

export async function getStudentNotificationsData() {
  return Promise.resolve(studentNotificationsData)
}

export async function getStudentProfileData() {
  return Promise.resolve(studentProfileData)
}

export async function getStudentSkillAnalysisData() {
  return Promise.resolve(studentSkillAnalysisData)
}
