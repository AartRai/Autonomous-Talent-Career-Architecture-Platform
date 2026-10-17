import { useEffect, useRef } from 'react'
import { CloseIcon, ApplicationsIcon } from './RecruiterIcons.jsx'

const toneGradients = {
  blue: 'from-[#1260ed] to-[#1764ed]',
  purple: 'from-[#7c3aed] to-[#9333ea]',
  emerald: 'from-[#059669] to-[#10b981]',
  amber: 'from-[#d97706] to-[#f59e0b]',
  rose: 'from-[#e11d48] to-[#f43f5e]',
}

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

function ApplicationDetailsModal({ application, onStatusChange, onClose }) {
  const closeButtonRef = useRef(null)

  // Keyboard Escape listener and body scroll lock
  useEffect(() => {
    if (!application) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    // Focus close button on mount for keyboard accessibility
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [application, onClose])

  if (!application) return null

  const gradient = toneGradients[application.tone] || toneGradients.blue

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="application-details-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop overlay */}
      <div
        role="presentation"
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog Container */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl border border-[#e2ecf9] bg-white shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-[#edf4fc] px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-sm font-extrabold text-white shadow-xs`}
              aria-label={`${application.candidateName} avatar initials`}
            >
              {application.initials}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2
                  id="application-details-title"
                  className="truncate text-lg font-bold text-[#101c3d] sm:text-xl"
                >
                  {application.candidateName}
                </h2>
                <StatusBadge status={application.status} />
                <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#1260ed]">
                  #{application.id}
                </span>
              </div>
              <p className="truncate text-xs font-semibold text-[#66738d] sm:text-sm">
                Applied for{' '}
                <span className="text-[#1260ed] font-bold">
                  {application.appliedJob}
                </span>
              </p>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            aria-label="Close application details modal"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-6">
          {/* Status Actions Bar */}
          <div className="rounded-2xl border border-[#d6e6fe] bg-[#f8fbff] p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#101c3d]">
                  Update Application Status
                </p>
                <p className="text-xs text-[#66738d] mt-0.5">
                  Select a new stage to move candidate across the hiring pipeline
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-white px-2.5 py-0.5 text-[10px] font-bold text-[#1260ed]">
                Demo Mode • Local State
              </span>
            </div>

            <div className="mt-3.5 flex flex-wrap gap-2">
              {allStatuses.map((st) => {
                const isCurrent = application.status === st
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => onStatusChange && onStatusChange(application.id, st)}
                    disabled={isCurrent}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      isCurrent
                        ? 'bg-[#1260ed] text-white shadow-xs cursor-default ring-2 ring-blue-200'
                        : 'border border-[#d6e4f7] bg-white text-[#17335e] hover:border-[#1260ed] hover:bg-[#edf4ff]'
                    }`}
                    aria-pressed={isCurrent}
                    aria-label={`Set status to ${st}`}
                  >
                    {isCurrent && (
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-3.5 w-3.5">
                        <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    <span>{st}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Demo Data Disclaimer Banner */}
          <div className="flex items-start gap-2.5 rounded-xl border border-blue-100 bg-[#f0f6ff] p-3 text-xs text-[#1e429f]">
            <ApplicationsIcon className="h-4 w-4 shrink-0 mt-0.5 text-[#1260ed]" />
            <div>
              <strong className="font-semibold text-[#101c3d]">Demonstration Record:</strong>{' '}
              Status changes update immediate frontend session state and synchronize across the dashboard. Changes are not persisted to a backend database.
            </div>
          </div>

          {/* Application Metadata Grid */}
          <div className="grid grid-cols-1 gap-4 rounded-2xl border border-[#e2ecf9] bg-[#f8fbff] p-4 text-xs sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#66738d]">
                Applied Position
              </p>
              <p className="mt-1 font-bold text-sm text-[#101c3d]">
                {application.appliedJob}
              </p>
              <p className="text-[#66738d]">{application.department}</p>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#66738d]">
                Application Date
              </p>
              <p className="mt-1 font-bold text-sm text-[#101c3d]">
                {application.applicationDate}
              </p>
              <p className="text-[#66738d]">Application ID: #{application.id}</p>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#66738d]">
                Candidate Email
              </p>
              <p className="mt-1 font-semibold text-xs text-[#1260ed]">
                {application.email}
              </p>
              <p className="text-[#66738d]">Verified student demo email</p>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#66738d]">
                Location & Work Mode
              </p>
              <p className="mt-1 font-semibold text-xs text-[#101c3d]">
                {application.location} • {application.workMode}
              </p>
              <p className="text-[#66738d]">Flexible availability</p>
            </div>
          </div>

          {/* Education & Experience Highlights */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Qualifications & Experience
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[#e2ecf9] bg-white p-3.5">
                <p className="text-[11px] font-bold text-slate-400">Education</p>
                <p className="mt-1 font-semibold text-xs text-[#101c3d]">
                  {application.education}
                </p>
              </div>
              <div className="rounded-xl border border-[#e2ecf9] bg-white p-3.5">
                <p className="text-[11px] font-bold text-slate-400">Experience</p>
                <p className="mt-1 font-semibold text-xs text-[#101c3d]">
                  {application.experience}
                </p>
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          {application.summary && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Professional Summary
              </h3>
              <p className="rounded-xl border border-[#eef4fc] bg-white p-4 text-xs leading-relaxed text-[#415170]">
                {application.summary}
              </p>
            </div>
          )}

          {/* Applicant Cover Note */}
          {application.coverNote && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Applicant Statement / Note
              </h3>
              <p className="rounded-xl border border-[#eef4fc] bg-[#fdfefe] p-4 text-xs italic leading-relaxed text-[#415170]">
                &ldquo;{application.coverNote}&rdquo;
              </p>
            </div>
          )}

          {/* Technical Skills List */}
          {application.skills && application.skills.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Verified Skills & Technologies
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {application.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center rounded-lg border border-[#d6e6fe] bg-[#edf4ff] px-2.5 py-1 text-xs font-semibold text-[#1260ed]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-[#edf4fc] bg-[#f8fbff] px-6 py-4 sm:px-8">
          <div className="flex items-center gap-1.5 text-xs text-[#66738d]">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Interactive Demo Session • In-Memory Updates</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#d6e4f7] bg-white px-5 py-2 text-xs font-bold text-[#101c3d] shadow-2xs hover:bg-slate-50 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ApplicationDetailsModal
