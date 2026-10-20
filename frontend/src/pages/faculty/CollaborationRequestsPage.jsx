import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CollaborationIcon,
  BriefcaseIcon,
  ClockIcon,
  CalendarIcon,
  BuildingIcon,
  FilterIcon,
  SearchIcon,
  CloseIcon,
  CheckCircleIcon,
  SparklesIcon,
  InfoIcon,
  UsersIcon,
  XCircleIcon,
  CheckIcon,
} from '../../components/faculty/FacultyIcons.jsx'

import {
  getFacultyCollaborationRequests,
  getFacultyCollaborationRequestsSummary,
} from '../../services/facultyService.js'

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Accepted', label: 'Accepted' },
  { value: 'Rejected', label: 'Rejected' },
  { value: 'In Progress', label: 'In Progress' },
]

const typeOptions = [
  { value: 'all', label: 'All Collaboration Types' },
  { value: 'Research', label: 'Research' },
  { value: 'Consultancy', label: 'Consultancy' },
  { value: 'Industrial Training', label: 'Industrial Training' },
  { value: 'Academic Partnership', label: 'Academic Partnership' },
]

function getStatusBadge(status) {
  switch (status) {
    case 'Pending':
    case 'Pending Review':
      return 'border-amber-200 bg-amber-50 text-amber-700'
    case 'Accepted':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700'
    case 'In Progress':
      return 'border-purple-200 bg-purple-50 text-purple-700'
    case 'Rejected':
      return 'border-rose-200 bg-rose-50 text-rose-700'
    default:
      return 'border-slate-200 bg-slate-100 text-slate-700'
  }
}

function getTypeBadge(type) {
  switch (type) {
    case 'Research':
      return 'border-[#cbdff8] bg-[#edf4ff] text-[#1260ed]'
    case 'Consultancy':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700'
    case 'Industrial Training':
      return 'border-purple-200 bg-purple-50 text-purple-700'
    case 'Academic Partnership':
      return 'border-indigo-200 bg-indigo-50 text-indigo-700'
    default:
      return 'border-slate-200 bg-slate-100 text-slate-700'
  }
}

export default function CollaborationRequestsPage() {
  const [requests, setRequests] = useState([])
  const [summaryStats, setSummaryStats] = useState({
    total: 12,
    pendingReview: 5,
    accepted: 4,
    inProgress: 3,
  })
  const [isLoading, setIsLoading] = useState(true)

  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedType, setSelectedType] = useState('all')

  // Modal and feedback states
  const [activeRequest, setActiveRequest] = useState(null)
  const [feedbackToast, setFeedbackToast] = useState(null)

  // Load initial data
  useEffect(() => {
    let isMounted = true
    Promise.all([
      getFacultyCollaborationRequests(),
      getFacultyCollaborationRequestsSummary(),
    ])
      .then(([data, summary]) => {
        if (isMounted) {
          setRequests(data)
          setSummaryStats(summary)
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  // Auto-dismiss toast notification
  useEffect(() => {
    if (!feedbackToast) return
    const timer = setTimeout(() => {
      setFeedbackToast(null)
    }, 3600)
    return () => clearTimeout(timer)
  }, [feedbackToast])

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeRequest) {
        setActiveRequest(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeRequest])

  // Filtered requests logic
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // Search by title, organization, contact person, or keyword
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchesTitle = req.title.toLowerCase().includes(query)
        const matchesOrg = req.organization.toLowerCase().includes(query)
        const matchesContact = req.contactPerson.toLowerCase().includes(query)
        const matchesDomain = req.domain.toLowerCase().includes(query)
        const matchesDesc = req.description.toLowerCase().includes(query)

        if (!matchesTitle && !matchesOrg && !matchesContact && !matchesDomain && !matchesDesc) {
          return false
        }
      }

      // Status filter
      if (selectedStatus !== 'all') {
        if (selectedStatus === 'Pending') {
          if (req.status !== 'Pending' && req.status !== 'Pending Review') {
            return false
          }
        } else if (req.status !== selectedStatus) {
          return false
        }
      }

      // Type filter
      if (selectedType !== 'all' && req.type !== selectedType) {
        return false
      }

      return true
    })
  }, [requests, searchQuery, selectedStatus, selectedType])

  const hasActiveFilters = Boolean(searchQuery.trim()) || selectedStatus !== 'all' || selectedType !== 'all'

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedStatus('all')
    setSelectedType('all')
  }

  // Handle Accept proposal
  const handleAccept = (req) => {
    if (req.status !== 'Pending Review' && req.status !== 'Pending') {
      setFeedbackToast({
        type: 'info',
        title: 'Request Already Processed',
        message: `This proposal has already been marked as ${req.status.toLowerCase()}.`,
      })
      return
    }

    setRequests((prev) =>
      prev.map((item) => (item.id === req.id ? { ...item, status: 'Accepted' } : item))
    )

    setSummaryStats((prev) => ({
      ...prev,
      pendingReview: Math.max(0, prev.pendingReview - 1),
      accepted: prev.accepted + 1,
    }))

    if (activeRequest && activeRequest.id === req.id) {
      setActiveRequest((prev) => (prev ? { ...prev, status: 'Accepted' } : null))
    }

    setFeedbackToast({
      type: 'success',
      title: 'Collaboration Proposal Accepted (Demo)',
      message: `You have accepted the collaboration proposal from ${req.organization}. Status updated in local session.`,
    })
  }

  // Handle Reject proposal
  const handleReject = (req) => {
    if (req.status !== 'Pending Review' && req.status !== 'Pending') {
      setFeedbackToast({
        type: 'info',
        title: 'Request Already Processed',
        message: `This proposal has already been marked as ${req.status.toLowerCase()}.`,
      })
      return
    }

    setRequests((prev) =>
      prev.map((item) => (item.id === req.id ? { ...item, status: 'Rejected' } : item))
    )

    setSummaryStats((prev) => ({
      ...prev,
      pendingReview: Math.max(0, prev.pendingReview - 1),
    }))

    if (activeRequest && activeRequest.id === req.id) {
      setActiveRequest((prev) => (prev ? { ...prev, status: 'Rejected' } : null))
    }

    setFeedbackToast({
      type: 'info',
      title: 'Collaboration Proposal Declined (Demo)',
      message: `The proposal from ${req.organization} was declined in your local session.`,
    })
  }


  return (
    <div className="space-y-7">
      {/* Toast Notification */}
      {feedbackToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex max-w-md items-start gap-3 rounded-xl border border-[#cbdff8] bg-white p-4 shadow-xl transition-all duration-200 animate-in fade-in slide-in-from-bottom-3"
        >
          <span
            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
              feedbackToast.type === 'success'
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-blue-50 text-[#1260ed]'
            }`}
          >
            {feedbackToast.type === 'success' ? (
              <CheckCircleIcon className="h-4 w-4" />
            ) : (
              <InfoIcon className="h-4 w-4" />
            )}
          </span>
          <div className="flex-1 text-xs">
            <p className="font-bold text-[#101c3d]">{feedbackToast.title}</p>
            <p className="mt-0.5 text-[#50617c]">{feedbackToast.message}</p>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackToast(null)}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Dismiss notification"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header & Breadcrumb */}
      <div>
        <nav aria-label="Breadcrumb" className="mb-2.5 flex items-center gap-2 text-xs">
          <Link
            to="/faculty"
            className="font-medium text-[#50617c] transition-colors hover:text-[#1260ed]"
          >
            Faculty Dashboard
          </Link>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-[#101c3d]" aria-current="page">
            Collaboration Requests
          </span>
        </nav>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#101c3d] sm:text-3xl">
              Collaboration Requests
            </h1>
            <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-[#50617c]">
              Review industry partnerships, academic collaborations, and joint research proposals.
            </p>
          </div>

          <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50/70 px-3 py-1 text-xs font-semibold text-[#1260ed]">
            <SparklesIcon className="h-3.5 w-3.5" />
            <span>Demo Data • Simulated Inquiries</span>
          </div>
        </div>
      </div>

      {/* Section A: Summary KPI Cards */}
      <section aria-labelledby="collaboration-summary-heading">
        <h2 id="collaboration-summary-heading" className="sr-only">
          Collaboration Requests Overview
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Total Requests */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] transition-all hover:border-[#cbdff8] hover:shadow-[0_4px_16px_rgba(20,40,80,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#d6e6fe] bg-[#edf4ff] text-[#1260ed]">
                <CollaborationIcon className="h-6 w-6" />
              </span>
              <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#1260ed]">
                All Cycles
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-[#101c3d]">
                  {summaryStats.total}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Demo Data
                </span>
              </div>
              <h3 className="mt-1 text-xs font-semibold text-[#50617c] sm:text-sm">
                Total Requests
              </h3>
              <p className="mt-0.5 text-[11px] text-[#71829e]">
                Proposals received across all tracks
              </p>
            </div>
          </div>

          {/* Card 2: Pending Review */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] transition-all hover:border-[#cbdff8] hover:shadow-[0_4px_16px_rgba(20,40,80,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-700">
                <ClockIcon className="h-6 w-6" />
              </span>
              <button
                type="button"
                onClick={() => setSelectedStatus(selectedStatus === 'Pending' ? 'all' : 'Pending')}
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition ${
                  selectedStatus === 'Pending'
                    ? 'border-amber-400 bg-amber-500 text-white'
                    : 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                }`}
              >
                {selectedStatus === 'Pending' ? 'Active Filter: On' : 'Needs Action'}
              </button>

            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-[#101c3d]">
                  {summaryStats.pendingReview}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Demo Data
                </span>
              </div>
              <h3 className="mt-1 text-xs font-semibold text-[#50617c] sm:text-sm">
                Pending Review
              </h3>
              <p className="mt-0.5 text-[11px] text-[#71829e]">
                Awaiting faculty evaluation
              </p>
            </div>
          </div>

          {/* Card 3: Accepted */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] transition-all hover:border-[#cbdff8] hover:shadow-[0_4px_16px_rgba(20,40,80,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#c8f0dc] bg-[#e9faf3] text-[#16a34a]">
                <CheckCircleIcon className="h-6 w-6" />
              </span>
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                Approved
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-[#101c3d]">
                  {summaryStats.accepted}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Demo Data
                </span>
              </div>
              <h3 className="mt-1 text-xs font-semibold text-[#50617c] sm:text-sm">
                Accepted
              </h3>
              <p className="mt-0.5 text-[11px] text-[#71829e]">
                Formal partnership endorsed
              </p>
            </div>
          </div>

          {/* Card 4: In Progress */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] transition-all hover:border-[#cbdff8] hover:shadow-[0_4px_16px_rgba(20,40,80,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#e6dbff] bg-[#f4f0ff] text-[#7c3aed]">
                <BriefcaseIcon className="h-6 w-6" />
              </span>
              <span className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-[11px] font-semibold text-purple-700">
                Active Projects
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-[#101c3d]">
                  {summaryStats.inProgress}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Demo Data
                </span>
              </div>
              <h3 className="mt-1 text-xs font-semibold text-[#50617c] sm:text-sm">
                In Progress
              </h3>
              <p className="mt-0.5 text-[11px] text-[#71829e]">
                Live collaboration & co-supervision
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section B: Search & Multi-Criteria Filters */}
      <section
        aria-labelledby="collab-filters-heading"
        className="rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-6"
      >
        <div className="flex items-center justify-between border-b border-[#eef4fc] pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#edf4ff] text-[#1260ed]">
              <FilterIcon className="h-4 w-4" />
            </span>
            <h2 id="collab-filters-heading" className="text-sm font-bold text-[#101c3d] sm:text-base">
              Filter Collaboration Requests
            </h2>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#d6e6fe] bg-[#edf4ff] px-3 py-1.5 text-xs font-semibold text-[#1260ed] transition hover:bg-[#dbe9fe]"
            >
              <CloseIcon className="h-3.5 w-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Filter Controls Grid */}
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-12">
          {/* Search Input */}
          <div className="relative md:col-span-6">
            <label htmlFor="collab-search" className="mb-1.5 block text-xs font-semibold text-[#50617c]">
              Search Organization, Title, Contact, or Keyword
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <SearchIcon className="h-4 w-4" />
              </span>
              <input
                id="collab-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by organization, proposal title, contact (e.g. ETH, Sensor)..."
                className="w-full rounded-xl border border-[#d6e6fe] bg-[#fbfdff] py-2.5 pl-9 pr-8 text-xs text-[#101c3d] placeholder-slate-400 transition focus:border-[#1260ed] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1260ed]/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <label htmlFor="status-select" className="mb-1.5 block text-xs font-semibold text-[#50617c]">
              Request Status
            </label>
            <select
              id="status-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-xl border border-[#d6e6fe] bg-[#fbfdff] px-3 py-2.5 text-xs text-[#101c3d] transition focus:border-[#1260ed] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1260ed]/20"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="md:col-span-3">
            <label htmlFor="type-select" className="mb-1.5 block text-xs font-semibold text-[#50617c]">
              Collaboration Type
            </label>
            <select
              id="type-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-xl border border-[#d6e6fe] bg-[#fbfdff] px-3 py-2.5 text-xs text-[#101c3d] transition focus:border-[#1260ed] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1260ed]/20"
            >
              {typeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Counter Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#f0f6fd] pt-3 text-xs text-[#50617c]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#101c3d]">
              Showing {filteredRequests.length}
            </span>
            <span>of {requests.length} demo proposals</span>
            {hasActiveFilters && (
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-[#1260ed]">
                Filters Active
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span>Click any request to view complete partnership scope & milestones</span>
          </div>
        </div>
      </section>

      {/* Section C: Collaboration Request Cards */}
      <section aria-labelledby="requests-heading">
        <h2 id="requests-heading" className="sr-only">
          Collaboration Request Listings
        </h2>

        {isLoading ? (
          <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-[#e2ecf9] bg-white p-8">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1260ed] border-r-transparent" />
              <p className="mt-3 text-xs font-semibold text-[#50617c]">
                Loading collaboration proposals...
              </p>
            </div>
          </div>
        ) : filteredRequests.length === 0 ? (
          /* Empty State */
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#cbdff8] bg-white p-8 text-center sm:p-12">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf4ff] text-[#1260ed]">
              <SearchIcon className="h-7 w-7" />
            </span>
            <h3 className="mt-4 text-base font-bold text-[#101c3d]">
              No collaboration requests match your filters
            </h3>
            <p className="mt-1.5 max-w-md text-xs leading-relaxed text-[#50617c]">
              We couldn't find any partnership proposals matching your query.
              Try clearing your search keyword, adjusting the status, or resetting your filter options.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#1260ed] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#0d4ecc]"
            >
              <CloseIcon className="h-4 w-4" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          /* Request Cards Grid */
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {filteredRequests.map((req) => {
              const statusClass = getStatusBadge(req.status)
              const typeClass = getTypeBadge(req.type)
              const isPending = req.status === 'Pending Review'

              return (
                <div
                  key={req.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] transition-all hover:border-[#cbdff8] hover:shadow-[0_4px_20px_rgba(20,40,80,0.08)] sm:p-6"
                >
                  <div>
                    {/* Top Meta Bar */}
                    <div className="flex flex-wrap items-start justify-between gap-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-[11px] font-bold ${typeClass}`}
                        >
                          {req.type}
                        </span>
                        <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600">
                          {req.domain}
                        </span>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusClass}`}
                      >
                        {req.status === 'In Progress' && (
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-600" />
                        )}
                        {req.status === 'Accepted' && <CheckIcon className="h-3 w-3" />}
                        {req.status === 'Rejected' && <XCircleIcon className="h-3 w-3" />}
                        <span>{req.status}</span>
                      </span>
                    </div>

                    {/* Request Title */}
                    <h3 className="mt-3 text-base font-extrabold text-[#101c3d] transition-colors group-hover:text-[#1260ed] sm:text-lg">
                      {req.title}
                    </h3>

                    {/* Organization & Location */}
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#50617c]">
                      <span className="inline-flex items-center gap-1.5 font-bold text-[#101c3d]">
                        <BuildingIcon className="h-3.5 w-3.5 text-[#1260ed]" />
                        <span>{req.organization}</span>
                      </span>
                    </div>

                    {/* Description */}
                    <p className="mt-3 text-xs leading-relaxed text-[#50617c]">
                      {req.description}
                    </p>

                    {/* Key Request Metadata Grid */}
                    <div className="mt-4 grid grid-cols-2 gap-2.5 rounded-xl bg-[#f8fbff] p-3 text-xs text-[#50617c] sm:grid-cols-3">
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Contact Person
                        </span>
                        <span className="mt-0.5 inline-flex items-center gap-1 font-semibold text-[#101c3d]">
                          <UsersIcon className="h-3.5 w-3.5 text-slate-400" />
                          <span>{req.contactPerson}</span>
                        </span>
                        <span className="block text-[10px] text-slate-400 truncate">
                          {req.designation}
                        </span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Received On
                        </span>
                        <span className="mt-0.5 inline-flex items-center gap-1 font-semibold text-[#101c3d]">
                          <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
                          <span>{req.dateReceived}</span>
                        </span>
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Proposed Timeline
                        </span>
                        <span className="mt-0.5 inline-flex items-center gap-1 font-semibold text-[#1260ed]">
                          <ClockIcon className="h-3.5 w-3.5 text-[#1260ed]" />
                          <span>{req.timeline}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#f0f6fd] pt-4">
                    <button
                      type="button"
                      onClick={() => setActiveRequest(req)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#d6e6fe] bg-[#edf4ff] px-3.5 py-2 text-xs font-bold text-[#1260ed] transition hover:bg-[#dbe9fe]"
                    >
                      <InfoIcon className="h-4 w-4" />
                      <span>View Details</span>
                    </button>

                    {/* Pending Action Buttons vs Processed Status */}
                    {isPending ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleReject(req)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100"
                        >
                          <XCircleIcon className="h-3.5 w-3.5" />
                          <span>Decline</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAccept(req)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
                        >
                          <CheckIcon className="h-3.5 w-3.5" />
                          <span>Accept Proposal</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold ${statusClass}`}
                        >
                          {req.status === 'Accepted' && <CheckCircleIcon className="h-3.5 w-3.5" />}
                          {req.status === 'Rejected' && <XCircleIcon className="h-3.5 w-3.5" />}
                          <span>
                            {req.status === 'Accepted'
                              ? 'Proposal Accepted'
                              : req.status === 'Rejected'
                              ? 'Proposal Declined'
                              : 'Active Collaboration'}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Section D: Collaboration Request Details Modal */}
      {activeRequest && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="collab-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-xs sm:p-6"
        >
          <div
            role="presentation"
            onClick={() => setActiveRequest(null)}
            className="fixed inset-0"
          />

          <div className="relative z-10 my-8 w-full max-w-2xl rounded-2xl border border-[#cbdff8] bg-white p-6 shadow-2xl transition-all sm:p-8">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#eef4fc] pb-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[11px] font-bold ${getTypeBadge(
                      activeRequest.type
                    )}`}
                  >
                    {activeRequest.type}
                  </span>
                  <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                    {activeRequest.domain}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getStatusBadge(
                      activeRequest.status
                    )}`}
                  >
                    {activeRequest.status}
                  </span>
                </div>

                <h2 id="collab-modal-title" className="text-xl font-extrabold text-[#101c3d] sm:text-2xl">
                  {activeRequest.title}
                </h2>

                <div className="flex flex-wrap items-center gap-2 text-xs text-[#50617c]">
                  <BuildingIcon className="h-4 w-4 text-[#1260ed]" />
                  <span className="font-bold text-[#101c3d]">{activeRequest.organization}</span>
                  <span className="text-slate-300">•</span>
                  <span>Received {activeRequest.dateReceived}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveRequest(null)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close details modal"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="mt-5 max-h-[60vh] space-y-5 overflow-y-auto pr-1 text-xs">
              {/* Partner Contact Card */}
              <div className="grid grid-cols-1 gap-3 rounded-xl border border-[#e2ecf9] bg-[#fbfdff] p-3.5 sm:grid-cols-2">
                <div>
                  <h4 className="flex items-center gap-1.5 font-bold text-[#101c3d]">
                    <UsersIcon className="h-3.5 w-3.5 text-[#1260ed]" />
                    <span>Lead Contact & Sponsor</span>
                  </h4>
                  <p className="mt-1 font-semibold text-[#101c3d]">{activeRequest.contactPerson}</p>
                  <p className="text-[11px] text-[#50617c]">{activeRequest.designation}</p>
                  <p className="text-[11px] text-[#1260ed]">{activeRequest.contactEmail}</p>
                </div>

                <div>
                  <h4 className="flex items-center gap-1.5 font-bold text-[#101c3d]">
                    <ClockIcon className="h-3.5 w-3.5 text-[#7c3aed]" />
                    <span>Project Duration & Timeline</span>
                  </h4>
                  <p className="mt-1 font-semibold text-[#101c3d]">{activeRequest.timeline}</p>
                  <p className="text-[11px] text-[#50617c]">Review Cycle: Current Academic Session</p>
                </div>
              </div>

              {/* Full Proposal Scope */}
              <div>
                <h3 className="font-bold text-[#101c3d]">Proposal Scope & Statement of Intent</h3>
                <p className="mt-1.5 leading-relaxed text-[#50617c]">
                  {activeRequest.fullProposal || activeRequest.description}
                </p>
              </div>

              {/* Milestones */}
              {activeRequest.milestones && (
                <div>
                  <h3 className="font-bold text-[#101c3d]">Proposed Milestones & Deliverables</h3>
                  <ul className="mt-2 space-y-1.5">
                    {activeRequest.milestones.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[#50617c]">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[10px] font-bold text-[#1260ed]">
                          {idx + 1}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Joint Resources */}
              {activeRequest.jointResources && (
                <div>
                  <h3 className="font-bold text-[#101c3d]">Committed Resources & Lab Facilities</h3>
                  <div className="mt-1.5 rounded-xl bg-[#f8fbff] p-3 text-[#405270]">
                    <p className="leading-relaxed">{activeRequest.jointResources}</p>
                  </div>
                </div>
              )}

              {/* Demo Notice Banner */}
              <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 text-[#17335e]">
                <div className="flex items-start gap-2.5">
                  <SparklesIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#1260ed]" />
                  <div>
                    <p className="font-bold">Simulated Demonstration Request</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600">
                      Partner institutions, proposals, and contact details are synthetic demonstration entities
                      for evaluating the SYNAPSE Faculty Module interface. Accepting or declining operates entirely within the frontend session.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#eef4fc] pt-4">
              <button
                type="button"
                onClick={() => setActiveRequest(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-[#50617c] hover:bg-slate-50"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                {activeRequest.status === 'Pending Review' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleReject(activeRequest)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100"
                    >
                      <XCircleIcon className="h-3.5 w-3.5" />
                      <span>Decline Proposal (Demo)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAccept(activeRequest)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
                    >
                      <CheckIcon className="h-3.5 w-3.5" />
                      <span>Accept Proposal (Demo)</span>
                    </button>
                  </>
                ) : (
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold ${getStatusBadge(
                      activeRequest.status
                    )}`}
                  >
                    {activeRequest.status === 'Accepted' && <CheckCircleIcon className="h-4 w-4" />}
                    {activeRequest.status === 'Rejected' && <XCircleIcon className="h-4 w-4" />}
                    <span>Status: {activeRequest.status}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
