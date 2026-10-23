import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getStudentCourseRecommendations } from '../../services/studentService.js'

const learningSkills = [
  { name: 'Deep Learning', level: 'High', category: 'Machine Learning', tone: 'red', icon: '✦' },
  { name: 'System Design', level: 'Medium', category: 'System Design', tone: 'blue', icon: '◇' },
  { name: 'Cloud Computing', level: 'Medium', category: 'Cloud Computing', tone: 'blue', icon: '☁' },
  { name: 'Data Structures', level: 'Medium', category: 'Programming', tone: 'green', icon: '▣' },
  { name: 'DevOps', level: 'Low', category: 'DevOps', tone: 'teal', icon: '↗' },
]

const popularCategories = [
  { name: 'Data Science', count: 24, icon: '▧', tone: 'blue' },
  { name: 'Cloud Computing', count: 18, icon: '☁', tone: 'slate' },
  { name: 'Programming', count: 32, icon: '</>', tone: 'green' },
  { name: 'Machine Learning', count: 20, icon: '✦', tone: 'purple' },
  { name: 'System Design', count: 16, icon: '⌘', tone: 'blue' },
  { name: 'DevOps', count: 14, icon: '↗', tone: 'purple' },
]

const visualStyles = {
  cloud: 'from-[#17375b] via-[#183f68] to-[#0c2342]',
  ai: 'from-[#25104e] via-[#492278] to-[#211344]',
  system: 'from-[#0e2853] via-[#123b73] to-[#09234a]',
  python: 'from-[#164a88] via-[#286da8] to-[#263b60]',
  'data-structures': 'from-[#08664e] via-[#07875f] to-[#095b4e]',
  devops: 'from-[#3e2e79] via-[#5644a2] to-[#302365]',
  analytics: 'from-[#9b4e2a] via-[#d17b38] to-[#673b55]',
}

function CourseArtwork({ visual, category }) {
  return (
    <div className={`relative flex h-24 w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br ${visualStyles[visual] ?? visualStyles.cloud} sm:h-24 sm:w-28 sm:shrink-0`}>
      <span aria-hidden="true" className="absolute -right-4 -top-7 h-24 w-24 rounded-full border border-white/10" />
      <span aria-hidden="true" className="absolute -bottom-10 -left-5 h-24 w-24 rounded-full border border-white/10" />
      {visual === 'python' ? (
        <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-[#ffcf4a] text-4xl font-black text-[#1769aa] shadow-lg">
          Py
        </div>
      ) : visual === 'data-structures' ? (
        <div className="relative grid grid-cols-3 gap-1.5" aria-label={category}>
          {Array.from({ length: 9 }, (_, index) => (
            <span key={index} className="h-3.5 w-3.5 rounded-sm border border-lime-200/80 bg-lime-300/70 shadow-[0_0_10px_rgba(190,242,100,0.35)]" />
          ))}
        </div>
      ) : visual === 'system' ? (
        <div className="relative flex flex-col items-center gap-2 text-[9px] font-bold tracking-[0.16em] text-white">
          <span className="rounded border border-cyan-200/70 px-2 py-1">SYSTEM DESIGN</span>
          <span className="text-sm text-cyan-200">□ ─ □ ─ □</span>
        </div>
      ) : visual === 'ai' ? (
        <div className="relative grid h-14 w-14 place-items-center rounded-full border border-fuchsia-200/50 bg-fuchsia-300/10 text-3xl text-fuchsia-100 shadow-[0_0_30px_rgba(216,180,254,0.3)]">◉</div>
      ) : visual === 'cloud' ? (
        <div className="relative text-center text-white">
          <div className="text-2xl font-bold tracking-tight">aws</div>
          <div className="mx-auto h-1 w-10 rounded-full bg-amber-400" />
        </div>
      ) : (
        <div className="relative grid h-14 w-14 place-items-center rounded-2xl border border-white/20 bg-white/10 text-3xl font-bold text-white shadow-lg">
          {visual === 'devops' ? '↗' : '▥'}
        </div>
      )}
    </div>
  )
}

function SelectFilter({ label, value, onChange, options }) {
  return (
    <label className="relative min-w-0 flex-1">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full appearance-none rounded-lg border border-[#dce5f1] bg-white px-3 pr-8 text-xs font-semibold text-[#283955] outline-none transition focus:border-[#1260ed] focus:ring-2 focus:ring-blue-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="pointer-events-none absolute right-2.5 top-3 h-4 w-4 text-[#71809a]">
        <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </label>
  )
}

function RecommendedCourseCard({ course, isSaved, isEnrolled, onSave, onEnroll }) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-[#e4ebf4] bg-white p-3.5 shadow-[0_2px_10px_rgba(26,50,90,0.025)] sm:flex-row sm:items-center sm:gap-4 sm:p-3">
      <CourseArtwork visual={course.visual} category={course.category} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="text-sm font-bold leading-5 text-[#172744]">{course.title}</h3>
          <span className="shrink-0 text-xs font-extrabold text-[#15966d] sm:hidden">{course.match}% Match</span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-medium text-[#62728e]">
          <span>{course.provider}</span>
          <span className="inline-flex items-center gap-1"><span className="text-amber-400">★</span>{course.rating}</span>
          <span>{course.duration}</span>
        </div>
        <p className="mt-2 max-w-xl text-[10px] leading-4 text-[#52627d]">{course.description}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="rounded-md bg-[#edf4ff] px-2 py-1 text-[10px] font-medium text-[#1260ed]">{course.category}</span>
          <span className="rounded-md bg-[#f1f4f9] px-2 py-1 text-[10px] font-medium text-[#52627d]">{course.level}</span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 sm:min-w-[74px] sm:flex-col sm:items-end sm:gap-2">
        <span className="hidden text-xs font-extrabold text-[#15966d] sm:block">{course.match}% Match</span>
        <button
          type="button"
          onClick={() => onEnroll(course)}
          disabled={isEnrolled}
          className="h-8 min-w-[66px] rounded-lg bg-[#1260ed] px-3 text-[11px] font-bold text-white transition hover:bg-[#0d52cf] disabled:cursor-default disabled:bg-[#eaf9f4] disabled:text-[#16856b]"
        >
          {isEnrolled ? 'Enrolled' : 'Enroll'}
        </button>
        <button
          type="button"
          onClick={() => onSave(course)}
          aria-pressed={isSaved}
          className={`inline-flex items-center gap-1 text-[10px] font-medium transition ${
            isSaved ? 'text-[#1260ed]' : 'text-[#62728e] hover:text-[#1260ed]'
          }`}
        >
          <svg viewBox="0 0 20 20" fill={isSaved ? 'currentColor' : 'none'} aria-hidden="true" className="h-3.5 w-3.5">
            <path d="M5 3.8A1.8 1.8 0 0 1 6.8 2h6.4A1.8 1.8 0 0 1 15 3.8V18l-5-3.2L5 18V3.8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
          {isSaved ? 'Saved' : 'Save'}
        </button>
      </div>
    </article>
  )
}

function RecommendedCoursesPage() {
  const [courses, setCourses] = useState([])
  const [category, setCategory] = useState('all')
  const [level, setLevel] = useState('all')
  const [duration, setDuration] = useState('all')
  const [provider, setProvider] = useState('all')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [minimumMatch, setMinimumMatch] = useState('0')
  const [savedOnly, setSavedOnly] = useState(false)
  const [savedCourses, setSavedCourses] = useState([])
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [showAll, setShowAll] = useState(false)
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    let active = true

    getStudentCourseRecommendations().then((data) => {
      if (active) setCourses(data)
    })

    return () => {
      active = false
    }
  }, [])

  const providers = useMemo(
    () => [...new Set(courses.map((course) => course.provider))].sort(),
    [courses],
  )
  const categories = useMemo(
    () => [...new Set(courses.map((course) => course.category))].sort(),
    [courses],
  )

  const filteredCourses = useMemo(() => courses.filter((course) => (
    (category === 'all' || course.category === category)
      && (level === 'all' || course.level === level)
      && (duration === 'all'
        || (duration === 'short' && parseInt(course.duration, 10) <= 6 && !course.duration.includes('month'))
        || (duration === 'long' && (parseInt(course.duration, 10) > 6 || course.duration.includes('month'))))
      && (provider === 'all' || course.provider === provider)
      && course.match >= Number(minimumMatch)
      && (!savedOnly || savedCourses.includes(course.id))
  )).sort((first, second) => second.match - first.match), [
    category, courses, duration, level, minimumMatch, provider, savedCourses, savedOnly,
  ])

  const toggleSaved = (course) => {
    const alreadySaved = savedCourses.includes(course.id)
    setSavedCourses((current) => (
      alreadySaved ? current.filter((id) => id !== course.id) : [...current, course.id]
    ))
    setAnnouncement(alreadySaved ? `${course.title} removed from saved courses.` : `${course.title} saved.`)
  }

  const enroll = (course) => {
    if (enrolledCourses.includes(course.id)) return
    setEnrolledCourses((current) => [...current, course.id])
    setAnnouncement(`Demo enrollment recorded for ${course.title}.`)
  }

  const clearFilters = () => {
    setCategory('all')
    setLevel('all')
    setDuration('all')
    setProvider('all')
    setMinimumMatch('0')
    setSavedOnly(false)
  }

  const displayedCourses = showAll ? filteredCourses : filteredCourses.slice(0, 5)

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#101c3d]">Recommended Courses</h2>
          <p className="mt-1 text-sm text-[#66738d]">Courses to help you build and upgrade your skills.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="self-start text-xs font-semibold text-[#1260ed] transition hover:underline sm:self-auto sm:pb-1"
        >
          View All Courses
        </button>
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-2">
          <SelectFilter
            label="Course category"
            value={category}
            onChange={setCategory}
            options={[{ value: 'all', label: 'All Categories' }, ...categories.map((item) => ({ value: item, label: item }))]}
          />
          <SelectFilter
            label="Course level"
            value={level}
            onChange={setLevel}
            options={[
              { value: 'all', label: 'Level' },
              { value: 'Beginner', label: 'Beginner' },
              { value: 'Intermediate', label: 'Intermediate' },
              { value: 'Advanced', label: 'Advanced' },
            ]}
          />
          <SelectFilter
            label="Course duration"
            value={duration}
            onChange={setDuration}
            options={[
              { value: 'all', label: 'Duration' },
              { value: 'short', label: '6 weeks or less' },
              { value: 'long', label: 'More than 6 weeks' },
            ]}
          />
          <SelectFilter
            label="Course provider"
            value={provider}
            onChange={setProvider}
            options={[{ value: 'all', label: 'Provider' }, ...providers.map((item) => ({ value: item, label: item }))]}
          />
          <button
            type="button"
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen((open) => !open)}
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-xs font-semibold transition ${
              filtersOpen ? 'bg-[#1260ed] text-white' : 'bg-[#edf4ff] text-[#1260ed] hover:bg-[#e2edff]'
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
              <path d="M4 6h16M7 12h10m-7 6h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            Filters
          </button>
        </div>
      </div>

      {filtersOpen && (
        <div className="flex flex-col gap-4 rounded-xl border border-[#dce7f5] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-3 text-xs font-semibold text-[#283955]">
            Minimum match
            <select
              value={minimumMatch}
              onChange={(event) => setMinimumMatch(event.target.value)}
              className="h-9 rounded-lg border border-[#dce5f1] bg-white px-3 text-xs outline-none focus:border-[#1260ed]"
            >
              <option value="0">Any match</option>
              <option value="70">70% or higher</option>
              <option value="80">80% or higher</option>
              <option value="90">90% or higher</option>
            </select>
          </label>
          <div className="flex flex-wrap items-center gap-4">
            <label className="inline-flex items-center gap-2 text-xs font-medium text-[#50617c]">
              <input
                type="checkbox"
                checked={savedOnly}
                onChange={(event) => setSavedOnly(event.target.checked)}
                className="h-4 w-4 rounded border-[#cbd6e5] accent-[#1260ed]"
              />
              Saved courses only
            </label>
            <button type="button" onClick={clearFilters} className="text-xs font-bold text-[#1260ed] hover:underline">Clear filters</button>
          </div>
        </div>
      )}

      {announcement && (
        <p role="status" aria-live="polite" className="rounded-xl border border-[#cfe9df] bg-[#effaf6] px-4 py-3 text-xs font-medium text-[#16856b]">
          {announcement}
        </p>
      )}

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,2.1fr)_minmax(270px,0.9fr)]">
        <section id="recommended-course-list" aria-label="Recommended courses" className="space-y-2.5">
          {displayedCourses.map((course) => (
            <RecommendedCourseCard
              key={course.id}
              course={course}
              isSaved={savedCourses.includes(course.id)}
              isEnrolled={enrolledCourses.includes(course.id)}
              onSave={toggleSaved}
              onEnroll={enroll}
            />
          ))}
          {displayedCourses.length === 0 && (
            <div className="rounded-xl border border-dashed border-[#cdd9e9] bg-white px-5 py-12 text-center">
              <p className="text-sm font-bold text-[#283955]">No courses match these filters</p>
              <p className="mt-1 text-xs text-[#71809a]">Try changing or clearing your filters.</p>
              <button type="button" onClick={clearFilters} className="mt-4 text-xs font-bold text-[#1260ed] hover:underline">Clear filters</button>
            </div>
          )}
          {filteredCourses.length > 5 && (
            <div className="flex justify-center pt-1">
              <button
                type="button"
                onClick={() => setShowAll((shown) => !shown)}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#edf4ff] px-5 text-xs font-bold text-[#1260ed] transition hover:bg-[#e2edff]"
              >
                {showAll ? 'Show Fewer Courses' : 'View More Courses'}
                <span aria-hidden="true">{showAll ? '⌃' : '⌄'}</span>
              </button>
            </div>
          )}
          <p className="sr-only">Course listings use fictional demonstration data. Enrolling only updates this demo page.</p>
        </section>

        <aside className="space-y-3">
          <section className="rounded-xl border border-[#e4ebf4] bg-white p-4 shadow-[0_2px_10px_rgba(26,50,90,0.025)] sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-bold text-[#172744]">Your Learning Overview</h3>
              <Link to="/student/skill-analysis" className="text-[10px] font-semibold text-[#1260ed] hover:underline">View Progress</Link>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div className="grid h-24 w-24 shrink-0 place-items-center rounded-full" style={{ background: 'conic-gradient(#19b596 0% 45%, #4c8dff 45% 72%, #e7edf5 72% 100%)' }}>
                <div className="grid h-[72px] w-[72px] place-content-center rounded-full bg-white text-center">
                  <span className="text-lg font-extrabold text-[#172744]">72%</span>
                  <span className="text-[9px] text-[#71809a]">Overall Progress</span>
                </div>
              </div>
              <div className="flex-1 space-y-3 text-[10px] font-medium text-[#52627d]">
                <p className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#19b596]" />Completed <strong className="ml-auto text-[#172744]">12</strong></p>
                <p className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#4c8dff]" />In Progress <strong className="ml-auto text-[#172744]">6</strong></p>
                <p className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#f3a51b]" />Not Started <strong className="ml-auto text-[#172744]">4</strong></p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#e4ebf4] bg-white p-4 shadow-[0_2px_10px_rgba(26,50,90,0.025)]">
            <h3 className="text-xs font-bold text-[#172744]">Top Skills You Can Improve</h3>
            <ul className="mt-3 space-y-2">
              {learningSkills.map((skill) => (
                <li key={skill.name} className="flex items-center gap-2 text-[10px]">
                  <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md ${
                    skill.tone === 'red' ? 'bg-[#fff0f0] text-[#e05454]' : skill.tone === 'green' ? 'bg-[#e7f8f1] text-[#15966d]' : skill.tone === 'teal' ? 'bg-[#e6f8f6] text-[#159a91]' : 'bg-[#edf4ff] text-[#4c75d5]'
                  }`} aria-hidden="true">{skill.icon}</span>
                  <span className="min-w-0 flex-1 font-medium text-[#34445f]">{skill.name}</span>
                  <span className={`rounded-md px-2 py-1 font-semibold ${
                    skill.level === 'High' ? 'bg-[#fff0f0] text-[#e05454]' : skill.level === 'Low' ? 'bg-[#e7f8f1] text-[#15966d]' : 'bg-[#fff5e8] text-[#c87908]'
                  }`}>{skill.level}</span>
                  <button
                    type="button"
                    onClick={() => setCategory(skill.category)}
                    className="rounded-md border border-[#d7e4f6] px-2 py-1 text-[9px] font-semibold text-[#1260ed] transition hover:bg-[#edf4ff]"
                  >
                    Learn Now
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-[#e4ebf4] bg-white p-4 shadow-[0_2px_10px_rgba(26,50,90,0.025)]">
            <h3 className="text-xs font-bold text-[#172744]">Popular Categories</h3>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {popularCategories.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setCategory(item.name)}
                  className="flex min-w-0 items-center gap-2 rounded-lg border border-[#edf1f7] p-2 text-left transition hover:border-[#cbdcf5] hover:bg-[#f8fbff]"
                >
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-md text-[10px] font-bold ${
                    item.tone === 'green' ? 'bg-[#e7f8f1] text-[#15966d]' : item.tone === 'purple' ? 'bg-[#f3efff] text-[#7351c9]' : item.tone === 'slate' ? 'bg-[#f1f4f9] text-[#64748b]' : 'bg-[#edf4ff] text-[#1260ed]'
                  }`}>{item.icon}</span>
                  <span className="min-w-0">
                    <span className="block truncate text-[9px] font-semibold text-[#34445f]">{item.name}</span>
                    <span className="mt-0.5 block text-[8px] text-[#71809a]">{item.count} Courses</span>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="flex items-center gap-3 rounded-xl border border-[#dce8fc] bg-gradient-to-br from-[#edf4ff] to-[#f5f8ff] p-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-xl text-[#1260ed] shadow-sm" aria-hidden="true">◆</span>
            <div className="min-w-0 flex-1">
              <h3 className="text-[10px] font-bold text-[#172744]">Not sure where to start?</h3>
              <p className="mt-1 text-[9px] leading-4 text-[#62728e]">Take a quick assessment and get personalized course recommendations.</p>
              <Link to="/student/skill-analysis" className="mt-2 inline-flex h-7 items-center rounded-md bg-[#1260ed] px-3 text-[9px] font-bold text-white transition hover:bg-[#0d52cf]">
                Take Assessment
              </Link>
            </div>
          </section>
        </aside>
      </div>
      <p className="sr-only" role="status" aria-live="polite">{announcement}</p>
    </div>
  )
}

export default RecommendedCoursesPage
