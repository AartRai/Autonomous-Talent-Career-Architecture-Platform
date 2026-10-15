import { Link, NavLink } from 'react-router-dom'
import { BrandMark } from '../../components.jsx'
import {
  DashboardIcon,
  PostJobIcon,
  TalentSearchIcon,
  CandidateProfilesIcon,
  ApplicationsIcon,
  AnalyticsIcon,
  CompanyProfileIcon,
  CloseIcon,
} from './RecruiterIcons.jsx'

const recruiterNavItems = [
  {
    name: 'Dashboard',
    to: '/recruiter',
    end: true,
    icon: DashboardIcon,
  },
  {
    name: 'Post a Job',
    to: '/recruiter/post-job',
    end: false,
    icon: PostJobIcon,
  },
  {
    name: 'Talent Search',
    to: '/recruiter/talent-search',
    end: false,
    icon: TalentSearchIcon,
  },
  {
    name: 'Candidate Profiles',
    to: '/recruiter/candidates',
    end: false,
    icon: CandidateProfilesIcon,
  },
  {
    name: 'Applications Management',
    to: '/recruiter/applications',
    end: false,
    icon: ApplicationsIcon,
  },
  {
    name: 'Analytics & Reports',
    to: '/recruiter/analytics',
    end: false,
    icon: AnalyticsIcon,
  },
  {
    name: 'Profile / Company Details',
    to: '/recruiter/company',
    end: false,
    icon: CompanyProfileIcon,
  },
]

function RecruiterSidebar({ isOpen, onClose }) {
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
        aria-label="Recruiter Sidebar"
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
                Recruiter Portal
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
          aria-label="Recruiter navigation"
          className="flex-1 space-y-1.5 overflow-y-auto px-4 py-5"
        >
          <div className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Recruiter Menu
          </div>

          {recruiterNavItems.map((item) => {
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
                  `group flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-[13.5px] font-medium transition-all ${
                    isActive
                      ? 'bg-[#edf4ff] text-[#1260ed] font-semibold shadow-[inset_0_0_0_1px_rgba(18,96,237,0.15)]'
                      : 'text-[#50617c] hover:bg-[#f6f9fe] hover:text-[#101c3d]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`transition-colors ${
                        isActive
                          ? 'text-[#1260ed]'
                          : 'text-[#70829f] group-hover:text-[#1260ed]'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="truncate">{item.name}</span>
                    {isActive && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-[#1260ed]" />
                    )}
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Bottom Workspace / Company Badge */}
        <div className="border-t border-[#eef4fc] p-4">
          <div className="flex items-center gap-3 rounded-xl border border-[#e5edf8] bg-[#f8fbff] p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#1260ed] to-[#1764ed] text-sm font-bold text-white shadow-xs">
              AC
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-[#101c3d]">
                Acme Corporation
              </p>
              <p className="truncate text-[11px] text-[#71829e]">
                Enterprise Partner
              </p>
            </div>
            <span
              className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100"
              title="Verified enterprise partner"
            />
          </div>
        </div>
      </aside>
    </>
  )
}

export default RecruiterSidebar
