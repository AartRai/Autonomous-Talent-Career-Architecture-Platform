import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  SearchIcon,
  SparkleMatchIcon,
  CloseIcon,
  BookmarkIcon,
} from '../../components/recruiter/RecruiterIcons.jsx'
import TalentSearchCandidateCard from '../../components/recruiter/TalentSearchCandidateCard.jsx'
import { demoTalentSearchCandidates } from '../../data/recruiterMockData.js'

function TalentSearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSkill, setSelectedSkill] = useState('')
  const [selectedExperience, setSelectedExperience] = useState('')
  const [selectedEducation, setSelectedEducation] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [submittedSearch, setSubmittedSearch] = useState(null)
  const [shortlistedIds, setShortlistedIds] = useState(['talent-3'])
  const [previewCandidate, setPreviewCandidate] = useState(null)

  // Close candidate preview modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setPreviewCandidate(null)
      }
    }
    if (previewCandidate) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [previewCandidate])

  const handleExecuteSearch = (
    query = searchQuery,
    skill = selectedSkill,
    experience = selectedExperience,
    education = selectedEducation,
    location = selectedLocation
  ) => {
    setSubmittedSearch({
      query: query.trim(),
      skill,
      experience,
      education,
      location,
      searchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    handleExecuteSearch()
  }

  const handleApplySuggestedQuery = (query) => {
    setSearchQuery(query)
    handleExecuteSearch(query, selectedSkill, selectedExperience, selectedEducation, selectedLocation)
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedSkill('')
    setSelectedExperience('')
    setSelectedEducation('')
    setSelectedLocation('')
    setSubmittedSearch(null)
    setPreviewCandidate(null)
  }

  const handleToggleShortlist = (candidateId) => {
    setShortlistedIds((prev) =>
      prev.includes(candidateId) ? prev.filter((id) => id !== candidateId) : [...prev, candidateId]
    )
  }

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    Boolean(selectedSkill) ||
    Boolean(selectedExperience) ||
    Boolean(selectedEducation) ||
    Boolean(selectedLocation) ||
    Boolean(submittedSearch)

  const exampleQueries = [
    'Full Stack Engineer (React & Node.js)',
    'Data Analyst with Python and SQL',
    'Machine Learning Intern',
    'Cloud / DevOps Specialist',
  ]

  // Frontend demo filtering applied when search is submitted
  const filteredCandidates = submittedSearch
    ? demoTalentSearchCandidates.filter((candidate) => {
        // 1. Keyword / query match
        if (submittedSearch.query) {
          const rawQuery = submittedSearch.query.toLowerCase()
          const cleanTerms = rawQuery
            .replace(/[()[\]{}]/g, ' ')
            .split(/\s+/)
            .filter((t) => t.length > 1 && !['with', 'and', 'for', 'the', 'in'].includes(t))

          const searchableText = `${candidate.name} ${candidate.role} ${candidate.education} ${candidate.skills.join(
            ' '
          )} ${candidate.summary} ${candidate.location} ${candidate.workMode}`.toLowerCase()

          const matchesFull = searchableText.includes(rawQuery)
          const matchesAnyTerm =
            cleanTerms.length > 0 && cleanTerms.some((term) => searchableText.includes(term))

          if (!matchesFull && !matchesAnyTerm) {
            return false
          }
        }

        // 2. Primary skill filter
        if (submittedSearch.skill && submittedSearch.skill !== 'All skills') {
          const targetSkill = submittedSearch.skill.toLowerCase()
          const hasSkill = candidate.skills.some(
            (s) => s.toLowerCase() === targetSkill || s.toLowerCase().includes(targetSkill)
          )
          if (!hasSkill) return false
        }

        // 3. Experience level filter
        if (submittedSearch.experience && submittedSearch.experience !== 'Any experience') {
          if (candidate.experienceLevel.toLowerCase() !== submittedSearch.experience.toLowerCase()) {
            return false
          }
        }

        // 4. Education level filter
        if (submittedSearch.education && submittedSearch.education !== 'Any education') {
          const targetEdu = submittedSearch.education.toLowerCase()
          const hasEdu =
            candidate.educationDegree.toLowerCase() === targetEdu ||
            candidate.education.toLowerCase().includes(targetEdu)
          if (!hasEdu) return false
        }

        // 5. Location / Mode filter
        if (submittedSearch.location && submittedSearch.location !== 'Any location or mode') {
          const targetLoc = submittedSearch.location.toLowerCase()
          const matchesLoc =
            candidate.location.toLowerCase() === targetLoc ||
            candidate.workMode.toLowerCase() === targetLoc
          if (!matchesLoc) return false
        }

        return true
      })
    : []

  return (
    <div className="space-y-7">
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs font-medium text-[#71829e]"
      >
        <Link to="/recruiter" className="transition hover:text-[#1260ed]">
          Recruiter Dashboard
        </Link>
        <span className="text-slate-300" aria-hidden="true">
          /
        </span>
        <span className="font-semibold text-[#101c3d]" aria-current="page">
          Talent Search
        </span>
      </nav>

      {/* Page Header */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-[#101c3d] sm:text-3xl">
              Talent Search
            </h1>
            <p className="mt-1.5 text-sm text-[#66738d] sm:text-base">
              Discover candidates whose skills and experience align with your hiring needs.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1.5 text-xs font-semibold text-[#1260ed]">
            <SparkleMatchIcon className="h-3.5 w-3.5" />
            Talent Search Interface (Demo Mode)
          </span>
        </div>
      </div>

      {/* Search Panel Card */}
      <div className="rounded-2xl border border-[#e2ecf9] bg-white p-6 shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-8">
        <form onSubmit={handleSearchSubmit} className="space-y-5">
          {/* Main Keyword Search Bar */}
          <div>
            <label
              htmlFor="talent-search-input"
              className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#50617c]"
            >
              Search by Skills, Role, or Candidate Profile
            </label>
            <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                  <SearchIcon className="h-5 w-5" />
                </div>
                <input
                  id="talent-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleExecuteSearch()
                    }
                  }}
                  placeholder="Enter keywords, job titles, or natural language query (e.g. 'Frontend engineer with TypeScript')..."
                  className="h-12 w-full rounded-xl border border-[#cdd9ec] bg-[#f8fbff] pl-11 pr-10 text-[13.5px] text-slate-800 placeholder:text-[#9aa6b9] transition focus:border-[#1260ed] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
                    aria-label="Clear search input"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#1260ed] px-6 text-[13.5px] font-bold text-white shadow-xs transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <SearchIcon className="h-4 w-4" />
                <span>Search Candidates</span>
              </button>
            </div>
          </div>

          {/* Filters Area */}
          <div className="border-t border-[#f0f4fa] pt-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#50617c]">
                Filters & Criteria
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-[#1260ed] hover:underline"
                >
                  Reset All Filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* 1. Primary Skill */}
              <div>
                <label
                  htmlFor="filter-skills"
                  className="mb-1.5 block text-xs font-semibold text-[#1e293b]"
                >
                  Primary Skill
                </label>
                <div className="relative">
                  <select
                    id="filter-skills"
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    className={`h-10 w-full cursor-pointer appearance-none rounded-xl border border-[#cdd9ec] bg-[#f8fbff] px-3 pr-8 text-[13px] transition focus:border-[#1260ed] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 ${
                      !selectedSkill ? 'text-[#9aa6b9]' : 'text-slate-800'
                    }`}
                  >
                    <option value="">All skills</option>
                    <option value="React">React</option>
                    <option value="Node.js">Node.js</option>
                    <option value="Python">Python</option>
                    <option value="Java">Java</option>
                    <option value="TypeScript">TypeScript</option>
                    <option value="SQL">SQL / Databases</option>
                    <option value="Machine Learning">Machine Learning / AI</option>
                    <option value="AWS">AWS / Cloud Infrastructure</option>
                    <option value="DevOps">DevOps / CI/CD</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 2. Experience Level */}
              <div>
                <label
                  htmlFor="filter-experience"
                  className="mb-1.5 block text-xs font-semibold text-[#1e293b]"
                >
                  Experience Level
                </label>
                <div className="relative">
                  <select
                    id="filter-experience"
                    value={selectedExperience}
                    onChange={(e) => setSelectedExperience(e.target.value)}
                    className={`h-10 w-full cursor-pointer appearance-none rounded-xl border border-[#cdd9ec] bg-[#f8fbff] px-3 pr-8 text-[13px] transition focus:border-[#1260ed] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 ${
                      !selectedExperience ? 'text-[#9aa6b9]' : 'text-slate-800'
                    }`}
                  >
                    <option value="">Any experience</option>
                    <option value="Fresher (0 years)">Fresher (0 years)</option>
                    <option value="0–1 years">0–1 years</option>
                    <option value="1–3 years">1–3 years</option>
                    <option value="3–5 years">3–5 years</option>
                    <option value="5+ years">5+ years</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 3. Education Level */}
              <div>
                <label
                  htmlFor="filter-education"
                  className="mb-1.5 block text-xs font-semibold text-[#1e293b]"
                >
                  Education Level
                </label>
                <div className="relative">
                  <select
                    id="filter-education"
                    value={selectedEducation}
                    onChange={(e) => setSelectedEducation(e.target.value)}
                    className={`h-10 w-full cursor-pointer appearance-none rounded-xl border border-[#cdd9ec] bg-[#f8fbff] px-3 pr-8 text-[13px] transition focus:border-[#1260ed] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 ${
                      !selectedEducation ? 'text-[#9aa6b9]' : 'text-slate-800'
                    }`}
                  >
                    <option value="">Any education</option>
                    <option value="B.Tech / B.E.">B.Tech / B.E.</option>
                    <option value="M.Tech / M.S.">M.Tech / M.S.</option>
                    <option value="BCA / MCA">BCA / MCA</option>
                    <option value="B.Sc / M.Sc Computer Science">B.Sc / M.Sc Computer Science</option>
                    <option value="Ph.D. / Doctorate">Ph.D. / Doctorate</option>
                    <option value="Other Degrees">Other Degrees</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 4. Location / Mode */}
              <div>
                <label
                  htmlFor="filter-location"
                  className="mb-1.5 block text-xs font-semibold text-[#1e293b]"
                >
                  Location / Mode
                </label>
                <div className="relative">
                  <select
                    id="filter-location"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className={`h-10 w-full cursor-pointer appearance-none rounded-xl border border-[#cdd9ec] bg-[#f8fbff] px-3 pr-8 text-[13px] transition focus:border-[#1260ed] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 ${
                      !selectedLocation ? 'text-[#9aa6b9]' : 'text-slate-800'
                    }`}
                  >
                    <option value="">Any location or mode</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Pune">Pune</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Chennai">Chennai</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Suggested Queries */}
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#f4f7fc] pt-4">
          <span className="text-xs font-medium text-[#71829e]">Suggested queries:</span>
          {exampleQueries.map((query) => (
            <button
              key={query}
              type="button"
              onClick={() => handleApplySuggestedQuery(query)}
              className="inline-flex items-center rounded-lg border border-[#d6e3f4] bg-[#f8fbff] px-2.5 py-1 text-xs font-medium text-[#334661] transition hover:border-[#1260ed] hover:bg-[#edf4ff] hover:text-[#1260ed]"
            >
              {query}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <section aria-labelledby="candidate-matches-heading" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <h2
              id="candidate-matches-heading"
              className="text-lg font-bold tracking-tight text-[#101c3d] sm:text-xl"
            >
              Candidate Matches
            </h2>
            <span className="rounded-full bg-[#edf4ff] px-2.5 py-0.5 text-xs font-bold text-[#1260ed]">
              {submittedSearch ? filteredCandidates.length : 0}
            </span>
          </div>
          <div className="text-xs font-medium text-[#71829e]">
            {submittedSearch
              ? `${filteredCandidates.length} demo candidate match(es) • Captured at ${submittedSearch.searchedAt}`
              : 'Awaiting search query'}
          </div>
        </div>

        {/* Conditional Display: Demo Search Results vs Initial Empty State */}
        {submittedSearch ? (
          <div className="space-y-6">
            {/* Notice Banner */}
            <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50/80 p-4 text-xs sm:text-[13px]">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#1260ed] text-white shadow-xs">
                <SparkleMatchIcon className="h-3.5 w-3.5" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-[#101c3d]">
                  Demo Candidate Matches (Frontend Simulation)
                </p>
                <p className="leading-relaxed text-[#50617c]">
                  Showing filtered demonstration candidate cards based on your criteria. Sample match
                  scores are mock values for layout review and do not reflect live backend AI or vector
                  database queries.
                </p>
              </div>
            </div>

            {/* If candidates match */}
            {filteredCandidates.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredCandidates.map((candidate) => (
                  <TalentSearchCandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    isShortlisted={shortlistedIds.includes(candidate.id)}
                    onToggleShortlist={handleToggleShortlist}
                    onViewProfile={(cand) => setPreviewCandidate(cand)}
                  />
                ))}
              </div>
            ) : (
              /* Empty Results State */
              <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-[#e2ecf9] bg-white p-8 text-center shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-12">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f0f4fa] text-slate-500 shadow-xs">
                  <SearchIcon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-[#101c3d]">
                  No matching demo candidates found
                </h3>
                <p className="mt-2 max-w-md text-xs leading-relaxed text-[#66738d] sm:text-sm">
                  None of the fictional demonstration profiles matched your current combination of keywords
                  and filters. Try broadening your keywords or resetting filters.
                </p>
                <div className="mt-5 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center rounded-xl bg-[#1260ed] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700"
                  >
                    Reset All Filters
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('talent-search-input')
                      if (el) el.focus()
                    }}
                    className="inline-flex items-center rounded-xl border border-[#cdd9ec] bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Modify Query
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Initial Empty State */
          <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-[#e2ecf9] bg-white p-8 text-center shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#edf4ff] text-[#1260ed] shadow-xs">
              <SearchIcon className="h-8 w-8" />
            </div>

            <h3 className="mt-5 text-lg font-bold text-[#101c3d] sm:text-xl">
              No candidate matches to display yet
            </h3>

            <p className="mt-2 max-w-md text-sm leading-relaxed text-[#66738d]">
              Enter a role title, key skills, or requirements in the search bar above and apply criteria filters to discover matched candidates. Candidates and their alignment will appear here.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('talent-search-input')
                  if (el) el.focus()
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-[#1260ed] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <SearchIcon className="h-4 w-4" />
                <span>Start searching</span>
              </button>
              <Link
                to="/recruiter"
                className="inline-flex items-center rounded-xl border border-[#cdd9ec] bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Candidate Profile Preview Modal */}
      {previewCandidate && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="preview-candidate-name"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <div
            role="presentation"
            onClick={() => setPreviewCandidate(null)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
          />

          {/* Modal Container */}
          <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl border border-[#e2ecf9] bg-white shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-[#edf4fc] px-6 py-5 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1260ed] to-[#1764ed] text-sm font-extrabold text-white shadow-xs">
                  {previewCandidate.initials}
                </div>
                <div>
                  <h3
                    id="preview-candidate-name"
                    className="text-lg font-bold text-[#101c3d] sm:text-xl"
                  >
                    {previewCandidate.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#1260ed] sm:text-sm">
                    {previewCandidate.role}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPreviewCandidate(null)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close candidate preview"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6 sm:px-8">
              {/* Match Indicator & Status */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-200 bg-blue-50/70 p-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1260ed]">
                    Demo Match Indicator
                  </span>
                  <div className="mt-0.5 text-base font-extrabold text-[#101c3d]">
                    {previewCandidate.demoMatchScore}% Alignment{' '}
                    <span className="text-xs font-medium text-[#66768e]">(Sample Mock Score)</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleShortlist(previewCandidate.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                    shortlistedIds.includes(previewCandidate.id)
                      ? 'border border-[#b8d6fc] bg-[#edf4ff] text-[#1260ed]'
                      : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <BookmarkIcon
                    className="h-4 w-4"
                    filled={shortlistedIds.includes(previewCandidate.id)}
                  />
                  <span>
                    {shortlistedIds.includes(previewCandidate.id) ? 'Shortlisted' : 'Shortlist Candidate'}
                  </span>
                </button>
              </div>

              {/* Fictional Summary */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#50617c]">
                  Candidate Profile Summary
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-[#41516c]">
                  {previewCandidate.summary}
                </p>
              </div>

              {/* Key Details Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-[#edf3fc] bg-[#f8fbff] p-4 text-xs">
                  <span className="font-semibold text-[#71829e]">Education & Degree</span>
                  <p className="mt-1 font-bold text-[#101c3d]">{previewCandidate.education}</p>
                </div>
                <div className="rounded-xl border border-[#edf3fc] bg-[#f8fbff] p-4 text-xs">
                  <span className="font-semibold text-[#71829e]">Experience Level</span>
                  <p className="mt-1 font-bold text-[#101c3d]">
                    {previewCandidate.experienceLevel} ({previewCandidate.experienceYears})
                  </p>
                </div>
                <div className="rounded-xl border border-[#edf3fc] bg-[#f8fbff] p-4 text-xs">
                  <span className="font-semibold text-[#71829e]">Location</span>
                  <p className="mt-1 font-bold text-[#101c3d]">{previewCandidate.location}</p>
                </div>
                <div className="rounded-xl border border-[#edf3fc] bg-[#f8fbff] p-4 text-xs">
                  <span className="font-semibold text-[#71829e]">Work Mode</span>
                  <p className="mt-1 font-bold text-[#101c3d]">{previewCandidate.workMode}</p>
                </div>
              </div>

              {/* Technical Skills */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#50617c]">
                  Technical Skills & Competencies
                </h4>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {previewCandidate.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg border border-[#cbe0fc] bg-[#edf4ff] px-3 py-1.5 text-xs font-semibold text-[#1260ed]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Demonstration Disclaimer */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-500">
                <strong>Disclaimer:</strong> This is a fictional demonstration profile for local recruiter UI
                evaluation. No live candidate data, vector search, or ML model was queried.
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#edf4fc] bg-slate-50/50 px-6 py-4 sm:px-8">
              <button
                type="button"
                onClick={() => setPreviewCandidate(null)}
                className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TalentSearchPage
