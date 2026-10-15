import { Link } from 'react-router-dom'
import CandidateCard from './CandidateCard.jsx'
import { ChevronRightIcon } from './RecruiterIcons.jsx'

function RecentCandidatesSection({ candidates, loading, onToggleShortlist }) {
  return (
    <section aria-label="Recent Candidates" className="space-y-4">
      {/* Header with Title, Subtitle, and View All link */}
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#101c3d] sm:text-2xl">
            Recent Candidates
          </h2>
          <p className="mt-0.5 text-xs text-[#66738d] sm:text-sm">
            Discover candidates who match your hiring needs.
          </p>
        </div>

        <Link
          to="/recruiter/candidates"
          className="group inline-flex items-center gap-1 self-start text-xs font-semibold text-[#1260ed] transition hover:text-blue-700 sm:self-center sm:text-sm"
        >
          <span>View All</span>
          <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading && candidates.length === 0
          ? Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="h-[340px] animate-pulse rounded-2xl border border-[#e2ecf9] bg-white p-6 shadow-[0_2px_12px_rgba(20,40,80,0.04)]"
              />
            ))
          : candidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                onToggleShortlist={onToggleShortlist}
              />
            ))}
      </div>
    </section>
  )
}

export default RecentCandidatesSection
