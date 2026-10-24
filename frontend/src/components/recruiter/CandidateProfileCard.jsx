import { BookmarkIcon } from './RecruiterIcons.jsx'

const toneGradients = {
  blue: 'from-[#1260ed] to-[#1764ed]',
  purple: 'from-[#7c3aed] to-[#9333ea]',
  emerald: 'from-[#059669] to-[#10b981]',
  amber: 'from-[#d97706] to-[#f59e0b]',
  rose: 'from-[#e11d48] to-[#f43f5e]',
}

function CandidateProfileCard({
  candidate,
  isShortlisted = false,
  onToggleShortlist,
  onViewProfile,
}) {
  const gradient = toneGradients[candidate.tone] || toneGradients.blue

  return (
    <article className="flex h-full flex-col justify-between rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] transition-all hover:border-[#c9defa] hover:shadow-[0_6px_20px_rgba(20,40,80,0.08)] sm:p-6">
      <div>
        {/* Top Header: Avatar, Name, Career Focus, and Demo / Shortlisted Labels */}
        <div className="flex flex-wrap items-start justify-between gap-2.5">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-xs font-extrabold text-white shadow-xs`}
              aria-label={`${candidate.name} initials`}
            >
              {candidate.initials}
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-[15px] font-bold text-[#101c3d]">
                {candidate.name}
              </h3>
              <p className="truncate text-xs font-semibold text-[#1260ed]">
                {candidate.role}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {isShortlisted && (
              <span
                className="inline-flex shrink-0 items-center gap-1 rounded-full border border-blue-200 bg-[#edf4ff] px-2.5 py-0.5 text-[11px] font-bold text-[#1260ed]"
                title="Candidate is shortlisted"
              >
                <BookmarkIcon className="h-3 w-3" filled={true} />
                <span>Shortlisted</span>
              </span>
            )}
            <span
              className="inline-flex shrink-0 items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-600"
              title="Demonstration profile record"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              <span>Demo Profile</span>
            </span>
          </div>
        </div>

        {/* Education, Experience & Location Grid */}
        <div className="mt-4 space-y-2 rounded-xl border border-[#edf3fc] bg-[#f8fbff] p-3 text-xs text-[#50617c]">
          {/* Education */}
          <div className="flex items-start gap-2">
            <svg
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#677b99]"
            >
              <path
                d="M10 3 2.5 7.5 10 12l7.5-4.5L10 3ZM4.5 9.7v4.6c0 1.9 2.5 3.2 5.5 3.2s5.5-1.3 5.5-3.2V9.7"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="truncate leading-relaxed">{candidate.education}</span>
          </div>

          {/* Experience & Location */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[#66768e]">
            {/* Experience */}
            <div className="flex items-center gap-1.5">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
                className="h-3.5 w-3.5 text-[#677b99]"
              >
                <rect x="3" y="6" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
                <path d="M7 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.4" />
              </svg>
              <span>{candidate.experienceYears || candidate.experienceLevel}</span>
            </div>

            {/* Location & Work Mode */}
            <div className="flex items-center gap-1.5">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
                className="h-3.5 w-3.5 text-[#677b99]"
              >
                <path
                  d="M10 17s5-5.2 5-9a5 5 0 1 0-10 0c0 3.8 5 9 5 9Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <circle cx="10" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.4" />
              </svg>
              <span>
                {candidate.location} • {candidate.workMode}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Summary Excerpt */}
        {candidate.summary && (
          <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-[#50617c]">
            {candidate.summary}
          </p>
        )}

        {/* Technical skills tags */}
        <div className="mt-4">
          <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Skills & Competencies
          </div>
          <div className="flex flex-wrap gap-1.5">
            {candidate.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-lg border border-[#e1eaf5] bg-[#f0f4fa] px-2.5 py-1 text-[11px] font-medium text-[#41516c]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Action Area: Shortlist and View Profile */}
      <div className="mt-5 flex items-center gap-2.5 border-t border-[#f0f4fa] pt-4">
        {onToggleShortlist && (
          <button
            type="button"
            onClick={() => onToggleShortlist(candidate.id)}
            aria-pressed={isShortlisted}
            aria-label={
              isShortlisted
                ? `Remove ${candidate.name} from shortlist`
                : `Add ${candidate.name} to shortlist`
            }
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
              isShortlisted
                ? 'border border-[#b8d6fc] bg-[#edf4ff] text-[#1260ed] shadow-xs'
                : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <BookmarkIcon className="h-4 w-4" filled={isShortlisted} />
            <span>{isShortlisted ? 'Shortlisted' : 'Shortlist'}</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => onViewProfile?.(candidate)}
          aria-label={`View full profile of ${candidate.name}`}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#1260ed] px-3.5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <span>View Profile</span>
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-3.5 w-3.5">
            <path
              d="M6 3.5 10.5 8 6 12.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </article>
  )
}

export default CandidateProfileCard
