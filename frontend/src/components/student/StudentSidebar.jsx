import { Link, NavLink } from 'react-router-dom'
import { BrandMark } from '../../components.jsx'
import {
  StudentApplicationsIcon,
  StudentBellIcon,
  StudentCloseIcon,
  StudentCoursesIcon,
  StudentDashboardIcon,
  StudentJobsIcon,
  StudentProfileIcon,
  StudentSkillIcon,
} from './StudentIcons.jsx'

const studentNavItems = [
  { name: 'Dashboard', icon: StudentDashboardIcon, to: '/student' },
  { name: 'Profile', icon: StudentProfileIcon, to: '/student/profile' },
  { name: 'Skill Analysis', icon: StudentSkillIcon },
  { name: 'Recommended Jobs', icon: StudentJobsIcon },
  { name: 'Recommended Courses', icon: StudentCoursesIcon },
  { name: 'Applications', icon: StudentApplicationsIcon },
  { name: 'Notifications', icon: StudentBellIcon },
]

function StudentSidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          role="presentation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        aria-label="Student sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#e2ecf9] bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:shadow-none'
        }`}
      >
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-[#eef4fc] px-6">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-[#17335e] transition hover:opacity-90"
            aria-label="Synapse home"
            onClick={onClose}
          >
            <BrandMark />
            <div className="flex flex-col">
              <span className="text-[19px] font-extrabold leading-none tracking-[-0.06em]">
                SYNAPSE
              </span>
              <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#1260ed]">
                Student Portal
              </span>
            </div>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 lg:hidden"
            aria-label="Close sidebar"
          >
            <StudentCloseIcon />
          </button>
        </div>

        <nav aria-label="Student navigation" className="flex-1 space-y-1.5 overflow-y-auto px-4 py-5">
          <div className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Student Menu
          </div>
          {studentNavItems.map((item) => {
            const Icon = item.icon

            return item.to ? (
              <NavLink
                key={item.name}
                to={item.to}
                end={item.to === '/student'}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose()
                }}
                className={({ isActive }) =>
                  `group flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-[13.5px] font-medium transition-all ${
                    isActive
                      ? 'bg-[#edf4ff] font-semibold text-[#1260ed] shadow-[inset_0_0_0_1px_rgba(18,96,237,0.15)]'
                      : 'text-[#50617c] hover:bg-[#f6f9fe] hover:text-[#101c3d]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={isActive ? 'h-5 w-5 text-[#1260ed]' : 'h-5 w-5 text-[#70829f]'} />
                    <span className="truncate">{item.name}</span>
                    {isActive && <span className="ml-auto h-2 w-2 rounded-full bg-[#1260ed]" />}
                  </>
                )}
              </NavLink>
            ) : (
              <button
                key={item.name}
                type="button"
                disabled
                title="Coming soon"
                className="group flex w-full cursor-not-allowed items-center gap-3.5 rounded-xl px-3.5 py-3 text-left text-[13.5px] font-medium text-[#9aa8bc]"
              >
                <Icon className="h-5 w-5 text-[#aab6c8]" />
                <span className="truncate">{item.name}</span>
              </button>
            )
          })}
        </nav>

        <div className="border-t border-[#eef4fc] p-4">
          <div className="flex items-center gap-3 rounded-xl border border-[#e5edf8] bg-[#f8fbff] p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1260ed] to-[#37bda8] text-xs font-extrabold text-white shadow-sm">
              AR
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-[#101c3d]">Aarti Rai</p>
              <p className="truncate text-[11px] text-[#71829e]">Computer Science Student</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default StudentSidebar
