import { useEffect, useState } from 'react'
import StatCard from '../../components/recruiter/StatCard.jsx'
import RecentCandidatesSection from '../../components/recruiter/RecentCandidatesSection.jsx'
import CandidateSkillDistributionSection from '../../components/recruiter/CandidateSkillDistributionSection.jsx'
import RecentJobPostsSection from '../../components/recruiter/RecentJobPostsSection.jsx'
import {
  getRecruiterDashboardStats,
  getRecentCandidates,
  getRecentJobs,
  getSkillDistribution,
} from '../../services/recruiterService.js'

function RecruiterDashboardPage() {
  const [stats, setStats] = useState([])
  const [candidates, setCandidates] = useState([])
  const [jobs, setJobs] = useState([])
  const [skills, setSkills] = useState([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingCandidates, setLoadingCandidates] = useState(true)
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [loadingSkills, setLoadingSkills] = useState(true)

  useEffect(() => {
    let isMounted = true

    getRecruiterDashboardStats()
      .then((data) => {
        if (isMounted) {
          setStats(data)
          setLoadingStats(false)
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoadingStats(false)
        }
      })

    getRecentCandidates()
      .then((data) => {
        if (isMounted) {
          setCandidates(data)
          setLoadingCandidates(false)
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoadingCandidates(false)
        }
      })

    getRecentJobs()
      .then((data) => {
        if (isMounted) {
          setJobs(data)
          setLoadingJobs(false)
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoadingJobs(false)
        }
      })

    getSkillDistribution()
      .then((data) => {
        if (isMounted) {
          setSkills(data)
          setLoadingSkills(false)
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoadingSkills(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const handleToggleShortlist = (candidateId) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidateId ? { ...c, shortlisted: !c.shortlisted } : c
      )
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-[#101c3d] sm:text-3xl">
          Welcome back, Recruiter!
        </h1>
        <p className="mt-1.5 text-sm text-[#66738d] sm:text-base">
          Discover talent and connect with the right candidates.
        </p>
      </div>

      {/* 4 Stat Cards */}
      <section aria-label="Recruiter Overview Metrics">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {loadingStats && stats.length === 0
            ? Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-[148px] animate-pulse rounded-2xl border border-[#e2ecf9] bg-white p-5 sm:p-6 shadow-[0_2px_12px_rgba(20,40,80,0.04)]"
                />
              ))
            : stats.map((stat) => <StatCard key={stat.id} stat={stat} />)}
        </div>
      </section>

      {/* Recent Candidates Section */}
      <RecentCandidatesSection
        candidates={candidates}
        loading={loadingCandidates}
        onToggleShortlist={handleToggleShortlist}
      />

      {/* Candidate Skill Distribution Chart */}
      <CandidateSkillDistributionSection
        skills={skills}
        loading={loadingSkills}
      />

      {/* Recent Job Posts Section */}
      <RecentJobPostsSection
        jobs={jobs}
        loading={loadingJobs}
      />
    </div>
  )
}

export default RecruiterDashboardPage
