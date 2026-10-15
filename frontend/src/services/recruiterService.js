import {
  recruiterStatsData,
  recentCandidatesData,
  recentJobsData,
  skillDistributionData,
} from '../data/recruiterMockData.js'

/**
 * Recruiter Service
 *
 * Separates data retrieval from presentation components.
 * Currently serves structured mock demonstration data for local development.
 * Designed to be swapped with HTTP fetch calls to the FastAPI backend
 * once endpoints are available.
 */

export async function getRecruiterDashboardStats() {
  // Demonstration mock retrieval.
  // In the future, this will call the FastAPI endpoint:
  // e.g.: const response = await fetch('/api/v1/recruiter/dashboard/stats');
  //       return await response.json();
  return Promise.resolve(recruiterStatsData)
}

export async function getRecentCandidates() {
  // Demonstration mock retrieval.
  // In the future, this will call the FastAPI endpoint:
  // e.g.: const response = await fetch('/api/v1/recruiter/candidates/recent');
  //       return await response.json();
  return Promise.resolve(recentCandidatesData)
}

export async function getRecentJobs() {
  // Demonstration mock retrieval.
  // In the future, this will call the FastAPI endpoint:
  // e.g.: const response = await fetch('/api/v1/recruiter/jobs/recent');
  //       return await response.json();
  return Promise.resolve(recentJobsData)
}

export async function getSkillDistribution() {
  // Demonstration mock retrieval.
  // In the future, this will call the FastAPI endpoint:
  // e.g.: const response = await fetch('/api/v1/recruiter/analytics/skills');
  //       return await response.json();
  return Promise.resolve(skillDistributionData)
}



