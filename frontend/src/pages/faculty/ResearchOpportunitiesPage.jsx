import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ResearchIcon,
  BriefcaseIcon,
  ClockIcon,
  CalendarIcon,
  BuildingIcon,

  CurrencyIcon,
  FilterIcon,
  SearchIcon,
  CloseIcon,
  CheckCircleIcon,
  SparklesIcon,
  AcademicCapIcon,
  TagIcon,
  SendIcon,
  InfoIcon,
} from '../../components/faculty/FacultyIcons.jsx'
import {
  getFacultyOpportunities,
  getFacultyOpportunitiesSummary,
} from '../../services/facultyService.js'

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'Research Project', label: 'Research Project' },
  { value: 'Consultancy', label: 'Consultancy' },
  { value: 'Sponsored Research', label: 'Sponsored Research' },
]

const domainOptions = [
  { value: 'all', label: 'All Domains' },
  { value: 'Artificial Intelligence & IoT', label: 'Artificial Intelligence & IoT' },
  { value: 'Clean Energy & Electrical Engineering', label: 'Clean Energy & Electrical Engineering' },
  { value: 'Bioinformatics & Distributed ML', label: 'Bioinformatics & Distributed ML' },
  { value: 'VLSI & Hardware Security', label: 'VLSI & Hardware Security' },
  { value: 'Cybersecurity & Cloud Systems', label: 'Cybersecurity & Cloud Systems' },
  { value: 'Smart Materials & Nanotechnology', label: 'Smart Materials & Nanotechnology' },
]

const workModeOptions = [
  { value: 'all', label: 'All Work Modes' },
  { value: 'Hybrid', label: 'Hybrid' },
  { value: 'Remote / Virtual Lab', label: 'Remote / Virtual Lab' },
  { value: 'On-site Lab Visits', label: 'On-site Lab Visits' },
]

function getCategoryBadge(category) {
  switch (category) {
    case 'Research Project':
      return 'border-[#cbdff8] bg-[#edf4ff] text-[#1260ed]'
    case 'Consultancy':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700'
    case 'Sponsored Research':
      return 'border-purple-200 bg-purple-50 text-purple-700'
    default:
      return 'border-slate-200 bg-slate-100 text-slate-700'
  }
}

export default function ResearchOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState([])
  const [summaryStats, setSummaryStats] = useState({
    total: 24,
    researchProjects: 14,
    consultancies: 10,
    closingSoon: 6,
  })
  const [isLoading, setIsLoading] = useState(true)

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDomain, setSelectedDomain] = useState('all')
  const [selectedWorkMode, setSelectedWorkMode] = useState('all')
  const [onlyClosingSoon, setOnlyClosingSoon] = useState(false)

  // Modal and interaction states
  const [activeOpportunity, setActiveOpportunity] = useState(null)
  const [appliedIds, setAppliedIds] = useState(['opp-4'])
  const [feedbackToast, setFeedbackToast] = useState(null)

  // Load data on mount
  useEffect(() => {
    let isMounted = true
    Promise.all([getFacultyOpportunities(), getFacultyOpportunitiesSummary()])
      .then(([opps, summary]) => {
        if (isMounted) {
          setOpportunities(opps)
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

  // Auto-dismiss toast
  useEffect(() => {
    if (!feedbackToast) return
    const timer = setTimeout(() => {
      setFeedbackToast(null)
    }, 3500)
    return () => clearTimeout(timer)
  }, [feedbackToast])

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeOpportunity) {
        setActiveOpportunity(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeOpportunity])

  // Filtered opportunities logic
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      // Search matching (title, sponsor, domain, skills, summary)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchesTitle = opp.title.toLowerCase().includes(query)
        const matchesSponsor = opp.sponsor.toLowerCase().includes(query)
        const matchesDomain = opp.domain.toLowerCase().includes(query)
        const matchesSummary = opp.summary.toLowerCase().includes(query)
        const matchesSkills = opp.requiredSkills.some((skill) =>
          skill.toLowerCase().includes(query)
        )

        if (
          !matchesTitle &&
          !matchesSponsor &&
          !matchesDomain &&
          !matchesSummary &&
          !matchesSkills
        ) {
          return false
        }
      }

      // Category filter
      if (selectedCategory !== 'all' && opp.category !== selectedCategory) {
        return false
      }

      // Domain filter
      if (selectedDomain !== 'all' && opp.domain !== selectedDomain) {
        return false
      }

      // Work mode filter
      if (selectedWorkMode !== 'all' && opp.workMode !== selectedWorkMode) {
        return false
      }

      // Closing soon filter
      if (onlyClosingSoon && !opp.isClosingSoon) {
        return false
      }

      return true
    })
  }, [
    opportunities,
    searchQuery,
    selectedCategory,
    selectedDomain,
    selectedWorkMode,
    onlyClosingSoon,
  ])

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    selectedCategory !== 'all' ||
    selectedDomain !== 'all' ||
    selectedWorkMode !== 'all' ||
    onlyClosingSoon

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedDomain('all')
    setSelectedWorkMode('all')
    setOnlyClosingSoon(false)
  }

  const handleToggleApply = (opp) => {
    const isApplied = appliedIds.includes(opp.id)
    if (isApplied) {
      setAppliedIds((prev) => prev.filter((id) => id !== opp.id))
      setFeedbackToast({
        type: 'info',
        title: 'Expression of Interest Withdrawn (Demo)',
        message: `Your demonstration submission for "${opp.title}" has been withdrawn.`,
      })
    } else {
      setAppliedIds((prev) => [...prev, opp.id])
      setFeedbackToast({
        type: 'success',
        title: 'Interest Expressed Successfully (Demo)',
        message: `Your demonstration proposal for "${opp.sponsor}" has been logged in this session.`,
      })
    }
  }

  return (
    <div className="space-y-7">
      {/* Feedback Toast Notification */}
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
            <CheckCircleIcon className="h-4 w-4" />
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
            Research & Consultancy Opportunities
          </span>
        </nav>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#101c3d] sm:text-3xl">
              Research & Consultancy Opportunities
            </h1>
            <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-[#50617c]">
              Discover research projects, sponsored funding, and consultancy opportunities aligned with your expertise.
            </p>
          </div>

          <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50/70 px-3 py-1 text-xs font-semibold text-[#1260ed]">
            <SparklesIcon className="h-3.5 w-3.5" />
            <span>Demo Data • Simulated Grants</span>
          </div>
        </div>
      </div>

      {/* Section A: Summary KPI Cards */}
      <section aria-labelledby="summary-cards-heading">
        <h2 id="summary-cards-heading" className="sr-only">
          Opportunities Summary
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Total Opportunities */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] transition-all hover:border-[#cbdff8] hover:shadow-[0_4px_16px_rgba(20,40,80,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#d6e6fe] bg-[#edf4ff] text-[#1260ed]">
                <ResearchIcon className="h-6 w-6" />
              </span>
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                +4 this month
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
                Total Opportunities
              </h3>
              <p className="mt-0.5 text-[11px] text-[#71829e]">
                Active grant cycles and tenders
              </p>
            </div>
          </div>

          {/* Card 2: Research Projects */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] transition-all hover:border-[#cbdff8] hover:shadow-[0_4px_16px_rgba(20,40,80,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#e6dbff] bg-[#f4f0ff] text-[#7c3aed]">
                <AcademicCapIcon className="h-6 w-6" />
              </span>
              <span className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-[11px] font-semibold text-purple-700">
                Sponsored & Grants
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-[#101c3d]">
                  {summaryStats.researchProjects}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Demo Data
                </span>
              </div>
              <h3 className="mt-1 text-xs font-semibold text-[#50617c] sm:text-sm">
                Research Projects
              </h3>
              <p className="mt-0.5 text-[11px] text-[#71829e]">
                Joint investigations & fellowships
              </p>
            </div>
          </div>

          {/* Card 3: Consultancy Assignments */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] transition-all hover:border-[#cbdff8] hover:shadow-[0_4px_16px_rgba(20,40,80,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#c8f0dc] bg-[#e9faf3] text-[#16a34a]">
                <BriefcaseIcon className="h-6 w-6" />
              </span>
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                Corporate Retainers
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-[#101c3d]">
                  {summaryStats.consultancies}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Demo Data
                </span>
              </div>
              <h3 className="mt-1 text-xs font-semibold text-[#50617c] sm:text-sm">
                Consultancy Assignments
              </h3>
              <p className="mt-0.5 text-[11px] text-[#71829e]">
                Direct industry advisory mandates
              </p>
            </div>
          </div>

          {/* Card 4: Closing Soon */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] transition-all hover:border-[#cbdff8] hover:shadow-[0_4px_16px_rgba(20,40,80,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#fcd4dc] bg-[#fff0f2] text-[#e11d48]">
                <ClockIcon className="h-6 w-6" />
              </span>
              <button
                type="button"
                onClick={() => setOnlyClosingSoon((prev) => !prev)}
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition ${
                  onlyClosingSoon
                    ? 'border-rose-400 bg-rose-600 text-white'
                    : 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                }`}
              >
                {onlyClosingSoon ? 'Active Filter: On' : 'Filter Expedited'}
              </button>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-[#101c3d]">
                  {summaryStats.closingSoon}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Demo Data
                </span>
              </div>
              <h3 className="mt-1 text-xs font-semibold text-[#50617c] sm:text-sm">
                Closing Soon
              </h3>
              <p className="mt-0.5 text-[11px] text-[#71829e]">
                Submissions due in ≤ 30 days
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section B: Search & Multi-Criteria Filters */}
      <section
        aria-labelledby="filters-heading"
        className="rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-6"
      >
        <div className="flex items-center justify-between border-b border-[#eef4fc] pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#edf4ff] text-[#1260ed]">
              <FilterIcon className="h-4 w-4" />
            </span>
            <h2 id="filters-heading" className="text-sm font-bold text-[#101c3d] sm:text-base">
              Filter Opportunities
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
          <div className="relative md:col-span-5">
            <label htmlFor="opp-search" className="mb-1.5 block text-xs font-semibold text-[#50617c]">
              Search Keyword, Organization, or Skill
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <SearchIcon className="h-4 w-4" />
              </span>
              <input
                id="opp-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, organization, or skill (e.g. PyTorch, Battery)..."
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

          {/* Category Filter */}
          <div className="md:col-span-2">
            <label htmlFor="category-select" className="mb-1.5 block text-xs font-semibold text-[#50617c]">
              Category
            </label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-xl border border-[#d6e6fe] bg-[#fbfdff] px-3 py-2.5 text-xs text-[#101c3d] transition focus:border-[#1260ed] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1260ed]/20"
            >
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Domain Filter */}
          <div className="md:col-span-3">
            <label htmlFor="domain-select" className="mb-1.5 block text-xs font-semibold text-[#50617c]">
              Research Domain
            </label>
            <select
              id="domain-select"
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full rounded-xl border border-[#d6e6fe] bg-[#fbfdff] px-3 py-2.5 text-xs text-[#101c3d] transition focus:border-[#1260ed] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1260ed]/20"
            >
              {domainOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Work Mode Filter */}
          <div className="md:col-span-2">
            <label htmlFor="workmode-select" className="mb-1.5 block text-xs font-semibold text-[#50617c]">
              Work Mode
            </label>
            <select
              id="workmode-select"
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value)}
              className="w-full rounded-xl border border-[#d6e6fe] bg-[#fbfdff] px-3 py-2.5 text-xs text-[#101c3d] transition focus:border-[#1260ed] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1260ed]/20"
            >
              {workModeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count & Active Tags Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#f0f6fd] pt-3 text-xs text-[#50617c]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#101c3d]">
              Showing {filteredOpportunities.length}
            </span>
            <span>of {opportunities.length} demo opportunities</span>
            {hasActiveFilters && (
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-[#1260ed]">
                Filters Active
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">
              {appliedIds.length > 0 && `${appliedIds.length} expressed interest in this session`}
            </span>
          </div>
        </div>
      </section>

      {/* Section C: Opportunities Listings */}
      <section aria-labelledby="listings-heading">
        <h2 id="listings-heading" className="sr-only">
          Opportunity Listings
        </h2>

        {isLoading ? (
          <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-[#e2ecf9] bg-white p-8">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1260ed] border-r-transparent" />
              <p className="mt-3 text-xs font-semibold text-[#50617c]">
                Loading research & consultancy opportunities...
              </p>
            </div>
          </div>
        ) : filteredOpportunities.length === 0 ? (
          /* Empty State */
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#cbdff8] bg-white p-8 text-center sm:p-12">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf4ff] text-[#1260ed]">
              <SearchIcon className="h-7 w-7" />
            </span>
            <h3 className="mt-4 text-base font-bold text-[#101c3d]">
              No opportunities match your criteria
            </h3>
            <p className="mt-1.5 max-w-md text-xs leading-relaxed text-[#50617c]">
              We couldn't find any opportunities matching your current search term or filter selection.
              Try adjusting your domain, category, or clear search filters.
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
          /* Opportunity Cards Grid */
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {filteredOpportunities.map((opp) => {
              const isApplied = appliedIds.includes(opp.id)
              const badgeClass = getCategoryBadge(opp.category)

              return (
                <div
                  key={opp.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] transition-all hover:border-[#cbdff8] hover:shadow-[0_4px_20px_rgba(20,40,80,0.08)] sm:p-6"
                >
                  <div>
                    {/* Top Meta Bar */}
                    <div className="flex flex-wrap items-start justify-between gap-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-[11px] font-bold ${badgeClass}`}
                        >
                          {opp.category}
                        </span>
                        <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600">
                          {opp.domain}
                        </span>
                      </div>

                      {opp.isClosingSoon && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                          <ClockIcon className="h-3 w-3" />
                          <span>Closing Soon</span>
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="mt-3 text-base font-extrabold text-[#101c3d] group-hover:text-[#1260ed] transition-colors sm:text-lg">
                      {opp.title}
                    </h3>

                    {/* Sponsor & Organization */}
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#50617c]">
                      <span className="inline-flex items-center gap-1.5 font-bold text-[#101c3d]">
                        <BuildingIcon className="h-3.5 w-3.5 text-[#1260ed]" />
                        <span>{opp.sponsor}</span>
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                        {opp.sponsorType}
                      </span>
                    </div>

                    {/* Summary text */}
                    <p className="mt-3 text-xs leading-relaxed text-[#50617c]">
                      {opp.summary}
                    </p>

                    {/* Key Metrics Chips */}
                    <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-[#f8fbff] p-3 text-xs text-[#50617c] sm:grid-cols-3">
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Funding / Value
                        </span>
                        <span className="mt-0.5 inline-flex items-center gap-1 font-bold text-[#1260ed]">
                          <CurrencyIcon className="h-3.5 w-3.5" />
                          <span>{opp.budget}</span>
                        </span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Engagement
                        </span>
                        <span className="mt-0.5 inline-flex items-center gap-1 font-semibold text-[#101c3d]">
                          <ClockIcon className="h-3.5 w-3.5 text-slate-400" />
                          <span>{opp.workMode} ({opp.duration})</span>
                        </span>
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Deadline
                        </span>
                        <span className="mt-0.5 inline-flex items-center gap-1 font-semibold text-[#101c3d]">
                          <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
                          <span>{opp.deadline}</span>
                        </span>
                      </div>
                    </div>

                    {/* Required Skills / Tags */}
                    <div className="mt-4">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                        <TagIcon className="h-3 w-3" />
                        <span>Required Expertise:</span>
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {opp.requiredSkills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center rounded-md border border-[#e2ecf9] bg-white px-2 py-0.5 text-[11px] font-medium text-[#405270]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#f0f6fd] pt-4">
                    <button
                      type="button"
                      onClick={() => setActiveOpportunity(opp)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#d6e6fe] bg-[#edf4ff] px-3.5 py-2 text-xs font-bold text-[#1260ed] transition hover:bg-[#dbe9fe]"
                    >
                      <InfoIcon className="h-4 w-4" />
                      <span>View Details</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {isApplied ? (
                        <button
                          type="button"
                          onClick={() => handleToggleApply(opp)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                          <span>Interest Expressed (Demo)</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleToggleApply(opp)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#1260ed] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#0d4ecc]"
                        >
                          <SendIcon className="h-3.5 w-3.5" />
                          <span>Express Interest</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Section D: Opportunity Details Modal */}
      {activeOpportunity && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-xs sm:p-6"
        >
          <div
            role="presentation"
            onClick={() => setActiveOpportunity(null)}
            className="fixed inset-0"
          />

          <div className="relative z-10 my-8 w-full max-w-2xl rounded-2xl border border-[#cbdff8] bg-white p-6 shadow-2xl transition-all sm:p-8">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#eef4fc] pb-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[11px] font-bold ${getCategoryBadge(
                      activeOpportunity.category
                    )}`}
                  >
                    {activeOpportunity.category}
                  </span>
                  <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                    {activeOpportunity.domain}
                  </span>
                  {activeOpportunity.isClosingSoon && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                      Closing Soon
                    </span>
                  )}
                </div>

                <h2 id="modal-title" className="text-xl font-extrabold text-[#101c3d] sm:text-2xl">
                  {activeOpportunity.title}
                </h2>

                <div className="flex items-center gap-2 text-xs text-[#50617c]">
                  <BuildingIcon className="h-4 w-4 text-[#1260ed]" />
                  <span className="font-bold text-[#101c3d]">{activeOpportunity.sponsor}</span>
                  <span className="text-slate-300">•</span>
                  <span>{activeOpportunity.sponsorType}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveOpportunity(null)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close details modal"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="mt-5 max-h-[60vh] space-y-5 overflow-y-auto pr-1 text-xs">
              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 gap-3 rounded-xl bg-[#f8fbff] p-4 sm:grid-cols-4">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Budget / Value
                  </span>
                  <span className="mt-0.5 font-bold text-[#1260ed]">
                    {activeOpportunity.budget}
                  </span>
                </div>

                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Duration
                  </span>
                  <span className="mt-0.5 font-semibold text-[#101c3d]">
                    {activeOpportunity.duration}
                  </span>
                </div>

                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Work Mode
                  </span>
                  <span className="mt-0.5 font-semibold text-[#101c3d]">
                    {activeOpportunity.workMode}
                  </span>
                </div>

                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Deadline
                  </span>
                  <span className="mt-0.5 font-semibold text-[#101c3d]">
                    {activeOpportunity.deadline}
                  </span>
                </div>
              </div>

              {/* Scope & Description */}
              <div>
                <h3 className="font-bold text-[#101c3d]">Project Scope & Description</h3>
                <p className="mt-1.5 leading-relaxed text-[#50617c]">
                  {activeOpportunity.fullDescription || activeOpportunity.summary}
                </p>
              </div>

              {/* Key Deliverables */}
              {activeOpportunity.deliverables && (
                <div>
                  <h3 className="font-bold text-[#101c3d]">Expected Deliverables & Outcomes</h3>
                  <ul className="mt-2 space-y-1.5">
                    {activeOpportunity.deliverables.map((item, idx) => (
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

              {/* Eligibility */}
              {activeOpportunity.eligibility && (
                <div>
                  <h3 className="font-bold text-[#101c3d]">Faculty Eligibility & Requirements</h3>
                  <p className="mt-1.5 leading-relaxed text-[#50617c]">
                    {activeOpportunity.eligibility}
                  </p>
                </div>
              )}

              {/* Skills */}
              <div>
                <h3 className="font-bold text-[#101c3d]">Required Technical Expertise</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {activeOpportunity.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md border border-[#e2ecf9] bg-[#edf4ff] px-2.5 py-1 font-semibold text-[#1260ed]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Demo Notice Banner */}
              <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 text-[#17335e]">
                <div className="flex items-start gap-2.5">
                  <SparklesIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#1260ed]" />
                  <div>
                    <p className="font-bold">Simulated Demonstration Posting</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600">
                      Organizations, grant packages, and contacts are synthetic demonstration entities
                      for evaluating the SYNAPSE Faculty Module interface. No live institutional backend call is triggered.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#eef4fc] pt-4">
              <button
                type="button"
                onClick={() => setActiveOpportunity(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-[#50617c] hover:bg-slate-50"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                {appliedIds.includes(activeOpportunity.id) ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleToggleApply(activeOpportunity)
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
                  >
                    <CheckCircleIcon className="h-4 w-4" />
                    <span>Interest Expressed (Click to Withdraw)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      handleToggleApply(activeOpportunity)
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#1260ed] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#0d4ecc]"
                  >
                    <SendIcon className="h-3.5 w-3.5" />
                    <span>Express Interest (Demo)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
