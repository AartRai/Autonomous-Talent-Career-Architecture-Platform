import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  FacultyDashboardIcon,
  ResearchIcon,
  TrainingIcon,
  CollaborationIcon,
  FacultyBellIcon,
  BuildingIcon,
  CalendarIcon,
  ClockIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  SparklesIcon,
  CloseIcon,
  SearchIcon,
} from '../../components/faculty/FacultyIcons.jsx'
import {
  getFacultyDashboardStats,
  getRecentFacultyOpportunities,
  getRecentCollaborationRequests,
} from '../../services/facultyService.js'

const iconMap = {
  research: ResearchIcon,
  training: TrainingIcon,
  collaboration: CollaborationIcon,
  notifications: FacultyBellIcon,
}

const toneMap = {
  blue: {
    bg: 'bg-[#edf4ff]',
    text: 'text-[#1260ed]',
    border: 'border-[#d6e6fe]',
  },
  purple: {
    bg: 'bg-[#f4f0ff]',
    text: 'text-[#7c3aed]',
    border: 'border-[#e6dbff]',
  },
  emerald: {
    bg: 'bg-[#e9faf3]',
    text: 'text-[#16a34a]',
    border: 'border-[#c8f0dc]',
  },
  rose: {
    bg: 'bg-[#fff0f2]',
    text: 'text-[#e11d48]',
    border: 'border-[#fcd4dc]',
  },
}

const linkMap = {
  research: '/faculty/opportunities',
  training: '/faculty/training',
  collaboration: '/faculty/collaborations',
  notifications: '/faculty/notifications',
}

function FacultyStatCard({ stat }) {
  const { title, value, icon, tone = 'blue', trend } = stat
  const IconComponent = iconMap[icon] || FacultyDashboardIcon
  const toneStyles = toneMap[tone] || toneMap.blue
  const targetLink = linkMap[icon] || '/faculty'

  return (
    <Link
      to={targetLink}
      className="group flex h-full flex-col justify-between rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] transition-all hover:-translate-y-0.5 hover:border-[#cbdff8] hover:shadow-[0_6px_20px_rgba(20,40,80,0.08)] sm:p-6 block"
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${toneStyles.bg} ${toneStyles.text} ${toneStyles.border} transition-transform group-hover:scale-105`}
          aria-hidden="true"
        >
          <IconComponent className="h-6 w-6" />
        </span>

        {trend && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              trend.isPositive === true
                ? 'border border-emerald-200/70 bg-emerald-50 text-emerald-700'
                : trend.isPositive === false
                ? 'border border-rose-200/70 bg-rose-50 text-rose-700'
                : 'border border-amber-200/70 bg-amber-50 text-amber-700'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-[#101c3d] group-hover:text-[#1260ed] transition-colors">
            {value}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Demo Data
          </span>
        </div>
        <h3 className="mt-1 text-xs font-semibold text-[#50617c] sm:text-sm group-hover:text-[#101c3d] transition-colors">
          {title}
        </h3>
        {trend?.label && (
          <p className="mt-1 text-[11px] text-[#71829e]">
            {trend.label}
          </p>
        )}
      </div>
    </Link>
  )
}

function FacultyDashboardPage() {
  const [stats, setStats] = useState([])
  const [opportunities, setOpportunities] = useState([])
  const [collaborations, setCollaborations] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All')
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    let isMounted = true

    getFacultyDashboardStats().then((data) => {
      if (isMounted) setStats(data)
    })

    getRecentFacultyOpportunities().then((data) => {
      if (isMounted) setOpportunities(data)
    })

    getRecentCollaborationRequests().then((data) => {
      if (isMounted) setCollaborations(data)
    })

    return () => {
      isMounted = false
    }
  }, [])

  // Filter opportunities by search query and type filter
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      const matchesType =
        selectedTypeFilter === 'All' || opp.type === selectedTypeFilter
      const matchesSearch =
        searchQuery === '' ||
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.sponsor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.requiredSkills.some((s) =>
          s.toLowerCase().includes(searchQuery.toLowerCase())
        )
      return matchesType && matchesSearch
    })
  }, [opportunities, selectedTypeFilter, searchQuery])

  // Handle interaction with collaboration requests
  const handleUpdateCollaborationStatus = (id, newStatus) => {
    setCollaborations((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    )
    setFeedback({
      type: 'success',
      title: `Collaboration Request ${newStatus}`,
      message: `Status updated to "${newStatus}" in your local demo session. No external emails or API requests were sent.`,
    })
  }

  return (
    <div className="space-y-8">
      {/* 1. Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#66738d] sm:text-sm">
        <span className="font-semibold text-[#101c3d]" aria-current="page">
          Faculty Dashboard
        </span>
      </nav>

      {/* Floating or inline status notice */}
      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-xs text-emerald-800 shadow-sm"
        >
          <div className="mt-0.5 shrink-0">
            <CheckCircleIcon className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            {feedback.title && (
              <p className="font-bold text-sm">{feedback.title}</p>
            )}
            <p className={feedback.title ? 'mt-0.5' : ''}>{feedback.message}</p>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-slate-600 transition rounded"
            aria-label="Dismiss notification"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 2. Welcome Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-[#101c3d] sm:text-3xl">
              Faculty Dashboard
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50 px-3 py-0.5 text-xs font-semibold text-[#1260ed]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#1260ed]" />
              Demo Mode
            </span>
          </div>
          <p className="mt-1.5 text-xs text-[#66738d] sm:text-sm max-w-3xl">
            Discover research opportunities, strengthen industry partnerships, and advance academic collaboration.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/faculty/opportunities"
            className="inline-flex items-center gap-2 rounded-xl border border-[#dce7f5] bg-white px-4 py-2 text-xs font-semibold text-[#101c3d] shadow-xs transition hover:bg-[#f3f7fd] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1260ed]"
          >
            <ResearchIcon className="h-4 w-4 text-[#1260ed]" />
            <span>Browse Opportunities</span>
          </Link>
          <Link
            to="/faculty/collaborations"
            className="inline-flex items-center gap-2 rounded-xl bg-[#1260ed] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1260ed]"
          >
            <CollaborationIcon className="h-4 w-4" />
            <span>View Requests</span>
          </Link>
        </div>
      </div>

      {/* Demonstration notice badge */}
      <div className="flex items-start gap-2.5 rounded-2xl border border-blue-100 bg-[#edf5ff]/80 p-4 text-xs text-[#2b4c7e]">
        <SparklesIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#1260ed]" />
        <div>
          <span className="font-bold text-[#101c3d]">Demonstration Environment:</span>{' '}
          All research opportunities, corporate grants, and collaborative proposals are realistic mock records curated for local UI evaluation.
          No backend API calls are triggered.
        </div>
      </div>

      {/* 3. Four Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <FacultyStatCard key={stat.id} stat={stat} />
        ))}
      </div>

      {/* 4. Recent Opportunities Section */}
      <section
        aria-labelledby="recent-opportunities-heading"
        className="rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#edf3fc] pb-4">
          <div>
            <h2 id="recent-opportunities-heading" className="text-base font-bold text-[#101c3d] sm:text-lg">
              Recent Research & Consultancy Opportunities
            </h2>
            <p className="mt-0.5 text-xs text-[#66738d]">
              Curated corporate grants, sponsored research initiatives, and industrial advisory calls.
            </p>
          </div>

          <Link
            to="/faculty/opportunities"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1260ed] hover:underline"
          >
            <span>View All Opportunities</span>
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Filter Bar & Search */}
        <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            {['All', 'Sponsored Research', 'Corporate Consultancy', 'Joint Research Initiative'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedTypeFilter(type)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  selectedTypeFilter === type
                    ? 'bg-[#1260ed] text-white shadow-xs'
                    : 'bg-[#f4f7fc] text-[#50617c] hover:bg-[#e7eef8]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <SearchIcon className="h-3.5 w-3.5" />
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search opportunity or skill..."
              className="h-9 w-full rounded-xl border border-[#dce7f5] bg-white pl-8 pr-3 text-xs text-[#101c3d] placeholder:text-slate-400 focus:border-[#1260ed] focus:outline-hidden focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Opportunities List */}
        <div className="mt-5 space-y-4">
          {filteredOpportunities.length > 0 ? (
            filteredOpportunities.map((opp) => (
              <div
                key={opp.id}
                className="group rounded-xl border border-[#e8f0fa] bg-[#fafcff] p-4 transition-all hover:border-[#bfd8fb] hover:bg-white hover:shadow-xs sm:p-5"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-[#1260ed]">
                        {opp.type}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        • {opp.domain}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.2 text-[10px] font-bold text-emerald-700">
                        {opp.status}
                      </span>
                    </div>

                    <h3 className="mt-2 text-sm font-bold text-[#101c3d] sm:text-base group-hover:text-[#1260ed] transition-colors">
                      {opp.title}
                    </h3>

                    <p className="mt-1 text-xs text-[#66738d] line-clamp-2">
                      {opp.summary}
                    </p>

                    {/* Metadata tags */}
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#50617c]">
                      <span className="inline-flex items-center gap-1.5 font-medium text-[#101c3d]">
                        <BuildingIcon className="h-3.5 w-3.5 text-slate-400" />
                        <span>{opp.sponsor}</span>
                        <span className="text-[11px] text-slate-400">({opp.sponsorType})</span>
                      </span>

                      <span className="inline-flex items-center gap-1 font-bold text-[#16a34a]">
                        <span>{opp.budget}</span>
                      </span>

                      <span className="inline-flex items-center gap-1 text-slate-500">
                        <ClockIcon className="h-3.5 w-3.5 text-slate-400" />
                        <span>{opp.duration}</span>
                      </span>

                      <span className="inline-flex items-center gap-1 text-slate-500">
                        <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
                        <span>Deadline: {opp.deadline}</span>
                      </span>
                    </div>

                    {/* Skills Chips */}
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      {opp.requiredSkills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md bg-white px-2 py-0.5 text-[11px] font-medium text-[#41516c] border border-slate-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-2 flex shrink-0 items-center gap-2 lg:mt-0">
                    <button
                      type="button"
                      onClick={() =>
                        setFeedback({
                          type: 'success',
                          title: 'Expression of Interest Registered',
                          message: `Your draft proposal for "${opp.title}" has been recorded for this demo session.`,
                        })
                      }
                      className="rounded-xl bg-[#1260ed] px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1260ed]"
                    >
                      Submit Proposal
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#dce7f5] p-8 text-center">
              <ResearchIcon className="h-10 w-10 text-slate-300" />
              <p className="mt-2 text-sm font-bold text-[#101c3d]">
                No matching opportunities found
              </p>
              <p className="mt-1 text-xs text-[#66738d]">
                Try adjusting your search criteria or clear the filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedTypeFilter('All')
                  setSearchQuery('')
                }}
                className="mt-3 rounded-lg border border-[#dce7f5] bg-white px-3 py-1.5 text-xs font-semibold text-[#1260ed] hover:bg-[#edf5ff]"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 5. Recent Collaboration Requests Section */}
      <section
        aria-labelledby="recent-collaborations-heading"
        className="rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#edf3fc] pb-4">
          <div>
            <h2 id="recent-collaborations-heading" className="text-base font-bold text-[#101c3d] sm:text-lg">
              Recent Collaboration Requests
            </h2>
            <p className="mt-0.5 text-xs text-[#66738d]">
              Joint academic initiatives, corporate co-supervision proposals, and research consortium invites.
            </p>
          </div>

          <Link
            to="/faculty/collaborations"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1260ed] hover:underline"
          >
            <span>View All Requests</span>
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {collaborations.map((collab) => (
            <div
              key={collab.id}
              className="flex flex-col justify-between rounded-xl border border-[#e8f0fa] bg-[#fafcff] p-4 transition hover:border-[#bfd8fb] hover:bg-white sm:p-5"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="inline-flex items-center gap-1 rounded-md border border-purple-200 bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                      {collab.type}
                    </span>
                    <h3 className="mt-2 text-sm font-bold text-[#101c3d] line-clamp-1">
                      {collab.title}
                    </h3>
                  </div>

                  <span
                    className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      collab.status === 'Accepted'
                        ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                        : collab.status === 'Under Discussion'
                        ? 'border border-blue-200 bg-blue-50 text-blue-700'
                        : 'border border-amber-200 bg-amber-50 text-amber-700'
                    }`}
                  >
                    {collab.status}
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-2 text-xs text-[#50617c]">
                  <span className="font-semibold text-[#101c3d]">{collab.requesterName}</span>
                  <span>•</span>
                  <span className="truncate">{collab.institution}</span>
                </div>

                <p className="mt-2 text-xs text-[#66738d] line-clamp-2">
                  {collab.message}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {collab.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-medium text-[#41516c]"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="ml-auto text-[11px] text-slate-400">
                    {collab.dateReceived}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex items-center justify-end gap-2 border-t border-[#edf3fc] pt-3">
                {collab.status === 'Pending Review' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleUpdateCollaborationStatus(collab.id, 'Declined')}
                      className="rounded-lg border border-[#dce7f5] px-3 py-1.5 text-xs font-semibold text-[#50617c] hover:bg-[#f3f7fd] transition"
                    >
                      Decline
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateCollaborationStatus(collab.id, 'Accepted')}
                      className="rounded-lg bg-[#1260ed] px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition"
                    >
                      Accept Proposal
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      setFeedback({
                        type: 'info',
                        title: 'Proposal Thread Open',
                        message: `Opening collaboration workspace for "${collab.title}" (Demo).`,
                      })
                    }
                    className="rounded-lg border border-[#dce7f5] bg-white px-3 py-1.5 text-xs font-semibold text-[#1260ed] hover:bg-[#edf5ff] transition"
                  >
                    Open Discussion
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default FacultyDashboardPage
