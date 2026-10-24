import { Link } from 'react-router-dom'

function FacultyPlaceholderPage({ title, description, category = 'Faculty Workspace' }) {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#66738d] sm:text-sm">
        <Link
          to="/faculty"
          className="font-medium transition hover:text-[#1260ed] hover:underline focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1260ed] rounded"
        >
          Faculty Dashboard
        </Link>
        <span className="text-slate-300" aria-hidden="true">/</span>
        <span className="font-semibold text-[#101c3d]" aria-current="page">
          {title}
        </span>
      </nav>

      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-[#101c3d] sm:text-3xl">
            {title}
          </h1>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50 px-3 py-0.5 text-xs font-semibold text-[#1260ed]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#1260ed]" />
            Under Development
          </span>
        </div>
        <p className="mt-1 text-xs text-[#66738d] sm:text-sm">
          {description || `${category} module for faculty members and researchers.`}
        </p>
      </div>

      {/* Placeholder Body */}
      <div className="flex min-h-[380px] flex-col items-center justify-center rounded-2xl border border-[#e4ebf5] bg-white p-8 text-center shadow-xs">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf5ff] text-[#1260ed]">
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
        <p className="mt-2 max-w-md text-xs text-[#66738d] sm:text-sm">
          This faculty module is scheduled for full implementation in the upcoming iteration. Functional routing and layout integration are active.
        </p>
        <Link
          to="/faculty"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1260ed] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1260ed]"
        >
          Return to Faculty Dashboard
        </Link>
      </div>
    </div>
  )
}

export default FacultyPlaceholderPage
