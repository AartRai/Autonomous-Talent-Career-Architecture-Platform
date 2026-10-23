import { useLocation } from 'react-router-dom'
import {
  StudentBellIcon,
  StudentMenuIcon,
  StudentSearchIcon,
} from './StudentIcons.jsx'

function StudentNavbar({ onMenuClick }) {
  const { pathname } = useLocation()
  const pageTitles = {
    '/student/profile': 'Profile',
    '/student/skill-analysis': 'Skill Analysis',
    '/student/recommended-jobs': 'Recommended Jobs',
    '/student/recommended-courses': 'Recommended Courses',
  }
  const pageTitle = pageTitles[pathname] ?? 'Student Dashboard'

  return (
    <header className="sticky top-0 z-30 flex h-[72px] w-full items-center justify-between border-b border-[#e2ecf9] bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 lg:hidden"
          aria-label="Open sidebar navigation"
        >
          <StudentMenuIcon />
        </button>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-[#101c3d] sm:text-xl">
            {pageTitle}
          </h1>
          <p className="hidden text-[11px] font-medium text-[#71829e] sm:block">
            Your personalized career workspace
          </p>
        </div>
      </div>

      <div className="mx-4 hidden max-w-md flex-1 md:block">
        <label className="relative block">
          <span className="sr-only">Search jobs, courses, or skills</span>
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8a9bb5]">
            <StudentSearchIcon className="h-4 w-4" />
          </span>
          <input
            type="search"
            placeholder="Search jobs, courses, or skills..."
            className="h-10 w-full rounded-xl border border-[#cdd9ec] bg-[#f8fbff] pl-10 pr-4 text-xs font-medium text-slate-800 placeholder:text-[#97a7bf] transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </label>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#e4ebf5] bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          aria-label="View notifications"
          title="Notifications coming soon"
        >
          <StudentBellIcon />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#1260ed] ring-2 ring-white" />
        </button>
        <div className="h-8 w-px bg-[#e5edf8]" aria-hidden="true" />
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1260ed] to-[#37bda8] text-xs font-extrabold text-white shadow-[0_3px_10px_rgba(18,96,237,0.2)]">
            AR
          </div>
          <div className="hidden text-left xl:block">
            <div className="text-[13px] font-bold leading-tight text-[#101c3d]">Aarti Rai</div>
            <div className="text-[11px] font-medium text-[#71829e]">Student</div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default StudentNavbar
