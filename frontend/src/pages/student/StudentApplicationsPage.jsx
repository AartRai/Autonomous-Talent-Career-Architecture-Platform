import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getStudentApplicationsData,
  getStudentSavedJobsData,
} from '../../services/studentService.js'

const applicationOverview = [
  { label: 'Under Review', count: 8, color: '#3978f6' },
  { label: 'Shortlisted', count: 5, color: '#25b889' },
  { label: 'Interview Scheduled', count: 4, color: '#8b5cf6' },
  { label: 'Applied', count: 6, color: '#f5a623' },
  { label: 'Rejected', count: 3, color: '#ef4444' },
  { label: 'Withdrawn', count: 2, color: '#a3afc2' },
]

const statusStyles = {
  'Under Review': 'bg-[#edf4ff] text-[#2463d8]',
  Shortlisted: 'bg-[#e7f8f1] text-[#14835f]',
  'Interview Scheduled': 'bg-[#f3efff] text-[#7543c5]',
  Applied: 'bg-[#edf4ff] text-[#2463d8]',
  Rejected: 'bg-[#fff0f0] text-[#d93434]',
  Withdrawn: 'bg-[#f1f4f8] text-[#64748b]',
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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

function CompanyMark({ item, compact = false }) {
  const isWordmark = String(item.logo).length > 2

  return (
    <span className={`grid shrink-0 place-items-center overflow-hidden whitespace-nowrap rounded-lg border border-[#edf1f7] bg-white font-extrabold ${
      compact
        ? isWordmark ? 'h-8 w-11 px-1 text-[9px] tracking-tight' : 'h-8 w-8 text-base'
        : isWordmark ? 'h-10 w-12 px-1 text-[10px] tracking-tight' : 'h-10 w-10 text-lg'
    } ${item.logoStyle}`}>
      {item.logo}
    </span>
  )
}

function ApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [savedJobs, setSavedJobs] = useState([])
  const [activeTab, setActiveTab] = useState('applied')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [role, setRole] = useState('all')
  const [location, setLocation] = useState('all')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [openMenu, setOpenMenu] = useState(null)
  const [tipsOpen, setTipsOpen] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const [resumeName, setResumeName] = useState('')
  const resumeInputRef = useRef(null)

  useEffect(() => {
    let active = true

    Promise.all([getStudentApplicationsData(), getStudentSavedJobsData()]).then(
      ([applicationData, savedJobData]) => {
        if (!active) return
        setApplications(applicationData)
        setSavedJobs(savedJobData)
      },
    )

    return () => {
      active = false
    }
  }, [])

  const roles = useMemo(
    () => [...new Set(applications.map((application) => application.title))].sort(),
    [applications],
  )
  const locations = useMemo(
    () => [...new Set(applications.map((application) => application.location))].sort(),
    [applications],
  )

  const filteredApplications = useMemo(() => applications.filter((application) => {
    const searchText = query.trim().toLowerCase()
    const matchesQuery = !searchText
      || application.title.toLowerCase().includes(searchText)
      || application.company.toLowerCase().includes(searchText)
    return matchesQuery
      && (status === 'all' || application.status === status)
      && (role === 'all' || application.title === role)
      && (location === 'all' || application.location === location)
  }), [applications, location, query, role, status])

  const filteredSavedJobs = useMemo(() => savedJobs.filter((job) => {
    const searchText = query.trim().toLowerCase()
    return !searchText
      || job.title.toLowerCase().includes(searchText)
      || job.company.toLowerCase().includes(searchText)
  }), [query, savedJobs])

  const resetFilters = () => {
    setQuery('')
    setStatus('all')
    setRole('all')
    setLocation('all')
  }

  const withdrawApplication = (application) => {
    setApplications((current) => current.map((item) => (
      item.id === application.id
        ? { ...item, status: 'Withdrawn', nextStep: '—' }
        : item
    )))
    setOpenMenu(null)
    setAnnouncement(`Demo application for ${application.title} at ${application.company} marked as withdrawn.`)
  }

  const removeSavedJob = (job) => {
    setSavedJobs((current) => current.filter((item) => item.id !== job.id))
    setAnnouncement(`${job.title} removed from saved jobs.`)
  }

  const handleResumeChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setResumeName(file.name)
    setAnnouncement(`${file.name} selected for this demo. It was not uploaded to a server.`)
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-[#101c3d]">Applications</h2>
        <p className="mt-1 text-sm text-[#66738d]">Track your job applications and their status.</p>
      </div>

      {announcement && (
        <p role="status" aria-live="polite" className="rounded-xl border border-[#cfe9df] bg-[#effaf6] px-4 py-3 text-xs font-medium text-[#16856b]">
          {announcement}
        </p>
      )}

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,2.1fr)_minmax(280px,0.9fr)]">
        <section className="min-w-0">
          <div className="flex border-b border-[#e5ebf3]" role="tablist" aria-label="Application lists">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'applied'}
              onClick={() => setActiveTab('applied')}
              className={`border-b-2 px-4 py-3 text-xs font-semibold transition ${
                activeTab === 'applied' ? 'border-[#1260ed] text-[#1260ed]' : 'border-transparent text-[#52627d] hover:text-[#1260ed]'
              }`}
            >
              Applied Jobs
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'saved'}
              onClick={() => setActiveTab('saved')}
              className={`border-b-2 px-4 py-3 text-xs font-semibold transition ${
                activeTab === 'saved' ? 'border-[#1260ed] text-[#1260ed]' : 'border-transparent text-[#52627d] hover:text-[#1260ed]'
              }`}
            >
              Saved Jobs
              <span className="ml-1.5 text-[10px] text-[#8896aa]">({savedJobs.length})</span>
            </button>
          </div>

          <div className="flex flex-col gap-2.5 py-3 sm:flex-row">
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">Search applications</span>
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#8291a8]"><SearchIcon /></span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={activeTab === 'applied' ? 'Search applications...' : 'Search saved jobs...'}
                className="h-10 w-full rounded-lg border border-[#dce5f1] bg-white pl-9 pr-3 text-xs text-[#283955] outline-none placeholder:text-[#91a0b5] focus:border-[#1260ed] focus:ring-2 focus:ring-blue-100"
              />
            </label>
            {activeTab === 'applied' && (
              <>
                <label className="relative min-w-[120px]">
                  <span className="sr-only">Filter by status</span>
                  <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 w-full appearance-none rounded-lg border border-[#dce5f1] bg-white px-3 pr-8 text-xs font-medium text-[#34445f] outline-none focus:border-[#1260ed]">
                    <option value="all">All Status</option>
                    {applicationOverview.map((item) => <option key={item.label} value={item.label}>{item.label}</option>)}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-3 text-xs text-[#71809a]">⌄</span>
                </label>
                <label className="relative min-w-[130px]">
                  <span className="sr-only">Filter by role</span>
                  <select value={role} onChange={(event) => setRole(event.target.value)} className="h-10 w-full appearance-none rounded-lg border border-[#dce5f1] bg-white px-3 pr-8 text-xs font-medium text-[#34445f] outline-none focus:border-[#1260ed]">
                    <option value="all">All Roles</option>
                    {roles.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-3 text-xs text-[#71809a]">⌄</span>
                </label>
              </>
            )}
            <button
              type="button"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((open) => !open)}
              className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-3 text-xs font-semibold transition ${
                filtersOpen ? 'bg-[#1260ed] text-white' : 'bg-[#edf4ff] text-[#1260ed] hover:bg-[#e2edff]'
              }`}
            >
              <FilterIcon />
              Filters
            </button>
          </div>

          {filtersOpen && activeTab === 'applied' && (
            <div className="mb-3 flex flex-col gap-3 rounded-xl border border-[#dce7f5] bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-2 text-xs font-medium text-[#52627d]">
                Location
                <select value={location} onChange={(event) => setLocation(event.target.value)} className="h-9 max-w-[220px] rounded-lg border border-[#dce5f1] bg-white px-2 text-xs outline-none focus:border-[#1260ed]">
                  <option value="all">All Locations</option>
                  {locations.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <button type="button" onClick={resetFilters} className="self-start text-xs font-bold text-[#1260ed] hover:underline sm:self-auto">Clear filters</button>
            </div>
          )}

          {activeTab === 'applied' ? (
            <div className="overflow-hidden rounded-xl border border-[#e4ebf4] bg-white shadow-[0_2px_10px_rgba(26,50,90,0.025)]">
              <div className="hidden grid-cols-[minmax(190px,1.5fr)_minmax(75px,.65fr)_minmax(90px,.8fr)_minmax(105px,.9fr)_minmax(105px,.9fr)_74px_24px] gap-3 border-b border-[#edf1f7] bg-[#fbfcfe] px-3 py-3 text-[9px] font-semibold text-[#52627d] lg:grid">
                <span>Job Title</span><span>Company</span><span>Applied On</span><span>Status</span><span>Next Step</span><span>Action</span><span />
              </div>
              {filteredApplications.map((application) => (
                <div key={application.id} className="grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 border-b border-[#edf1f7] px-3 py-3 last:border-b-0 sm:grid-cols-[44px_minmax(0,1.4fr)_minmax(80px,.8fr)_auto] lg:grid-cols-[minmax(190px,1.5fr)_minmax(75px,.65fr)_minmax(90px,.8fr)_minmax(105px,.9fr)_minmax(105px,.9fr)_74px_24px] lg:gap-3">
                  <div className="lg:hidden"><CompanyMark item={application} /></div>
                  <div className="min-w-0 lg:col-span-1">
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="hidden lg:block"><CompanyMark item={application} compact /></div>
                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-bold leading-4 text-[#243653]">{application.title}</p>
                        <p className="mt-0.5 text-[9px] text-[#71809a]">{application.type} <span className="px-1">·</span>{application.location}</p>
                      </div>
                    </div>
                  </div>
                  <span className="hidden truncate text-[10px] text-[#52627d] sm:block">{application.company}</span>
                  <span className="hidden text-[9px] text-[#52627d] xl:block">{application.appliedOn}</span>
                  <span className={`justify-self-start rounded-md px-2 py-1 text-[9px] font-semibold ${statusStyles[application.status] ?? statusStyles.Applied}`}>{application.status}</span>
                  <span className="hidden truncate text-[9px] text-[#52627d] xl:block">{application.nextStep}</span>
                  <button type="button" onClick={() => setSelectedApplication(application)} className="h-8 rounded-md border border-[#d7e3f4] px-3 text-[10px] font-semibold text-[#1260ed] transition hover:bg-[#edf4ff]">View</button>
                  <div className="relative justify-self-end">
                    <button type="button" aria-label={`More actions for ${application.title}`} aria-expanded={openMenu === application.id} onClick={() => setOpenMenu((current) => current === application.id ? null : application.id)} className="grid h-8 w-6 place-items-center rounded text-base font-bold text-[#64748b] hover:bg-[#f1f5f9]">⋮</button>
                    {openMenu === application.id && (
                      <div className="absolute right-0 top-9 z-20 w-36 rounded-lg border border-[#e1e8f1] bg-white p-1 shadow-lg">
                        <button type="button" onClick={() => { setSelectedApplication(application); setOpenMenu(null) }} className="w-full rounded px-2.5 py-2 text-left text-[10px] text-[#34445f] hover:bg-[#f5f8fc]">View details</button>
                        {application.status !== 'Withdrawn' && application.status !== 'Rejected' && (
                          <button type="button" onClick={() => withdrawApplication(application)} className="w-full rounded px-2.5 py-2 text-left text-[10px] text-[#d93434] hover:bg-[#fff5f5]">Withdraw application</button>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="col-start-2 col-end-4 flex gap-3 text-[9px] text-[#71809a] sm:hidden">
                    <span>{application.company}</span><span>{application.appliedOn}</span>
                  </div>
                  <p className="col-start-2 col-end-4 text-[9px] text-[#71809a] xl:hidden">Next: {application.nextStep}</p>
                </div>
              ))}
              {filteredApplications.length === 0 && (
                <div className="px-5 py-12 text-center">
                  <p className="text-sm font-bold text-[#283955]">No applications found</p>
                  <p className="mt-1 text-xs text-[#71809a]">Try another search or clear your filters.</p>
                  <button type="button" onClick={resetFilters} className="mt-3 text-xs font-bold text-[#1260ed] hover:underline">Clear filters</button>
                </div>
              )}
            </div>
          ) : (
            <div className="divide-y divide-[#edf1f7] overflow-hidden rounded-xl border border-[#e4ebf4] bg-white px-4 shadow-[0_2px_10px_rgba(26,50,90,0.025)]">
              {filteredSavedJobs.map((job) => (
                <div key={job.id} className="flex items-center gap-3 py-3">
                  <CompanyMark item={job} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-bold text-[#243653]">{job.title}</p>
                    <p className="mt-1 text-[9px] text-[#71809a]">{job.company}<span className="px-1.5">·</span>{job.location}</p>
                  </div>
                  <button type="button" onClick={() => removeSavedJob(job)} aria-label={`Remove ${job.title} from saved jobs`} className="grid h-8 w-8 place-items-center rounded-lg text-[#1260ed] hover:bg-[#edf4ff]">
                    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-4 w-4"><path d="M5 3.8A1.8 1.8 0 0 1 6.8 2h6.4A1.8 1.8 0 0 1 15 3.8V18l-5-3.2L5 18V3.8Z" /></svg>
                  </button>
                </div>
              ))}
              {filteredSavedJobs.length === 0 && <p className="py-12 text-center text-xs text-[#71809a]">No saved jobs match your search.</p>}
            </div>
          )}
          <div className="flex justify-center pt-2">
            <button type="button" onClick={() => setActiveTab('applied')} className="rounded-lg bg-[#edf4ff] px-5 py-2.5 text-[10px] font-bold text-[#1260ed] transition hover:bg-[#e2edff]">
              View All Applications
            </button>
          </div>
        </section>

        <aside className="space-y-3">
          <section className="rounded-xl border border-[#e4ebf4] bg-white p-4 shadow-[0_2px_10px_rgba(26,50,90,0.025)]">
            <h3 className="text-xs font-bold text-[#172744]">Application Overview</h3>
            <div className="mt-4 flex items-center gap-4">
              <div className="grid h-24 w-24 shrink-0 place-items-center rounded-full" style={{ background: 'conic-gradient(#3978f6 0% 28.6%, #25b889 28.6% 46.5%, #8b5cf6 46.5% 60.8%, #f5a623 60.8% 82.2%, #ef4444 82.2% 92.9%, #a3afc2 92.9% 100%)' }}>
                <div className="grid h-[68px] w-[68px] place-content-center rounded-full bg-white text-center">
                  <span className="text-lg font-extrabold text-[#172744]">28</span>
                  <span className="text-[8px] text-[#71809a]">Total Applications</span>
                </div>
              </div>
              <ul className="min-w-0 flex-1 space-y-2.5">
                {applicationOverview.map((item) => (
                  <li key={item.label} className="flex items-center gap-2 text-[9px] text-[#52627d]">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="min-w-0 flex-1">{item.label}</span>
                    <strong className="text-[#34445f]">{item.count}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="rounded-xl border border-[#e4ebf4] bg-white p-4 shadow-[0_2px_10px_rgba(26,50,90,0.025)]">
            <h3 className="text-xs font-bold text-[#172744]">Quick Actions</h3>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-[#edf1f7] p-2.5">
                <div className="flex items-start gap-2">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-[#edf4ff] text-sm text-[#1260ed]" aria-hidden="true">↑</span>
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold text-[#34445f]">Upload New Resume</p>
                    <p className="mt-0.5 text-[8px] leading-3 text-[#71809a]">Update your resume for better matching.</p>
                  </div>
                </div>
                <input ref={resumeInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleResumeChange} className="sr-only" aria-label="Choose resume file" />
                <button type="button" onClick={() => resumeInputRef.current?.click()} className="mt-2 w-full rounded-md bg-[#edf4ff] px-2 py-1.5 text-[9px] font-bold text-[#1260ed] transition hover:bg-[#e2edff]">
                  {resumeName ? 'Change File' : 'Upload'}
                </button>
                {resumeName && <p className="mt-1 truncate text-[8px] text-[#71809a]" title={resumeName}>{resumeName}</p>}
              </div>
              <div className="rounded-lg border border-[#edf1f7] p-2.5">
                <div className="flex items-start gap-2">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-[#f3efff] text-sm text-[#7543c5]" aria-hidden="true">▤</span>
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold text-[#34445f]">Application Tips</p>
                    <p className="mt-0.5 text-[8px] leading-3 text-[#71809a]">Learn how to improve your applications.</p>
                  </div>
                </div>
                <button type="button" onClick={() => setTipsOpen(true)} className="mt-2 w-full rounded-md bg-[#edf4ff] px-2 py-1.5 text-[9px] font-bold text-[#1260ed] transition hover:bg-[#e2edff]">View Tips</button>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#e4ebf4] bg-white p-4 shadow-[0_2px_10px_rgba(26,50,90,0.025)]">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-bold text-[#172744]">Saved Jobs ({savedJobs.length})</h3>
              <button type="button" onClick={() => setActiveTab('saved')} className="text-[9px] font-semibold text-[#1260ed] hover:underline">View All</button>
            </div>
            <ul className="mt-2 divide-y divide-[#edf1f7]">
              {savedJobs.slice(0, 4).map((job) => (
                <li key={job.id} className="flex items-center gap-2 py-2">
                  <CompanyMark item={job} compact />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[9px] font-bold text-[#34445f]">{job.title}</p>
                    <p className="mt-0.5 truncate text-[8px] text-[#71809a]">{job.company}<span className="px-1">·</span>{job.location}</p>
                  </div>
                  <span className="text-sm text-[#1260ed]" aria-hidden="true">▮</span>
                </li>
              ))}
            </ul>
            <Link to="/student/recommended-jobs" className="mt-2 flex h-8 items-center justify-center rounded-md bg-[#edf4ff] text-[9px] font-bold text-[#1260ed] transition hover:bg-[#e2edff]">
              Explore More Jobs
            </Link>
          </section>
        </aside>
      </div>

      {selectedApplication && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/40 p-4" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSelectedApplication(null)
        }}>
          <section role="dialog" aria-modal="true" aria-labelledby="application-detail-title" className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <CompanyMark item={selectedApplication} />
                <div>
                  <h3 id="application-detail-title" className="text-sm font-bold text-[#172744]">{selectedApplication.title}</h3>
                  <p className="mt-1 text-xs text-[#71809a]">{selectedApplication.company}</p>
                </div>
              </div>
              <button type="button" onClick={() => setSelectedApplication(null)} aria-label="Close application details" className="grid h-8 w-8 place-items-center rounded-lg text-lg text-[#64748b] hover:bg-[#f1f5f9]">×</button>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-4 text-xs">
              <div><dt className="text-[#71809a]">Status</dt><dd className={`mt-1 inline-flex rounded-md px-2 py-1 font-semibold ${statusStyles[selectedApplication.status]}`}>{selectedApplication.status}</dd></div>
              <div><dt className="text-[#71809a]">Applied on</dt><dd className="mt-1 font-semibold text-[#34445f]">{selectedApplication.appliedOn}</dd></div>
              <div><dt className="text-[#71809a]">Location</dt><dd className="mt-1 font-semibold text-[#34445f]">{selectedApplication.location}</dd></div>
              <div><dt className="text-[#71809a]">Next step</dt><dd className="mt-1 font-semibold text-[#34445f]">{selectedApplication.nextStep}</dd></div>
            </dl>
            <p className="mt-5 rounded-lg bg-[#f7f9fc] p-3 text-[10px] leading-4 text-[#71809a]">This is a sample application record for the SYNAPSE student demo.</p>
          </section>
        </div>
      )}

      {tipsOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/40 p-4" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setTipsOpen(false)
        }}>
          <section role="dialog" aria-modal="true" aria-labelledby="application-tips-title" className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <h3 id="application-tips-title" className="text-base font-bold text-[#172744]">Application Tips</h3>
              <button type="button" onClick={() => setTipsOpen(false)} aria-label="Close application tips" className="grid h-8 w-8 place-items-center rounded-lg text-lg text-[#64748b] hover:bg-[#f1f5f9]">×</button>
            </div>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-xs leading-5 text-[#52627d]">
              <li>Tailor your resume to highlight skills that match the job description.</li>
              <li>Keep your contact details and profile information up to date.</li>
              <li>Prepare examples that demonstrate your impact and problem-solving.</li>
              <li>Check your application status regularly and follow up professionally.</li>
            </ul>
            <button type="button" onClick={() => setTipsOpen(false)} className="mt-5 h-9 rounded-lg bg-[#1260ed] px-4 text-xs font-bold text-white hover:bg-[#0d52cf]">Got it</button>
          </section>
        </div>
      )}

      <p className="sr-only">Application and saved-job data are fictional demonstrations. Resume selection stays in this browser and is not uploaded.</p>
    </div>
  )
}

export default ApplicationsPage
