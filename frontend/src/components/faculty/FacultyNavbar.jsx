import { Link } from 'react-router-dom'
import { FacultyBellIcon, MenuIcon, SearchIcon } from './FacultyIcons.jsx'

function FacultyNavbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex h-18 w-full items-center justify-between border-b border-[#e2ecf9] bg-white px-4 sm:px-6 lg:px-8">
      {/* Left: Mobile hamburger menu & Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 lg:hidden"
          aria-label="Open sidebar navigation"
        >
          <MenuIcon className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-lg font-bold tracking-tight text-[#101c3d] sm:text-xl">
            Faculty Portal
          </h1>
          <p className="hidden text-[11px] font-medium text-[#71829e] sm:block">
            Academic Research & Industry Collaboration
          </p>
        </div>
      </div>

      {/* Center: Search input */}
      <div className="mx-4 hidden max-w-md flex-1 md:block">
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8a9bb5]">
            <SearchIcon className="h-4 w-4" />
          </span>
          <input
            type="search"
            placeholder="Search opportunities, grants, or collaborations..."
            className="h-10 w-full rounded-xl border border-[#cdd9ec] bg-[#f8fbff] pl-10 pr-4 text-xs font-medium text-slate-800 placeholder:text-[#97a7bf] transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Right: Notification & Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notification Bell */}
        <Link
          to="/faculty/notifications"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#e4ebf5] bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          aria-label="View faculty notifications"
          title="5 Unread Notifications"
        >
          <FacultyBellIcon className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#1260ed] ring-2 ring-white" />
        </Link>

        {/* Vertical divider */}
        <div className="h-8 w-px bg-[#e5edf8]" aria-hidden="true" />

        {/* Faculty Profile / Avatar */}
        <Link
          to="/faculty/profile"
          className="group flex items-center gap-3 rounded-xl p-1 transition hover:bg-slate-50 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1260ed]"
          aria-label="View faculty profile and expertise"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1260ed] to-[#2563eb] text-xs font-extrabold text-white shadow-[0_3px_10px_rgba(18,96,237,0.25)]">
            DR
          </div>
          <div className="hidden text-left xl:block">
            <div className="text-[13px] font-bold leading-tight text-[#101c3d] group-hover:text-[#1260ed] transition-colors">
              Dr. Radhika Sharma
            </div>
            <div className="text-[11px] font-medium text-[#71829e]">
              Professor & Research Lead
            </div>
          </div>
        </Link>
      </div>
    </header>
  )
}

export default FacultyNavbar
