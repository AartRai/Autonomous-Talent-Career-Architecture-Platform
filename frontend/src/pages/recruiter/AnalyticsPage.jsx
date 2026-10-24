import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ApplicationsIcon,
  PostJobIcon,
  CandidateProfilesIcon,
  AnalyticsIcon,
  CloseIcon,
  SearchIcon,
} from '../../components/recruiter/RecruiterIcons.jsx'

// Supplementary SVG icons for Analytics UI
function CalendarIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function TrendingUpIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="m23 6-9.5 9.5-5-5L1 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 6h6v6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ClockIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function DownloadIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronDownIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function InfoCircleIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 8h.01M12 11v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function CheckCircleIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m9 11 3 3L22 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function InboxEmptyIcon({ className = 'h-10 w-10' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M22 12h-6l-2 3h-4l-2-3H2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.45 5.11 2 12v0h20v0l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function FileTextIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * Mathematically Consistent Demonstration Datasets
 *
 * Each date-range bucket maintains strict mathematical parity across:
 * 1. Total Applications KPI = Sum of Trend Points Applications
 * 2. Total Applications KPI = Sum of Status Distribution Counts
 * 3. Status Distribution percentages sum to exactly 100.0%
 * 4. Shortlisted Candidates KPI = Sum of Trend Points Shortlisted
 * 5. Shortlisted Candidates KPI = Status Distribution (Shortlisted + Interview Stage)
 * 6. Job-wise Application Performance rows sum to Total Applications, Shortlists, Interviews & Hires
 * 7. In every job: Hired <= Interview-Stage <= Shortlisted <= Total Applications
 * 8. Hiring Conversion Rate = (Hired / Total Applications) * 100%
 */
const analyticsDemoData = {
  '7d': {
    rangeKey: '7d',
    label: 'Last 7 Days',
    dateSpan: 'Oct 20, 2026 – Oct 26, 2026',
    comparisonLabel: 'vs prior 7 days',

    // KPI Cards
    totalApplications: 38,
    totalAppsTrend: '+6 (+18.8%)',
    totalAppsTrendPositive: true,

    activeJobPosts: 12,
    activeJobsTrend: '3 closing soon',
    activeJobsContext: 'Workspace active roles',

    shortlistedCandidates: 11,
    shortlistRate: '28.9%',
    shortlistedTrend: '+3 candidates',
    shortlistedTrendPositive: true,

    interviewsScheduled: 5,
    interviewsTrend: '3 scheduled tomorrow',
    interviewRate: '45.5% of shortlisted',

    hiredCandidates: 2,
    hiringConversionRate: '5.3%',

    // Application Trends (Daily: 4 + 7 + 5 + 8 + 9 + 3 + 2 = 38 apps; 1 + 2 + 1 + 3 + 2 + 1 + 1 = 11 shortlisted)
    trendIntervalName: 'Daily',
    peakIntervalText: 'Fri: 9 apps',
    avgPerIntervalText: '5.4 apps / day',
    trendPoints: [
      { label: 'Mon', fullLabel: 'Oct 20 (Mon)', applications: 4, shortlisted: 1 },
      { label: 'Tue', fullLabel: 'Oct 21 (Tue)', applications: 7, shortlisted: 2 },
      { label: 'Wed', fullLabel: 'Oct 22 (Wed)', applications: 5, shortlisted: 1 },
      { label: 'Thu', fullLabel: 'Oct 23 (Thu)', applications: 8, shortlisted: 3 },
      { label: 'Fri', fullLabel: 'Oct 24 (Fri)', applications: 9, shortlisted: 2 },
      { label: 'Sat', fullLabel: 'Oct 25 (Sat)', applications: 3, shortlisted: 1 },
      { label: 'Sun', fullLabel: 'Oct 26 (Sun)', applications: 2, shortlisted: 1 },
    ],

    // Status Distribution: 10 + 10 + 11 + 5 + 2 = 38 (26.3% + 26.3% + 28.9% + 13.2% + 5.3% = 100.0%)
    // Shortlisted = 11 (matches KPI 11), Interview Stage = 5 (matches KPI 5), Hired = 2 (matches KPI 2)
    statusDistribution: [
      {
        stage: 'Applied',
        description: 'New submissions awaiting initial resume screen',
        count: 10,
        percentage: 26.3,
        color: '#0284c7', // Sky-600
        bgClass: 'bg-sky-500',
        toneClass: 'text-sky-700 bg-sky-50 border-sky-200',
      },
      {
        stage: 'Under Review',
        description: 'Recruiter profile review and portfolio evaluation',
        count: 10,
        percentage: 26.3,
        color: '#d97706', // Amber-600
        bgClass: 'bg-amber-500',
        toneClass: 'text-amber-700 bg-amber-50 border-amber-200',
      },
      {
        stage: 'Shortlisted',
        description: 'Passed screening, queued for hiring manager',
        count: 11,
        percentage: 28.9,
        color: '#16a34a', // Emerald-600
        bgClass: 'bg-emerald-500',
        toneClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      },
      {
        stage: 'Interview Stage',
        description: 'Engaged in live technical and culture rounds',
        count: 5,
        percentage: 13.2,
        color: '#6366f1', // Indigo-500
        bgClass: 'bg-indigo-500',
        toneClass: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      },
      {
        stage: 'Hired / Closed',
        description: 'Offers extended, accepted and onboarding',
        count: 2,
        percentage: 5.3,
        color: '#8b5cf6', // Violet-500
        bgClass: 'bg-violet-500',
        toneClass: 'text-violet-700 bg-violet-50 border-violet-200',
      },
    ],

    // Job-wise Performance (Hired <= Interview-Stage <= Shortlisted <= Applications)
    // 12+10+7+5+4 = 38 apps; 4+3+2+1+1 = 11 shortlisted; 2+1+1+1+0 = 5 interviews; 1+1+0+0+0 = 2 hired
    jobPerformance: [
      {
        id: 'job-perf-1',
        title: 'Software Development Engineer Intern',
        department: 'Engineering & Technology',
        status: 'Active',
        applications: 12,
        shortlisted: 4,
        interviewStage: 2,
        hired: 1,
        conversionRate: '8.3%',
        trend: '+4 new',
      },
      {
        id: 'job-perf-2',
        title: 'Frontend Developer',
        department: 'Core Web Experience',
        status: 'Active',
        applications: 10,
        shortlisted: 3,
        interviewStage: 1,
        hired: 1,
        conversionRate: '10.0%',
        trend: '+3 new',
      },
      {
        id: 'job-perf-3',
        title: 'AI / Machine Learning Engineer',
        department: 'AI Labs & Research',
        status: 'Active',
        applications: 7,
        shortlisted: 2,
        interviewStage: 1,
        hired: 0,
        conversionRate: '0.0%',
        trend: '+2 new',
      },
      {
        id: 'job-perf-4',
        title: 'Data Analyst',
        department: 'Business Intelligence',
        status: 'Paused',
        applications: 5,
        shortlisted: 1,
        interviewStage: 1,
        hired: 0,
        conversionRate: '0.0%',
        trend: 'Paused',
      },
      {
        id: 'job-perf-5',
        title: 'Cloud & DevOps Architect',
        department: 'Infrastructure',
        status: 'Active',
        applications: 4,
        shortlisted: 1,
        interviewStage: 0,
        hired: 0,
        conversionRate: '0.0%',
        trend: '+1 new',
      },
    ],
  },

  '30d': {
    rangeKey: '30d',
    label: 'Last 30 Days',
    dateSpan: 'Sep 27, 2026 – Oct 26, 2026',
    comparisonLabel: 'vs prior 30 days',

    // KPI Cards
    totalApplications: 134,
    totalAppsTrend: '+22 (+19.6%)',
    totalAppsTrendPositive: true,

    activeJobPosts: 12,
    activeJobsTrend: '3 closing soon',
    activeJobsContext: 'Workspace active roles',

    shortlistedCandidates: 42,
    shortlistRate: '31.3%',
    shortlistedTrend: '+8 candidates',
    shortlistedTrendPositive: true,

    interviewsScheduled: 18,
    interviewsTrend: '6 scheduled this week',
    interviewRate: '42.9% of shortlisted',

    hiredCandidates: 8,
    hiringConversionRate: '6.0%',

    // Application Trends (Weekly: 22 + 28 + 36 + 30 + 18 = 134 apps; 7 + 9 + 11 + 9 + 6 = 42 shortlisted)
    trendIntervalName: 'Weekly',
    peakIntervalText: 'W3: 36 apps',
    avgPerIntervalText: '26.8 apps / week',
    trendPoints: [
      { label: 'W1 (Sep 27)', fullLabel: 'Sep 27 – Oct 03', applications: 22, shortlisted: 7 },
      { label: 'W2 (Oct 04)', fullLabel: 'Oct 04 – Oct 10', applications: 28, shortlisted: 9 },
      { label: 'W3 (Oct 11)', fullLabel: 'Oct 11 – Oct 17', applications: 36, shortlisted: 11 },
      { label: 'W4 (Oct 18)', fullLabel: 'Oct 18 – Oct 24', applications: 30, shortlisted: 9 },
      { label: 'W5 (Current)', fullLabel: 'Oct 25 – Oct 26', applications: 18, shortlisted: 6 },
    ],

    // Status Distribution: 36 + 30 + 42 + 18 + 8 = 134 (26.9% + 22.4% + 31.3% + 13.4% + 6.0% = 100.0%)
    // Shortlisted = 42 (matches KPI 42), Interview Stage = 18 (matches KPI 18), Hired = 8 (matches KPI 8)
    statusDistribution: [
      {
        stage: 'Applied',
        description: 'New submissions awaiting initial resume screen',
        count: 36,
        percentage: 26.9,
        color: '#0284c7', // Sky-600
        bgClass: 'bg-sky-500',
        toneClass: 'text-sky-700 bg-sky-50 border-sky-200',
      },
      {
        stage: 'Under Review',
        description: 'Recruiter profile review and portfolio evaluation',
        count: 30,
        percentage: 22.4,
        color: '#d97706', // Amber-600
        bgClass: 'bg-amber-500',
        toneClass: 'text-amber-700 bg-amber-50 border-amber-200',
      },
      {
        stage: 'Shortlisted',
        description: 'Passed screening, queued for hiring manager',
        count: 42,
        percentage: 31.3,
        color: '#16a34a', // Emerald-600
        bgClass: 'bg-emerald-500',
        toneClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      },
      {
        stage: 'Interview Stage',
        description: 'Engaged in live technical and culture rounds',
        count: 18,
        percentage: 13.4,
        color: '#6366f1', // Indigo-500
        bgClass: 'bg-indigo-500',
        toneClass: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      },
      {
        stage: 'Hired / Closed',
        description: 'Offers extended, accepted and onboarding',
        count: 8,
        percentage: 6.0,
        color: '#8b5cf6', // Violet-500
        bgClass: 'bg-violet-500',
        toneClass: 'text-violet-700 bg-violet-50 border-violet-200',
      },
    ],

    // Job-wise Performance (Hired <= Interview-Stage <= Shortlisted <= Applications)
    // 42+36+26+18+12 = 134 apps; 14+11+8+5+4 = 42 shortlisted; 6+5+4+2+1 = 18 interviews; 3+2+2+1+0 = 8 hired
    jobPerformance: [
      {
        id: 'job-perf-1',
        title: 'Software Development Engineer Intern',
        department: 'Engineering & Technology',
        status: 'Active',
        applications: 42,
        shortlisted: 14,
        interviewStage: 6,
        hired: 3,
        conversionRate: '7.1%',
        trend: '+12 new',
      },
      {
        id: 'job-perf-2',
        title: 'Frontend Developer',
        department: 'Core Web Experience',
        status: 'Active',
        applications: 36,
        shortlisted: 11,
        interviewStage: 5,
        hired: 2,
        conversionRate: '5.6%',
        trend: '+9 new',
      },
      {
        id: 'job-perf-3',
        title: 'AI / Machine Learning Engineer',
        department: 'AI Labs & Research',
        status: 'Active',
        applications: 26,
        shortlisted: 8,
        interviewStage: 4,
        hired: 2,
        conversionRate: '7.7%',
        trend: '+6 new',
      },
      {
        id: 'job-perf-4',
        title: 'Data Analyst',
        department: 'Business Intelligence',
        status: 'Paused',
        applications: 18,
        shortlisted: 5,
        interviewStage: 2,
        hired: 1,
        conversionRate: '5.6%',
        trend: 'Paused',
      },
      {
        id: 'job-perf-5',
        title: 'Cloud & DevOps Architect',
        department: 'Infrastructure',
        status: 'Active',
        applications: 12,
        shortlisted: 4,
        interviewStage: 1,
        hired: 0,
        conversionRate: '0.0%',
        trend: '+3 new',
      },
    ],
  },

  '90d': {
    rangeKey: '90d',
    label: 'Last 90 Days',
    dateSpan: 'Jul 29, 2026 – Oct 26, 2026',
    comparisonLabel: 'vs prior 90 days',

    // KPI Cards
    totalApplications: 412,
    totalAppsTrend: '+94 (+29.6%)',
    totalAppsTrendPositive: true,

    activeJobPosts: 12,
    activeJobsTrend: '18 total closed/active',
    activeJobsContext: 'Workspace active roles',

    shortlistedCandidates: 128,
    shortlistRate: '31.1%',
    shortlistedTrend: '+28 candidates',
    shortlistedTrendPositive: true,

    interviewsScheduled: 54,
    interviewsTrend: '42 completed, 12 upcoming',
    interviewRate: '42.2% of shortlisted',

    hiredCandidates: 25,
    hiringConversionRate: '6.1%',

    // Application Trends (Bi-Weekly: 52 + 64 + 78 + 82 + 76 + 60 = 412 apps; 16 + 20 + 24 + 26 + 23 + 19 = 128 shortlisted)
    trendIntervalName: 'Bi-Weekly',
    peakIntervalText: 'Sep 16-30: 82 apps',
    avgPerIntervalText: '68.7 apps / bi-week',
    trendPoints: [
      { label: 'Jul 29-Aug 15', fullLabel: 'Jul 29 – Aug 15', applications: 52, shortlisted: 16 },
      { label: 'Aug 16-31', fullLabel: 'Aug 16 – Aug 31', applications: 64, shortlisted: 20 },
      { label: 'Sep 01-15', fullLabel: 'Sep 01 – Sep 15', applications: 78, shortlisted: 24 },
      { label: 'Sep 16-30', fullLabel: 'Sep 16 – Sep 30', applications: 82, shortlisted: 26 },
      { label: 'Oct 01-15', fullLabel: 'Oct 01 – Oct 15', applications: 76, shortlisted: 23 },
      { label: 'Oct 16-26', fullLabel: 'Oct 16 – Oct 26', applications: 60, shortlisted: 19 },
    ],

    // Status Distribution: 110 + 95 + 128 + 54 + 25 = 412 (26.7% + 23.1% + 31.1% + 13.1% + 6.0% = 100.0%)
    // Shortlisted = 128 (matches KPI 128), Interview Stage = 54 (matches KPI 54), Hired = 25 (matches KPI 25)
    statusDistribution: [
      {
        stage: 'Applied',
        description: 'New submissions awaiting initial resume screen',
        count: 110,
        percentage: 26.7,
        color: '#0284c7', // Sky-600
        bgClass: 'bg-sky-500',
        toneClass: 'text-sky-700 bg-sky-50 border-sky-200',
      },
      {
        stage: 'Under Review',
        description: 'Recruiter profile review and portfolio evaluation',
        count: 95,
        percentage: 23.1,
        color: '#d97706', // Amber-600
        bgClass: 'bg-amber-500',
        toneClass: 'text-amber-700 bg-amber-50 border-amber-200',
      },
      {
        stage: 'Shortlisted',
        description: 'Passed screening, queued for hiring manager',
        count: 128,
        percentage: 31.1,
        color: '#16a34a', // Emerald-600
        bgClass: 'bg-emerald-500',
        toneClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      },
      {
        stage: 'Interview Stage',
        description: 'Engaged in live technical and culture rounds',
        count: 54,
        percentage: 13.1,
        color: '#6366f1', // Indigo-500
        bgClass: 'bg-indigo-500',
        toneClass: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      },
      {
        stage: 'Hired / Closed',
        description: 'Offers extended, accepted and onboarding',
        count: 25,
        percentage: 6.0,
        color: '#8b5cf6', // Violet-500
        bgClass: 'bg-violet-500',
        toneClass: 'text-violet-700 bg-violet-50 border-violet-200',
      },
    ],

    // Job-wise Performance (Hired <= Interview-Stage <= Shortlisted <= Applications)
    // 128+110+82+54+38 = 412 apps; 40+34+26+16+12 = 128 shortlisted; 17+15+11+6+5 = 54 interviews; 8+7+5+3+2 = 25 hired
    jobPerformance: [
      {
        id: 'job-perf-1',
        title: 'Software Development Engineer Intern',
        department: 'Engineering & Technology',
        status: 'Active',
        applications: 128,
        shortlisted: 40,
        interviewStage: 17,
        hired: 8,
        conversionRate: '6.3%',
        trend: '+38 total',
      },
      {
        id: 'job-perf-2',
        title: 'Frontend Developer',
        department: 'Core Web Experience',
        status: 'Active',
        applications: 110,
        shortlisted: 34,
        interviewStage: 15,
        hired: 7,
        conversionRate: '6.4%',
        trend: '+32 total',
      },
      {
        id: 'job-perf-3',
        title: 'AI / Machine Learning Engineer',
        department: 'AI Labs & Research',
        status: 'Active',
        applications: 82,
        shortlisted: 26,
        interviewStage: 11,
        hired: 5,
        conversionRate: '6.1%',
        trend: '+24 total',
      },
      {
        id: 'job-perf-4',
        title: 'Data Analyst',
        department: 'Business Intelligence',
        status: 'Paused',
        applications: 54,
        shortlisted: 16,
        interviewStage: 6,
        hired: 3,
        conversionRate: '5.6%',
        trend: 'Paused',
      },
      {
        id: 'job-perf-5',
        title: 'Cloud & DevOps Architect',
        department: 'Infrastructure',
        status: 'Active',
        applications: 38,
        shortlisted: 12,
        interviewStage: 5,
        hired: 2,
        conversionRate: '5.3%',
        trend: '+12 total',
      },
    ],
  },
}

/**
 * Escapes a cell value strictly compliant with RFC 4180 CSV specifications.
 * - Numbers and clean values without delimiters are output directly.
 * - Values containing commas, double quotes, or newlines are enclosed in double quotes with internal quotes doubled.
 * - Null or undefined values produce empty cells.
 */
function escapeCsvValue(val) {
  if (val === null || val === undefined) return ''
  if (typeof val === 'number') return String(val)
  const str = String(val)
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

/**
 * Builds CSV content for Analytics Overview & Summary.
 */
function generateSummaryCsv(metrics) {
  const rows = [
    ['SYNAPSE RECRUITER ANALYTICS REPORT - SUMMARY'],
    ['Data Classification', 'Demonstration Data (Not Real Recruitment Activity)'],
    ['Reporting Period', metrics.label],
    ['Date Window', metrics.dateSpan],
    ['Exported At', new Date().toISOString()],
    [],
    ['--- OVERVIEW KPI METRICS ---'],
    ['Metric Name', 'Value', 'Scope', 'Trend / Ratio Context', 'Description'],
    [
      'Total Applications',
      metrics.totalApplications,
      'Selected Period',
      metrics.totalAppsTrend,
      `Applications received during ${metrics.label.toLowerCase()}`,
    ],
    [
      'Active Job Posts',
      metrics.activeJobPosts,
      'All-Time Active',
      metrics.activeJobsTrend,
      'Workspace-level live vacancies (all departments)',
    ],
    [
      'Shortlisted Candidates',
      metrics.shortlistedCandidates,
      'Selected Period',
      `${metrics.shortlistRate} shortlist rate`,
      'Candidates advanced to hiring manager review',
    ],
    [
      'Interview-Stage Candidates',
      metrics.interviewsScheduled,
      'Selected Period',
      metrics.interviewRate,
      'Applicants engaged in active interviews',
    ],
    [
      'Hired Candidates',
      metrics.hiredCandidates,
      'Selected Period',
      `${metrics.hiringConversionRate} overall hiring rate`,
      'Candidates extended and accepted offers',
    ],
    [],
    ['--- APPLICATION STATUS DISTRIBUTION ---'],
    ['Stage Name', 'Candidate Count', 'Cohort Share (%)', 'Description'],
    ...metrics.statusDistribution.map((s) => [
      s.stage,
      s.count,
      `${s.percentage}%`,
      s.description,
    ]),
    [],
    ['--- APPLICATION TRENDS TIME-SERIES ---'],
    ['Reporting Interval', 'Total Applications', 'Shortlisted Candidates', 'Progression Rate (%)'],
    ...metrics.trendPoints.map((t) => [
      t.fullLabel || t.label,
      t.applications,
      t.shortlisted,
      t.applications > 0 ? `${Math.round((t.shortlisted / t.applications) * 100)}%` : '0%',
    ]),
    [],
    ['--- DISCLAIMER ---'],
    [
      'Notice',
      'All figures and time-series displayed in this report are simulated demo values generated for interface evaluation. No actual candidate data was retrieved or processed.',
    ],
  ]

  return rows.map((r) => r.map(escapeCsvValue).join(',')).join('\r\n')
}

/**
 * Builds CSV content for Job-wise Recruitment Performance.
 */
function generateJobPerformanceCsv(metrics) {
  const rows = [
    ['SYNAPSE JOB-WISE RECRUITMENT PERFORMANCE REPORT'],
    ['Data Classification', 'Demonstration Data (Not Real Recruitment Activity)'],
    ['Reporting Period', metrics.label],
    ['Date Window', metrics.dateSpan],
    ['Exported At', new Date().toISOString()],
    [],
    [
      'Job ID',
      'Job Title',
      'Department',
      'Status',
      'Total Applications',
      'Shortlisted Candidates',
      'Interview-Stage Candidates',
      'Hired Candidates',
      'Hiring Conversion Rate (%)',
      'Shortlist-to-Interview Rate (%)',
      'Recent Trend',
    ],
    ...metrics.jobPerformance.map((j) => [
      j.id,
      j.title,
      j.department,
      j.status,
      j.applications,
      j.shortlisted,
      j.interviewStage,
      j.hired,
      j.conversionRate,
      j.shortlisted > 0 ? `${Math.round((j.interviewStage / j.shortlisted) * 100)}%` : '0%',
      j.trend,
    ]),
    [
      'TOTAL',
      `All ${metrics.jobPerformance.length} Tracked Roles`,
      'All Departments',
      'Active / Paused',
      metrics.totalApplications,
      metrics.shortlistedCandidates,
      metrics.interviewsScheduled,
      metrics.hiredCandidates,
      metrics.hiringConversionRate,
      metrics.shortlistedCandidates > 0
        ? `${Math.round((metrics.interviewsScheduled / metrics.shortlistedCandidates) * 100)}%`
        : '0%',
      'Cohort Total',
    ],
    [],
    ['--- DISCLAIMER ---'],
    [
      'Notice',
      'Job-wise performance records are fictional demonstration values for UI evaluation. Shortlisted, interview-stage, and hired counts are simulated demo values.',
    ],
  ]

  return rows.map((r) => r.map(escapeCsvValue).join(',')).join('\r\n')
}

/**
 * Initiates browser CSV file download and automatically revokes temporary object URL.
 */
function triggerCsvDownload(csvString, filename) {
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const downloadLink = document.createElement('a')
  downloadLink.href = url
  downloadLink.download = filename
  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
  setTimeout(() => {
    URL.revokeObjectURL(url)
  }, 1000)
}

function AnalyticsPage() {
  const [selectedRange, setSelectedRange] = useState('30d')
  const [hoveredTrendPoint, setHoveredTrendPoint] = useState(null)
  const [hoveredStatusStage, setHoveredStatusStage] = useState(null)
  const [exportMenuOpen, setExportMenuOpen] = useState(false)
  const [exportFeedback, setExportFeedback] = useState(null)
  const [jobSearchQuery, setJobSearchQuery] = useState('')

  // Current metrics bundle based on selected date range
  const currentMetrics = useMemo(() => {
    return analyticsDemoData[selectedRange] || analyticsDemoData['30d']
  }, [selectedRange])

  // Calculation for dynamic SVG Y-axis scale based on the maximum application count
  const { maxTrendVal, yTicks } = useMemo(() => {
    if (!currentMetrics.trendPoints || currentMetrics.trendPoints.length === 0) {
      return { maxTrendVal: 10, yTicks: [10, 7.5, 5, 2.5, 0] }
    }
    const maxVal = Math.max(...currentMetrics.trendPoints.map((p) => p.applications), 1)
    let ceiling
    if (maxVal <= 10) {
      ceiling = 10
    } else if (maxVal <= 25) {
      ceiling = 25
    } else if (maxVal <= 40) {
      ceiling = 40
    } else if (maxVal <= 60) {
      ceiling = 60
    } else if (maxVal <= 100) {
      ceiling = 100
    } else {
      ceiling = Math.ceil(maxVal / 25) * 25
    }

    const step = ceiling / 4
    const ticks = [ceiling, step * 3, step * 2, step, 0]
    return { maxTrendVal: ceiling, yTicks: ticks }
  }, [currentMetrics])

  // Donut chart calculations (Radius = 54, Circumference = 2 * PI * 54 = 339.292)
  const donutRadius = 54
  const donutCircumference = 2 * Math.PI * donutRadius

  const donutSlices = useMemo(() => {
    return currentMetrics.statusDistribution.map((item, idx, arr) => {
      const precedingPct = arr
        .slice(0, idx)
        .reduce((sum, prev) => sum + prev.percentage, 0)
      const offset = (precedingPct / 100) * donutCircumference
      const sliceLength = (item.percentage / 100) * donutCircumference
      return {
        ...item,
        strokeDasharray: `${sliceLength} ${donutCircumference}`,
        strokeDashoffset: -offset,
      }
    })
  }, [currentMetrics, donutCircumference])

  // Validation checksum check (displayed in UI for clarity)
  const statusSumCheck = useMemo(() => {
    const sumCounts = currentMetrics.statusDistribution.reduce((acc, c) => acc + c.count, 0)
    const sumPct = currentMetrics.statusDistribution.reduce((acc, c) => acc + c.percentage, 0)
    return {
      sumCounts,
      sumPct: Math.round(sumPct * 10) / 10,
      isExactMatch: sumCounts === currentMetrics.totalApplications,
    }
  }, [currentMetrics])

  // Filtered job performance list based on search query
  const filteredJobs = useMemo(() => {
    if (!jobSearchQuery.trim()) {
      return currentMetrics.jobPerformance
    }
    const q = jobSearchQuery.toLowerCase().trim()
    return currentMetrics.jobPerformance.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.department.toLowerCase().includes(q) ||
        job.status.toLowerCase().includes(q)
    )
  }, [currentMetrics.jobPerformance, jobSearchQuery])

  // Auto-dismiss export feedback banner
  useEffect(() => {
    if (!exportFeedback) return
    const timer = setTimeout(() => {
      setExportFeedback(null)
    }, 4500)
    return () => clearTimeout(timer)
  }, [exportFeedback])

  // Keyboard accessibility: Escape key closes export menu
  useEffect(() => {
    if (!exportMenuOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setExportMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [exportMenuOpen])

  // Handler for triggering CSV downloads with filename and feedback
  const handleExport = (exportType) => {
    const today = new Date().toISOString().slice(0, 10)
    let filename = ''
    let csvString = ''
    let label = ''

    if (exportType === 'summary') {
      filename = `synapse-analytics-summary-${selectedRange}-${today}.csv`
      csvString = generateSummaryCsv(currentMetrics)
      label = 'Analytics Summary'
    } else if (exportType === 'jobs') {
      filename = `synapse-job-performance-${selectedRange}-${today}.csv`
      csvString = generateJobPerformanceCsv(currentMetrics)
      label = 'Job-Wise Performance'
    }

    if (csvString && filename) {
      triggerCsvDownload(csvString, filename)
      setExportFeedback({
        id: `${exportType}-${Date.now()}`,
        filename,
        label,
        rangeLabel: currentMetrics.label,
      })
      setExportMenuOpen(false)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#66738d] sm:text-sm">
        <Link
          to="/recruiter"
          className="font-medium transition hover:text-[#1260ed] hover:underline"
        >
          Recruiter Dashboard
        </Link>
        <span className="text-slate-300" aria-hidden="true">/</span>
        <span className="font-semibold text-[#101c3d]" aria-current="page">
          Analytics & Reports
        </span>
      </nav>

      {/* Floating Export Feedback Notification */}
      {exportFeedback && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-5 right-5 z-50 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-white p-4 shadow-xl text-xs text-[#101c3d] max-w-sm animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <CheckCircleIcon className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="font-bold text-sm text-[#101c3d]">Report Exported (CSV)</p>
              <button
                type="button"
                onClick={() => setExportFeedback(null)}
                className="text-slate-400 hover:text-slate-600 transition"
                aria-label="Dismiss notification"
              >
                <CloseIcon className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-0.5 text-xs text-[#415170]">
              Downloaded <strong className="text-[#101c3d]">{exportFeedback.filename}</strong> for {exportFeedback.rangeLabel}.
            </p>
            <p className="mt-1 text-[11px] font-semibold text-[#1260ed]">
              Demo Data CSV • Generated in browser
            </p>
          </div>
        </div>
      )}

      {/* 2. Page Header, Date Range Selector & Export Report Controls */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-[#101c3d] sm:text-3xl">
              Analytics & Reports
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50 px-3 py-0.5 text-xs font-semibold text-[#1260ed]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#1260ed]" />
              Demo Data
            </span>
          </div>
          <p className="mt-1 text-xs text-[#66738d] sm:text-sm">
            Track hiring performance, application trends, and recruitment outcomes.
          </p>
        </div>

        {/* Date-Range Selector Controls & Export Menu */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Segmented Date Range Toggle */}
          <div
            role="group"
            aria-label="Date range selector"
            className="inline-flex items-center rounded-xl border border-[#dce7f5] bg-white p-1 shadow-xs"
          >
            <div className="hidden items-center gap-1.5 px-2.5 text-xs font-semibold text-[#66738d] sm:inline-flex">
              <CalendarIcon className="h-3.5 w-3.5 text-[#1260ed]" />
              <span>Range:</span>
            </div>

            <button
              type="button"
              id="range-btn-7d"
              aria-pressed={selectedRange === '7d'}
              onClick={() => setSelectedRange('7d')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1260ed] focus-visible:ring-offset-1 ${
                selectedRange === '7d'
                  ? 'bg-[#1260ed] text-white shadow-xs'
                  : 'text-[#50617c] hover:bg-[#f3f7fd] hover:text-[#101c3d]'
              }`}
            >
              Last 7 Days
            </button>

            <button
              type="button"
              id="range-btn-30d"
              aria-pressed={selectedRange === '30d'}
              onClick={() => setSelectedRange('30d')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1260ed] focus-visible:ring-offset-1 ${
                selectedRange === '30d'
                  ? 'bg-[#1260ed] text-white shadow-xs'
                  : 'text-[#50617c] hover:bg-[#f3f7fd] hover:text-[#101c3d]'
              }`}
            >
              Last 30 Days
            </button>

            <button
              type="button"
              id="range-btn-90d"
              aria-pressed={selectedRange === '90d'}
              onClick={() => setSelectedRange('90d')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1260ed] focus-visible:ring-offset-1 ${
                selectedRange === '90d'
                  ? 'bg-[#1260ed] text-white shadow-xs'
                  : 'text-[#50617c] hover:bg-[#f3f7fd] hover:text-[#101c3d]'
              }`}
            >
              Last 90 Days
            </button>
          </div>

          {/* Export Report Dropdown Menu */}
          <div className="relative">
            <button
              type="button"
              id="export-report-btn"
              onClick={() => setExportMenuOpen((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={exportMenuOpen}
              className="inline-flex items-center gap-2 rounded-xl border border-[#dce7f5] bg-white px-3.5 py-2 text-xs font-semibold text-[#101c3d] shadow-xs transition hover:bg-[#f3f7fd] hover:border-[#cbdff8] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1260ed] focus-visible:ring-offset-1"
            >
              <DownloadIcon className="h-3.5 w-3.5 text-[#1260ed]" />
              <span>Export Report</span>
              <ChevronDownIcon className={`h-3.5 w-3.5 text-slate-400 transition-transform ${exportMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu Items */}
            {exportMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setExportMenuOpen(false)}
                />
                <div
                  role="menu"
                  aria-orientation="vertical"
                  className="absolute right-0 top-full mt-1.5 z-30 w-72 origin-top-right rounded-2xl border border-[#dce7f5] bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1 duration-150"
                >
                  <div className="px-3 py-2 border-b border-[#f0f4fa]">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Export Options ({currentMetrics.label})
                    </p>
                    <p className="text-[11px] text-[#66738d] mt-0.5">
                      Download demo datasets formatted in standard CSV.
                    </p>
                  </div>

                  <div className="p-1 space-y-1">
                    <button
                      type="button"
                      id="export-summary-csv-btn"
                      role="menuitem"
                      onClick={() => handleExport('summary')}
                      className="group flex w-full items-start gap-2.5 rounded-xl p-2.5 text-left text-xs transition hover:bg-[#f3f7fd]"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#1260ed] group-hover:bg-[#1260ed] group-hover:text-white transition-colors">
                        <FileTextIcon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#101c3d]">Export Summary as CSV</span>
                          <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[9px] font-semibold text-slate-600">.csv</span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-[#66738d]">
                          High-level KPIs, status distribution & interval trends
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      id="export-jobs-csv-btn"
                      role="menuitem"
                      onClick={() => handleExport('jobs')}
                      className="group flex w-full items-start gap-2.5 rounded-xl p-2.5 text-left text-xs transition hover:bg-[#f3f7fd]"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <FileTextIcon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#101c3d]">Export Job-Wise as CSV</span>
                          <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[9px] font-semibold text-slate-600">.csv</span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-[#66738d]">
                          Role-level applications, shortlists, interviews & conversion rates
                        </p>
                      </div>
                    </button>
                  </div>

                  <div className="border-t border-[#f0f4fa] px-3 py-1.5 text-[10px] text-slate-400">
                    * CSV generation executes client-side with demo data.
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 3. Date Span & Demonstration Context Notice */}
      <div className="flex flex-col gap-2 rounded-2xl border border-blue-100 bg-[#edf5ff]/80 p-4 text-xs text-[#2b4c7e] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2.5">
          <InfoCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#1260ed]" />
          <div>
            <span className="font-bold text-[#101c3d]">Demonstration Environment:</span>{' '}
            Metrics, time-series, and pipeline splits reflect simulated demo data for{' '}
            <strong className="text-[#101c3d]">{currentMetrics.label} ({currentMetrics.dateSpan})</strong>.
            All demo totals maintain strict cohort parity and do not represent live database activity.
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 self-start rounded-lg bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#1260ed] shadow-xs border border-blue-200/60 sm:self-center">
          <CalendarIcon className="h-3 w-3" />
          <span>Active Window: {currentMetrics.label}</span>
        </div>
      </div>

      {/* 4. Four Primary Stat Cards with Explicit Scope Badges */}
      <section aria-label="Recruitment Overview Metrics">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Total Applications (Period-Dependent) */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] transition-all hover:border-[#cbdff8] hover:shadow-[0_4px_16px_rgba(20,40,80,0.08)] sm:p-6">
            <div className="flex items-start justify-between gap-2">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#d6e6fe] bg-[#edf4ff] text-[#1260ed]"
                aria-hidden="true"
              >
                <ApplicationsIcon className="h-5 w-5" />
              </span>
              <span
                className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#1260ed]"
                title="This metric represents candidate applications received during the selected date window"
              >
                Selected Period
              </span>
            </div>

            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-[#101c3d] sm:text-4xl">
                  {currentMetrics.totalApplications}
                </span>
                <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600">
                  <TrendingUpIcon className="h-3 w-3" />
                  {currentMetrics.totalAppsTrend}
                </span>
              </div>
              <div className="mt-1 text-xs font-semibold text-[#5a6b85] sm:text-[13px]">
                Total Applications
              </div>
            </div>

            <div className="mt-3 border-t border-[#f0f4fa] pt-3 text-[11px] text-[#71829e]">
              <span className="font-medium text-[#101c3d]">Received in {currentMetrics.label.toLowerCase()}</span>
              <span className="block text-slate-400">{currentMetrics.comparisonLabel}</span>
            </div>
          </div>

          {/* Card 2: Active Job Posts (Workspace-Level / All-Time Active) */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] transition-all hover:border-[#cbdff8] hover:shadow-[0_4px_16px_rgba(20,40,80,0.08)] sm:p-6">
            <div className="flex items-start justify-between gap-2">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#e6dbff] bg-[#f4f0ff] text-[#7c3aed]"
                aria-hidden="true"
              >
                <PostJobIcon className="h-5 w-5" />
              </span>
              <span
                className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-purple-50/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#7c3aed]"
                title="Workspace-level snapshot: current active job posts regardless of the selected date range"
              >
                All-Time Active
              </span>
            </div>

            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-[#101c3d] sm:text-4xl">
                  {currentMetrics.activeJobPosts}
                </span>
                <span className="rounded-full bg-purple-100/70 px-2 py-0.5 text-[11px] font-semibold text-purple-700">
                  {currentMetrics.activeJobsTrend}
                </span>
              </div>
              <div className="mt-1 text-xs font-semibold text-[#5a6b85] sm:text-[13px]">
                Active Job Posts
              </div>
            </div>

            <div className="mt-3 border-t border-[#f0f4fa] pt-3 text-[11px] text-[#71829e]">
              <span className="font-medium text-[#101c3d]">Current live vacancies</span>
              <span className="block text-slate-400">Workspace status (all departments)</span>
            </div>
          </div>

          {/* Card 3: Shortlisted Candidates (Period-Dependent) */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] transition-all hover:border-[#cbdff8] hover:shadow-[0_4px_16px_rgba(20,40,80,0.08)] sm:p-6">
            <div className="flex items-start justify-between gap-2">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#c8f0dc] bg-[#e9faf3] text-[#16a34a]"
                aria-hidden="true"
              >
                <CandidateProfilesIcon className="h-5 w-5" />
              </span>
              <span
                className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#16a34a]"
                title="Candidates shortlisted from applications received in the selected window"
              >
                Selected Period
              </span>
            </div>

            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-[#101c3d] sm:text-4xl">
                  {currentMetrics.shortlistedCandidates}
                </span>
                <span className="rounded-full bg-emerald-100/70 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                  {currentMetrics.shortlistRate} rate
                </span>
              </div>
              <div className="mt-1 text-xs font-semibold text-[#5a6b85] sm:text-[13px]">
                Shortlisted Candidates
              </div>
            </div>

            <div className="mt-3 border-t border-[#f0f4fa] pt-3 text-[11px] text-[#71829e]">
              <span className="font-medium text-[#101c3d]">Passed review in {currentMetrics.label.toLowerCase()}</span>
              <span className="block text-slate-400">{currentMetrics.shortlistedTrend}</span>
            </div>
          </div>

          {/* Card 4: Interviews Scheduled (Period-Dependent) */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] transition-all hover:border-[#cbdff8] hover:shadow-[0_4px_16px_rgba(20,40,80,0.08)] sm:p-6">
            <div className="flex items-start justify-between gap-2">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-600"
                aria-hidden="true"
              >
                <ClockIcon className="h-5 w-5" />
              </span>
              <span
                className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600"
                title="Interview rounds arranged for applicants from the selected date range"
              >
                Selected Period
              </span>
            </div>

            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-[#101c3d] sm:text-4xl">
                  {currentMetrics.interviewsScheduled}
                </span>
                <span className="rounded-full bg-indigo-100/70 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
                  {currentMetrics.interviewRate}
                </span>
              </div>
              <div className="mt-1 text-xs font-semibold text-[#5a6b85] sm:text-[13px]">
                Interviews Scheduled
              </div>
            </div>

            <div className="mt-3 border-t border-[#f0f4fa] pt-3 text-[11px] text-[#71829e]">
              <span className="font-medium text-[#101c3d]">Rounds arranged ({currentMetrics.label.toLowerCase()})</span>
              <span className="block text-slate-400">{currentMetrics.interviewsTrend}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Chart Visualizations: Application Trends & Status Distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Application Trends Chart (Enhanced SVG Vector Visualization) */}
        <section
          aria-label="Application Trends Chart Section"
          className="flex flex-col justify-between rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-6 lg:col-span-7"
        >
          <div>
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md border border-blue-200/60 bg-blue-50 text-[#1260ed]">
                    <AnalyticsIcon className="h-3.5 w-3.5" />
                  </span>
                  <h2 className="text-lg font-bold tracking-tight text-[#101c3d] sm:text-xl">
                    Application Trends
                  </h2>
                  <span className="rounded-md border border-blue-200/70 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#1260ed]">
                    {currentMetrics.trendIntervalName} View
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-[#66738d]">
                  Inflow volume and shortlist count over {currentMetrics.label.toLowerCase()}
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-xs font-semibold text-[#50617c]">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-sm bg-[#1260ed]" />
                  <span>Applications</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-sm bg-[#10b981]" />
                  <span>Shortlisted</span>
                </div>
              </div>
            </div>

            {/* Quick Summary Pill Bar */}
            <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-[#edf3fb] bg-[#f9fbfe] p-2.5 text-center text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Inflow</span>
                <p className="font-extrabold text-[#1260ed] sm:text-sm">{currentMetrics.totalApplications} Apps</p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Peak Interval</span>
                <p className="font-extrabold text-[#101c3d] sm:text-sm">{currentMetrics.peakIntervalText}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pace</span>
                <p className="font-extrabold text-emerald-600 sm:text-sm">{currentMetrics.avgPerIntervalText}</p>
              </div>
            </div>

            {/* SVG Interactive Vector Chart */}
            <div className="relative mt-5">
              {currentMetrics.trendPoints.length === 0 ? (
                /* Empty state container */
                <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
                  <InboxEmptyIcon className="h-10 w-10 text-slate-400" />
                  <p className="mt-2 text-sm font-bold text-[#101c3d]">No application trend data found</p>
                  <p className="mt-1 text-xs text-[#66738d]">
                    No candidate applications were logged during this interval.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedRange('30d')}
                    className="mt-3 rounded-lg bg-[#1260ed] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs"
                  >
                    Reset to Last 30 Days
                  </button>
                </div>
              ) : (
                <div className="relative h-64 w-full select-none rounded-xl border border-[#edf3fc] bg-[#fafdff] p-3 sm:p-4">
                  <svg
                    viewBox="0 0 560 210"
                    className="h-full w-full"
                    aria-label="Application trends demonstration chart"
                  >
                    <defs>
                      <linearGradient id="trendAppGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#1260ed" stopOpacity="0.75" />
                      </linearGradient>
                      <linearGradient id="trendShortGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#059669" stopOpacity="0.8" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Gridlines & Y-Axis Scale Ticks */}
                    {yTicks.map((tickVal, idx) => {
                      const y = 20 + 140 * (1 - tickVal / maxTrendVal)
                      return (
                        <g key={idx}>
                          <line
                            x1="40"
                            y1={y}
                            x2="540"
                            y2={y}
                            stroke="#e8eff9"
                            strokeDasharray={tickVal === 0 ? 'none' : '3 3'}
                            strokeWidth={tickVal === 0 ? '1.5' : '1'}
                          />
                          <text
                            x="32"
                            y={y + 3.5}
                            textAnchor="end"
                            className="fill-slate-400 text-[10px] font-medium"
                          >
                            {tickVal}
                          </text>
                        </g>
                      )
                    })}

                    {/* Chart Columns & Bars */}
                    {currentMetrics.trendPoints.map((pt, i) => {
                      const count = currentMetrics.trendPoints.length
                      const usableWidth = 490
                      const groupWidth = usableWidth / count
                      const groupX = 45 + i * groupWidth

                      const barWidth = Math.min(22, groupWidth * 0.36)
                      const appHeight = (pt.applications / maxTrendVal) * 140
                      const appY = 160 - appHeight

                      const shortHeight = (pt.shortlisted / maxTrendVal) * 140
                      const shortY = 160 - shortHeight

                      const isHovered = hoveredTrendPoint?.label === pt.label

                      return (
                        <g
                          key={pt.label}
                          className="cursor-pointer focus:outline-hidden"
                          tabIndex={0}
                          role="graphics-symbol"
                          aria-label={`${pt.fullLabel || pt.label}: ${pt.applications} applications, ${pt.shortlisted} shortlisted`}
                          onMouseEnter={() => setHoveredTrendPoint(pt)}
                          onMouseLeave={() => setHoveredTrendPoint(null)}
                          onFocus={() => setHoveredTrendPoint(pt)}
                          onBlur={() => setHoveredTrendPoint(null)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              setHoveredTrendPoint(pt)
                            }
                          }}
                        >
                          {/* Hover highlight column */}
                          <rect
                            x={groupX + 1}
                            y={20}
                            width={groupWidth - 2}
                            height={140}
                            rx="6"
                            className={`transition-colors duration-150 ${
                              isHovered ? 'fill-blue-500/10' : 'fill-transparent'
                            }`}
                          />

                          {/* Applications Bar */}
                          <rect
                            x={groupX + groupWidth / 2 - barWidth - 2}
                            y={appY}
                            width={barWidth}
                            height={Math.max(appHeight, 2)}
                            rx="4"
                            fill="url(#trendAppGradient)"
                            className={`transition-opacity ${isHovered ? 'opacity-100' : 'opacity-90'}`}
                          />

                          {/* Shortlisted Bar */}
                          <rect
                            x={groupX + groupWidth / 2 + 2}
                            y={shortY}
                            width={barWidth}
                            height={Math.max(shortHeight, 2)}
                            rx="4"
                            fill="url(#trendShortGradient)"
                            className={`transition-opacity ${isHovered ? 'opacity-100' : 'opacity-90'}`}
                          />

                          {/* Top values for each bar */}
                          <text
                            x={groupX + groupWidth / 2 - barWidth / 2 - 2}
                            y={appY - 4}
                            textAnchor="middle"
                            className={`text-[9px] font-bold transition-opacity ${
                              isHovered ? 'fill-[#1260ed] opacity-100' : 'fill-slate-600 opacity-0 sm:opacity-80'
                            }`}
                          >
                            {pt.applications}
                          </text>

                          {/* X-Axis Category Label */}
                          <text
                            x={groupX + groupWidth / 2}
                            y={180}
                            textAnchor="middle"
                            className={`text-[10px] font-semibold transition-colors ${
                              isHovered ? 'fill-[#1260ed] font-bold' : 'fill-[#66738d]'
                            }`}
                          >
                            {pt.label}
                          </text>
                        </g>
                      )
                    })}
                  </svg>

                  {/* Dynamic Tooltip on Hover */}
                  {hoveredTrendPoint && (
                    <div
                      role="tooltip"
                      className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 rounded-xl border border-[#d6e6fe] bg-[#101c3d] px-3.5 py-2 text-center text-xs text-white shadow-lg animate-in fade-in duration-150"
                    >
                      <p className="font-bold text-white">{hoveredTrendPoint.fullLabel || hoveredTrendPoint.label}</p>
                      <div className="mt-1 flex items-center justify-center gap-3 text-[11px]">
                        <span className="text-[#93c5fd]">
                          Apps: <strong className="text-white">{hoveredTrendPoint.applications}</strong>
                        </span>
                        <span className="text-emerald-300">
                          Shortlisted: <strong className="text-white">{hoveredTrendPoint.shortlisted}</strong>
                        </span>
                        <span className="text-slate-300">
                          Rate:{' '}
                          <strong className="text-white">
                            {hoveredTrendPoint.applications > 0
                              ? Math.round((hoveredTrendPoint.shortlisted / hoveredTrendPoint.applications) * 100)
                              : 0}
                            %
                          </strong>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#f0f4fa] pt-3 text-[11px] text-[#71829e]">
            <span>* Sum of bars = {currentMetrics.totalApplications} applications & {currentMetrics.shortlistedCandidates} shortlisted (100% cohort match)</span>
            <span className="font-semibold text-[#1260ed]">{currentMetrics.trendPoints.length} reporting intervals</span>
          </div>
        </section>

        {/* Application Status Distribution (Vector SVG Donut + Consistent Stage Breakdown) */}
        <section
          aria-label="Application Status Distribution Section"
          className="flex flex-col justify-between rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-6 lg:col-span-5"
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold tracking-tight text-[#101c3d] sm:text-xl">
                    Status Distribution
                  </h2>
                  <span className="rounded-md border border-emerald-200/70 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    Vector Donut
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-[#66738d]">
                  Pipeline allocation for {currentMetrics.label.toLowerCase()}
                </p>
              </div>

              <div className="text-right">
                <span className="text-sm font-extrabold text-[#101c3d]">
                  {statusSumCheck.sumCounts} Total
                </span>
                <span className="block text-[10px] text-emerald-600 font-semibold">
                  100% accounted
                </span>
              </div>
            </div>

            {/* SVG Donut Chart with Centered Total Badge */}
            <div className="mt-4 flex flex-col items-center justify-center sm:flex-row sm:gap-6">
              <div className="relative flex shrink-0 items-center justify-center">
                <svg
                  width="140"
                  height="140"
                  viewBox="0 0 140 140"
                  className="-rotate-90 select-none"
                  aria-label="Candidate status donut distribution"
                >
                  {/* Background track circle */}
                  <circle
                    cx="70"
                    cy="70"
                    r={donutRadius}
                    fill="transparent"
                    stroke="#edf2f9"
                    strokeWidth="16"
                  />

                  {/* Status arc segments */}
                  {donutSlices.map((slice) => {
                    const isHovered = hoveredStatusStage === slice.stage
                    return (
                      <circle
                        key={slice.stage}
                        cx="70"
                        cy="70"
                        r={donutRadius}
                        fill="transparent"
                        stroke={slice.color}
                        strokeWidth={isHovered ? '20' : '16'}
                        strokeDasharray={slice.strokeDasharray}
                        strokeDashoffset={slice.strokeDashoffset}
                        strokeLinecap="butt"
                        className="transition-all duration-200 cursor-pointer"
                        onMouseEnter={() => setHoveredStatusStage(slice.stage)}
                        onMouseLeave={() => setHoveredStatusStage(null)}
                      />
                    )
                  })}
                </svg>

                {/* Donut Center Display */}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-extrabold text-[#101c3d] leading-none">
                    {currentMetrics.totalApplications}
                  </span>
                  <span className="mt-0.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    {currentMetrics.label}
                  </span>
                </div>
              </div>

              {/* Multi-segment continuous horizontal progress bar for quick mobile inspection */}
              <div className="mt-4 w-full sm:mt-0 sm:flex-1 space-y-2">
                <div className="flex h-3 w-full overflow-hidden rounded-full bg-[#edf2f9]">
                  {currentMetrics.statusDistribution.map((item) => (
                    <div
                      key={item.stage}
                      className={`h-full ${item.bgClass} transition-all duration-300 ${
                        hoveredStatusStage === item.stage ? 'brightness-110' : ''
                      }`}
                      style={{ width: `${item.percentage}%` }}
                      title={`${item.stage}: ${item.count} (${item.percentage}%)`}
                      onMouseEnter={() => setHoveredStatusStage(item.stage)}
                      onMouseLeave={() => setHoveredStatusStage(null)}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                  <span>Initial Screening</span>
                  <span>Offer Accepted</span>
                </div>
              </div>
            </div>

            {/* Stage-by-Stage List with Count & Exact Percentage */}
            <div className="mt-4 space-y-2">
              {currentMetrics.statusDistribution.map((item) => {
                const isHovered = hoveredStatusStage === item.stage
                return (
                  <div
                    key={item.stage}
                    tabIndex={0}
                    role="region"
                    aria-label={`${item.stage}: ${item.count} candidates, ${item.percentage}%`}
                    onMouseEnter={() => setHoveredStatusStage(item.stage)}
                    onMouseLeave={() => setHoveredStatusStage(null)}
                    onFocus={() => setHoveredStatusStage(item.stage)}
                    onBlur={() => setHoveredStatusStage(null)}
                    className={`flex items-center justify-between rounded-xl border p-2.5 transition focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1260ed] ${
                      isHovered
                        ? 'border-blue-300 bg-blue-50/50 shadow-xs'
                        : 'border-[#edf3fb] bg-[#f9fbfe] hover:border-[#d9e6f6]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="truncate">
                        <span className="text-xs font-bold text-[#101c3d]">
                          {item.stage}
                        </span>
                        <span className="hidden text-[10px] text-[#66738d] sm:inline sm:ml-2">
                          — {item.description}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-extrabold text-[#101c3d]">
                        {item.count}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10.5px] font-semibold text-slate-600">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-4 border-t border-[#f0f4fa] pt-3 text-[11px] text-[#71829e]">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
              <CheckCircleIcon className="h-3.5 w-3.5" />
              Verified Parity: {currentMetrics.statusDistribution.map((d) => d.count).join(' + ')} = {statusSumCheck.sumCounts} ({statusSumCheck.sumPct}%)
            </span>
          </div>
        </section>
      </div>

      {/* 6. Job-wise Application Performance Section */}
      <section
        aria-label="Job-wise Application Performance Section"
        className="rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-6 lg:p-7"
      >
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-lg font-bold tracking-tight text-[#101c3d] sm:text-xl">
                Job-wise Application Performance
              </h2>
              <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[10.5px] font-semibold text-[#1260ed]">
                {currentMetrics.label} Breakdown
              </span>
            </div>
            <p className="mt-0.5 text-xs text-[#66738d] sm:text-sm">
              Role-level funnel tracking, shortlists, interview-stage volume, and hiring conversion for {currentMetrics.label.toLowerCase()} ({currentMetrics.dateSpan})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search/Filter within Job-wise Performance */}
            <div className="relative w-full sm:w-60">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={jobSearchQuery}
                onChange={(e) => setJobSearchQuery(e.target.value)}
                placeholder="Filter by role or department..."
                className="h-8.5 w-full rounded-xl border border-[#dce7f5] bg-white pl-8 pr-7 text-xs text-[#101c3d] placeholder:text-slate-400 focus:border-[#1260ed] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1260ed]"
              />
              {jobSearchQuery && (
                <button
                  type="button"
                  onClick={() => setJobSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-hidden focus-visible:ring-1 focus-visible:ring-[#1260ed]"
                  aria-label="Clear filter"
                >
                  <CloseIcon className="h-3 w-3" />
                </button>
              )}
            </div>

            <Link
              to="/recruiter/applications"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1260ed] hover:underline whitespace-nowrap focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1260ed] rounded"
            >
              Manage Applications &rarr;
            </Link>
          </div>
        </div>

        {/* Empty State when no jobs match filter */}
        {filteredJobs.length === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#cbdff8] bg-[#f8fbff] p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#1260ed]">
              <InboxEmptyIcon className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-sm font-bold text-[#101c3d]">No job positions found</h3>
            <p className="mt-1 max-w-sm text-xs text-[#66738d]">
              No job postings in the "{currentMetrics.label}" cohort match the filter "{jobSearchQuery}".
            </p>
            <button
              type="button"
              onClick={() => setJobSearchQuery('')}
              className="mt-4 rounded-xl bg-[#1260ed] px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1260ed]"
            >
              Clear Filter
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View with horizontal scroll and minimum width to avoid cramped columns */}
            <div
              tabIndex={0}
              role="region"
              aria-label="Job-wise performance table"
              className="mt-6 hidden overflow-x-auto rounded-xl border border-[#edf3fc] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1260ed] md:block"
            >
              <table className="w-full min-w-[760px] text-left text-xs">
                <thead>
                  <tr className="border-b border-[#edf3fc] bg-[#fafdff] text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4 whitespace-nowrap">Job Role & Department</th>
                    <th className="py-3 px-3 whitespace-nowrap">Status</th>
                    <th className="py-3 px-3 text-center whitespace-nowrap">Total Applications</th>
                    <th className="py-3 px-3 text-center whitespace-nowrap">Shortlisted</th>
                    <th className="py-3 px-3 text-center whitespace-nowrap">Interview-Stage</th>
                    <th className="py-3 px-3 text-center whitespace-nowrap">Hired</th>
                    <th className="py-3 px-3 text-center whitespace-nowrap" title="Hiring Conversion Rate = (Hired / Total Applications) * 100%">
                      Hiring Conversion Rate
                    </th>
                    <th className="py-3 pr-4 pl-3 text-right whitespace-nowrap">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf3fc]">
                  {filteredJobs.map((job) => (
                    <tr
                      key={job.id}
                      className="transition hover:bg-[#f8fbff]"
                    >
                      <td className="py-4 px-4 min-w-[200px]">
                        <p className="font-bold text-[#101c3d] text-sm">
                          {job.title}
                        </p>
                        <p className="text-[11px] text-[#66738d]">
                          {job.department}
                        </p>
                      </td>

                      <td className="py-4 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            job.status === 'Active'
                              ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                              : 'border border-amber-200 bg-amber-50 text-amber-700'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              job.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                          />
                          {job.status}
                        </span>
                      </td>

                      <td className="py-4 px-3 text-center whitespace-nowrap">
                        <span className="font-extrabold text-[#101c3d] text-sm">
                          {job.applications}
                        </span>
                      </td>

                      <td className="py-4 px-3 text-center whitespace-nowrap">
                        <span className="font-bold text-[#1260ed]">
                          {job.shortlisted}
                        </span>
                        <span className="block text-[10px] text-slate-400">
                          {job.applications > 0 ? Math.round((job.shortlisted / job.applications) * 100) : 0}% of apps
                        </span>
                      </td>

                      <td className="py-4 px-3 text-center whitespace-nowrap">
                        <span className="font-bold text-indigo-600">
                          {job.interviewStage}
                        </span>
                        <span className="block text-[10px] text-slate-400">
                          {job.shortlisted > 0 ? Math.round((job.interviewStage / job.shortlisted) * 100) : 0}% of short
                        </span>
                      </td>

                      <td className="py-4 px-3 text-center whitespace-nowrap">
                        <span className="font-bold text-violet-700">
                          {job.hired}
                        </span>
                      </td>

                      <td className="py-4 px-3 text-center whitespace-nowrap">
                        <span
                          className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200/80 px-2.5 py-1 text-[11px] font-bold text-[#1260ed]"
                          title={`${job.hired} hired / ${job.applications} applications`}
                        >
                          {job.conversionRate}
                        </span>
                      </td>

                      <td className="py-4 pr-4 pl-3 text-right whitespace-nowrap">
                        <span className="text-[11px] font-medium text-[#66738d]">
                          {job.trend}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Compact Card View */}
            <div className="mt-4 space-y-3 md:hidden">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-xl border border-[#edf3fc] bg-[#f9fbfe] p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-[#101c3d] text-sm">{job.title}</p>
                      <p className="text-[11px] text-[#66738d]">{job.department}</p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        job.status === 'Active'
                          ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                          : 'border border-amber-200 bg-amber-50 text-amber-700'
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 border-t border-[#eaf0f9] pt-2.5 text-center text-xs">
                    <div>
                      <span className="text-[10px] font-semibold uppercase text-slate-400">Apps</span>
                      <p className="mt-0.5 font-bold text-[#101c3d]">{job.applications}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold uppercase text-slate-400">Shortlisted</span>
                      <p className="mt-0.5 font-bold text-[#1260ed]">{job.shortlisted}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold uppercase text-slate-400">Interviews</span>
                      <p className="mt-0.5 font-bold text-indigo-600">{job.interviewStage}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold uppercase text-slate-400">Hired</span>
                      <p className="mt-0.5 font-bold text-violet-700">{job.hired}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#eaf0f9] pt-2 text-[11px]">
                    <span className="text-slate-500">Hiring Conversion Rate:</span>
                    <span className="font-bold text-[#1260ed] bg-blue-50 border border-blue-200/80 rounded-md px-2 py-0.5">
                      {job.conversionRate} ({job.hired}/{job.applications})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Table summary row showing exact mathematical alignment */}
        <div className="mt-4 flex flex-col justify-between gap-2 border-t border-[#edf3fc] pt-4 text-[11px] text-[#71829e] sm:flex-row sm:items-center">
          <span className="font-medium">
            Cohort Totals ({currentMetrics.label}):{' '}
            <strong className="text-[#101c3d]">{currentMetrics.totalApplications} Applications</strong> •{' '}
            <strong className="text-[#1260ed]">{currentMetrics.shortlistedCandidates} Shortlisted</strong> •{' '}
            <strong className="text-indigo-600">{currentMetrics.interviewsScheduled} Interview-Stage</strong> •{' '}
            <strong className="text-violet-700">{currentMetrics.hiredCandidates} Hired</strong> •{' '}
            <strong className="text-[#1260ed]">Overall Conversion: {currentMetrics.hiringConversionRate}</strong>
          </span>
          <span className="font-semibold text-slate-500">
            {filteredJobs.length} of {currentMetrics.jobPerformance.length} roles shown • Workspace Active Total: {currentMetrics.activeJobPosts}
          </span>
        </div>
      </section>
    </div>
  )
}

export default AnalyticsPage
