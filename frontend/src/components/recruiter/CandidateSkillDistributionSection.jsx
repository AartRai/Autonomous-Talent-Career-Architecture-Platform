import { useState } from 'react'

function CandidateSkillDistributionSection({ skills = [], loading = false }) {
  const [activeSkill, setActiveSkill] = useState(null)

  const maxScale = 1000
  const yTicks = [1000, 750, 500, 250, 0]

  // Chart dimensions in SVG user space
  const chartWidth = 640
  const chartHeight = 220
  const paddingLeft = 50
  const paddingRight = 20
  const paddingTop = 25
  const paddingBottom = 40

  const plotWidth = chartWidth - paddingLeft - paddingRight
  const plotHeight = chartHeight - paddingTop - paddingBottom

  return (
    <section aria-label="Candidate Skill Distribution" className="space-y-4">
      {/* Header */}
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#101c3d] sm:text-2xl">
            Candidate Skill Distribution
          </h2>
          <p className="mt-0.5 text-xs text-[#66738d] sm:text-sm">
            Explore the skills represented across candidate profiles.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#1260ed]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#1260ed]" />
            Demo Data
          </span>
        </div>
      </div>

      {/* Main Card Container */}
      <div className="rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-6 lg:p-7">
        {loading && skills.length === 0 ? (
          <div className="h-64 animate-pulse rounded-xl bg-slate-100" />
        ) : (
          <div className="space-y-6">
            {/* Top Metrics Summary */}
            <div className="grid grid-cols-2 gap-3 border-b border-[#f0f4fa] pb-4 sm:grid-cols-4 sm:gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Top Skill
                </span>
                <p className="mt-0.5 text-sm font-bold text-[#101c3d] sm:text-base">
                  React (840)
                </p>
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Talent Depth
                </span>
                <p className="mt-0.5 text-sm font-bold text-[#1260ed] sm:text-base">
                  5 Core Areas
                </p>
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Avg Alignment
                </span>
                <p className="mt-0.5 text-sm font-bold text-[#101c3d] sm:text-base">
                  52% of pool
                </p>
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Data Source
                </span>
                <p className="mt-0.5 text-xs font-semibold text-[#66738d] sm:text-sm">
                  FastAPI Ready (Mock)
                </p>
              </div>
            </div>

            {/* Desktop & Tablet SVG Bar Chart */}
            <div className="relative">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="h-auto w-full select-none"
                aria-label="Skill distribution bar chart"
              >
                <defs>
                  <linearGradient id="barGradientPrimary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#1260ed" />
                  </linearGradient>
                  <linearGradient id="barGradientHover" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>

                {/* Horizontal Gridlines & Y-Axis Labels */}
                {yTicks.map((tick) => {
                  const y =
                    paddingTop +
                    plotHeight -
                    (tick / maxScale) * plotHeight
                  return (
                    <g key={tick}>
                      <line
                        x1={paddingLeft}
                        y1={y}
                        x2={chartWidth - paddingRight}
                        y2={y}
                        stroke="#edf2f9"
                        strokeDasharray={tick === 0 ? 'none' : '3 4'}
                        strokeWidth={tick === 0 ? '1.5' : '1'}
                      />
                      <text
                        x={paddingLeft - 10}
                        y={y + 3.5}
                        textAnchor="end"
                        className="fill-slate-400 text-[10px] font-medium"
                      >
                        {tick}
                      </text>
                    </g>
                  )
                })}

                {/* Bars & X-Axis Labels */}
                {skills.map((item, index) => {
                  const barWidth = 44
                  const groupWidth = plotWidth / skills.length
                  const x =
                    paddingLeft +
                    index * groupWidth +
                    (groupWidth - barWidth) / 2
                  const barHeight = (item.candidateCount / maxScale) * plotHeight
                  const y = paddingTop + plotHeight - barHeight
                  const isHovered = activeSkill?.id === item.id

                  return (
                    <g
                      key={item.id}
                      className="cursor-pointer transition-all duration-150"
                      onMouseEnter={() => setActiveSkill(item)}
                      onMouseLeave={() => setActiveSkill(null)}
                      onClick={() =>
                        setActiveSkill(activeSkill?.id === item.id ? null : item)
                      }
                    >
                      {/* Interactive background highlight column */}
                      <rect
                        x={paddingLeft + index * groupWidth}
                        y={paddingTop}
                        width={groupWidth}
                        height={plotHeight}
                        fill={isHovered ? '#f0f6ff' : 'transparent'}
                        opacity={isHovered ? 0.6 : 0}
                        className="transition-opacity duration-150"
                      />

                      {/* Bar */}
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={barHeight}
                        rx="6"
                        fill={
                          isHovered
                            ? 'url(#barGradientHover)'
                            : 'url(#barGradientPrimary)'
                        }
                        className="transition-all duration-150"
                        filter={
                          isHovered
                            ? 'drop-shadow(0 4px 8px rgba(18,96,237,0.3))'
                            : 'none'
                        }
                      />

                      {/* Bar Value on top */}
                      <text
                        x={x + barWidth / 2}
                        y={y - 8}
                        textAnchor="middle"
                        className={`text-[11px] font-bold transition-colors ${
                          isHovered ? 'fill-[#1260ed]' : 'fill-[#101c3d]'
                        }`}
                      >
                        {item.candidateCount}
                      </text>

                      {/* Category label on X-axis */}
                      <text
                        x={x + barWidth / 2}
                        y={chartHeight - paddingBottom + 18}
                        textAnchor="middle"
                        className={`text-[11.5px] font-semibold transition-colors ${
                          isHovered ? 'fill-[#1260ed]' : 'fill-[#475569]'
                        }`}
                      >
                        {item.skill}
                      </text>

                      {/* Percentage label underneath category */}
                      <text
                        x={x + barWidth / 2}
                        y={chartHeight - paddingBottom + 32}
                        textAnchor="middle"
                        className="fill-slate-400 text-[10px] font-medium"
                      >
                        {item.percentage}%
                      </text>
                    </g>
                  )
                })}
              </svg>

              {/* Dynamic Interactive Tooltip */}
              {activeSkill && (
                <div
                  role="tooltip"
                  className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 rounded-xl border border-[#d6e6fe] bg-[#101c3d] px-3.5 py-2 text-center text-xs text-white shadow-lg transition-all"
                >
                  <p className="font-bold text-white">{activeSkill.skill}</p>
                  <p className="mt-0.5 text-[11px] text-[#93c5fd]">
                    <span className="font-extrabold text-white">
                      {activeSkill.candidateCount}
                    </span>{' '}
                    candidates ({activeSkill.percentage}% of talent pool)
                  </p>
                  <span className="mt-0.5 block text-[9px] uppercase tracking-wider text-slate-400">
                    Demonstration Estimate
                  </span>
                </div>
              )}
            </div>

            {/* Mobile Horizontal Progress Bars for Enhanced Legibility */}
            <div className="space-y-3.5 border-t border-[#f0f4fa] pt-4 sm:hidden">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Category Breakdown (Mobile View)
              </div>
              {skills.map((item) => (
                <div key={item.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-[#101c3d]">
                    <span>{item.skill}</span>
                    <span className="text-[#1260ed]">
                      {item.candidateCount} candidates ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#edf2f9]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#1260ed] to-[#3b82f6]"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Data architecture disclosure note */}
            <p className="text-[11px] leading-relaxed text-[#71829e]">
              * Skill distribution counts are demonstration values for UI
              testing. Real-time aggregation will be ingested from the FastAPI
              analytics endpoints upon database connection.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default CandidateSkillDistributionSection
