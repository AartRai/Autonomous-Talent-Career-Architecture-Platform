import {
  CandidateProfilesIcon,
  ApplicationsIcon,
  PostJobIcon,
  SparkleMatchIcon,
} from './RecruiterIcons.jsx'

const iconMap = {
  candidates: CandidateProfilesIcon,
  applications: ApplicationsIcon,
  jobs: PostJobIcon,
  matches: SparkleMatchIcon,
}

const toneMap = {
  blue: {
    bg: 'bg-[#edf4ff]',
    text: 'text-[#1260ed]',
    border: 'border-[#d6e6fe]',
  },
  emerald: {
    bg: 'bg-[#e9faf3]',
    text: 'text-[#16a34a]',
    border: 'border-[#c8f0dc]',
  },
  purple: {
    bg: 'bg-[#f4f0ff]',
    text: 'text-[#7c3aed]',
    border: 'border-[#e6dbff]',
  },
  rose: {
    bg: 'bg-[#fff0f2]',
    text: 'text-[#e11d48]',
    border: 'border-[#fcd4dc]',
  },
}

function StatCard({ stat }) {
  const { title, value, icon, tone = 'blue', trend } = stat
  const IconComponent = iconMap[icon] || CandidateProfilesIcon
  const toneStyles = toneMap[tone] || toneMap.blue

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] transition-all hover:border-[#cbdff8] hover:shadow-[0_4px_16px_rgba(20,40,80,0.08)] sm:p-6">
      {/* Top row: Icon and trend badge */}
      <div className="flex items-center justify-between gap-3">
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${toneStyles.bg} ${toneStyles.text} ${toneStyles.border}`}
          aria-hidden="true"
        >
          <IconComponent className="h-6 w-6" />
        </span>

        {trend && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              trend.isPositive === true
                ? 'border border-emerald-200/70 bg-emerald-50 text-emerald-700'
                : trend.isPositive === false
                  ? 'border border-rose-200/70 bg-rose-50 text-rose-700'
                  : 'border border-slate-200/70 bg-slate-50 text-slate-600'
            }`}
          >
            {trend.isPositive === true && (
              <svg
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
                className="h-3 w-3"
              >
                <path
                  d="m2.5 7.5 3.5-3.5 3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {trend.value}
          </span>
        )}
      </div>

      {/* Metric and Title */}
      <div className="mt-4">
        <div className="text-2xl font-extrabold tracking-tight text-[#101c3d] sm:text-3xl">
          {value}
        </div>
        <div className="mt-1 text-xs font-semibold text-[#5a6b85] sm:text-[13px]">
          {title}
        </div>
      </div>

      {/* Supporting context label */}
      {trend?.label && (
        <div className="mt-3 border-t border-[#f0f4fa] pt-3 text-[11px] text-[#71829e]">
          <span className="font-medium">{trend.label}</span>
        </div>
      )}
    </div>
  )
}

export default StatCard
