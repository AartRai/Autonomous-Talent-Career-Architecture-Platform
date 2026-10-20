import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CompanyProfileIcon,
  CandidateProfilesIcon,
  CloseIcon,
} from '../../components/recruiter/RecruiterIcons.jsx'

// Supplementary SVG icons for Profile & Company UI
function UserIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5.5 21a6.5 6.5 0 0 1 13 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function MailIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="m3 7 9 6 9-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BriefcaseIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PhoneIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BuildingIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 7h1M9 11h1M9 15h1M14 7h1M14 11h1M14 15h1M10 21v-3h4v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function GlobeIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.6 9h16.8M3.6 15h16.8M12 3a14.5 14.5 0 0 0 0 18M12 3a14.5 14.5 0 0 1 0 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function MapPinIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function CheckCircleIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

function CameraIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Initial demonstration data representing the active recruiter session
const initialDemoProfileData = {
  // Recruiter Information
  fullName: 'Sarah Jenkins',
  workEmail: 'sarah.jenkins@acmecorp.demo',
  jobTitle: 'Senior Tech Recruiter',
  phoneNumber: '+1 (555) 234-5678',
  department: 'Global Talent Acquisition',

  // Company Information
  companyName: 'Acme Corporation',
  industry: 'Enterprise Software & Cloud AI',
  website: 'https://acmecorp.example.com',
  companySize: '500–1,000 employees',
  location: 'San Francisco, CA (Hybrid)',
  description:
    'Acme Corporation develops next-generation autonomous workflows, AI architecture, and enterprise software solutions connecting industry demands with top-tier university talent worldwide.',
}

const industryOptions = [
  'Enterprise Software & Cloud AI',
  'Fintech & Digital Banking',
  'Healthcare & Biotechnology',
  'Data Analytics & Business Intelligence',
  'Cybersecurity & Network Defense',
  'E-Commerce & Digital Marketplaces',
  'Autonomous Systems & Robotics',
  'Other / Emerging Tech',
]

const companySizeOptions = [
  '1–10 employees',
  '11–50 employees',
  '51–200 employees',
  '201–500 employees',
  '500–1,000 employees',
  '1,000–5,000 employees',
  '5,000+ employees',
]

// Pure field-level validator for accurate real-time and submission checks
const validateField = (name, value) => {
  switch (name) {
    case 'fullName':
      if (!value || !value.trim()) return 'Full name is required.'
      return ''

    case 'workEmail': {
      if (!value || !value.trim()) return 'Work email is required.'
      const trimmed = value.trim()
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
      if (!emailRegex.test(trimmed)) {
        return 'Please enter a valid work email address (e.g. sarah.jenkins@acmecorp.demo).'
      }
      return ''
    }

    case 'jobTitle':
      if (!value || !value.trim()) return 'Job title / designation is required.'
      return ''

    case 'phoneNumber': {
      if (!value || !value.trim()) return ''
      const trimmed = value.trim()
      const digits = trimmed.replace(/\D/g, '')
      const phonePattern = /^[+]?[\d\s().-]+$/
      if (!phonePattern.test(trimmed) || digits.length < 7 || digits.length > 15) {
        return 'Please enter a valid phone number (7–15 digits, e.g. +1 (555) 234-5678).'
      }
      return ''
    }

    case 'companyName':
      if (!value || !value.trim()) return 'Company name is required.'
      return ''

    case 'industry':
      if (!value) return 'Please select an industry sector.'
      return ''

    case 'website': {
      if (!value || !value.trim()) return ''
      const trimmed = value.trim()
      try {
        const parsed = new URL(trimmed)
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          return 'Website URL must begin with http:// or https://'
        }
        if (!parsed.hostname.includes('.') || parsed.hostname.length < 4) {
          return 'Please enter a valid website URL (e.g. https://acmecorp.example.com).'
        }
      } catch {
        return 'Please enter a valid website URL (e.g. https://acmecorp.example.com).'
      }
      return ''
    }

    case 'companySize':
      if (!value) return 'Please select your organization size.'
      return ''

    case 'location':
      if (!value || !value.trim()) return 'Company location is required.'
      return ''

    default:
      return ''
  }
}

const validatedFieldKeys = [
  'fullName',
  'workEmail',
  'jobTitle',
  'phoneNumber',
  'companyName',
  'industry',
  'website',
  'companySize',
  'location',
]

function RecruiterProfilePage() {
  // Baseline saved state for this active browser session
  const [savedData, setSavedData] = useState(initialDemoProfileData)
  // Current active form inputs
  const [formData, setFormData] = useState(initialDemoProfileData)
  // Track fields the user has interacted with (blurred or edited after touch)
  const [touched, setTouched] = useState({})
  // Track whether a save attempt has occurred to reveal all errors
  const [hasSubmitted, setHasSubmitted] = useState(false)
  // Form errors keyed by field name
  const [errors, setErrors] = useState({})
  // Feedback alert / banner state
  const [feedback, setFeedback] = useState(null)

  // Derive display initials from full name
  const initials = useMemo(() => {
    if (!formData.fullName.trim()) return 'SJ'
    const parts = formData.fullName.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }, [formData.fullName])

  // Check if form differs from the most recently saved baseline
  const isDirty = useMemo(() => {
    return Object.keys(savedData).some((key) => savedData[key] !== formData[key])
  }, [formData, savedData])

  // Handle typing / value changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // If user has already blurred or submitted, re-validate dynamically as they edit
    if (hasSubmitted || touched[name]) {
      const fieldError = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: fieldError }))
    } else if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // Handle blur to mark field as touched and validate
  const handleInputBlur = (e) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const fieldError = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: fieldError }))
  }

  // Save changes handler
  const handleSave = (e) => {
    if (e) e.preventDefault()
    setHasSubmitted(true)

    // Run full validation across all monitored fields
    const newErrors = {}
    validatedFieldKeys.forEach((key) => {
      const err = validateField(key, formData[key] || '')
      if (err) {
        newErrors[key] = err
      }
    })

    setErrors(newErrors)

    // If invalid, prevent save and focus first invalid input
    if (Object.keys(newErrors).length > 0) {
      setFeedback({
        type: 'error',
        title: 'Validation Errors Detected',
        message: 'Please review and resolve the highlighted errors before saving.',
      })

      const firstInvalidKey = validatedFieldKeys.find((key) => newErrors[key])
      if (firstInvalidKey) {
        const elem = document.getElementById(firstInvalidKey)
        if (elem) {
          elem.focus()
        }
      }
      return
    }

    // If valid, update session state and establish current inputs as new reset baseline
    setSavedData({ ...formData })
    setHasSubmitted(false)
    setTouched({})
    setErrors({})
    setFeedback({
      type: 'success',
      title: 'Profile Updated (Demo Mode)',
      message:
        'Changes have been saved to your current frontend demo session. These updates are stored locally in component memory and are not persisted to a backend or remote database.',
    })
  }

  // Cancel handler restores the most recently saved demo values
  const handleCancel = () => {
    if (!isDirty) return
    setFormData({ ...savedData })
    setErrors({})
    setTouched({})
    setHasSubmitted(false)
    setFeedback({
      type: 'info',
      title: 'Changes Discarded',
      message: 'Form inputs have been restored to your last saved demo values for this session.',
    })
  }

  // Helper to determine if an individual field should render an active error state
  const shouldShowError = (field) => {
    return Boolean((hasSubmitted || touched[field]) && errors[field])
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#66738d] sm:text-sm">
        <Link
          to="/recruiter"
          className="font-medium transition hover:text-[#1260ed] hover:underline focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1260ed] rounded"
        >
          Recruiter Dashboard
        </Link>
        <span className="text-slate-300" aria-hidden="true">/</span>
        <span className="font-semibold text-[#101c3d]" aria-current="page">
          Profile / Company Details
        </span>
      </nav>

      {/* Dynamic Status / Feedback Notice Banner */}
      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className={`flex items-start gap-3 rounded-2xl border p-4 shadow-sm text-xs transition-all ${
            feedback.type === 'error'
              ? 'border-rose-200 bg-rose-50/90 text-rose-800'
              : feedback.type === 'success'
              ? 'border-emerald-200 bg-emerald-50/90 text-emerald-800'
              : 'border-blue-200 bg-blue-50/90 text-blue-800'
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {feedback.type === 'error' ? (
              <InfoCircleIcon className="h-5 w-5 text-rose-600" />
            ) : feedback.type === 'success' ? (
              <CheckCircleIcon className="h-5 w-5 text-emerald-600" />
            ) : (
              <InfoCircleIcon className="h-5 w-5 text-blue-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            {feedback.title && (
              <p className="font-bold text-sm">{feedback.title}</p>
            )}
            <p className={feedback.title ? 'mt-0.5' : ''}>{feedback.message}</p>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-slate-600 transition focus:outline-hidden focus-visible:ring-1 focus-visible:ring-blue-500 rounded"
            aria-label="Dismiss notification"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 2. Page Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-[#101c3d] sm:text-3xl">
              Profile & Company Details
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50 px-3 py-0.5 text-xs font-semibold text-[#1260ed]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#1260ed]" />
              Demo Mode
            </span>
            {isDirty && (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
                Unsaved Changes
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-[#66738d] sm:text-sm">
            Manage your recruiter profile and company information.
          </p>
        </div>

        {/* Header Action Buttons (Quick access on larger displays) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={!isDirty}
            aria-disabled={!isDirty}
            className={`rounded-xl border px-4 py-2 text-xs font-semibold transition focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1260ed] ${
              isDirty
                ? 'border-[#dce7f5] bg-white text-[#50617c] hover:bg-[#f3f7fd] hover:text-[#101c3d] shadow-xs cursor-pointer'
                : 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed'
            }`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1260ed] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1260ed] focus-visible:ring-offset-1 cursor-pointer"
          >
            <CheckCircleIcon className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* 3. Demonstration Scope Notice */}
      <div className="flex items-start gap-2.5 rounded-2xl border border-blue-100 bg-[#edf5ff]/80 p-4 text-xs text-[#2b4c7e]">
        <InfoCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#1260ed]" />
        <div>
          <span className="font-bold text-[#101c3d]">Demonstration Environment:</span>{' '}
          This profile editor is a frontend evaluation mockup. All values are editable demo attributes stored within this browser session.
          No backend API calls are triggered, and changes will not be saved to an external database.
        </div>
      </div>

      {/* 4. Recruiter Profile Summary Card */}
      <section
        aria-label="Recruiter Profile Overview"
        className="rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-6"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Avatar with Initials & Camera Badge */}
            <div className="relative flex shrink-0">
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1260ed] to-[#1764ed] text-xl sm:text-2xl font-extrabold text-white shadow-md">
                {initials}
              </div>
              <button
                type="button"
                onClick={() =>
                  setFeedback({
                    type: 'info',
                    title: 'Avatar Upload (Demo)',
                    message: 'Photo upload is simulated for frontend preview and does not upload images to a server.',
                  })
                }
                className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-lg border-2 border-white bg-[#101c3d] text-white shadow-sm hover:bg-[#1260ed] transition focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1260ed]"
                title="Change Avatar (Demo)"
                aria-label="Change Avatar"
              >
                <CameraIcon className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Recruiter Details Summary */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-[#101c3d] sm:text-xl truncate">
                  {formData.fullName || 'Recruiter Name'}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Verified Recruiter
                </span>
              </div>

              <p className="mt-0.5 text-xs font-semibold text-[#1260ed] sm:text-sm">
                {formData.jobTitle || 'Designation'} • {formData.companyName || 'Company'}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#66738d]">
                <span className="inline-flex items-center gap-1.5">
                  <BuildingIcon className="h-3.5 w-3.5 text-slate-400" />
                  <span>{formData.department || 'Talent Acquisition'}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPinIcon className="h-3.5 w-3.5 text-slate-400" />
                  <span>{formData.location || 'Location Not Specified'}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MailIcon className="h-3.5 w-3.5 text-slate-400" />
                  <span>{formData.workEmail || 'No Email'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Status Badges */}
          <div className="flex flex-wrap items-center gap-2 border-t border-[#edf3fc] pt-4 sm:border-t-0 sm:pt-0 sm:flex-col sm:items-end sm:gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-lg border border-purple-200 bg-purple-50 px-2.5 py-1 text-[11px] font-bold text-purple-700">
              Enterprise Partner
            </span>
            <span className="text-[11px] text-slate-400">
              Workspace Access: Admin
            </span>
          </div>
        </div>
      </section>

      {/* 5. Main Form: Two clearly separated sections */}
      <form onSubmit={handleSave} className="space-y-6 sm:space-y-8" noValidate>
        {/* Section 1: Recruiter Information */}
        <section
          aria-labelledby="recruiter-info-heading"
          className="rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-6 lg:p-7"
        >
          <div className="flex items-center gap-2.5 border-b border-[#edf3fc] pb-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200/80 bg-blue-50 text-[#1260ed]">
              <UserIcon className="h-4 w-4" />
            </span>
            <div>
              <h2 id="recruiter-info-heading" className="text-base font-bold text-[#101c3d] sm:text-lg">
                Recruiter Information
              </h2>
              <p className="text-xs text-[#66738d]">
                Personal details and recruiter credentials within your SYNAPSE workspace.
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs font-bold text-[#101c3d]"
              >
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative mt-1.5">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <UserIcon className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  aria-required="true"
                  aria-invalid={shouldShowError('fullName') ? 'true' : 'false'}
                  aria-describedby={shouldShowError('fullName') ? 'fullName-error' : undefined}
                  placeholder="e.g. Sarah Jenkins"
                  className={`h-10 w-full rounded-xl border bg-white pl-9 pr-3 text-xs text-[#101c3d] placeholder:text-slate-400 focus:outline-hidden focus:ring-2 ${
                    shouldShowError('fullName')
                      ? 'border-rose-300 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-100'
                      : 'border-[#dce7f5] focus:border-[#1260ed] focus:ring-blue-100'
                  }`}
                />
              </div>
              {shouldShowError('fullName') && (
                <p id="fullName-error" role="alert" className="mt-1 text-[11px] font-semibold text-rose-600">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Work Email */}
            <div>
              <label
                htmlFor="workEmail"
                className="block text-xs font-bold text-[#101c3d]"
              >
                Work Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative mt-1.5">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <MailIcon className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  id="workEmail"
                  name="workEmail"
                  value={formData.workEmail}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  aria-required="true"
                  aria-invalid={shouldShowError('workEmail') ? 'true' : 'false'}
                  aria-describedby={shouldShowError('workEmail') ? 'workEmail-error' : undefined}
                  placeholder="e.g. sarah.jenkins@company.com"
                  className={`h-10 w-full rounded-xl border bg-white pl-9 pr-3 text-xs text-[#101c3d] placeholder:text-slate-400 focus:outline-hidden focus:ring-2 ${
                    shouldShowError('workEmail')
                      ? 'border-rose-300 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-100'
                      : 'border-[#dce7f5] focus:border-[#1260ed] focus:ring-blue-100'
                  }`}
                />
              </div>
              {shouldShowError('workEmail') && (
                <p id="workEmail-error" role="alert" className="mt-1 text-[11px] font-semibold text-rose-600">
                  {errors.workEmail}
                </p>
              )}
            </div>

            {/* Job Title / Designation */}
            <div>
              <label
                htmlFor="jobTitle"
                className="block text-xs font-bold text-[#101c3d]"
              >
                Job Title / Designation <span className="text-rose-500">*</span>
              </label>
              <div className="relative mt-1.5">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <BriefcaseIcon className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  aria-required="true"
                  aria-invalid={shouldShowError('jobTitle') ? 'true' : 'false'}
                  aria-describedby={shouldShowError('jobTitle') ? 'jobTitle-error' : undefined}
                  placeholder="e.g. Senior Tech Recruiter"
                  className={`h-10 w-full rounded-xl border bg-white pl-9 pr-3 text-xs text-[#101c3d] placeholder:text-slate-400 focus:outline-hidden focus:ring-2 ${
                    shouldShowError('jobTitle')
                      ? 'border-rose-300 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-100'
                      : 'border-[#dce7f5] focus:border-[#1260ed] focus:ring-blue-100'
                  }`}
                />
              </div>
              {shouldShowError('jobTitle') && (
                <p id="jobTitle-error" role="alert" className="mt-1 text-[11px] font-semibold text-rose-600">
                  {errors.jobTitle}
                </p>
              )}
            </div>

            {/* Phone Number (Optional) */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="phoneNumber"
                  className="block text-xs font-bold text-[#101c3d]"
                >
                  Phone Number
                </label>
                <span className="text-[10px] text-slate-400">Optional</span>
              </div>
              <div className="relative mt-1.5">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <PhoneIcon className="h-4 w-4" />
                </span>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  aria-invalid={shouldShowError('phoneNumber') ? 'true' : 'false'}
                  aria-describedby={shouldShowError('phoneNumber') ? 'phoneNumber-error' : undefined}
                  placeholder="e.g. +1 (555) 234-5678"
                  className={`h-10 w-full rounded-xl border bg-white pl-9 pr-3 text-xs text-[#101c3d] placeholder:text-slate-400 focus:outline-hidden focus:ring-2 ${
                    shouldShowError('phoneNumber')
                      ? 'border-rose-300 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-100'
                      : 'border-[#dce7f5] focus:border-[#1260ed] focus:ring-blue-100'
                  }`}
                />
              </div>
              {shouldShowError('phoneNumber') && (
                <p id="phoneNumber-error" role="alert" className="mt-1 text-[11px] font-semibold text-rose-600">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            {/* Department (Optional) */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="department"
                  className="block text-xs font-bold text-[#101c3d]"
                >
                  Department / Recruiting Unit
                </label>
                <span className="text-[10px] text-slate-400">Optional</span>
              </div>
              <div className="relative mt-1.5">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <CandidateProfilesIcon className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="e.g. Global Talent Acquisition / Engineering Staffing"
                  className="h-10 w-full rounded-xl border border-[#dce7f5] bg-white pl-9 pr-3 text-xs text-[#101c3d] placeholder:text-slate-400 focus:border-[#1260ed] focus:outline-hidden focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Company Information */}
        <section
          aria-labelledby="company-info-heading"
          className="rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-6 lg:p-7"
        >
          <div className="flex items-center gap-2.5 border-b border-[#edf3fc] pb-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-200/80 bg-purple-50 text-[#7c3aed]">
              <CompanyProfileIcon className="h-4 w-4" />
            </span>
            <div>
              <h2 id="company-info-heading" className="text-base font-bold text-[#101c3d] sm:text-lg">
                Company Information
              </h2>
              <p className="text-xs text-[#66738d]">
                Organization details, industry sector, and employer brand visibility.
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Company Name */}
            <div>
              <label
                htmlFor="companyName"
                className="block text-xs font-bold text-[#101c3d]"
              >
                Company Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative mt-1.5">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <BuildingIcon className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  aria-required="true"
                  aria-invalid={shouldShowError('companyName') ? 'true' : 'false'}
                  aria-describedby={shouldShowError('companyName') ? 'companyName-error' : undefined}
                  placeholder="e.g. Acme Corporation"
                  className={`h-10 w-full rounded-xl border bg-white pl-9 pr-3 text-xs text-[#101c3d] placeholder:text-slate-400 focus:outline-hidden focus:ring-2 ${
                    shouldShowError('companyName')
                      ? 'border-rose-300 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-100'
                      : 'border-[#dce7f5] focus:border-[#1260ed] focus:ring-blue-100'
                  }`}
                />
              </div>
              {shouldShowError('companyName') && (
                <p id="companyName-error" role="alert" className="mt-1 text-[11px] font-semibold text-rose-600">
                  {errors.companyName}
                </p>
              )}
            </div>

            {/* Industry */}
            <div>
              <label
                htmlFor="industry"
                className="block text-xs font-bold text-[#101c3d]"
              >
                Industry Sector <span className="text-rose-500">*</span>
              </label>
              <div className="relative mt-1.5">
                <select
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  aria-required="true"
                  aria-invalid={shouldShowError('industry') ? 'true' : 'false'}
                  aria-describedby={shouldShowError('industry') ? 'industry-error' : undefined}
                  className={`h-10 w-full rounded-xl border bg-white px-3 text-xs text-[#101c3d] focus:outline-hidden focus:ring-2 ${
                    shouldShowError('industry')
                      ? 'border-rose-300 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-100'
                      : 'border-[#dce7f5] focus:border-[#1260ed] focus:ring-blue-100'
                  }`}
                >
                  <option value="">Select industry sector...</option>
                  {industryOptions.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>
              {shouldShowError('industry') && (
                <p id="industry-error" role="alert" className="mt-1 text-[11px] font-semibold text-rose-600">
                  {errors.industry}
                </p>
              )}
            </div>

            {/* Company Website (Optional) */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="website"
                  className="block text-xs font-bold text-[#101c3d]"
                >
                  Company Website
                </label>
                <span className="text-[10px] text-slate-400">Optional</span>
              </div>
              <div className="relative mt-1.5">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <GlobeIcon className="h-4 w-4" />
                </span>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  aria-invalid={shouldShowError('website') ? 'true' : 'false'}
                  aria-describedby={shouldShowError('website') ? 'website-error' : undefined}
                  placeholder="https://example.com"
                  className={`h-10 w-full rounded-xl border bg-white pl-9 pr-3 text-xs text-[#101c3d] placeholder:text-slate-400 focus:outline-hidden focus:ring-2 ${
                    shouldShowError('website')
                      ? 'border-rose-300 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-100'
                      : 'border-[#dce7f5] focus:border-[#1260ed] focus:ring-blue-100'
                  }`}
                />
              </div>
              {shouldShowError('website') && (
                <p id="website-error" role="alert" className="mt-1 text-[11px] font-semibold text-rose-600">
                  {errors.website}
                </p>
              )}
            </div>

            {/* Company Size */}
            <div>
              <label
                htmlFor="companySize"
                className="block text-xs font-bold text-[#101c3d]"
              >
                Company Size <span className="text-rose-500">*</span>
              </label>
              <div className="relative mt-1.5">
                <select
                  id="companySize"
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  aria-required="true"
                  aria-invalid={shouldShowError('companySize') ? 'true' : 'false'}
                  aria-describedby={shouldShowError('companySize') ? 'companySize-error' : undefined}
                  className={`h-10 w-full rounded-xl border bg-white px-3 text-xs text-[#101c3d] focus:outline-hidden focus:ring-2 ${
                    shouldShowError('companySize')
                      ? 'border-rose-300 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-100'
                      : 'border-[#dce7f5] focus:border-[#1260ed] focus:ring-blue-100'
                  }`}
                >
                  <option value="">Select organization size...</option>
                  {companySizeOptions.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
              {shouldShowError('companySize') && (
                <p id="companySize-error" role="alert" className="mt-1 text-[11px] font-semibold text-rose-600">
                  {errors.companySize}
                </p>
              )}
            </div>

            {/* Company Location */}
            <div className="sm:col-span-2">
              <label
                htmlFor="location"
                className="block text-xs font-bold text-[#101c3d]"
              >
                Headquarters / Primary Location <span className="text-rose-500">*</span>
              </label>
              <div className="relative mt-1.5">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <MapPinIcon className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  aria-required="true"
                  aria-invalid={shouldShowError('location') ? 'true' : 'false'}
                  aria-describedby={shouldShowError('location') ? 'location-error' : undefined}
                  placeholder="e.g. San Francisco, CA (Hybrid)"
                  className={`h-10 w-full rounded-xl border bg-white pl-9 pr-3 text-xs text-[#101c3d] placeholder:text-slate-400 focus:outline-hidden focus:ring-2 ${
                    shouldShowError('location')
                      ? 'border-rose-300 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-100'
                      : 'border-[#dce7f5] focus:border-[#1260ed] focus:ring-blue-100'
                  }`}
                />
              </div>
              {shouldShowError('location') && (
                <p id="location-error" role="alert" className="mt-1 text-[11px] font-semibold text-rose-600">
                  {errors.location}
                </p>
              )}
            </div>

            {/* Company Description (Optional) */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="description"
                  className="block text-xs font-bold text-[#101c3d]"
                >
                  Company Overview & Mission
                </label>
                <span className="text-[10px] text-slate-400">Optional</span>
              </div>
              <div className="mt-1.5">
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Share a brief introduction to your organization, hiring culture, and core mission..."
                  className="w-full rounded-xl border border-[#dce7f5] bg-white p-3 text-xs text-[#101c3d] placeholder:text-slate-400 focus:border-[#1260ed] focus:outline-hidden focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <p className="mt-1 text-[11px] text-[#71829e]">
                This summary is displayed to student applicants browsing your vacancies.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Form Bottom Actions & Confirmation Footer */}
        <div className="flex flex-col-reverse justify-between gap-3 border-t border-[#edf3fc] pt-4 sm:flex-row sm:items-center">
          <div className="text-xs text-[#71829e]">
            {isDirty ? (
              <span className="font-semibold text-amber-600">
                You have unsaved changes in your profile.
              </span>
            ) : (
              <span>All changes saved to this browser session.</span>
            )}
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={!isDirty}
              aria-disabled={!isDirty}
              className={`rounded-xl border px-4 py-2.5 text-xs font-semibold transition focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1260ed] ${
                isDirty
                  ? 'border-[#dce7f5] bg-white text-[#50617c] hover:bg-[#f3f7fd] hover:text-[#101c3d] shadow-xs cursor-pointer'
                  : 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#1260ed] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1260ed] focus-visible:ring-offset-1 cursor-pointer"
            >
              <CheckCircleIcon className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default RecruiterProfilePage
