import { Link, NavLink } from 'react-router-dom'
import { BrandMark } from '../../components.jsx'
import {
  FacultyDashboardIcon,
  ResearchIcon,
  TrainingIcon,
  CollaborationIcon,
  ProfileExpertiseIcon,
  FacultyBellIcon,
  CloseIcon,
} from './FacultyIcons.jsx'

const facultyNavItems = [
  {
    name: 'Faculty Dashboard',
    to: '/faculty',
    end: true,
    icon: FacultyDashboardIcon,
  },
  {
    name: 'Research & Consultancy Opportunities',
    to: '/faculty/opportunities',
    end: false,
    icon: ResearchIcon,
  },
  {
    name: 'Industrial Training / FDP',
    to: '/faculty/training',
    end: false,
    icon: TrainingIcon,
  },
  {
    name: 'Collaboration Requests',
    to: '/faculty/collaborations',
    end: false,
    icon: CollaborationIcon,
  },
  {
    name: 'Profile / Expertise',
    to: '/faculty/profile',
    end: false,
    icon: ProfileExpertiseIcon,
  },
  {
    name: 'Notifications',
    to: '/faculty/notifications',
    end: false,
    icon: FacultyBellIcon,
  },
]

function FacultySidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          role="presentation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        aria-label="Faculty Sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#e2ecf9] bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:shadow-none'
        }`}
      >
        {/* Branding Header */}
        <div className="flex h-18 shrink-0 items-center justify-between border-b border-[#eef4fc] px-6">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-[#17335e] transition hover:opacity-90"
            aria-label="Synapse home"
          >
            <BrandMark />
            <div className="flex flex-col">
              <span className="text-[19px] font-extrabold leading-none tracking-[-0.06em]">
                SYNAPSE
              </span>
              <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#1260ed]">
                Faculty Portal
              </span>
            </div>
          </Link>

          {/* Close button for mobile */}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 lg:hidden"
            aria-label="Close sidebar"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav
          aria-label="Faculty navigation"
          className="flex-1 space-y-1.5 overflow-y-auto px-4 py-5"
        >
          <div className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Faculty Workspace
          </div>

          {facultyNavItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.name}
                to={item.to}
                end={item.end}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose()
                }}
                className={({ isActive }) =>
                  `group flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-[13px] font-medium transition-all ${
                    isActive
                      ? 'bg-[#edf4ff] text-[#1260ed] font-semibold shadow-[inset_0_0_0_1px_rgba(18,96,237,0.15)]'
                      : 'text-[#50617c] hover:bg-[#f6f9fe] hover:text-[#101c3d]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`transition-colors shrink-0 ${
                        isActive
                          ? 'text-[#1260ed]'
                          : 'text-[#70829f] group-hover:text-[#1260ed]'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="truncate">{item.name}</span>
                    {isActive && (
                      <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-[#1260ed]" />
                    )}
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Bottom Institutional / Department Badge */}
        <div className="border-t border-[#eef4fc] p-4">
          <div className="flex items-center gap-3 rounded-xl border border-[#e5edf8] bg-[#f8fbff] p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#1260ed] to-[#3b82f6] text-sm font-bold text-white shadow-xs">
              CS
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-[#101c3d]">
                Dept. of Computer Science
              </p>
              <p className="truncate text-[11px] text-[#71829e]">
                Research & Innovation Lead
              </p>
            </div>
            <span
              className="inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500 ring-4 ring-emerald-100"
              title="Verified Academic Partner"
            />
          </div>
        </div>
      </aside>
    </>
  )
}

export default FacultySidebar
