import { Link } from 'react-router-dom'
import {
  ChevronRightIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
} from './RecruiterIcons.jsx'

function StatusBadge({ status }) {
  if (status === 'Active') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
        Active
      </span>
    )
  }
  if (status === 'Paused') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        Paused
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
      Closed
    </span>
  )
}

function RecentJobPostsSection({ jobs, loading }) {
  return (
    <section aria-label="Recent Job Posts" className="space-y-4">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#101c3d] sm:text-2xl">
            Recent Job Posts
          </h2>
          <p className="mt-0.5 text-xs text-[#66738d] sm:text-sm">
            Track your active openings and application activity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/recruiter/post-job"
            className="group inline-flex items-center gap-1 text-xs font-semibold text-[#1260ed] transition hover:text-blue-700 sm:text-sm"
          >
            <span>View All</span>
            <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/recruiter/post-job"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#1260ed] px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700 sm:px-4 sm:py-2.5 sm:text-sm"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Post a Job</span>
          </Link>
        </div>
      </div>

      {/* Main Container */}
      <div className="overflow-hidden rounded-2xl border border-[#e2ecf9] bg-white shadow-[0_2px_12px_rgba(20,40,80,0.04)]">
        {loading && jobs.length === 0 ? (
          <div className="space-y-4 p-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="h-16 animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        ) : (
          <>
            {/* Desktop & Tablet Table View */}
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#eef4fc] bg-[#f8fbff] text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th scope="col" className="px-6 py-4">
                      Job Title
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Applications
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Posted Date
                    </th>
                    <th scope="col" className="px-6 py-4 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f4fa] text-xs">
                  {jobs.map((job) => (
                    <tr
                      key={job.id}
                      className="transition-colors hover:bg-[#fbfdff]"
                    >
                      {/* Job Title */}
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#101c3d] sm:text-[13.5px]">
                          {job.title}
                        </div>
                        <div className="mt-0.5 text-[11px] text-[#71829e]">
                          {job.department} • {job.employmentType}
                        </div>
                      </td>

                      {/* Applications count */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#101c3d]">
                            {job.applicationsCount}
                          </span>
                          {job.newApplications > 0 && (
                            <span className="rounded-md border border-emerald-200/80 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                              +{job.newApplications} new
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          Demo count
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <StatusBadge status={job.status} />
                      </td>

                      {/* Posted Date */}
                      <td className="px-6 py-4 text-[#50617c] font-medium">
                        {job.postedDate}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            to="/recruiter/applications"
                            className="inline-flex items-center gap-1 rounded-lg border border-transparent px-2.5 py-1.5 font-semibold text-[#1260ed] transition hover:border-blue-100 hover:bg-blue-50 hover:text-blue-700"
                            title={`View applications for ${job.title}`}
                          >
                            <EyeIcon className="h-3.5 w-3.5" />
                            <span>View</span>
                          </Link>
                          <Link
                            to="/recruiter/post-job"
                            className="inline-flex items-center gap-1 rounded-lg border border-transparent px-2.5 py-1.5 font-semibold text-slate-600 transition hover:border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                            title={`Edit ${job.title}`}
                          >
                            <PencilIcon className="h-3.5 w-3.5" />
                            <span>Edit</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Card View */}
            <div className="divide-y divide-[#f0f4fa] sm:hidden">
              {jobs.map((job) => (
                <div key={job.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-[#101c3d]">
                        {job.title}
                      </h3>
                      <p className="mt-0.5 text-[11px] text-[#71829e]">
                        {job.department} • {job.employmentType}
                      </p>
                    </div>
                    <StatusBadge status={job.status} />
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#50617c] pt-1">
                    <div>
                      <span className="text-[11px] text-slate-400 block">
                        Applications
                      </span>
                      <span className="font-bold text-[#101c3d]">
                        {job.applicationsCount}
                      </span>
                      {job.newApplications > 0 && (
                        <span className="ml-1.5 rounded-md border border-emerald-200/80 bg-emerald-50 px-1.5 py-0.2 text-[10px] font-bold text-emerald-700">
                          +{job.newApplications} new
                        </span>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">
                        Posted
                      </span>
                      <span className="font-medium text-[#50617c]">
                        {job.postedDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-t border-[#f0f4fa] pt-3">
                    <Link
                      to="/recruiter/applications"
                      className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-[#cbe0fc] bg-[#edf4ff] py-2 text-xs font-semibold text-[#1260ed]"
                    >
                      <EyeIcon className="h-3.5 w-3.5" />
                      <span>View</span>
                    </Link>
                    <Link
                      to="/recruiter/post-job"
                      className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <PencilIcon className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default RecentJobPostsSection
