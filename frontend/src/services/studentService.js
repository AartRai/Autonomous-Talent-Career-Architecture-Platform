import { studentDashboardData, studentProfileData } from '../data/studentMockData.js'

/**
 * Student Service
 *
 * Returns fictional student mock data using the same retrieval pattern as the
 * recruiter service. These functions can be replaced with API calls later.
 */
export async function getStudentDashboardData() {
  return Promise.resolve(studentDashboardData)
}

export async function getStudentProfileData() {
  return Promise.resolve(studentProfileData)
}
