import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ApplicationsIcon,
  SearchIcon,
  CloseIcon,
  CandidateProfilesIcon,
  PostJobIcon,
  EyeIcon,
} from '../../components/recruiter/RecruiterIcons.jsx'
import ApplicationDetailsModal from '../../components/recruiter/ApplicationDetailsModal.jsx'
import { demoApplications } from '../../data/recruiterMockData.js'

const allStatuses = [
  'Applied',
  'Under Review',
  'Shortlisted',
  'Interview Stage',
  'Rejected',
]

function StatusBadge({ status }) {
  if (status === 'Applied') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200/80 bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-800">
        <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
        Applied
      </span>
    )
  }
  if (status === 'Under Review') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
        Under Review
      </span>
    )
  }
  if (status === 'Shortlisted') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
        Shortlisted
      </span>
    )
  }
  if (status === 'Interview Stage') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/80 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-800">
        <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
        Interview Stage
      </span>
    )
  }
  if (status === 'Rejected') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-800">
        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
        Rejected
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
      {status}
    </span>
  )
}

function CalendarIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function FilterFunnelIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M22 3H2l8 9.46V19l4 2v-8.54L22 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CheckIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ApplicationsPage() {
  // Store applications in frontend React state for interactive pipeline demo
  const [applications, setApplications] = useState(() => demoApplications)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedJob, setSelectedJob] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [feedbackToast, setFeedbackToast] = useState(null)

  // Auto-dismiss feedback toast message
  useEffect(() => {
    if (!feedbackToast) return
    const timer = setTimeout(() => {
      setFeedbackToast(null)
    }, 4200)
    return () => clearTimeout(timer)
  }, [feedbackToast])

  // Unique list of job positions dynamically computed from current applications
  const jobOptions = useMemo(() => {
    const jobs = Array.from(new Set(applications.map((app) => app.appliedJob)))
    return jobs.sort()
  }, [applications])

  // Summary counts computed directly from current applications state
  const summaryCounts = useMemo(() => {
    const total = applications.length
    const underReview = applications.filter((app) => app.status === 'Under Review').length
    const shortlisted = applications.filter((app) => app.status === 'Shortlisted').length
    const interviewStage = applications.filter((app) => app.status === 'Interview Stage').length

    return { total, underReview, shortlisted, interviewStage }
  }, [applications])

  // Handler for changing an application's status
  const handleStatusChange = (applicationId, newStatus) => {
    if (!allStatuses.includes(newStatus)) return

    const target = applications.find((a) => a.id === applicationId)
    if (!target || target.status === newStatus) return

    const oldStatus = target.status

    // Update application state by stable ID
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      )
    )

    // Synchronize modal state if open
    setSelectedApplication((prev) =>
      prev && prev.id === applicationId ? { ...prev, status: newStatus } : prev
    )

    // Trigger clear demo feedback message
    setFeedbackToast({
      id: `${applicationId}-${newStatus}`,
      candidateName: target.candidateName,
      oldStatus,
      newStatus,
      message: `${target.candidateName}'s application moved from "${oldStatus}" to "${newStatus}".`,
    })
  }

  // Filter applications based on search query, job position, and status
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // 1. Text search across candidate name, email, applied job title, and application ID
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase()
        const candidateMatch = app.candidateName.toLowerCase().includes(query)
        const emailMatch = app.email ? app.email.toLowerCase().includes(query) : false
        const jobMatch = app.appliedJob.toLowerCase().includes(query)
        const idMatch = app.id.toLowerCase().includes(query)

        if (!candidateMatch && !emailMatch && !jobMatch && !idMatch) {
          return false
        }
      }

      // 2. Job position filter
      if (selectedJob && app.appliedJob !== selectedJob) {
        return false
      }

      // 3. Status filter
      if (selectedStatus && app.status !== selectedStatus) {
        return false
      }

      return true
    })
  }, [applications, searchQuery, selectedJob, selectedStatus])

  const hasActiveFilters = Boolean(searchQuery.trim()) || Boolean(selectedJob) || Boolean(selectedStatus)

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedJob('')
    setSelectedStatus('')
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#66738d] sm:text-sm">
        <Link
          to="/recruiter"
          className="font-medium transition hover:text-[#1260ed] hover:underline"
        >
          Recruiter Dashboard
        </Link>
        <span className="text-slate-300" aria-hidden="true">/</span>
        <span className="font-semibold text-[#101c3d]" aria-current="page">
          Applications Management
        </span>
      </nav>

      {/* Demo Feedback Toast */}
      {feedbackToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-5 right-5 z-50 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-white p-4 shadow-xl text-xs text-[#101c3d] max-w-sm animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <CheckIcon className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="font-bold text-sm text-[#101c3d]">Status Updated</p>
              <button
                type="button"
                onClick={() => setFeedbackToast(null)}
                className="text-slate-400 hover:text-slate-600 transition"
                aria-label="Dismiss message"
              >
                <CloseIcon className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-0.5 text-xs text-[#415170]">
              {feedbackToast.message}
            </p>
            <p className="mt-1 text-[11px] font-semibold text-[#1260ed]">
              Demo Session • Local updates (not saved to backend)
            </p>
          </div>
        </div>
      )}

      {/* 2. Header & Title */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-[#101c3d] sm:text-3xl">
              Applications Management
            </h1>
            <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#1260ed]">
              Demo Mode
            </span>
          </div>
          <p className="mt-1.5 text-sm text-[#66738d] sm:text-base">
            Review applicants, track hiring progress, and manage your recruitment pipeline.
          </p>
        </div>

        {/* Demo Indicator */}
        <div className="flex items-center gap-2 text-xs text-[#66738d]">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          <span>Interactive Session • State Updates Live</span>
        </div>
      </div>

      {/* 3. Demo Data Indicator Banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-[#f0f6ff] p-4 text-xs text-[#1e429f] sm:text-sm">
        <ApplicationsIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#1260ed]" />
        <div>
          <span className="font-bold text-[#101c3d]">Demonstration Pipeline:</span>{' '}
          Recruiters can update application stages (Applied, Under Review, Shortlisted, Interview Stage, Rejected). All updates reflect in real-time in memory and are not persisted to a backend database.
        </div>
      </div>

      {/* 4. Summary Pipeline Cards */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-[#66738d]">
            Pipeline Summary (All Demo Applications)
          </p>
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50/70 px-2.5 py-0.5 text-[11px] font-semibold text-[#1260ed]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1260ed]" />
            All Pipeline Baseline ({summaryCounts.total} Total)
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Applications */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] transition-all hover:border-[#cbdff8] hover:shadow-[0_4px_16px_rgba(20,40,80,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#d6e6fe] bg-[#edf4ff] text-[#1260ed]"
                aria-hidden="true"
              >
                <ApplicationsIcon className="h-5 w-5" />
              </span>
              <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
                All Roles
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#66738d]">
                Total Applications
              </p>
              <p className="mt-1 text-2xl font-extrabold tracking-tight text-[#101c3d] sm:text-3xl">
                {summaryCounts.total}
              </p>
              <p className="mt-1 text-xs text-[#66738d]">
                Total applicants in demo pipeline
              </p>
            </div>
          </div>

          {/* Under Review */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] transition-all hover:border-[#cbdff8] hover:shadow-[0_4px_16px_rgba(20,40,80,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-700"
                aria-hidden="true"
              >
                <CandidateProfilesIcon className="h-5 w-5" />
              </span>
              <span className="rounded-full border border-amber-100 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
                Awaiting Review
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#66738d]">
                Under Review
              </p>
              <p className="mt-1 text-2xl font-extrabold tracking-tight text-[#101c3d] sm:text-3xl">
                {summaryCounts.underReview}
              </p>
              <p className="mt-1 text-xs text-[#66738d]">
                Pending screening (all roles)
              </p>
            </div>
          </div>

          {/* Shortlisted */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] transition-all hover:border-[#cbdff8] hover:shadow-[0_4px_16px_rgba(20,40,80,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700"
                aria-hidden="true"
              >
                <PostJobIcon className="h-5 w-5" />
              </span>
              <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                Selected
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#66738d]">
                Shortlisted
              </p>
              <p className="mt-1 text-2xl font-extrabold tracking-tight text-[#101c3d] sm:text-3xl">
                {summaryCounts.shortlisted}
              </p>
              <p className="mt-1 text-xs text-[#66738d]">
                Shortlisted for outreach (all roles)
              </p>
            </div>
          </div>

          {/* Interview Stage */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] transition-all hover:border-[#cbdff8] hover:shadow-[0_4px_16px_rgba(20,40,80,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple-200 bg-purple-50 text-purple-700"
                aria-hidden="true"
              >
                <CalendarIcon className="h-5 w-5" />
              </span>
              <span className="rounded-full border border-purple-100 bg-purple-50 px-2.5 py-0.5 text-[11px] font-semibold text-purple-700">
                In Rounds
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#66738d]">
                Interview Stage
              </p>
              <p className="mt-1 text-2xl font-extrabold tracking-tight text-[#101c3d] sm:text-3xl">
                {summaryCounts.interviewStage}
              </p>
              <p className="mt-1 text-xs text-[#66738d]">
                In interview rounds (all roles)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Search & Filter Controls Toolbar */}
      <div className="rounded-2xl border border-[#e2ecf9] bg-white p-4 shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <SearchIcon className="h-4 w-4" />
            </div>
            <input
              id="applicant-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by candidate name, email, job title, or ID..."
              className="w-full rounded-xl border border-[#d6e4f7] bg-[#fdfefe] py-2.5 pr-9 pl-10 text-sm text-[#101c3d] placeholder:text-[#8896ab] transition focus:border-[#1260ed] focus:bg-white focus:ring-3 focus:ring-blue-100 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                aria-label="Clear search input"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap">
            {/* Job Position Filter */}
            <div className="w-full sm:w-auto">
              <label htmlFor="filter-job-position" className="sr-only">
                Filter by Job Position
              </label>
              <select
                id="filter-job-position"
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="w-full rounded-xl border border-[#d6e4f7] bg-[#fdfefe] px-3.5 py-2.5 text-xs font-semibold text-[#17335e] transition focus:border-[#1260ed] focus:bg-white focus:ring-3 focus:ring-blue-100 focus:outline-none sm:text-sm"
              >
                <option value="">All Job Positions</option>
                {jobOptions.map((job) => (
                  <option key={job} value={job}>
                    {job}
                  </option>
                ))}
              </select>
            </div>

            {/* Application Status Filter */}
            <div className="w-full sm:w-auto">
              <label htmlFor="filter-application-status" className="sr-only">
                Filter by Application Status
              </label>
              <select
                id="filter-application-status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full rounded-xl border border-[#d6e4f7] bg-[#fdfefe] px-3.5 py-2.5 text-xs font-semibold text-[#17335e] transition focus:border-[#1260ed] focus:bg-white focus:ring-3 focus:ring-blue-100 focus:outline-none sm:text-sm"
              >
                <option value="">All Statuses</option>
                {allStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Filters button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-[#101c3d] transition hover:bg-slate-100 hover:text-slate-900"
              >
                <CloseIcon className="h-3.5 w-3.5 text-slate-500" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Filter Indicator Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#f0f6ff] pt-3 text-xs text-[#66738d]">
          <div className="flex items-center gap-2">
            <FilterFunnelIcon className="h-3.5 w-3.5 text-slate-400" />
            <span>
              Showing{' '}
              <strong className="font-semibold text-[#101c3d]">
                {filteredApplications.length}
              </strong>{' '}
              of{' '}
              <strong className="font-semibold text-[#101c3d]">
                {applications.length}
              </strong>{' '}
              applications
              {hasActiveFilters && (
                <span className="ml-1 text-[#1260ed] font-medium">
                  (Filtered View)
                </span>
              )}
            </span>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-medium text-slate-400">Active:</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-[#1260ed]">
                  Search: &ldquo;{searchQuery}&rdquo;
                </span>
              )}
              {selectedJob && (
                <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-0.5 text-[11px] font-medium text-purple-700">
                  Job: {selectedJob}
                </span>
              )}
              {selectedStatus && (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                  Status: {selectedStatus}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 6. Applications Listing Area */}
      {filteredApplications.length === 0 ? (
        /* 7. Empty State */
        <div className="flex min-h-[340px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#cbdff8] bg-white p-8 text-center shadow-xs">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf4ff] text-[#1260ed]">
            <SearchIcon className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-[#101c3d]">
            No Applications Found
          </h2>
          <p className="mt-1.5 max-w-md text-xs text-[#66738d] sm:text-sm">
            We couldn&apos;t find any applications matching your current search query or filter selection.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1260ed] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700 sm:text-sm"
            >
              Reset All Filters
            </button>
            <Link
              to="/recruiter/candidates"
              className="inline-flex items-center gap-2 rounded-xl border border-[#d6e4f7] bg-white px-4 py-2.5 text-xs font-bold text-[#101c3d] transition hover:bg-slate-50 sm:text-sm"
            >
              Browse Candidate Profiles
            </Link>
          </div>
        </div>
      ) : (
        /* Responsive Application List (Table on sm+, Card List on mobile) */
        <div className="overflow-hidden rounded-2xl border border-[#e2ecf9] bg-white shadow-[0_2px_12px_rgba(20,40,80,0.04)]">
          {/* Desktop & Tablet Table */}
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[#eef4fc] bg-[#f8fbff] text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th scope="col" className="px-6 py-4">
                    Candidate
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Applied Job
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Application Date
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Status / Action
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Experience & Location
                  </th>
                  <th scope="col" className="px-6 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef4fc]">
                {filteredApplications.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => setSelectedApplication(app)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setSelectedApplication(app)
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`View application details for ${app.candidateName}`}
                    className="cursor-pointer transition-colors hover:bg-[#f6faff] focus:bg-[#f0f6ff] focus:outline-none"
                  >
                    {/* Candidate Name & Avatar */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                            app.tone === 'blue'
                              ? 'bg-blue-100 text-blue-700'
                              : app.tone === 'purple'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {app.initials}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[#101c3d] group-hover:text-[#1260ed]">
                            {app.candidateName}
                          </p>
                          <p className="text-xs text-[#66738d]">
                            {app.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Applied Job & Department */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-sm text-[#101c3d]">
                        {app.appliedJob}
                      </p>
                      <p className="text-xs text-[#66738d]">
                        {app.department}
                      </p>
                    </td>

                    {/* Application Date */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-[#66738d]">
                        <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
                        <span>{app.applicationDate}</span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-400">
                        #{app.id}
                      </span>
                    </td>

                    {/* Status Badge & Compact Status Selector */}
                    <td
                      className="px-6 py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center">
                        <StatusBadge status={app.status} />
                        <label htmlFor={`status-select-${app.id}`} className="sr-only">
                          Change status for {app.candidateName}
                        </label>
                        <select
                          id={`status-select-${app.id}`}
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className="rounded-lg border border-[#d6e4f7] bg-white px-2 py-1 text-xs font-semibold text-[#17335e] shadow-2xs transition hover:border-[#1260ed] focus:border-[#1260ed] focus:ring-2 focus:ring-blue-100 focus:outline-none"
                          aria-label={`Change status for ${app.candidateName}, current status is ${app.status}`}
                        >
                          {allStatuses.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>

                    {/* Experience & Location */}
                    <td className="px-6 py-4">
                      <p className="text-xs font-medium text-[#101c3d]">
                        {app.experience}
                      </p>
                      <p className="text-xs text-[#66738d]">
                        {app.location} • {app.workMode}
                      </p>
                    </td>

                    {/* Dedicated View Details Button */}
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedApplication(app)
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#d6e4f7] bg-white px-3 py-1.5 text-xs font-bold text-[#1260ed] shadow-2xs transition hover:border-[#1260ed] hover:bg-[#edf4ff]"
                      >
                        <EyeIcon className="h-3.5 w-3.5" />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View (< sm screens) */}
          <div className="divide-y divide-[#eef4fc] sm:hidden">
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                onClick={() => setSelectedApplication(app)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelectedApplication(app)
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`View application details for ${app.candidateName}`}
                className="cursor-pointer p-4 space-y-3 transition hover:bg-[#f8fbff] focus:bg-[#f0f6ff] focus:outline-none"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                        app.tone === 'blue'
                          ? 'bg-blue-100 text-blue-700'
                          : app.tone === 'purple'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {app.initials}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#101c3d]">
                        {app.candidateName}
                      </p>
                      <p className="text-xs text-[#66738d]">
                        {app.email}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] font-semibold text-slate-400">
                    #{app.id}
                  </span>
                </div>

                <div className="rounded-xl bg-[#f8fbff] p-3 text-xs space-y-1">
                  <p className="font-semibold text-[#101c3d]">
                    {app.appliedJob}
                  </p>
                  <p className="text-[#66738d]">
                    {app.department} • {app.location} ({app.workMode})
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    {app.experience}
                  </p>
                </div>

                <div
                  className="flex flex-wrap items-center justify-between gap-2 pt-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status={app.status} />
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className="rounded-lg border border-[#d6e4f7] bg-white px-2 py-1 text-xs font-semibold text-[#17335e]"
                      aria-label={`Change status for ${app.candidateName}`}
                    >
                      {allStatuses.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedApplication(app)
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#d6e4f7] bg-white px-2.5 py-1 text-xs font-bold text-[#1260ed]"
                  >
                    <EyeIcon className="h-3 w-3" />
                    <span>View</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. Application Details Modal */}
      {selectedApplication && (
        <ApplicationDetailsModal
          application={selectedApplication}
          onStatusChange={handleStatusChange}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </div>
  )
}

export default ApplicationsPage
