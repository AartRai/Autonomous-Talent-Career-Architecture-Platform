import { Link } from 'react-router-dom'

function PlaceholderSection({ title }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-[#101c3d] sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1 text-sm text-[#66738d]">
          Recruiter workspace module
        </p>
      </div>

      <div className="flex min-h-[380px] flex-col items-center justify-center rounded-2xl border border-[#e4ebf5] bg-white p-8 text-center shadow-xs">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f0f6ff] text-[#1260ed]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="h-7 w-7"
          >
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
            <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
        <h2 className="mt-4 text-lg font-bold text-[#101c3d]">
          {title} Module
        </h2>
        <p className="mt-2 max-w-sm text-sm text-[#66738d]">
          This section is a placeholder and will be implemented in subsequent development phases.
        </p>
        <Link
          to="/recruiter"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1260ed] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default PlaceholderSection
