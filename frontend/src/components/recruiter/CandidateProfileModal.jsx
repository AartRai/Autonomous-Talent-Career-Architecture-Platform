import { useEffect, useRef } from 'react'
import { CloseIcon, BookmarkIcon } from './RecruiterIcons.jsx'

const toneGradients = {
  blue: 'from-[#1260ed] to-[#1764ed]',
  purple: 'from-[#7c3aed] to-[#9333ea]',
  emerald: 'from-[#059669] to-[#10b981]',
  amber: 'from-[#d97706] to-[#f59e0b]',
  rose: 'from-[#e11d48] to-[#f43f5e]',
}

function CandidateProfileModal({
  candidate,
  isShortlisted = false,
  onToggleShortlist,
  onClose,
}) {
  const closeButtonRef = useRef(null)

  // Escape key handler and body scroll lock
  useEffect(() => {
    if (!candidate) return

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
  }, [candidate, onClose])

  if (!candidate) return null

  const gradient = toneGradients[candidate.tone] || toneGradients.blue

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="candidate-profile-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop overlay */}
      <div
        role="presentation"
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Container */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl border border-[#e2ecf9] bg-white shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-[#edf4fc] px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-sm font-extrabold text-white shadow-xs`}
              aria-label={`${candidate.name} initials avatar`}
            >
              {candidate.initials}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2
                  id="candidate-profile-modal-title"
                  className="truncate text-lg font-bold text-[#101c3d] sm:text-xl"
                >
                  {candidate.name}
                </h2>
                {isShortlisted && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-[#edf4ff] px-2.5 py-0.5 text-[11px] font-bold text-[#1260ed]">
                    <BookmarkIcon className="h-3 w-3" filled={true} />
                    Shortlisted
                  </span>
                )}
                <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-[#1260ed]">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  Demo Profile
                </span>
              </div>
              <p className="truncate text-xs font-semibold text-[#1260ed] sm:text-sm">
                {candidate.role}
              </p>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close candidate profile modal"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6 sm:px-8">
          {/* Quick Details Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Education */}
            <div className="rounded-xl border border-[#edf3fc] bg-[#f8fbff] p-3.5 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-[#71829e]">
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                  className="h-4 w-4 text-[#677b99]"
                >
                  <path
                    d="M10 3 2.5 7.5 10 12l7.5-4.5L10 3ZM4.5 9.7v4.6c0 1.9 2.5 3.2 5.5 3.2s5.5-1.3 5.5-3.2V9.7"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Education</span>
              </div>
              <p className="mt-1.5 font-bold text-[#101c3d] leading-snug">
                {candidate.education}
              </p>
            </div>

            {/* Experience Level */}
            <div className="rounded-xl border border-[#edf3fc] bg-[#f8fbff] p-3.5 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-[#71829e]">
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                  className="h-4 w-4 text-[#677b99]"
                >
                  <rect x="3" y="6" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M7 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.4" />
                </svg>
                <span>Experience Level</span>
              </div>
              <p className="mt-1.5 font-bold text-[#101c3d]">
                {candidate.experienceYears || candidate.experienceLevel}
              </p>
            </div>

            {/* Location & Work Mode */}
            <div className="rounded-xl border border-[#edf3fc] bg-[#f8fbff] p-3.5 text-xs sm:col-span-2">
              <div className="flex items-center gap-1.5 font-semibold text-[#71829e]">
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                  className="h-4 w-4 text-[#677b99]"
                >
                  <path
                    d="M10 17s5-5.2 5-9a5 5 0 1 0-10 0c0 3.8 5 9 5 9Z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                  <circle cx="10" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.4" />
                </svg>
                <span>Location & Work Preference</span>
              </div>
              <p className="mt-1.5 font-bold text-[#101c3d]">
                {candidate.location} ({candidate.workMode})
              </p>
            </div>
          </div>

          {/* Professional Summary */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#50617c]">
              Professional Summary
            </h3>
            <div className="mt-2 rounded-xl border border-[#edf3fc] bg-white p-4 shadow-xs">
              <p className="text-sm leading-relaxed text-[#41516c]">
                {candidate.summary}
              </p>
            </div>
          </div>

          {/* Technical Skills & Competencies */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#50617c]">
              Technical Skills & Competencies
            </h3>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {candidate.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-[#cbe0fc] bg-[#edf4ff] px-3 py-1.5 text-xs font-semibold text-[#1260ed]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Experience Highlights / Relevant Projects */}
          {candidate.highlights && candidate.highlights.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#50617c]">
                Key Projects & Experience Highlights
              </h3>
              <div className="mt-2.5 space-y-3">
                {candidate.highlights.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-[#edf3fc] bg-[#f8fbff] p-4 text-xs transition hover:border-[#cde0fa]"
                  >
                    <h4 className="font-bold text-[#101c3d] text-sm">
                      {item.title}
                    </h4>
                    <p className="mt-1.5 leading-relaxed text-[#50617c]">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Demonstration Notice */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-500">
            <strong>Demonstration Profile:</strong> This fictional candidate profile is provided for
            recruiter UI evaluation and layout review. Live candidate data, direct messaging, and AI
            ranking algorithms are not active.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-[#edf4fc] bg-slate-50/60 px-6 py-4 sm:px-8">
          {onToggleShortlist && (
            <button
              type="button"
              onClick={() => onToggleShortlist(candidate.id)}
              aria-pressed={isShortlisted}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                isShortlisted
                  ? 'border border-[#b8d6fc] bg-[#edf4ff] text-[#1260ed] shadow-xs'
                  : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <BookmarkIcon className="h-4 w-4" filled={isShortlisted} />
              <span>{isShortlisted ? 'Shortlisted' : 'Shortlist Candidate'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  )
}

export default CandidateProfileModal
