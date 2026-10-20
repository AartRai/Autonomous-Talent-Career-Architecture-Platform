import { useEffect, useState } from 'react'
import { getStudentSkillAnalysisData } from '../../services/studentService.js'

const chartPoints = [
  [145, 52],
  [207, 88],
  [207, 160],
  [145, 196],
  [83, 160],
  [83, 88],
]

function Panel({ title, children, className = '' }) {
  return (
    <section className={`rounded-xl border border-[#e4ebf4] bg-white p-4 shadow-[0_2px_10px_rgba(26,50,90,0.035)] sm:p-5 ${className}`}>
      <h2 className="text-sm font-bold tracking-tight text-[#172744]">{title}</h2>
      {children}
    </section>
  )
}

function SkillBadgeIcon({ type }) {
  const symbols = {
    python: 'Py',
    js: 'JS',
    database: 'DB',
    ai: 'AI',
    chat: 'C',
  }
  return (
    <span className="text-[10px] font-extrabold">
      {symbols[type] ?? 'S'}
    </span>
  )
}

function ActivityIcon({ type }) {
  const symbols = {
    course: '✓',
    code: '</>',
    learn: '✦',
    award: '★',
  }
  return <span className="text-sm font-bold leading-none">{symbols[type] ?? '•'}</span>
}

function RadarChart({ categories }) {
  const polygonForPercent = (percent) =>
    chartPoints
      .map(([x, y]) => {
        const centerX = 145
        const centerY = 124
        const scale = percent / 100
        return `${centerX + (x - centerX) * scale},${centerY + (y - centerY) * scale}`
      })
      .join(' ')

  const dataPoints = categories
    .map((category, index) => {
      const [x, y] = chartPoints[index]
      const scale = category.score / 100
      return `${145 + (x - 145) * scale},${124 + (y - 124) * scale}`
    })
    .join(' ')

  return (
    <div className="mt-3 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
      <svg viewBox="0 0 290 225" role="img" aria-label="Radar chart of skill scores across six categories" className="w-full max-w-[290px]">
        {[25, 50, 75, 100].map((percent) => (
          <polygon
            key={percent}
            points={polygonForPercent(percent)}
            fill={percent === 100 ? 'none' : '#f8fbff'}
            stroke="#d8e2ef"
            strokeWidth="1"
          />
        ))}
        {chartPoints.map(([x, y], index) => (
          <line key={`axis-${index}`} x1="145" y1="124" x2={x} y2={y} stroke="#d8e2ef" strokeWidth="1" />
        ))}
        {[25, 50, 75, 100].map((percent) => (
          <text key={`label-${percent}`} x="145" y={124 - (72 * percent) / 100 + 4} textAnchor="middle" className="fill-[#7b8aa0] text-[8px]">
            {percent}
          </text>
        ))}
        <polygon points={dataPoints} fill="#bfdbfe" fillOpacity="0.55" stroke="#4f8ef7" strokeWidth="1.5" />
        {categories.map((category, index) => {
          const [x, y] = chartPoints[index]
          const scale = category.score / 100
          return (
            <circle
              key={category.name}
              cx={145 + (x - 145) * scale}
              cy={124 + (y - 124) * scale}
              r="2.5"
              fill={category.color}
            />
          )
        })}
        <text x="145" y="23" textAnchor="middle" className="fill-[#596984] text-[9px]">Programming</text>
        <text x="233" y="78" textAnchor="start" className="fill-[#596984] text-[9px]">Data Science</text>
        <text x="221" y="177" textAnchor="start" className="fill-[#596984] text-[9px]">Web Development</text>
        <text x="145" y="216" textAnchor="middle" className="fill-[#596984] text-[9px]">Database</text>
        <text x="67" y="177" textAnchor="end" className="fill-[#596984] text-[9px]">DevOps</text>
        <text x="67" y="78" textAnchor="end" className="fill-[#596984] text-[9px]">Soft Skills</text>
      </svg>
      <div className="grid w-full grid-cols-2 gap-x-4 gap-y-3 sm:w-auto sm:grid-cols-1">
        {categories.map((category) => (
          <div key={category.name} className="flex min-w-0 items-center gap-2 text-[10px] text-[#55657e]">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: category.color }} />
            <span className="min-w-0 flex-1 truncate">{category.name}</span>
            <span className="font-semibold text-[#34435d]">{category.score}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProgressChart({ progress }) {
  const chartSeries = [
    { color: '#2563eb', values: progress.map((item) => item.overall) },
    { color: '#10b981', values: progress.map((item) => item.programming) },
    { color: '#8b5cf6', values: progress.map((item) => item.dataScience) },
  ]

  return (
    <svg viewBox="0 0 540 205" role="img" aria-label="Skill progress from May through October" className="mt-3 w-full">
      {[25, 50, 75, 100].map((score) => {
        const y = 180 - score * 1.35
        return (
          <g key={score}>
            <line x1="52" y1={y} x2="510" y2={y} stroke="#edf1f6" strokeWidth="1" />
            <text x="37" y={y + 3} textAnchor="end" className="fill-[#71809a] text-[8px]">{score}</text>
          </g>
        )
      })}
      <line x1="52" y1="45" x2="52" y2="180" stroke="#dbe4ef" />
      <line x1="52" y1="180" x2="510" y2="180" stroke="#dbe4ef" />
      <text x="10" y="43" className="fill-[#71809a] text-[8px]">Score (%)</text>
      {progress.map((item, index) => (
        <text key={item.month} x={52 + index * 90} y="196" textAnchor="middle" className="fill-[#596984] text-[9px]">{item.month}</text>
      ))}
      {chartSeries.map((series) => (
        <g key={series.color}>
          <polyline
            points={series.values.map((value, index) => `${52 + index * 90},${180 - value * 1.35}`).join(' ')}
            fill="none"
            stroke={series.color}
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {series.values.map((value, index) => {
            const cx = 52 + index * 90
            const cy = 180 - value * 1.35
            return <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.7" fill={series.color} />
          })}
        </g>
      ))}
    </svg>
  )
}

function StudentSkillAnalysisPage() {
  const [analysis, setAnalysis] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [showFullCategoryBreakdown, setShowFullCategoryBreakdown] = useState(false)
  const [showAllActivities, setShowAllActivities] = useState(false)
  const [showAllStrengths, setShowAllStrengths] = useState(false)
  const [showLearningRecommendations, setShowLearningRecommendations] = useState(false)
  const [showDetailedProgress, setShowDetailedProgress] = useState(false)

  useEffect(() => {
    let isMounted = true
    getStudentSkillAnalysisData()
      .then((data) => {
        if (isMounted) setAnalysis(data)
      })
      .catch((error) => {
        if (isMounted) setLoadError(`Could not load skill analysis: ${error.message}`)
      })

    return () => {
      isMounted = false
    }
  }, [])

  if (loadError) {
    return <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{loadError}</p>
  }

  if (!analysis) {
    return <p role="status" className="text-sm text-[#71809a]">Loading skill analysis...</p>
  }

  const {
    summary,
    categories,
    strengths,
    improvementAreas,
    learningRecommendations,
    progress,
    recentActivity,
    updatedAt,
  } = analysis
  const stats = [
    { label: 'Overall Skill Score', value: `${summary.overallScore}%`, note: 'Good', tone: 'green', type: 'score' },
    { label: 'Total Skills', value: summary.totalSkills, note: 'Across All Categories', tone: 'blue', type: 'skills' },
    { label: 'Strong Skills', value: summary.strongSkills, note: 'Skills You Excel In', tone: 'green', type: 'strong' },
    { label: 'Skills to Improve', value: summary.skillsToImprove, note: 'Focus Areas', tone: 'orange', type: 'improve' },
    { label: 'Learning Streak', value: summary.learningStreak, note: 'Days in a Row', tone: 'purple', type: 'streak' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-extrabold tracking-[-0.035em] text-[#101c3d] sm:text-3xl">Skill Analysis</h1>
          <p className="mt-1 text-sm text-[#66738d]">Analyze your skills in detail and track your growth over time.</p>
        </div>
        <p className="text-[11px] font-medium text-[#71809a]">Last updated: {updatedAt} <span aria-hidden="true">↻</span></p>
      </div>

      <section aria-label="Skill summary" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => (
          <article key={stat.label} className="flex min-h-[94px] items-center gap-3 rounded-xl border border-[#e4ebf4] bg-white p-3.5 shadow-[0_2px_10px_rgba(26,50,90,0.03)]">
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${
              stat.tone === 'green' ? 'bg-[#e6f9ef] text-[#13a66b]' :
                stat.tone === 'blue' ? 'bg-[#eaf2ff] text-[#3b82f6]' :
                  stat.tone === 'orange' ? 'bg-[#fff2e4] text-[#f28a25]' : 'bg-[#f3eaff] text-[#9346db]'
            }`} aria-hidden="true">
              {stat.type === 'score' ? '♧' : stat.type === 'skills' ? '▣' : stat.type === 'strong' ? '♙' : stat.type === 'improve' ? '↗' : '♨'}
            </span>
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <p className="truncate text-[10px] font-semibold text-[#64748b]">{stat.label}</p>
              {stat.type === 'score' ? (
                <div className="mt-1 flex items-center justify-center gap-2 sm:justify-start">
                  <div className="relative h-10 w-16">
                    <svg viewBox="0 0 64 40" aria-hidden="true" className="absolute inset-0 h-full w-full">
                      <path d="M8 34a24 24 0 0 1 48 0" fill="none" stroke="#e5edf0" strokeWidth="3" strokeLinecap="round" />
                      <path
                        d="M8 34a24 24 0 0 1 48 0"
                        fill="none"
                        stroke="#16b978"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={`${summary.overallScore * 0.754} 100`}
                      />
                    </svg>
                    <span className="absolute inset-x-0 bottom-0 text-center text-lg font-extrabold leading-none text-[#172744]">{stat.value}</span>
                  </div>
                  <span className="mt-3 text-[9px] text-[#71809a]">{stat.note}</span>
                </div>
              ) : (
                <>
                  <p className="mt-1 text-xl font-extrabold leading-none text-[#172744]">{stat.value}</p>
                  <p className="mt-1 text-[9px] text-[#71809a]">{stat.note}</p>
                </>
              )}
            </div>
          </article>
        ))}
      </section>

      <section aria-label="Skill category scores, strengths, and areas to improve" className="grid gap-3 xl:grid-cols-[1.35fr_0.92fr_0.92fr]">
        <Panel title="Skills by Category">
          <RadarChart categories={categories} />
          {showFullCategoryBreakdown && (
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[#edf1f6] pt-3 sm:grid-cols-3">
              {categories.map((category) => (
                <div key={category.name} className="rounded-lg bg-[#f7faff] p-2">
                  <p className="truncate text-[10px] font-semibold text-[#53647e]">{category.name}</p>
                  <p className="mt-1 text-xs font-bold text-[#172744]">{category.score}%</p>
                </div>
              ))}
            </div>
          )}
          <div className="mt-2 flex justify-end">
            <button type="button" onClick={() => setShowFullCategoryBreakdown((visible) => !visible)} className="rounded-md bg-[#eff5ff] px-3 py-1.5 text-[10px] font-semibold text-[#1260ed] hover:bg-[#e4eeff]">
              {showFullCategoryBreakdown ? 'Hide Breakdown' : 'View Full Breakdown'}
            </button>
          </div>
        </Panel>

        <Panel title="Top Strengths">
          <div className="mt-3 space-y-3">
            {(showAllStrengths ? strengths : strengths.slice(0, 5)).map((skill) => (
              <div key={skill.name} className="flex items-center gap-2">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${skill.color}`}>
                  <SkillBadgeIcon type={skill.icon} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="truncate text-[10px] font-medium text-[#34435d]">{skill.name}</span>
                    <span className="text-[9px] font-semibold text-[#34435d]">{skill.score}%</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-[#edf1f6]">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#19b977] to-[#11a66c]" style={{ width: `${skill.score}%` }} />
                  </div>
                </div>
                <span className={`hidden rounded px-1.5 py-1 text-[8px] font-semibold sm:inline ${
                  skill.level === 'Advanced' ? 'bg-[#e7f9ef] text-[#138455]' : 'bg-[#eaf2ff] text-[#2563eb]'
                }`}>
                  {skill.level}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <button type="button" onClick={() => setShowAllStrengths((visible) => !visible)} className="rounded-md bg-[#eff5ff] px-3 py-1.5 text-[10px] font-semibold text-[#1260ed] hover:bg-[#e4eeff]">
              {showAllStrengths ? 'Show Top Strengths' : 'View All Strengths'}
            </button>
          </div>
        </Panel>

        <Panel title="Areas to Improve">
          <div className="mt-3 space-y-3">
            {improvementAreas.map((item) => (
              <div key={item.name}>
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <span className="truncate text-[10px] font-medium text-[#34435d]">{item.name}</span>
                  <span className="text-[9px] font-semibold text-[#34435d]">{item.score}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#edf1f6]">
                    <div className={`h-full rounded-full ${item.color === 'amber' ? 'bg-[#f59e0b]' : 'bg-[#ef4444]'}`} style={{ width: `${item.score * 2}%` }} />
                  </div>
                  <span className={`min-w-[32px] rounded px-1.5 py-1 text-center text-[8px] font-semibold ${
                    item.color === 'amber' ? 'bg-[#fff5e8] text-[#c77913]' : 'bg-[#fff0f0] text-[#dc3e48]'
                  }`}>
                    {item.level}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <button type="button" onClick={() => setShowLearningRecommendations((visible) => !visible)} className="rounded-md bg-[#eff5ff] px-3 py-1.5 text-[10px] font-semibold text-[#1260ed] hover:bg-[#e4eeff]">
              {showLearningRecommendations ? 'Hide Recommendations' : 'View Learning Recommendations'}
            </button>
          </div>
          {showLearningRecommendations && (
            <ul className="mt-3 space-y-2 border-t border-[#edf1f6] pt-3">
              {learningRecommendations.map((item) => (
                <li key={item.title} className="rounded-lg bg-[#f7faff] p-2.5">
                  <p className="text-[10px] font-semibold text-[#34435d]">{item.title}</p>
                  <p className="mt-1 text-[9px] leading-4 text-[#71809a]">{item.detail}</p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </section>

      <section aria-label="Skill progress and recent learning activity" className="grid gap-3 xl:grid-cols-[1.25fr_0.9fr]">
        <Panel title="Skill Progress Over Time">
          <div className="mt-3 flex flex-wrap justify-end gap-x-4 gap-y-2">
            {[
              ['Overall Score', '#2563eb'],
              ['Programming', '#10b981'],
              ['Data Science', '#8b5cf6'],
            ].map(([label, color]) => (
              <span key={label} className="flex items-center gap-1.5 text-[9px] text-[#64748b]">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                {label}
              </span>
            ))}
          </div>
          <ProgressChart progress={progress} />
          <div className="mt-2 flex justify-center">
            <button type="button" onClick={() => setShowDetailedProgress((visible) => !visible)} className="rounded-md bg-[#eff5ff] px-3 py-1.5 text-[10px] font-semibold text-[#1260ed] hover:bg-[#e4eeff]">
              {showDetailedProgress ? 'Hide Detailed Progress' : 'View Detailed Progress'}
            </button>
          </div>
          {showDetailedProgress && (
            <p className="mt-3 rounded-lg bg-[#f7faff] px-3 py-2 text-[10px] leading-5 text-[#64748b]">
              Your overall score improved from {progress[0].overall}% in {progress[0].month} to {progress[progress.length - 1].overall}% in {progress[progress.length - 1].month}.
            </p>
          )}
        </Panel>

        <Panel title="Recent Learning Activity">
          <div className="mt-2 divide-y divide-[#edf1f6]">
            {(showAllActivities ? recentActivity : recentActivity.slice(0, 4)).map((activity) => (
              <div key={`${activity.title}-${activity.date}`} className="flex items-center gap-2.5 py-2.5 first:pt-1">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  activity.color === 'green' ? 'bg-[#e7f9ef] text-[#13a66b]' :
                    activity.color === 'blue' ? 'bg-[#eaf2ff] text-[#3b82f6]' :
                      activity.color === 'purple' ? 'bg-[#f3eaff] text-[#9346db]' : 'bg-[#fff2e4] text-[#f28a25]'
                }`}>
                  <ActivityIcon type={activity.icon} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] font-semibold text-[#34435d]">{activity.title}</p>
                  <p className="mt-0.5 text-[9px] text-[#71809a]">{activity.category}</p>
                </div>
                <p className="shrink-0 text-right text-[8px] leading-4 text-[#71809a]">
                  {activity.date}<br />{activity.time}
                </p>
              </div>
            ))}
          </div>
          {recentActivity.length > 4 && (
            <button type="button" onClick={() => setShowAllActivities((visible) => !visible)} className="mt-3 block mx-auto rounded-md bg-[#eff5ff] px-3 py-1.5 text-[10px] font-semibold text-[#1260ed] hover:bg-[#e4eeff]">
              {showAllActivities ? 'Show Less' : 'View All Activity'}
            </button>
          )}
        </Panel>
      </section>
      <p className="sr-only" role="status" aria-live="polite">
        Skill analysis sample data. Overall skill score {summary.overallScore} percent.
      </p>
    </div>
  )
}

export default StudentSkillAnalysisPage
