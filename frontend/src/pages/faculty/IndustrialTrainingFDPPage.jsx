import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  TrainingIcon,
  AcademicCapIcon,
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
  SendIcon,
  MonitorIcon,
  MapPinIcon,
  GlobeIcon,
  AwardIcon,
  UsersIcon,
} from '../../components/faculty/FacultyIcons.jsx'
import {
  getFacultyTrainingPrograms,
  getFacultyTrainingProgramsSummary,
} from '../../services/facultyService.js'

const typeOptions = [
  { value: 'all', label: 'All Program Types' },
  { value: 'Industrial Training', label: 'Industrial Training' },
  { value: 'FDP', label: 'Faculty Development Program (FDP)' },
]

const deliveryModeOptions = [
  { value: 'all', label: 'All Delivery Modes' },
  { value: 'Online', label: 'Online' },
  { value: 'Offline', label: 'Offline / In-Person' },
  { value: 'Hybrid', label: 'Hybrid' },
]

const domainOptions = [
  { value: 'all', label: 'All Topics & Domains' },
  { value: 'Artificial Intelligence & Cloud', label: 'Artificial Intelligence & Cloud' },
  { value: 'Quantum Computing & Advanced Algorithms', label: 'Quantum Computing & Advanced Algorithms' },
  { value: 'Semiconductor & VLSI Design', label: 'Semiconductor & VLSI Design' },
  { value: 'Cybersecurity & Threat Intel', label: 'Cybersecurity & Threat Intel' },
  { value: 'Robotics & Industrial Automation', label: 'Robotics & Industrial Automation' },
  { value: 'Renewable Energy & Power Systems', label: 'Renewable Energy & Power Systems' },
]

function getTypeBadge(type) {
  switch (type) {
    case 'Industrial Training':
      return 'border-[#cbdff8] bg-[#edf4ff] text-[#1260ed]'
    case 'FDP':
      return 'border-purple-200 bg-purple-50 text-purple-700'
    default:
      return 'border-slate-200 bg-slate-100 text-slate-700'
  }
}

function getDeliveryIcon(mode) {
  switch (mode) {
    case 'Online':
      return MonitorIcon
    case 'Offline':
      return MapPinIcon
    case 'Hybrid':
      return GlobeIcon
    default:
      return MonitorIcon
  }
}

export default function IndustrialTrainingFDPPage() {
  const [programs, setPrograms] = useState([])
  const [summaryStats, setSummaryStats] = useState({
    total: 18,
    industrialTraining: 10,
    fdpPrograms: 8,
    closingSoon: 4,
  })
  const [isLoading, setIsLoading] = useState(true)

  // Filters and search
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedMode, setSelectedMode] = useState('all')
  const [selectedDomain, setSelectedDomain] = useState('all')
  const [onlyClosingSoon, setOnlyClosingSoon] = useState(false)

  // Modal and interactions
  const [activeProgram, setActiveProgram] = useState(null)
  const [registeredIds, setRegisteredIds] = useState(['train-2']) // Pre-populate 1 for realistic session demo
  const [feedbackToast, setFeedbackToast] = useState(null)

  // Load data on mount
  useEffect(() => {
    let isMounted = true
    Promise.all([getFacultyTrainingPrograms(), getFacultyTrainingProgramsSummary()])
      .then(([trainingList, summary]) => {
        if (isMounted) {
          setPrograms(trainingList)
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
      if (e.key === 'Escape' && activeProgram) {
        setActiveProgram(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeProgram])

  // Filter logic
  const filteredPrograms = useMemo(() => {
    return programs.filter((prog) => {
      // Keyword search (title, provider, domain, shortDescription, curriculum)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchesTitle = prog.title.toLowerCase().includes(query)
        const matchesProvider = prog.provider.toLowerCase().includes(query)
        const matchesDomain = prog.domain.toLowerCase().includes(query)
        const matchesDesc = prog.shortDescription.toLowerCase().includes(query)
        const matchesCurriculum = prog.curriculum?.some((c) =>
          c.toLowerCase().includes(query)
        )

        if (
          !matchesTitle &&
          !matchesProvider &&
          !matchesDomain &&
          !matchesDesc &&
          !matchesCurriculum
        ) {
          return false
        }
      }

      // Program type
      if (selectedType !== 'all' && prog.type !== selectedType) {
        return false
      }

      // Delivery mode
      if (selectedMode !== 'all' && prog.deliveryMode !== selectedMode) {
        return false
      }

      // Domain
      if (selectedDomain !== 'all' && prog.domain !== selectedDomain) {
        return false
      }

      // Closing soon
      if (onlyClosingSoon && !prog.isClosingSoon) {
        return false
      }

      return true
    })
  }, [programs, searchQuery, selectedType, selectedMode, selectedDomain, onlyClosingSoon])

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    selectedType !== 'all' ||
    selectedMode !== 'all' ||
    selectedDomain !== 'all' ||
    onlyClosingSoon

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedType('all')
    setSelectedMode('all')
    setSelectedDomain('all')
    setOnlyClosingSoon(false)
  }

  // Toggle demo registration
  const handleToggleRegistration = (program) => {
    const isRegistered = registeredIds.includes(program.id)
    if (isRegistered) {
      setRegisteredIds((prev) => prev.filter((id) => id !== program.id))
      setFeedbackToast({
        type: 'info',
        title: 'Demo Registration Withdrawn',
        message: `Your demonstration registration for "${program.title}" has been withdrawn.`,
      })
    } else {
      setRegisteredIds((prev) => [...prev, program.id])
      setFeedbackToast({
        type: 'success',
        title: 'Registration Logged Successfully (Demo)',
        message: `You have registered your demonstration interest for "${program.title}" with ${program.provider}.`,
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
            Industrial Training / FDP
          </span>
        </nav>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#101c3d] sm:text-3xl">
              Industrial Training / FDP
            </h1>
            <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-[#50617c]">
              Explore industry training programs and faculty development opportunities to enhance your technical and teaching expertise.
            </p>
          </div>

          <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-purple-200/80 bg-purple-50/70 px-3 py-1 text-xs font-semibold text-[#7c3aed]">
            <SparklesIcon className="h-3.5 w-3.5" />
            <span>Demo Data • Simulated Programs</span>
          </div>
        </div>
      </div>

      {/* Section A: Summary KPI Cards */}
      <section aria-labelledby="summary-cards-heading">
        <h2 id="summary-cards-heading" className="sr-only">
          Program Summary Cards
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Total Programs */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] transition-all hover:border-[#cbdff8] hover:shadow-[0_4px_16px_rgba(20,40,80,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#d6e6fe] bg-[#edf4ff] text-[#1260ed]">
                <TrainingIcon className="h-6 w-6" />
              </span>
              <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#1260ed]">
                Active Catalog
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
                Total Programs
              </h3>
              <p className="mt-0.5 text-[11px] text-[#71829e]">
                Training residencies & workshops
              </p>
            </div>
          </div>

          {/* Card 2: Industrial Training Programs */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] transition-all hover:border-[#cbdff8] hover:shadow-[0_4px_16px_rgba(20,40,80,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#c8f0dc] bg-[#e9faf3] text-[#16a34a]">
                <BriefcaseIcon className="h-6 w-6" />
              </span>
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                Corporate Immersions
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-[#101c3d]">
                  {summaryStats.industrialTraining}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Demo Data
                </span>
              </div>
              <h3 className="mt-1 text-xs font-semibold text-[#50617c] sm:text-sm">
                Industrial Training Programs
              </h3>
              <p className="mt-0.5 text-[11px] text-[#71829e]">
                Direct enterprise laboratory residencies
              </p>
            </div>
          </div>

          {/* Card 3: Faculty Development Programs */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] transition-all hover:border-[#cbdff8] hover:shadow-[0_4px_16px_rgba(20,40,80,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#e6dbff] bg-[#f4f0ff] text-[#7c3aed]">
                <AcademicCapIcon className="h-6 w-6" />
              </span>
              <span className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-[11px] font-semibold text-purple-700">
                Pedagogy & Research
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-[#101c3d]">
                  {summaryStats.fdpPrograms}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Demo Data
                </span>
              </div>
              <h3 className="mt-1 text-xs font-semibold text-[#50617c] sm:text-sm">
                Faculty Development Programs
              </h3>
              <p className="mt-0.5 text-[11px] text-[#71829e]">
                AICTE & university consortia workshops
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
                Registration deadline ≤ 30 days
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section B: Search & Multi-Criteria Filters */}
      <section
        aria-labelledby="training-filters-heading"
        className="rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-6"
      >
        <div className="flex items-center justify-between border-b border-[#eef4fc] pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#edf4ff] text-[#1260ed]">
              <FilterIcon className="h-4 w-4" />
            </span>
            <h2 id="training-filters-heading" className="text-sm font-bold text-[#101c3d] sm:text-base">
              Filter Programs
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
            <label htmlFor="prog-search" className="mb-1.5 block text-xs font-semibold text-[#50617c]">
              Search Program Title, Provider, or Keyword
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <SearchIcon className="h-4 w-4" />
              </span>
              <input
                id="prog-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, provider, or topic (e.g. TensorRT, Qiskit)..."
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

          {/* Program Type Filter */}
          <div className="md:col-span-2">
            <label htmlFor="type-select" className="mb-1.5 block text-xs font-semibold text-[#50617c]">
              Program Type
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

          {/* Delivery Mode Filter */}
          <div className="md:col-span-2">
            <label htmlFor="mode-select" className="mb-1.5 block text-xs font-semibold text-[#50617c]">
              Delivery Mode
            </label>
            <select
              id="mode-select"
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="w-full rounded-xl border border-[#d6e6fe] bg-[#fbfdff] px-3 py-2.5 text-xs text-[#101c3d] transition focus:border-[#1260ed] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1260ed]/20"
            >
              {deliveryModeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Domain Filter */}
          <div className="md:col-span-3">
            <label htmlFor="domain-select" className="mb-1.5 block text-xs font-semibold text-[#50617c]">
              Topic / Domain
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
        </div>

        {/* Results Counter Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#f0f6fd] pt-3 text-xs text-[#50617c]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#101c3d]">
              Showing {filteredPrograms.length}
            </span>
            <span>of {programs.length} demo programs</span>
            {hasActiveFilters && (
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-[#1260ed]">
                Filters Active
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">
              {registeredIds.length > 0 && `${registeredIds.length} registered in this session`}
            </span>
          </div>
        </div>
      </section>

      {/* Section C: Program Cards Listing */}
      <section aria-labelledby="programs-heading">
        <h2 id="programs-heading" className="sr-only">
          Program Listings
        </h2>

        {isLoading ? (
          <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-[#e2ecf9] bg-white p-8">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1260ed] border-r-transparent" />
              <p className="mt-3 text-xs font-semibold text-[#50617c]">
                Loading industrial training & FDP programs...
              </p>
            </div>
          </div>
        ) : filteredPrograms.length === 0 ? (
          /* Empty State */
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#cbdff8] bg-white p-8 text-center sm:p-12">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf4ff] text-[#1260ed]">
              <SearchIcon className="h-7 w-7" />
            </span>
            <h3 className="mt-4 text-base font-bold text-[#101c3d]">
              No programs match your filters
            </h3>
            <p className="mt-1.5 max-w-md text-xs leading-relaxed text-[#50617c]">
              We couldn't find any training or faculty development programs matching your search criteria.
              Try clearing filters or selecting another topic or delivery mode.
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
          /* Program Cards Grid */
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {filteredPrograms.map((prog) => {
              const isRegistered = registeredIds.includes(prog.id)
              const typeClass = getTypeBadge(prog.type)
              const DeliveryIcon = getDeliveryIcon(prog.deliveryMode)

              return (
                <div
                  key={prog.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] transition-all hover:border-[#cbdff8] hover:shadow-[0_4px_20px_rgba(20,40,80,0.08)] sm:p-6"
                >
                  <div>
                    {/* Top Meta Bar */}
                    <div className="flex flex-wrap items-start justify-between gap-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-[11px] font-bold ${typeClass}`}
                        >
                          {prog.type}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                          <DeliveryIcon className="h-3.5 w-3.5 text-[#1260ed]" />
                          <span>{prog.deliveryMode}</span>
                        </span>
                        <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600">
                          {prog.domain}
                        </span>
                      </div>

                      {prog.isClosingSoon && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                          <ClockIcon className="h-3 w-3" />
                          <span>Closing Soon</span>
                        </span>
                      )}
                    </div>

                    {/* Program Title */}
                    <h3 className="mt-3 text-base font-extrabold text-[#101c3d] transition-colors group-hover:text-[#1260ed] sm:text-lg">
                      {prog.title}
                    </h3>

                    {/* Provider & Organization */}
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#50617c]">
                      <span className="inline-flex items-center gap-1.5 font-bold text-[#101c3d]">
                        <BuildingIcon className="h-3.5 w-3.5 text-[#1260ed]" />
                        <span>{prog.provider}</span>
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                        {prog.providerType}
                      </span>
                    </div>

                    {/* Short Description */}
                    <p className="mt-3 text-xs leading-relaxed text-[#50617c]">
                      {prog.shortDescription}
                    </p>

                    {/* Key Details Matrix */}
                    <div className="mt-4 grid grid-cols-2 gap-2.5 rounded-xl bg-[#f8fbff] p-3 text-xs text-[#50617c] sm:grid-cols-3">
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Duration & Pace
                        </span>
                        <span className="mt-0.5 inline-flex items-center gap-1 font-semibold text-[#101c3d]">
                          <ClockIcon className="h-3.5 w-3.5 text-slate-400" />
                          <span>{prog.duration}</span>
                        </span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Start Date
                        </span>
                        <span className="mt-0.5 inline-flex items-center gap-1 font-semibold text-[#101c3d]">
                          <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
                          <span>{prog.startDate}</span>
                        </span>
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Deadline
                        </span>
                        <span className="mt-0.5 inline-flex items-center gap-1 font-semibold text-[#e11d48]">
                          <ClockIcon className="h-3.5 w-3.5 text-[#e11d48]" />
                          <span>{prog.registrationDeadline}</span>
                        </span>
                      </div>
                    </div>

                    {/* Fee & Eligibility Row */}
                    <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                        <AwardIcon className="h-3.5 w-3.5 text-emerald-600" />
                        <span>{prog.feeStatus}</span>
                      </div>

                      <span className="text-[11px] font-medium text-slate-500">
                        {prog.seatsAvailable}
                      </span>
                    </div>

                    {/* Eligibility Snippet */}
                    <div className="mt-2.5 text-[11px] leading-relaxed text-[#71829e]">
                      <span className="font-semibold text-[#50617c]">Eligibility: </span>
                      {prog.eligibility}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#f0f6fd] pt-4">
                    <button
                      type="button"
                      onClick={() => setActiveProgram(prog)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#d6e6fe] bg-[#edf4ff] px-3.5 py-2 text-xs font-bold text-[#1260ed] transition hover:bg-[#dbe9fe]"
                    >
                      <InfoIcon className="h-4 w-4" />
                      <span>View Details</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {isRegistered ? (
                        <button
                          type="button"
                          onClick={() => handleToggleRegistration(prog)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                          <span>Registered (Demo)</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleToggleRegistration(prog)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#1260ed] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#0d4ecc]"
                        >
                          <SendIcon className="h-3.5 w-3.5" />
                          <span>Register Interest</span>
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

      {/* Section D: Program Details Modal */}
      {activeProgram && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="training-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-xs sm:p-6"
        >
          <div
            role="presentation"
            onClick={() => setActiveProgram(null)}
            className="fixed inset-0"
          />

          <div className="relative z-10 my-8 w-full max-w-2xl rounded-2xl border border-[#cbdff8] bg-white p-6 shadow-2xl transition-all sm:p-8">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#eef4fc] pb-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[11px] font-bold ${getTypeBadge(
                      activeProgram.type
                    )}`}
                  >
                    {activeProgram.type}
                  </span>
                  <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                    {activeProgram.domain}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                    <AwardIcon className="h-3 w-3 text-emerald-600" />
                    <span>{activeProgram.feeStatus}</span>
                  </span>
                </div>

                <h2 id="training-modal-title" className="text-xl font-extrabold text-[#101c3d] sm:text-2xl">
                  {activeProgram.title}
                </h2>

                <div className="flex flex-wrap items-center gap-2 text-xs text-[#50617c]">
                  <BuildingIcon className="h-4 w-4 text-[#1260ed]" />
                  <span className="font-bold text-[#101c3d]">{activeProgram.provider}</span>
                  <span className="text-slate-300">•</span>
                  <span>{activeProgram.location}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveProgram(null)}
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
                    Duration
                  </span>
                  <span className="mt-0.5 font-bold text-[#101c3d]">
                    {activeProgram.duration}
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    {activeProgram.schedule}
                  </span>
                </div>

                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Delivery Mode
                  </span>
                  <span className="mt-0.5 font-semibold text-[#1260ed]">
                    {activeProgram.deliveryMode}
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    {activeProgram.location}
                  </span>
                </div>

                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Start Date
                  </span>
                  <span className="mt-0.5 font-semibold text-[#101c3d]">
                    {activeProgram.startDate}
                  </span>
                </div>

                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Registration Cutoff
                  </span>
                  <span className="mt-0.5 font-semibold text-[#e11d48]">
                    {activeProgram.registrationDeadline}
                  </span>
                </div>
              </div>

              {/* Program Overview */}
              <div>
                <h3 className="font-bold text-[#101c3d]">Program Overview & Immersion Scope</h3>
                <p className="mt-1.5 leading-relaxed text-[#50617c]">
                  {activeProgram.fullDescription}
                </p>
              </div>

              {/* Curriculum Breakdown */}
              {activeProgram.curriculum && (
                <div>
                  <h3 className="font-bold text-[#101c3d]">Curriculum & Modules</h3>
                  <ul className="mt-2 space-y-1.5">
                    {activeProgram.curriculum.map((mod, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[#50617c]">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[10px] font-bold text-[#1260ed]">
                          {idx + 1}
                        </span>
                        <span>{mod}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Key Takeaways / Certification */}
              {activeProgram.keyTakeaways && (
                <div>
                  <h3 className="font-bold text-[#101c3d]">Learning Outcomes & Credentials</h3>
                  <ul className="mt-2 space-y-1.5">
                    {activeProgram.keyTakeaways.map((outcome, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[#50617c]">
                        <CheckCircleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Eligibility & Mentors */}
              <div className="grid grid-cols-1 gap-4 rounded-xl border border-[#e2ecf9] bg-[#fbfdff] p-3.5 sm:grid-cols-2">
                <div>
                  <h4 className="flex items-center gap-1.5 font-bold text-[#101c3d]">
                    <UsersIcon className="h-3.5 w-3.5 text-[#1260ed]" />
                    <span>Eligibility Criteria</span>
                  </h4>
                  <p className="mt-1 text-[11px] leading-relaxed text-[#50617c]">
                    {activeProgram.eligibility}
                  </p>
                </div>

                <div>
                  <h4 className="flex items-center gap-1.5 font-bold text-[#101c3d]">
                    <AcademicCapIcon className="h-3.5 w-3.5 text-[#7c3aed]" />
                    <span>Lead Mentors & Instructors</span>
                  </h4>
                  <p className="mt-1 text-[11px] leading-relaxed text-[#50617c]">
                    {activeProgram.leadInstructors}
                  </p>
                </div>
              </div>

              {/* Demo Notice Banner */}
              <div className="rounded-xl border border-purple-200 bg-purple-50/70 p-3.5 text-[#2e1065]">
                <div className="flex items-start gap-2.5">
                  <SparklesIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#7c3aed]" />
                  <div>
                    <p className="font-bold">Simulated Demonstration Program</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600">
                      Organizations, training modules, and certifications are demonstration entities
                      for evaluating the SYNAPSE Faculty Module interface. No live registration is submitted to external servers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#eef4fc] pt-4">
              <button
                type="button"
                onClick={() => setActiveProgram(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-[#50617c] hover:bg-slate-50"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                {registeredIds.includes(activeProgram.id) ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleToggleRegistration(activeProgram)
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
                  >
                    <CheckCircleIcon className="h-4 w-4" />
                    <span>Registered (Click to Withdraw)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      handleToggleRegistration(activeProgram)
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#1260ed] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#0d4ecc]"
                  >
                    <SendIcon className="h-3.5 w-3.5" />
                    <span>Register Interest (Demo)</span>
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
