import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getStudentJobRecommendations } from '../../services/studentService.js'

const matchedSkills = [
  { name: 'Python', level: 'Advanced' },
  { name: 'Machine Learning', level: 'Advanced' },
  { name: 'Data Structures', level: 'Intermediate' },
  { name: 'SQL', level: 'Intermediate' },
  { name: 'Data Analysis', level: 'Intermediate' },
]

const skillsToImprove = [
  { name: 'Deep Learning', level: 'High' },
  { name: 'System Design', level: 'Medium' },
  { name: 'Cloud Computing', level: 'Medium' },
]

function BookmarkIcon({ saved }) {
  return (
    <svg viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} aria-hidden="true" className="h-5 w-5">
      <path d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-3.75L6 21V4.75Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
      <path d="M4 6h16M7 12h10m-7 6h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function SelectFilter({ label, value, onChange, options }) {
  return (
    <label className="relative min-w-0 flex-1">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full appearance-none rounded-lg border border-[#dce5f1] bg-white px-3 pr-8 text-xs font-semibold text-[#283955] outline-none transition focus:border-[#1260ed] focus:ring-2 focus:ring-blue-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="pointer-events-none absolute right-2.5 top-3 h-4 w-4 text-[#71809a]">
        <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </label>
  )
}

function StudentRecommendedJobsPage() {
  const [jobs, setJobs] = useState([])
  const [savedJobs, setSavedJobs] = useState([])
  const [appliedJobs, setAppliedJobs] = useState([])
  const [category, setCategory] = useState('all')
  const [location, setLocation] = useState('all')
  const [experience, setExperience] = useState('all')
  const [jobType, setJobType] = useState('all')
  const [sortBy, setSortBy] = useState('match')
  const [minimumMatch, setMinimumMatch] = useState('0')
  const [savedOnly, setSavedOnly] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [showAllJobs, setShowAllJobs] = useState(false)
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    let active = true

    getStudentJobRecommendations().then((data) => {
      if (active) setJobs(data)
    })

    return () => {
      active = false
    }
  }, [])

  const locations = useMemo(
    () => [...new Set(jobs.map((job) => job.location))].sort(),
    [jobs],
  )

  const filteredJobs = useMemo(() => {
    const matching = jobs.filter((job) => {
      const matchesCategory = category === 'all'
        || (category === 'engineering' && /engineer|developer/i.test(job.title))
        || (category === 'data-ai' && /data|analyst|machine learning|ai/i.test(job.title))
      return matchesCategory
        && (location === 'all' || job.location === location)
        && (experience === 'all' || job.experience === experience)
        && (jobType === 'all' || job.type === jobType)
        && job.match >= Number(minimumMatch)
        && (!savedOnly || savedJobs.includes(job.id))
    })

    return matching.sort((first, second) => (
      sortBy === 'company'
        ? first.company.localeCompare(second.company)
        : sortBy === 'title'
          ? first.title.localeCompare(second.title)
          : second.match - first.match
    ))
  }, [category, experience, jobType, jobs, location, minimumMatch, savedJobs, savedOnly, sortBy])

  const displayedJobs = showAllJobs ? filteredJobs : filteredJobs.slice(0, 5)

  const toggleSaved = (job) => {
    const isSaved = savedJobs.includes(job.id)
    setSavedJobs((current) => (
      isSaved ? current.filter((id) => id !== job.id) : [...current, job.id]
    ))
    setAnnouncement(isSaved ? `${job.title} removed from saved jobs.` : `${job.title} saved.`)
  }

  const applyToJob = (job) => {
    const isApplied = appliedJobs.includes(job.id)
    if (isApplied) return
    setAppliedJobs((current) => [...current, job.id])
    setAnnouncement(`Demo application recorded for ${job.title} at ${job.company}.`)
  }

  const resetFilters = () => {
    setCategory('all')
    setLocation('all')
    setExperience('all')
    setJobType('all')
    setMinimumMatch('0')
    setSavedOnly(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#101c3d]">Recommended Jobs</h2>
          <p className="mt-1 text-sm text-[#66738d]">Jobs that match your skills and career interests.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowAllJobs(true)
            document.getElementById('recommended-job-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1260ed] px-4 text-xs font-bold text-white shadow-sm transition hover:bg-[#0d52cf]"
        >
          Explore More Jobs
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-2">
          <SelectFilter
            label="Role category"
            value={category}
            onChange={setCategory}
            options={[
              { value: 'all', label: 'All Roles' },
              { value: 'engineering', label: 'Engineering' },
              { value: 'data-ai', label: 'Data & AI' },
            ]}
          />
          <SelectFilter
            label="Location"
            value={location}
            onChange={setLocation}
            options={[
              { value: 'all', label: 'All Locations' },
              ...locations.map((item) => ({ value: item, label: item })),
            ]}
          />
          <SelectFilter
            label="Experience level"
            value={experience}
            onChange={setExperience}
            options={[
              { value: 'all', label: 'Experience Level' },
              { value: 'Entry level', label: 'Entry level' },
              { value: 'Internship', label: 'Internship' },
            ]}
          />
          <SelectFilter
            label="Job type"
            value={jobType}
            onChange={setJobType}
            options={[
              { value: 'all', label: 'Job Type' },
              { value: 'Full-time', label: 'Full-time' },
              { value: 'Internship', label: 'Internship' },
            ]}
          />
          <button
            type="button"
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen((open) => !open)}
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-xs font-semibold transition ${
              filtersOpen ? 'bg-[#1260ed] text-white' : 'bg-[#edf4ff] text-[#1260ed] hover:bg-[#e2edff]'
            }`}
          >
            <FilterIcon />
            Filters
          </button>
        </div>
        <label className="flex shrink-0 items-center gap-2 text-xs text-[#66738d]">
          Sort by:
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="h-10 rounded-lg border border-[#dce5f1] bg-white px-3 text-xs font-semibold text-[#283955] outline-none focus:border-[#1260ed]"
          >
            <option value="match">Best Match</option>
            <option value="company">Company</option>
            <option value="title">Job Title</option>
          </select>
        </label>
      </div>

      {filtersOpen && (
        <div className="flex flex-col gap-4 rounded-xl border border-[#dce7f5] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-3 text-xs font-semibold text-[#283955]">
            Minimum match
            <select
              value={minimumMatch}
              onChange={(event) => setMinimumMatch(event.target.value)}
              className="h-9 rounded-lg border border-[#dce5f1] bg-white px-3 text-xs outline-none focus:border-[#1260ed]"
            >
              <option value="0">Any match</option>
              <option value="70">70% or higher</option>
              <option value="80">80% or higher</option>
              <option value="90">90% or higher</option>
            </select>
          </label>
          <div className="flex flex-wrap items-center gap-4">
            <label className="inline-flex items-center gap-2 text-xs font-medium text-[#50617c]">
              <input
                type="checkbox"
                checked={savedOnly}
                onChange={(event) => setSavedOnly(event.target.checked)}
                className="h-4 w-4 rounded border-[#cbd6e5] accent-[#1260ed]"
              />
              Saved jobs only
            </label>
            <button type="button" onClick={resetFilters} className="text-xs font-bold text-[#1260ed] hover:underline">
              Clear filters
            </button>
          </div>
        </div>
      )}

      {announcement && (
        <div role="status" aria-live="polite" className="rounded-xl border border-[#cfe9df] bg-[#effaf6] px-4 py-3 text-xs font-medium text-[#16856b]">
          {announcement}
        </div>
      )}

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,2.1fr)_minmax(270px,0.9fr)]">
        <section id="recommended-job-list" aria-label="Recommended job listings" className="space-y-2.5">
          {displayedJobs.map((job) => {
            const saved = savedJobs.includes(job.id)
            const applied = appliedJobs.includes(job.id)
            const visibleSkills = job.skills.slice(0, 4)

            return (
              <article key={job.id} className="grid grid-cols-[52px_minmax(0,1fr)] gap-3 rounded-xl border border-[#e4ebf4] bg-white p-3.5 shadow-[0_2px_10px_rgba(26,50,90,0.025)] sm:grid-cols-[64px_minmax(0,1fr)_auto] sm:items-center sm:gap-4 sm:p-4">
                <div className={`flex h-[52px] w-[52px] items-center justify-center rounded-xl border border-[#edf1f7] text-xl font-extrabold tracking-tight sm:h-14 sm:w-14 ${job.logoStyle}`}>
                  {job.logo}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-[#172744]">{job.title}</h3>
                    <span className="text-xs font-extrabold text-[#15966d] sm:hidden">{job.match}% Match</span>
                  </div>
                  <p className="mt-1 text-[11px] font-medium text-[#62728e]">
                    {job.company}<span className="px-1.5 text-[#bbc6d6]">•</span>{job.location}
                    <span className="px-1.5 text-[#bbc6d6]">•</span>{job.type}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {visibleSkills.map((skill) => (
                      <span key={skill} className="rounded-md bg-[#edf4ff] px-2 py-1 text-[10px] font-medium text-[#1260ed]">{skill}</span>
                    ))}
                    {job.skills.length > visibleSkills.length && (
                      <span className="rounded-md bg-[#edf4ff] px-2 py-1 text-[10px] font-medium text-[#1260ed]">+{job.skills.length - visibleSkills.length}</span>
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-2 sm:hidden">
                    <button
                      type="button"
                      onClick={() => applyToJob(job)}
                      disabled={applied}
                      className="h-8 rounded-lg bg-[#1260ed] px-4 text-[11px] font-bold text-white transition hover:bg-[#0d52cf] disabled:cursor-default disabled:bg-[#eaf9f4] disabled:text-[#16856b]"
                    >
                      {applied ? 'Applied' : 'Apply'}
                    </button>
                    <button type="button" onClick={() => toggleSaved(job)} aria-label={saved ? `Remove ${job.title} from saved jobs` : `Save ${job.title}`} aria-pressed={saved} className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition ${saved ? 'text-[#1260ed]' : 'text-[#7586a0] hover:bg-[#f3f7fd]'}`}>
                      <BookmarkIcon saved={saved} />
                    </button>
                  </div>
                </div>
                <div className="hidden min-w-[82px] flex-col items-end gap-2.5 sm:flex">
                  <span className="text-xs font-extrabold text-[#15966d]">{job.match}% Match</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => applyToJob(job)}
                      disabled={applied}
                      className="h-9 min-w-[64px] rounded-lg bg-[#1260ed] px-3 text-xs font-bold text-white transition hover:bg-[#0d52cf] disabled:cursor-default disabled:bg-[#eaf9f4] disabled:text-[#16856b]"
                    >
                      {applied ? 'Applied' : 'Apply'}
                    </button>
                    <button type="button" onClick={() => toggleSaved(job)} aria-label={saved ? `Remove ${job.title} from saved jobs` : `Save ${job.title}`} aria-pressed={saved} className={`inline-flex h-9 w-8 items-center justify-center rounded-lg transition ${saved ? 'text-[#1260ed]' : 'text-[#7586a0] hover:bg-[#f3f7fd]'}`}>
                      <BookmarkIcon saved={saved} />
                    </button>
                  </div>
                </div>
              </article>
            )
          })}

          {displayedJobs.length === 0 && (
            <div className="rounded-xl border border-dashed border-[#cdd9e9] bg-white px-5 py-12 text-center">
              <p className="text-sm font-bold text-[#283955]">No jobs match these filters</p>
              <p className="mt-1 text-xs text-[#71809a]">Try changing or clearing your filters.</p>
              <button type="button" onClick={resetFilters} className="mt-4 text-xs font-bold text-[#1260ed] hover:underline">Clear filters</button>
            </div>
          )}

          {filteredJobs.length > 5 && (
            <div className="flex justify-center pt-1">
              <button
                type="button"
                onClick={() => setShowAllJobs((shown) => !shown)}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#edf4ff] px-5 text-xs font-bold text-[#1260ed] transition hover:bg-[#e2edff]"
              >
                {showAllJobs ? 'Show Fewer Jobs' : 'View More Jobs'}
                <span aria-hidden="true">{showAllJobs ? '⌃' : '⌄'}</span>
              </button>
            </div>
          )}
          <p className="sr-only">Job listings use fictional demonstration data. Applying only updates this demo page.</p>
        </section>

        <aside className="space-y-3">
          <section className="rounded-xl border border-[#e4ebf4] bg-white p-4 shadow-[0_2px_10px_rgba(26,50,90,0.025)] sm:p-5">
            <h3 className="text-xs font-bold text-[#172744]">Your Job Match Summary</h3>
            <div className="mt-4 flex items-center gap-4">
              <div className="relative grid h-24 w-24 shrink-0 place-items-center rounded-full" style={{ background: 'conic-gradient(#19b596 0% 55%, #4c8dff 55% 72%, #e7edf5 72% 100%)' }}>
                <div className="grid h-[72px] w-[72px] place-content-center rounded-full bg-white text-center">
                  <span className="text-lg font-extrabold text-[#172744]">72%</span>
                  <span className="text-[9px] text-[#71809a]">Overall Match</span>
                </div>
              </div>
              <div className="space-y-3 text-[10px] font-medium text-[#52627d]">
                <p className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#19b596]" />Matched Skills <strong className="ml-auto text-[#172744]">18</strong></p>
                <p className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#4c8dff]" />Partial Match <strong className="ml-auto text-[#172744]">6</strong></p>
                <p className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#f3a51b]" />Missing Skills <strong className="ml-auto text-[#172744]">4</strong></p>
              </div>
            </div>
            <Link to="/student/skill-analysis" className="mt-4 flex h-9 items-center justify-center rounded-lg bg-[#edf4ff] text-xs font-bold text-[#1260ed] transition hover:bg-[#e2edff]">
              View Skill Gap Analysis
            </Link>
          </section>

          <section className="rounded-xl border border-[#e4ebf4] bg-white p-4 shadow-[0_2px_10px_rgba(26,50,90,0.025)] sm:p-5">
            <h3 className="text-xs font-bold text-[#172744]">Top Matched Skills</h3>
            <ul className="mt-3 space-y-2.5">
              {matchedSkills.map((skill) => (
                <li key={skill.name} className="flex items-center gap-2 text-[10px] text-[#34445f]">
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-[#dff6ed] text-[10px] font-bold text-[#15966d]" aria-hidden="true">✓</span>
                  <span className="min-w-0 flex-1">{skill.name}</span>
                  <span className={`rounded-md px-2 py-1 font-semibold ${skill.level === 'Advanced' ? 'bg-[#e7f8f1] text-[#15966d]' : 'bg-[#fff4e5] text-[#c87908]'}`}>{skill.level}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-[#e4ebf4] bg-white p-4 shadow-[0_2px_10px_rgba(26,50,90,0.025)] sm:p-5">
            <h3 className="text-xs font-bold text-[#172744]">Improve Your Match</h3>
            <p className="mt-1 text-[10px] text-[#71809a]">Learn these skills to increase your match score.</p>
            <ul className="mt-3 space-y-2">
              {skillsToImprove.map((skill) => (
                <li key={skill.name} className="flex items-center justify-between gap-2 text-[10px]">
                  <span className="rounded-md border border-[#edf1f7] px-2 py-1.5 font-medium text-[#34445f]">{skill.name}</span>
                  <span className={`rounded-md px-2 py-1 font-semibold ${skill.level === 'High' ? 'bg-[#fff0f0] text-[#e05454]' : 'bg-[#fff5e8] text-[#c87908]'}`}>{skill.level}</span>
                </li>
              ))}
            </ul>
            <Link to="/student/skill-analysis" className="mt-3 flex h-9 items-center justify-center rounded-lg bg-[#edf4ff] text-xs font-bold text-[#1260ed] transition hover:bg-[#e2edff]">
              View Learning Plan
            </Link>
          </section>
        </aside>
      </div>
    </div>
  )
}

export default StudentRecommendedJobsPage
