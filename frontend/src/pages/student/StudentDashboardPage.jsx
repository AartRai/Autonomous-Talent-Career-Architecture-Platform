import { useEffect, useState } from 'react'
import {
  StudentCoursesIcon,
  StudentJobsIcon,
  StudentMatchIcon,
  StudentProfileCompletionIcon,
  StudentSkillIcon,
} from '../../components/student/StudentIcons.jsx'
import { getStudentDashboardData } from '../../services/studentService.js'

const statIcons = {
  profile: StudentProfileCompletionIcon,
  match: StudentMatchIcon,
  jobs: StudentJobsIcon,
  courses: StudentCoursesIcon,
}

function PanelHeading({ eyebrow, title, description }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8191aa]">{eyebrow}</p>
      <h2 className="mt-1 text-base font-bold tracking-tight text-[#101c3d]">{title}</h2>
      {description && <p className="mt-1 text-xs leading-5 text-[#77869d]">{description}</p>}
    </div>
  )
}

function StudentDashboardPage() {
  const [dashboardData, setDashboardData] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [appliedJobs, setAppliedJobs] = useState([])
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    let isMounted = true

    getStudentDashboardData()
      .then((data) => {
        if (isMounted) setDashboardData(data)
      })
      .catch((error) => {
        if (isMounted) setLoadError(`Could not load student dashboard data: ${error.message}`)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const toggleJobApplication = (role) => {
    const isApplied = appliedJobs.includes(role)
    setAppliedJobs((current) =>
      isApplied ? current.filter((item) => item !== role) : [...current, role]
    )
    setAnnouncement(isApplied ? `Application removed for ${role}.` : `Application saved for ${role}.`)
  }

  const toggleCourseEnrollment = (title) => {
    const isEnrolled = enrolledCourses.includes(title)
    setEnrolledCourses((current) =>
      isEnrolled ? current.filter((item) => item !== title) : [...current, title]
    )
    setAnnouncement(isEnrolled ? `Enrollment removed for ${title}.` : `Enrolled in ${title}.`)
  }

  if (loadError) {
    return <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{loadError}</p>
  }

  if (!dashboardData) {
    return <p role="status" className="text-sm text-[#71809a]">Loading student dashboard...</p>
  }

  const { overviewStats, skillMatch, jobRecommendations, skillGaps, courseRecommendations } = dashboardData

  return (
    <div className="space-y-7 sm:space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#168e9d]">
            Your career dashboard
          </p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.035em] text-[#101c3d] sm:text-3xl">
            Welcome back, {dashboardData.studentName}!
          </h1>
          <p className="mt-1.5 text-sm text-[#66738d] sm:text-base">
            Your next opportunity is closer than you think. Here’s your career snapshot.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start rounded-full border border-[#d7eee8] bg-[#effaf7] px-3.5 py-2 text-xs font-semibold text-[#17856f] sm:self-auto">
          <span className="h-2 w-2 rounded-full bg-[#27b392]" />
          Career profile active
        </div>
      </div>

      <section aria-label="Student overview metrics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewStats.map((stat) => {
          const Icon = statIcons[stat.icon]
          return (
            <article
              key={stat.label}
              className="rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-[#71809a]">{stat.label}</p>
                  <p className="mt-3 text-[30px] font-extrabold leading-none tracking-[-0.04em] text-[#101c3d]">
                    {stat.value}
                  </p>
                </div>
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-3 text-[11px] font-medium text-[#8a98ad]">{stat.detail}</p>
              {stat.label === 'Profile Completion' && (
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#edf1f7]">
                  <div className="h-full rounded-full bg-[#1260ed]" style={{ width: stat.value }} />
                </div>
              )}
            </article>
          )
        })}
      </section>

      <section aria-label="Skill analysis and skill gaps" className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-6">
          <PanelHeading
            eyebrow="Your skills"
            title="Skill Match Overview"
            description="How your current skills align with in-demand roles."
          />
          <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:justify-around">
            <div
              className="relative flex h-44 w-44 shrink-0 items-center justify-center rounded-full"
              style={{ background: `conic-gradient(#19b596 0deg ${skillMatch.percentage * 3.6}deg, #dce8f5 ${skillMatch.percentage * 3.6}deg 360deg)` }}
              role="img"
              aria-label={`${skillMatch.percentage} percent overall skill match`}
            >
              <div className="flex h-[132px] w-[132px] flex-col items-center justify-center rounded-full bg-white shadow-[inset_0_0_0_1px_#edf2f8]">
                <span className="text-4xl font-extrabold tracking-[-0.05em] text-[#101c3d]">{skillMatch.percentage}%</span>
                <span className="mt-1 text-[11px] font-semibold text-[#7b8aa0]">Overall match</span>
              </div>
            </div>
            <div className="w-full max-w-xs space-y-4">
              {skillMatch.counts.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                    <span className="text-xs font-medium text-[#687791]">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold text-[#243653]">{item.count}</span>
                </div>
              ))}
              <div className="rounded-xl bg-[#f5f9ff] px-3.5 py-3 text-[11px] leading-5 text-[#71809a]">
                Add the skills below to improve your match for AI and data roles.
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <PanelHeading
              eyebrow="Keep growing"
              title="Skills to Strengthen"
              description="Build these in-demand skills to improve your match."
            />
            <span className="rounded-lg bg-[#fff5e8] px-2.5 py-1.5 text-[10px] font-bold text-[#c6821f]">
              3 focus areas
            </span>
          </div>
          <div className="mt-5 space-y-4">
            {skillGaps.map((item) => (
              <div key={item.id}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-[#34435d]">{item.skill}</span>
                  <span
                    className={`rounded-md px-2 py-1 text-[10px] font-bold ${
                      item.level === 'High'
                        ? 'bg-[#fff0ef] text-[#d75c57]'
                        : 'bg-[#fff8e9] text-[#b78122]'
                    }`}
                  >
                    {item.level} priority
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[#edf1f7]">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: item.width }} />
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setAnnouncement('Skill analysis details will be available soon.')}
            className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#dce7f6] px-3.5 py-2 text-xs font-semibold text-[#315982] transition hover:border-[#b7d0f3] hover:bg-[#f5f9ff]"
          >
            <StudentSkillIcon className="h-4 w-4" />
            View detailed analysis
          </button>
        </article>
      </section>

      <section aria-label="Recommended opportunities and courses" className="grid gap-5 xl:grid-cols-2">
        <article className="rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <PanelHeading
              eyebrow="Picked for you"
              title="Recommended Jobs"
              description="Roles matched to your skills and career interests."
            />
            <span className="rounded-lg bg-[#edf4ff] px-2.5 py-1.5 text-[10px] font-bold text-[#1260ed]">
              24 matches
            </span>
          </div>
          <div className="mt-4 divide-y divide-[#edf2f8]">
            {jobRecommendations.map((job) => {
              const isApplied = appliedJobs.includes(job.role)
              return (
                <div key={job.id} className="flex items-center gap-3 py-4 first:pt-2 last:pb-1">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-extrabold ${job.color}`}>
                    {job.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xs font-bold text-[#243653]">{job.role}</h3>
                      <span className="rounded-md bg-[#eaf9f4] px-1.5 py-0.5 text-[10px] font-bold text-[#148368]">
                        {job.match}% match
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] font-medium text-[#71809a]">
                      {job.company} <span className="px-1 text-[#c3ccda]">·</span> {job.location}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleJobApplication(job.role)}
                    aria-pressed={isApplied}
                    className={`shrink-0 rounded-lg px-3 py-2 text-[11px] font-bold transition ${
                      isApplied
                        ? 'border border-[#cfe9df] bg-[#effaf6] text-[#16856b]'
                        : 'bg-[#1260ed] text-white shadow-[0_3px_8px_rgba(18,96,237,0.18)] hover:bg-[#0d52cf]'
                    }`}
                  >
                    {isApplied ? 'Saved' : 'Apply'}
                  </button>
                </div>
              )
            })}
          </div>
        </article>

        <article className="rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <PanelHeading
              eyebrow="Learn and grow"
              title="Recommended Courses"
              description="Courses selected to close your most important skill gaps."
            />
            <span className="rounded-lg bg-[#f3efff] px-2.5 py-1.5 text-[10px] font-bold text-[#7351c9]">
              12 courses
            </span>
          </div>
          <div className="mt-4 divide-y divide-[#edf2f8]">
            {courseRecommendations.map((course) => {
              const isEnrolled = enrolledCourses.includes(course.title)
              return (
                <div key={course.id} className="flex items-center gap-3 py-4 first:pt-2 last:pb-1">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${course.color} text-[10px] font-extrabold text-white shadow-sm`}>
                    {course.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-bold leading-5 text-[#243653]">{course.title}</h3>
                    <p className="mt-0.5 text-[11px] text-[#71809a]">
                      {course.provider} <span className="px-1 text-[#c3ccda]">·</span> Rating {course.rating} <span className="px-1 text-[#c3ccda]">·</span> {course.duration}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleCourseEnrollment(course.title)}
                    aria-pressed={isEnrolled}
                    className={`shrink-0 rounded-lg px-3 py-2 text-[11px] font-bold transition ${
                      isEnrolled
                        ? 'border border-[#cfe9df] bg-[#effaf6] text-[#16856b]'
                        : 'border border-[#dce7f6] bg-white text-[#315982] hover:border-[#b7d0f3] hover:bg-[#f5f9ff]'
                    }`}
                  >
                    {isEnrolled ? 'Enrolled' : 'Enroll'}
                  </button>
                </div>
              )
            })}
          </div>
        </article>
      </section>
      <p className="sr-only" role="status" aria-live="polite">{announcement}</p>
      <p className="sr-only">Dashboard data is sample data for demonstration purposes.</p>
    </div>
  )
}

export default StudentDashboardPage
