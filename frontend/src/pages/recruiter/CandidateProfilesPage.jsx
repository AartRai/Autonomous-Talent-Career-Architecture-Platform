import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CandidateProfilesIcon,
  SearchIcon,
  CloseIcon,
  BookmarkIcon,
} from '../../components/recruiter/RecruiterIcons.jsx'
import CandidateProfileCard from '../../components/recruiter/CandidateProfileCard.jsx'
import CandidateProfileModal from '../../components/recruiter/CandidateProfileModal.jsx'
import { demoCandidateProfiles } from '../../data/recruiterMockData.js'

function CandidateProfilesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSkill, setSelectedSkill] = useState('')
  const [selectedExperience, setSelectedExperience] = useState('')
  const [selectedEducation, setSelectedEducation] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [shortlistedIds, setShortlistedIds] = useState(['talent-3'])
  const [feedbackToast, setFeedbackToast] = useState(null)

  // Auto-dismiss feedback toast message
  useEffect(() => {
    if (!feedbackToast) return
    const timer = setTimeout(() => {
      setFeedbackToast(null)
    }, 3200)
    return () => clearTimeout(timer)
  }, [feedbackToast])

  const categoryPresets = [
    { id: 'all', label: 'All Profiles' },
    { id: 'shortlisted', label: `Shortlisted (${shortlistedIds.length})` },
    { id: 'frontend', label: 'Frontend & UI' },
    { id: 'backend', label: 'Backend & Cloud' },
    { id: 'ai-data', label: 'AI & Data' },
    { id: 'devops', label: 'DevOps & Systems' },
  ]

  const handleToggleShortlist = (candidateId) => {
    const candidate = demoCandidateProfiles.find((c) => c.id === candidateId)
    const candidateName = candidate ? candidate.name : 'Candidate'

    setShortlistedIds((prev) => {
      const isAlreadyShortlisted = prev.includes(candidateId)
      if (isAlreadyShortlisted) {
        setFeedbackToast({
          type: 'removed',
          title: 'Removed from Shortlist',
          message: `${candidateName} was removed from your demonstration shortlist.`,
        })
        return prev.filter((id) => id !== candidateId)
      } else {
        setFeedbackToast({
          type: 'added',
          title: 'Candidate Shortlisted',
          message: `${candidateName} has been added to your demonstration shortlist.`,
        })
        return [...new Set([...prev, candidateId])]
      }
    })
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedSkill('')
    setSelectedExperience('')
    setSelectedEducation('')
    setSelectedLocation('')
    setActiveCategory('all')
    setSelectedCandidate(null)
  }

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    Boolean(selectedSkill) ||
    Boolean(selectedExperience) ||
    Boolean(selectedEducation) ||
    Boolean(selectedLocation) ||
    activeCategory !== 'all'

  // Filter candidates based on search query, dropdown filters, and category chips
  const filteredCandidates = useMemo(() => {
    return demoCandidateProfiles.filter((candidate) => {
      // 1. Text search across candidate name, role/career focus, education, location, and skills
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase()
        const searchableText = `${candidate.name} ${candidate.role} ${candidate.education} ${candidate.location} ${candidate.workMode} ${candidate.skills.join(
          ' '
        )} ${candidate.summary || ''}`.toLowerCase()

        if (!searchableText.includes(query)) {
          // Check individual terms
          const terms = query.split(/\s+/).filter((t) => t.length > 1)
          const matchesAnyTerm = terms.length > 0 && terms.some((term) => searchableText.includes(term))
          if (!matchesAnyTerm) return false
        }
      }

      // 2. Primary skill filter
      if (selectedSkill && selectedSkill !== 'All skills') {
        const targetSkill = selectedSkill.toLowerCase()
        const hasSkill = candidate.skills.some(
          (s) => s.toLowerCase() === targetSkill || s.toLowerCase().includes(targetSkill)
        )
        if (!hasSkill) return false
      }

      // 3. Experience level filter
      if (selectedExperience && selectedExperience !== 'Any experience') {
        if (candidate.experienceLevel.toLowerCase() !== selectedExperience.toLowerCase()) {
          return false
        }
      }

      // 4. Education level filter
      if (selectedEducation && selectedEducation !== 'Any education') {
        const targetEdu = selectedEducation.toLowerCase()
        const hasEdu =
          candidate.educationDegree.toLowerCase() === targetEdu ||
          candidate.education.toLowerCase().includes(targetEdu)
        if (!hasEdu) return false
      }

      // 5. Location / Mode filter
      if (selectedLocation && selectedLocation !== 'Any location or mode') {
        const targetLoc = selectedLocation.toLowerCase()
        const matchesLoc =
          candidate.location.toLowerCase() === targetLoc ||
          candidate.workMode.toLowerCase() === targetLoc
        if (!matchesLoc) return false
      }

      // 6. Quick category preset filter
      if (activeCategory === 'shortlisted') {
        if (!shortlistedIds.includes(candidate.id)) return false
      } else if (activeCategory === 'frontend') {
        const hasFrontend = candidate.skills.some((s) =>
          ['react', 'typescript', 'frontend', 'tailwind css', 'ui/ux design', 'figma'].includes(
            s.toLowerCase()
          )
        )
        if (!hasFrontend) return false
      } else if (activeCategory === 'backend') {
        const hasBackend = candidate.skills.some((s) =>
          ['node.js', 'java', 'spring boot', 'python', 'postgresql', 'rest apis'].includes(
            s.toLowerCase()
          )
        )
        if (!hasBackend) return false
      } else if (activeCategory === 'ai-data') {
        const hasAiData = candidate.skills.some((s) =>
          ['machine learning', 'pytorch', 'tensorflow', 'data analytics', 'sql', 'tableau'].includes(
            s.toLowerCase()
          )
        )
        if (!hasAiData) return false
      } else if (activeCategory === 'devops') {
        const hasDevops = candidate.skills.some((s) =>
          ['aws', 'devops', 'docker', 'kubernetes', 'ci/cd', 'cybersecurity'].includes(
            s.toLowerCase()
          )
        )
        if (!hasDevops) return false
      }

      return true
    })
  }, [
    searchQuery,
    selectedSkill,
    selectedExperience,
    selectedEducation,
    selectedLocation,
    activeCategory,
    shortlistedIds,
  ])

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
          Candidate Profiles
        </span>
      </nav>

      {/* Page Header */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-[#101c3d] sm:text-3xl">
              Candidate Profiles
            </h1>
            <p className="mt-1.5 text-sm text-[#66738d] sm:text-base">
              Explore candidate profiles, review skills, and discover potential talent.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory(activeCategory === 'shortlisted' ? 'all' : 'shortlisted')}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                activeCategory === 'shortlisted'
                  ? 'border-[#1260ed] bg-[#edf4ff] text-[#1260ed]'
                  : 'border-blue-200 bg-blue-50/80 text-[#1260ed] hover:bg-blue-100/70'
              }`}
              title="Filter by shortlisted candidates"
            >
              <BookmarkIcon className="h-3.5 w-3.5" filled={shortlistedIds.length > 0} />
              <span>{shortlistedIds.length} Shortlisted (Demo)</span>
            </button>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1.5 text-xs font-semibold text-[#1260ed]">
              <CandidateProfilesIcon className="h-3.5 w-3.5" />
              Candidate Directory (Demo Mode)
            </span>
          </div>
        </div>
      </div>

      {/* Demo Notice Banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50/80 p-4 text-xs sm:text-[13px]">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#1260ed] text-white shadow-xs">
          <CandidateProfilesIcon className="h-3.5 w-3.5" />
        </div>
        <div className="space-y-1">
          <p className="font-bold text-[#101c3d]">
            Fictional Demonstration Profiles
          </p>
          <p className="leading-relaxed text-[#50617c]">
            The profiles displayed below are fictional demonstration records provided for testing
            directory filtering and profile cards. No live candidate data or real AI match scores
            are used.
          </p>
        </div>
      </div>

      {/* Search and Filters Card */}
      <div className="rounded-2xl border border-[#e2ecf9] bg-white p-6 shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-8">
        <div className="space-y-5">
          {/* Search Input Bar */}
          <div>
            <label
              htmlFor="candidate-search-input"
              className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#50617c]"
            >
              Search by Candidate Name, Skills, or Career Focus
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <SearchIcon className="h-5 w-5" />
              </div>
              <input
                id="candidate-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidates by name (e.g., 'Aarav'), role ('Frontend Engineer'), or skill ('Python')..."
                className="h-12 w-full rounded-xl border border-[#cdd9ec] bg-[#f8fbff] pl-11 pr-10 text-[13.5px] text-slate-800 placeholder:text-[#9aa6b9] transition focus:border-[#1260ed] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
                  aria-label="Clear search input"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Controls Row */}
          <div className="border-t border-[#f0f4fa] pt-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#50617c]">
                Filter Candidates
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
                  htmlFor="filter-candidate-skill"
                  className="mb-1.5 block text-xs font-semibold text-[#1e293b]"
                >
                  Primary Skill
                </label>
                <div className="relative">
                  <select
                    id="filter-candidate-skill"
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
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Cybersecurity">Cybersecurity</option>
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
                  htmlFor="filter-candidate-experience"
                  className="mb-1.5 block text-xs font-semibold text-[#1e293b]"
                >
                  Experience Level
                </label>
                <div className="relative">
                  <select
                    id="filter-candidate-experience"
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
                  htmlFor="filter-candidate-education"
                  className="mb-1.5 block text-xs font-semibold text-[#1e293b]"
                >
                  Education Level
                </label>
                <div className="relative">
                  <select
                    id="filter-candidate-education"
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
                  htmlFor="filter-candidate-location"
                  className="mb-1.5 block text-xs font-semibold text-[#1e293b]"
                >
                  Location / Mode
                </label>
                <div className="relative">
                  <select
                    id="filter-candidate-location"
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

          {/* Quick Category Chips */}
          <div className="flex flex-wrap items-center gap-2 border-t border-[#f4f7fc] pt-4">
            <span className="text-xs font-medium text-[#71829e]">Quick categories:</span>
            {categoryPresets.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  activeCategory === cat.id
                    ? 'border border-[#1260ed] bg-[#edf4ff] text-[#1260ed]'
                    : 'border border-[#d6e3f4] bg-[#f8fbff] text-[#42546f] hover:border-[#b8d6fc] hover:bg-white hover:text-[#1260ed]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Candidate Listings Section */}
      <section aria-labelledby="candidate-directory-heading" className="space-y-4">
        {/* Header with Candidate Count and Filter Summary */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <h2
              id="candidate-directory-heading"
              className="text-lg font-bold tracking-tight text-[#101c3d] sm:text-xl"
            >
              Available Candidates
            </h2>
            <span className="rounded-full bg-[#edf4ff] px-2.5 py-0.5 text-xs font-bold text-[#1260ed]">
              {filteredCandidates.length}
            </span>
          </div>

          <div className="text-xs font-medium text-[#71829e]">
            {filteredCandidates.length === demoCandidateProfiles.length
              ? `Showing all ${filteredCandidates.length} demonstration candidate profiles`
              : `Showing ${filteredCandidates.length} of ${demoCandidateProfiles.length} candidate profiles`}
          </div>
        </div>

        {/* Listing or Empty State */}
        {filteredCandidates.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredCandidates.map((candidate) => (
              <CandidateProfileCard
                key={candidate.id}
                candidate={candidate}
                isShortlisted={shortlistedIds.includes(candidate.id)}
                onToggleShortlist={handleToggleShortlist}
                onViewProfile={(cand) => setSelectedCandidate(cand)}
              />
            ))}
          </div>
        ) : (
          /* Empty State when no candidates match */
          <div className="flex min-h-[340px] flex-col items-center justify-center rounded-2xl border border-[#e2ecf9] bg-white p-8 text-center shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-12">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf4ff] text-[#1260ed] shadow-xs">
              <SearchIcon className="h-7 w-7" />
            </div>

            <h3 className="mt-4 text-lg font-bold text-[#101c3d]">
              {activeCategory === 'shortlisted'
                ? 'No candidates in your shortlist yet'
                : 'No candidate profiles match your criteria'}
            </h3>

            <p className="mt-2 max-w-md text-xs leading-relaxed text-[#66738d] sm:text-sm">
              {activeCategory === 'shortlisted'
                ? 'You have not shortlisted any candidates in this demo session yet. Click the "Shortlist" button on any candidate card to add them here.'
                : 'We couldn\'t find any demonstration candidates matching your current combination of search terms and filters. Try adjusting your search query or resetting filters.'}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 rounded-xl bg-[#1260ed] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700"
              >
                Reset All Filters
              </button>
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById('candidate-search-input')
                  if (input) input.focus()
                }}
                className="inline-flex items-center rounded-xl border border-[#cdd9ec] bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Modify Search Query
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Accessible Candidate Profile Details Modal */}
      {selectedCandidate && (
        <CandidateProfileModal
          candidate={selectedCandidate}
          isShortlisted={shortlistedIds.includes(selectedCandidate.id)}
          onToggleShortlist={handleToggleShortlist}
          onClose={() => setSelectedCandidate(null)}
        />
      )}

      {/* Shortlist Feedback Notification Toast */}
      {feedbackToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-3 rounded-2xl border border-blue-200 bg-white p-4 shadow-[0_10px_35px_rgba(18,96,237,0.18)] transition-all animate-in fade-in slide-in-from-bottom-3"
        >
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
              feedbackToast.type === 'added'
                ? 'bg-blue-50 text-[#1260ed]'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            <BookmarkIcon
              className="h-4 w-4"
              filled={feedbackToast.type === 'added'}
            />
          </div>
          <div className="flex-1 min-w-0 pr-1">
            <p className="text-xs font-bold text-[#101c3d]">
              {feedbackToast.title}
            </p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-[#50617c]">
              {feedbackToast.message}
            </p>
            <span className="mt-1.5 inline-block rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-800">
              Demo Session • Not saved to backend
            </span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackToast(null)}
            aria-label="Dismiss shortlist notification"
            className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <CloseIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}

export default CandidateProfilesPage
