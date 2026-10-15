import { Link } from 'react-router-dom'
import { BookmarkIcon } from './RecruiterIcons.jsx'

const toneGradients = {
  blue: 'from-[#1260ed] to-[#1764ed]',
  purple: 'from-[#7c3aed] to-[#9333ea]',
  emerald: 'from-[#059669] to-[#10b981]',
}

function CandidateCard({ candidate, onToggleShortlist }) {
  const gradient = toneGradients[candidate.tone] || toneGradients.blue

  return (
    <article className="flex h-full flex-col justify-between rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] transition-all hover:border-[#c9defa] hover:shadow-[0_6px_20px_rgba(20,40,80,0.08)] sm:p-6">
      <div>
        {/* Top Header: Avatar, Name, Role, and Match percentage */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-xs font-bold text-white shadow-xs`}
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

          {/* Skill-match percentage clearly labelled as demo data */}
          <span
            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-0.5 text-[11.5px] font-bold text-emerald-700"
            title="Demo skill-match calculation for preview purposes"
          >
            <span>{candidate.matchScore}% Match</span>
            <span className="text-[9px] font-semibold uppercase tracking-wider text-emerald-600/80">
              (Demo)
            </span>
          </span>
        </div>

        {/* Education & Experience info */}
        <div className="mt-3.5 flex items-start gap-2 rounded-xl bg-[#f8fbff] p-2.5 border border-[#edf3fc]">
          <svg
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            className="mt-0.5 h-4 w-4 shrink-0 text-[#677b99]"
          >
            <path
              d="M10 3 2.5 7.5 10 12l7.5-4.5L10 3ZM4.5 9.7v4.6c0 1.9 2.5 3.2 5.5 3.2s5.5-1.3 5.5-3.2V9.7"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-xs leading-relaxed text-[#50617c]">
            {candidate.experience}
          </p>
        </div>

        {/* Technical skills badges */}
        <div className="mt-4">
          <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Key Technical Skills
          </div>
          <div className="flex flex-wrap gap-1.5">
            {candidate.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-lg border border-[#e1eaf5] bg-[#f0f4fa] px-2.5 py-1 text-[11.5px] font-medium text-[#41516c]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Actions: Shortlist and View Profile */}
      <div className="mt-5 flex items-center gap-2.5 border-t border-[#f0f4fa] pt-4">
        {/* Shortlist action */}
        <button
          type="button"
          onClick={() => onToggleShortlist(candidate.id)}
          aria-pressed={candidate.shortlisted}
          className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
            candidate.shortlisted
              ? 'border border-[#b8d6fc] bg-[#edf4ff] text-[#1260ed] shadow-xs'
              : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <BookmarkIcon
            className="h-4 w-4"
            filled={candidate.shortlisted}
          />
          <span>{candidate.shortlisted ? 'Shortlisted' : 'Shortlist'}</span>
        </button>

        {/* View Profile action */}
        <Link
          to="/recruiter/candidates"
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#1260ed] px-3.5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700"
        >
          <span>View Profile</span>
          <svg
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className="h-3.5 w-3.5"
          >
            <path
              d="M6 3.5 10.5 8 6 12.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </article>
  )
}

export default CandidateCard
