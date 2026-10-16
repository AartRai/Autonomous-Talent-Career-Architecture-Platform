import { useState } from 'react'
import { Link } from 'react-router-dom'

const errorFieldIdMap = {
  jobTitle: 'jobTitle',
  companyName: 'companyName',
  location: 'location',
  workMode: 'workMode',
  jobType: 'jobType',
  experienceLevel: 'experienceLevel',
  openingsCount: 'openingsCount',
  jobDescription: 'jobDescription',
  requiredSkills: 'requiredSkillInput',
  responsibilities: 'responsibilities',
  qualifications: 'qualifications',
}

function PostJobPage() {
  // Empty initial values as requested
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    location: '',
    workMode: '',
    jobType: '',
    experienceLevel: '',
    salaryRange: '',
    openingsCount: '',
  })

  // Empty initial values for textareas and skills
  const [jobDescription, setJobDescription] = useState('')
  const [requiredSkills, setRequiredSkills] = useState([])
  const [preferredSkills, setPreferredSkills] = useState([])
  const [requiredSkillInput, setRequiredSkillInput] = useState('')
  const [preferredSkillInput, setPreferredSkillInput] = useState('')
  const [responsibilities, setResponsibilities] = useState('')
  const [qualifications, setQualifications] = useState('')

  // Validation & interaction states
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [draftSavedAt, setDraftSavedAt] = useState(null)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [showPublishedModal, setShowPublishedModal] = useState(false)

  // Detect previously saved local session draft on mount via lazy initializer
  const [savedDraftNotice, setSavedDraftNotice] = useState(() => {
    try {
      const raw = sessionStorage.getItem('synapse_recruiter_job_draft')
      if (raw) {
        const data = JSON.parse(raw)
        return data && data.savedAt ? data : null
      }
    } catch {
      // Fallback
    }
    return null
  })

  // Input change handler with error clearing
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // Required skills handlers
  const handleAddRequiredSkill = (e) => {
    if (e) e.preventDefault()
    const trimmed = requiredSkillInput.trim()
    if (!trimmed) return
    const exists = requiredSkills.some(
      (s) => s.toLowerCase() === trimmed.toLowerCase()
    )
    if (!exists) {
      setRequiredSkills((prev) => [...prev, trimmed])
      if (errors.requiredSkills) {
        setErrors((prev) => ({ ...prev, requiredSkills: '' }))
      }
    }
    setRequiredSkillInput('')
  }

  const handleRemoveRequiredSkill = (skillToRemove) => {
    setRequiredSkills((prev) => prev.filter((s) => s !== skillToRemove))
  }

  // Preferred skills handlers
  const handleAddPreferredSkill = (e) => {
    if (e) e.preventDefault()
    const trimmed = preferredSkillInput.trim()
    if (!trimmed) return
    const exists = preferredSkills.some(
      (s) => s.toLowerCase() === trimmed.toLowerCase()
    )
    if (!exists) {
      setPreferredSkills((prev) => [...prev, trimmed])
    }
    setPreferredSkillInput('')
  }

  const handleRemovePreferredSkill = (skillToRemove) => {
    setPreferredSkills((prev) => prev.filter((s) => s !== skillToRemove))
  }

  // Form validation function
  const validateForm = () => {
    const newErrors = {}

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required.'
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required.'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required.'
    }

    if (!formData.workMode) {
      newErrors.workMode = 'Please select a work mode.'
    }

    if (!formData.jobType) {
      newErrors.jobType = 'Please select a job type.'
    }

    if (!formData.experienceLevel) {
      newErrors.experienceLevel = 'Please select an experience level.'
    }

    const openings = Number(formData.openingsCount)
    if (!formData.openingsCount || !formData.openingsCount.toString().trim()) {
      newErrors.openingsCount = 'Number of openings is required.'
    } else if (!Number.isInteger(openings) || openings < 1) {
      newErrors.openingsCount = 'Number of openings must be a positive integer (at least 1).'
    }

    if (!jobDescription.trim()) {
      newErrors.jobDescription = 'Job description is required.'
    }

    if (requiredSkills.length === 0) {
      newErrors.requiredSkills = 'Please add at least one required skill.'
    }

    if (!responsibilities.trim()) {
      newErrors.responsibilities = 'Key responsibilities are required.'
    }

    if (!qualifications.trim()) {
      newErrors.qualifications = 'Qualifications and education are required.'
    }

    return newErrors
  }

  // Save Draft handler (temporary session persistence)
  const handleSaveDraft = (e) => {
    e.preventDefault()
    setIsSavingDraft(true)

    const now = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })

    const draftData = {
      formData,
      jobDescription,
      requiredSkills,
      preferredSkills,
      responsibilities,
      qualifications,
      savedAt: now,
    }

    try {
      sessionStorage.setItem('synapse_recruiter_job_draft', JSON.stringify(draftData))
    } catch {
      // In-memory component state serves as fallback
    }

    setTimeout(() => {
      setIsSavingDraft(false)
      setDraftSavedAt(now)
      setSavedDraftNotice(null)
      setSubmitStatus({
        type: 'draft',
        message: `Draft saved locally at ${now}. (Demo notice: Stored in browser session).`,
      })
    }, 250)
  }

  // Restore Draft handler
  const handleRestoreDraft = () => {
    try {
      const raw = sessionStorage.getItem('synapse_recruiter_job_draft')
      if (raw) {
        const data = JSON.parse(raw)
        if (data.formData) setFormData(data.formData)
        if (typeof data.jobDescription === 'string') setJobDescription(data.jobDescription)
        if (Array.isArray(data.requiredSkills)) setRequiredSkills(data.requiredSkills)
        if (Array.isArray(data.preferredSkills)) setPreferredSkills(data.preferredSkills)
        if (typeof data.responsibilities === 'string') setResponsibilities(data.responsibilities)
        if (typeof data.qualifications === 'string') setQualifications(data.qualifications)
        if (data.savedAt) setDraftSavedAt(data.savedAt)
        setErrors({})
        setSavedDraftNotice(null)
        setSubmitStatus({
          type: 'draft',
          message: `Draft saved at ${data.savedAt} restored successfully.`,
        })
      }
    } catch {
      // In-memory fallback
    }
  }

  // Publish Job handler
  const handlePublish = (e) => {
    e.preventDefault()
    const validationErrors = validateForm()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setSubmitStatus({
        type: 'error',
        message: 'Please resolve the highlighted validation errors before publishing.',
      })

      // Scroll and focus on the first invalid field
      const firstErrorKey = Object.keys(validationErrors)[0]
      const elementId = errorFieldIdMap[firstErrorKey]
      if (elementId) {
        const el = document.getElementById(elementId)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          el.focus()
        }
      }
      return
    }

    // Valid: simulate publication workflow
    setErrors({})
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setShowPublishedModal(true)
      setSubmitStatus({
        type: 'success',
        message: 'Job posting validated and compiled in local demo session.',
      })
    }, 350)
  }

  const handleResetForm = () => {
    setFormData({
      jobTitle: '',
      companyName: '',
      location: '',
      workMode: '',
      jobType: '',
      experienceLevel: '',
      salaryRange: '',
      openingsCount: '',
    })
    setJobDescription('')
    setRequiredSkills([])
    setPreferredSkills([])
    setRequiredSkillInput('')
    setPreferredSkillInput('')
    setResponsibilities('')
    setQualifications('')
    setErrors({})
    setSubmitStatus(null)
    setShowPublishedModal(false)
  }

  return (
    <div className="space-y-7">
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs font-medium text-[#71829e]"
      >
        <Link
          to="/recruiter"
          className="transition hover:text-[#1260ed]"
        >
          Recruiter Dashboard
        </Link>
        <span className="text-slate-300" aria-hidden="true">
          /
        </span>
        <span className="font-semibold text-[#101c3d]" aria-current="page">
          Post a Job
        </span>
      </nav>

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-[#101c3d] sm:text-3xl">
          Post a Job
        </h1>
        <p className="mt-1.5 text-sm text-[#66738d] sm:text-base">
          Create a job listing to discover and connect with the right talent.
        </p>
      </div>

      {/* Saved Draft Restoration Banner */}
      {savedDraftNotice && !draftSavedAt && (
        <div
          role="region"
          aria-label="Saved draft notice"
          className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-blue-200 bg-blue-50/80 p-4 text-xs font-medium text-blue-900 sm:flex-row sm:items-center"
        >
          <div className="flex items-center gap-2.5">
            <svg className="h-4 w-4 shrink-0 text-[#1260ed]" viewBox="0 0 16 16" fill="currentColor">
              <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm-.75-7.5a.75.75 0 0 1 1.5 0v4a.75.75 0 0 1-1.5 0v-4Zm.75-2.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
            </svg>
            <span>
              A previously saved local draft from <strong>{savedDraftNotice.savedAt}</strong> was found in this browser session.
            </span>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleRestoreDraft}
              className="rounded-lg bg-[#1260ed] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Restore Draft
            </button>
            <button
              type="button"
              onClick={() => setSavedDraftNotice(null)}
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Global Status Alert Banner */}
      {submitStatus && (
        <div
          role="status"
          className={`flex items-start justify-between gap-3 rounded-2xl border p-4 text-xs font-medium sm:text-[13px] ${
            submitStatus.type === 'error'
              ? 'border-rose-200 bg-rose-50 text-rose-800'
              : submitStatus.type === 'draft'
                ? 'border-blue-200 bg-blue-50 text-blue-800'
                : 'border-emerald-200 bg-emerald-50 text-emerald-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {submitStatus.type === 'error' ? (
              <svg className="h-4 w-4 shrink-0 text-rose-600" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm-.75-4a.75.75 0 0 0 1.5 0 .75.75 0 0 0-1.5 0ZM7.25 5a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0V5Z" clipRule="evenodd" />
              </svg>
            ) : submitStatus.type === 'draft' ? (
              <svg className="h-4 w-4 shrink-0 text-blue-600" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm-.75-7.5a.75.75 0 0 1 1.5 0v4a.75.75 0 0 1-1.5 0v-4Zm.75-2.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-4 w-4 shrink-0 text-emerald-600" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm3.28-8.72a.75.75 0 0 0-1.06-1.06L7 8.44 5.78 7.22a.75.75 0 0 0-1.06 1.06l1.75 1.75a.75.75 0 0 0 1.06 0l3.75-3.75Z" clipRule="evenodd" />
              </svg>
            )}
            <span>{submitStatus.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setSubmitStatus(null)}
            className="text-slate-400 hover:text-slate-700"
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Form Elements */}
      <form onSubmit={handlePublish} noValidate className="space-y-7">
        {/* Section 1: Job Information */}
        <div className="rounded-2xl border border-[#e2ecf9] bg-white p-6 shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-8 lg:p-9">
          <div className="border-b border-[#f0f4fa] pb-4">
            <h2 className="text-lg font-bold tracking-tight text-[#101c3d] sm:text-xl">
              Job Information
            </h2>
            <p className="mt-0.5 text-xs text-[#66738d] sm:text-sm">
              Specify the role details, employment parameters, and candidate requirements.
            </p>
          </div>

          <div className="mt-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 sm:gap-6">
              {/* 1. Job Title */}
              <div>
                <label
                  htmlFor="jobTitle"
                  className="mb-1.5 block text-[13px] font-semibold text-[#1e293b]"
                >
                  Job Title <span className="text-[#1260ed]">*</span>
                </label>
                <input
                  id="jobTitle"
                  name="jobTitle"
                  type="text"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  placeholder="e.g. Software Development Engineer Intern"
                  className={`h-11 w-full rounded-xl border px-3.5 text-[13.5px] text-slate-800 placeholder:text-[#9aa6b9] transition focus:outline-none focus:ring-2 ${
                    errors.jobTitle
                      ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-100'
                      : 'border-[#cdd9ec] bg-[#f8fbff] focus:border-[#1260ed] focus:bg-white focus:ring-blue-100'
                  }`}
                />
                {errors.jobTitle && (
                  <p className="mt-1.5 text-xs font-semibold text-rose-600" role="alert">
                    {errors.jobTitle}
                  </p>
                )}
              </div>

              {/* 2. Company Name */}
              <div>
                <label
                  htmlFor="companyName"
                  className="mb-1.5 block text-[13px] font-semibold text-[#1e293b]"
                >
                  Company Name <span className="text-[#1260ed]">*</span>
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                  className={`h-11 w-full rounded-xl border px-3.5 text-[13.5px] text-slate-800 placeholder:text-[#9aa6b9] transition focus:outline-none focus:ring-2 ${
                    errors.companyName
                      ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-100'
                      : 'border-[#cdd9ec] bg-[#f8fbff] focus:border-[#1260ed] focus:bg-white focus:ring-blue-100'
                  }`}
                />
                {errors.companyName && (
                  <p className="mt-1.5 text-xs font-semibold text-rose-600" role="alert">
                    {errors.companyName}
                  </p>
                )}
              </div>

              {/* 3. Location */}
              <div>
                <label
                  htmlFor="location"
                  className="mb-1.5 block text-[13px] font-semibold text-[#1e293b]"
                >
                  Location <span className="text-[#1260ed]">*</span>
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g. Bengaluru, India"
                  className={`h-11 w-full rounded-xl border px-3.5 text-[13.5px] text-slate-800 placeholder:text-[#9aa6b9] transition focus:outline-none focus:ring-2 ${
                    errors.location
                      ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-100'
                      : 'border-[#cdd9ec] bg-[#f8fbff] focus:border-[#1260ed] focus:bg-white focus:ring-blue-100'
                  }`}
                />
                {errors.location && (
                  <p className="mt-1.5 text-xs font-semibold text-rose-600" role="alert">
                    {errors.location}
                  </p>
                )}
              </div>

              {/* 4. Work Mode */}
              <div>
                <label
                  htmlFor="workMode"
                  className="mb-1.5 block text-[13px] font-semibold text-[#1e293b]"
                >
                  Work Mode <span className="text-[#1260ed]">*</span>
                </label>
                <div className="relative">
                  <select
                    id="workMode"
                    name="workMode"
                    value={formData.workMode}
                    onChange={handleInputChange}
                    className={`h-11 w-full cursor-pointer appearance-none rounded-xl border px-3.5 pr-10 text-[13.5px] transition focus:outline-none focus:ring-2 ${
                      !formData.workMode ? 'text-[#9aa6b9]' : 'text-slate-800'
                    } ${
                      errors.workMode
                        ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-100'
                        : 'border-[#cdd9ec] bg-[#f8fbff] focus:border-[#1260ed] focus:bg-white focus:ring-blue-100'
                    }`}
                  >
                    <option value="" disabled>
                      Select Work Mode
                    </option>
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                {errors.workMode && (
                  <p className="mt-1.5 text-xs font-semibold text-rose-600" role="alert">
                    {errors.workMode}
                  </p>
                )}
              </div>

              {/* 5. Job Type */}
              <div>
                <label
                  htmlFor="jobType"
                  className="mb-1.5 block text-[13px] font-semibold text-[#1e293b]"
                >
                  Job Type <span className="text-[#1260ed]">*</span>
                </label>
                <div className="relative">
                  <select
                    id="jobType"
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleInputChange}
                    className={`h-11 w-full cursor-pointer appearance-none rounded-xl border px-3.5 pr-10 text-[13.5px] transition focus:outline-none focus:ring-2 ${
                      !formData.jobType ? 'text-[#9aa6b9]' : 'text-slate-800'
                    } ${
                      errors.jobType
                        ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-100'
                        : 'border-[#cdd9ec] bg-[#f8fbff] focus:border-[#1260ed] focus:bg-white focus:ring-blue-100'
                    }`}
                  >
                    <option value="" disabled>
                      Select Job Type
                    </option>
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                {errors.jobType && (
                  <p className="mt-1.5 text-xs font-semibold text-rose-600" role="alert">
                    {errors.jobType}
                  </p>
                )}
              </div>

              {/* 6. Experience Level */}
              <div>
                <label
                  htmlFor="experienceLevel"
                  className="mb-1.5 block text-[13px] font-semibold text-[#1e293b]"
                >
                  Experience Level <span className="text-[#1260ed]">*</span>
                </label>
                <div className="relative">
                  <select
                    id="experienceLevel"
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleInputChange}
                    className={`h-11 w-full cursor-pointer appearance-none rounded-xl border px-3.5 pr-10 text-[13.5px] transition focus:outline-none focus:ring-2 ${
                      !formData.experienceLevel ? 'text-[#9aa6b9]' : 'text-slate-800'
                    } ${
                      errors.experienceLevel
                        ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-100'
                        : 'border-[#cdd9ec] bg-[#f8fbff] focus:border-[#1260ed] focus:bg-white focus:ring-blue-100'
                    }`}
                  >
                    <option value="" disabled>
                      Select Experience Level
                    </option>
                    <option value="Fresher">Fresher</option>
                    <option value="0–1 years">0–1 years</option>
                    <option value="1–3 years">1–3 years</option>
                    <option value="3–5 years">3–5 years</option>
                    <option value="5+ years">5+ years</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                {errors.experienceLevel && (
                  <p className="mt-1.5 text-xs font-semibold text-rose-600" role="alert">
                    {errors.experienceLevel}
                  </p>
                )}
              </div>

              {/* 7. Salary Range (Optional) */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="salaryRange"
                    className="block text-[13px] font-semibold text-[#1e293b]"
                  >
                    Salary Range
                  </label>
                  <span className="text-[11px] font-medium text-slate-400">
                    Optional
                  </span>
                </div>
                <input
                  id="salaryRange"
                  name="salaryRange"
                  type="text"
                  value={formData.salaryRange}
                  onChange={handleInputChange}
                  placeholder="e.g. ₹6–10 LPA"
                  className="h-11 w-full rounded-xl border border-[#cdd9ec] bg-[#f8fbff] px-3.5 text-[13.5px] text-slate-800 placeholder:text-[#9aa6b9] transition focus:border-[#1260ed] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* 8. Number of Openings */}
              <div>
                <label
                  htmlFor="openingsCount"
                  className="mb-1.5 block text-[13px] font-semibold text-[#1e293b]"
                >
                  Number of Openings <span className="text-[#1260ed]">*</span>
                </label>
                <input
                  id="openingsCount"
                  name="openingsCount"
                  type="number"
                  min="1"
                  value={formData.openingsCount}
                  onChange={handleInputChange}
                  placeholder="e.g. 3"
                  className={`h-11 w-full rounded-xl border px-3.5 text-[13.5px] text-slate-800 placeholder:text-[#9aa6b9] transition focus:outline-none focus:ring-2 ${
                    errors.openingsCount
                      ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-100'
                      : 'border-[#cdd9ec] bg-[#f8fbff] focus:border-[#1260ed] focus:bg-white focus:ring-blue-100'
                  }`}
                />
                {errors.openingsCount && (
                  <p className="mt-1.5 text-xs font-semibold text-rose-600" role="alert">
                    {errors.openingsCount}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Job Description */}
        <div className="rounded-2xl border border-[#e2ecf9] bg-white p-6 shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-8 lg:p-9">
          <div className="border-b border-[#f0f4fa] pb-4">
            <h2 className="text-lg font-bold tracking-tight text-[#101c3d] sm:text-xl">
              Job Description
            </h2>
            <p className="mt-0.5 text-xs text-[#66738d] sm:text-sm">
              Provide a detailed overview of the role, impact, and day-to-day work.
            </p>
          </div>

          <div className="mt-6">
            <label
              htmlFor="jobDescription"
              className="mb-1.5 block text-[13px] font-semibold text-[#1e293b]"
            >
              Role Details & Scope <span className="text-[#1260ed]">*</span>
            </label>
            <textarea
              id="jobDescription"
              name="jobDescription"
              rows={6}
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value)
                if (errors.jobDescription) {
                  setErrors((prev) => ({ ...prev, jobDescription: '' }))
                }
              }}
              placeholder="Describe the role, responsibilities, and what the candidate will work on..."
              className={`w-full rounded-xl border p-3.5 text-[13.5px] leading-relaxed text-slate-800 placeholder:text-[#9aa6b9] transition focus:outline-none focus:ring-2 ${
                errors.jobDescription
                  ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-100'
                  : 'border-[#cdd9ec] bg-[#f8fbff] focus:border-[#1260ed] focus:bg-white focus:ring-blue-100'
              }`}
            />
            {errors.jobDescription && (
              <p className="mt-1.5 text-xs font-semibold text-rose-600" role="alert">
                {errors.jobDescription}
              </p>
            )}
            <p className="mt-2 text-xs leading-relaxed text-[#71829e]">
              * Highlight the core mission of the position, key team objectives, engineering culture, and the technical challenges the candidate will help solve.
            </p>
          </div>
        </div>

        {/* Section 3: Skills & Requirements */}
        <div className="rounded-2xl border border-[#e2ecf9] bg-white p-6 shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-8 lg:p-9">
          <div className="border-b border-[#f0f4fa] pb-4">
            <h2 className="text-lg font-bold tracking-tight text-[#101c3d] sm:text-xl">
              Skills & Requirements
            </h2>
            <p className="mt-0.5 text-xs text-[#66738d] sm:text-sm">
              Define mandatory proficiencies, nice-to-have skills, qualifications, and core duties.
            </p>
          </div>

          <div className="mt-6 space-y-7">
            {/* Skills Row: Required Skills & Preferred Skills */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Required Skills */}
              <div className="flex flex-col">
                <label
                  htmlFor="requiredSkillInput"
                  className="mb-1.5 block text-[13px] font-semibold text-[#1e293b]"
                >
                  Required Skills <span className="text-[#1260ed]">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="requiredSkillInput"
                    type="text"
                    value={requiredSkillInput}
                    onChange={(e) => setRequiredSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddRequiredSkill()
                      }
                    }}
                    placeholder="e.g. React, Python, Docker"
                    className={`h-11 flex-1 rounded-xl border px-3.5 text-[13.5px] text-slate-800 placeholder:text-[#9aa6b9] transition focus:outline-none focus:ring-2 ${
                      errors.requiredSkills
                        ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-100'
                        : 'border-[#cdd9ec] bg-[#f8fbff] focus:border-[#1260ed] focus:bg-white focus:ring-blue-100'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleAddRequiredSkill}
                    className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-[#1260ed] px-4 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Add
                  </button>
                </div>

                {errors.requiredSkills && (
                  <p className="mt-1.5 text-xs font-semibold text-rose-600" role="alert">
                    {errors.requiredSkills}
                  </p>
                )}

                {/* Added Required Skills Chips */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {requiredSkills.length === 0 ? (
                    <span className="text-xs italic text-slate-400">
                      No required skills added yet. Type a skill and press Enter or Add.
                    </span>
                  ) : (
                    requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#cbe0fc] bg-[#edf4ff] px-3 py-1.5 text-xs font-semibold text-[#1260ed]"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRequiredSkill(skill)}
                          className="rounded p-0.5 text-blue-500 hover:bg-blue-200/50 hover:text-blue-800"
                          aria-label={`Remove required skill ${skill}`}
                        >
                          <svg
                            viewBox="0 0 14 14"
                            fill="none"
                            aria-hidden="true"
                            className="h-3 w-3"
                          >
                            <path
                              d="m3.5 3.5 7 7m0-7-7 7"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Preferred Skills */}
              <div className="flex flex-col">
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="preferredSkillInput"
                    className="block text-[13px] font-semibold text-[#1e293b]"
                  >
                    Preferred Skills
                  </label>
                  <span className="text-[11px] font-medium text-slate-400">
                    Optional
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="preferredSkillInput"
                    type="text"
                    value={preferredSkillInput}
                    onChange={(e) => setPreferredSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddPreferredSkill()
                      }
                    }}
                    placeholder="e.g. Next.js, GraphQL, AWS"
                    className="h-11 flex-1 rounded-xl border border-[#cdd9ec] bg-[#f8fbff] px-3.5 text-[13.5px] text-slate-800 placeholder:text-[#9aa6b9] transition focus:border-[#1260ed] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    onClick={handleAddPreferredSkill}
                    className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
                  >
                    Add
                  </button>
                </div>

                {/* Added Preferred Skills Chips */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {preferredSkills.length === 0 ? (
                    <span className="text-xs italic text-slate-400">
                      No preferred skills added yet.
                    </span>
                  ) : (
                    preferredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#c8f0dc] bg-[#e9faf3] px-3 py-1.5 text-xs font-semibold text-[#16a34a]"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemovePreferredSkill(skill)}
                          className="rounded p-0.5 text-emerald-600 hover:bg-emerald-200/50 hover:text-emerald-900"
                          aria-label={`Remove preferred skill ${skill}`}
                        >
                          <svg
                            viewBox="0 0 14 14"
                            fill="none"
                            aria-hidden="true"
                            className="h-3 w-3"
                          >
                            <path
                              d="m3.5 3.5 7 7m0-7-7 7"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Responsibilities and Qualifications in a responsive 2-column grid */}
            <div className="grid grid-cols-1 gap-6 border-t border-[#f0f4fa] pt-6 md:grid-cols-2">
              {/* Responsibilities */}
              <div>
                <label
                  htmlFor="responsibilities"
                  className="mb-1.5 block text-[13px] font-semibold text-[#1e293b]"
                >
                  Key Responsibilities <span className="text-[#1260ed]">*</span>
                </label>
                <textarea
                  id="responsibilities"
                  name="responsibilities"
                  rows={5}
                  value={responsibilities}
                  onChange={(e) => {
                    setResponsibilities(e.target.value)
                    if (errors.responsibilities) {
                      setErrors((prev) => ({ ...prev, responsibilities: '' }))
                    }
                  }}
                  placeholder="Outline the day-to-day deliverables, code ownership, project collaboration, and sprint objectives..."
                  className={`w-full rounded-xl border p-3.5 text-[13.5px] leading-relaxed text-slate-800 placeholder:text-[#9aa6b9] transition focus:outline-none focus:ring-2 ${
                    errors.responsibilities
                      ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-100'
                      : 'border-[#cdd9ec] bg-[#f8fbff] focus:border-[#1260ed] focus:bg-white focus:ring-blue-100'
                  }`}
                />
                {errors.responsibilities && (
                  <p className="mt-1.5 text-xs font-semibold text-rose-600" role="alert">
                    {errors.responsibilities}
                  </p>
                )}
                <p className="mt-1.5 text-xs text-[#71829e]">
                  List core responsibilities, ownership expectations, and project deliverables.
                </p>
              </div>

              {/* Qualifications */}
              <div>
                <label
                  htmlFor="qualifications"
                  className="mb-1.5 block text-[13px] font-semibold text-[#1e293b]"
                >
                  Qualifications & Education <span className="text-[#1260ed]">*</span>
                </label>
                <textarea
                  id="qualifications"
                  name="qualifications"
                  rows={5}
                  value={qualifications}
                  onChange={(e) => {
                    setQualifications(e.target.value)
                    if (errors.qualifications) {
                      setErrors((prev) => ({ ...prev, qualifications: '' }))
                    }
                  }}
                  placeholder="e.g. Bachelor's or Master's degree in Computer Science, or equivalent hands-on industry experience..."
                  className={`w-full rounded-xl border p-3.5 text-[13.5px] leading-relaxed text-slate-800 placeholder:text-[#9aa6b9] transition focus:outline-none focus:ring-2 ${
                    errors.qualifications
                      ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-100'
                      : 'border-[#cdd9ec] bg-[#f8fbff] focus:border-[#1260ed] focus:bg-white focus:ring-blue-100'
                  }`}
                />
                {errors.qualifications && (
                  <p className="mt-1.5 text-xs font-semibold text-rose-600" role="alert">
                    {errors.qualifications}
                  </p>
                )}
                <p className="mt-1.5 text-xs text-[#71829e]">
                  Specify required degree paths, relevant certifications, or practical prerequisites.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="flex flex-col-reverse items-stretch justify-between gap-4 rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:flex-row sm:items-center sm:p-6">
          <div className="flex items-center gap-2 text-xs text-[#71829e]">
            <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
            <span>Local demo mode (temporary session storage)</span>
            {draftSavedAt && (
              <span className="font-semibold text-slate-600">
                • Draft saved at {draftSavedAt}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Save Draft */}
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSavingDraft || isSubmitting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
            >
              {isSavingDraft ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
                  <span>Saving Draft...</span>
                </>
              ) : (
                <span>Save Draft</span>
              )}
            </button>

            {/* Publish Job */}
            <button
              type="submit"
              disabled={isSavingDraft || isSubmitting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1260ed] px-6 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
            >
              {isSubmitting ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Validating...</span>
                </>
              ) : (
                <span>Publish Job</span>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Published Confirmation Modal & Preview Summary */}
      {showPublishedModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="published-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#e2ecf9] bg-white p-6 shadow-2xl sm:p-8">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-xs">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 id="published-dialog-title" className="text-xl font-bold text-[#101c3d]">
                    Job Published (Local Demo Simulation)
                  </h3>
                  <p className="text-xs text-[#66738d]">
                    All required fields validated successfully.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPublishedModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            {/* Scope & Architecture Notice */}
            <div className="mt-4 rounded-xl border border-amber-200/80 bg-amber-50 p-3.5 text-xs text-amber-900">
              <p className="font-semibold">Local Demo Notice:</p>
              <p className="mt-0.5 text-amber-800">
                This job posting has passed all client-side validations and is previewed in your active browser session. It has not been published to a real database or made publicly accessible pending FastAPI backend integration.
              </p>
            </div>

            {/* Job Summary Preview Card */}
            <div className="mt-5 space-y-4 rounded-2xl border border-[#e2ecf9] bg-[#f8fbff] p-5 text-xs text-slate-700">
              <div className="border-b border-[#e9f0fa] pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1260ed]">
                  {formData.jobType} • {formData.workMode}
                </span>
                <h4 className="mt-1 text-base font-bold text-[#101c3d]">
                  {formData.jobTitle}
                </h4>
                <p className="text-xs text-[#50617c]">
                  {formData.companyName} • {formData.location}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div>
                  <span className="text-[10px] uppercase text-slate-400">Experience</span>
                  <p className="font-semibold text-slate-800">{formData.experienceLevel}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400">Openings</span>
                  <p className="font-semibold text-slate-800">{formData.openingsCount} position(s)</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400">Salary Range</span>
                  <p className="font-semibold text-slate-800">{formData.salaryRange || 'Not disclosed'}</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase text-slate-400">Required Skills</span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {requiredSkills.map((s) => (
                    <span key={s} className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {preferredSkills.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase text-slate-400">Preferred Skills</span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {preferredSkills.map((s) => (
                      <span key={s} className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="text-[10px] uppercase text-slate-400">Job Description</span>
                <p className="mt-1 whitespace-pre-line text-xs text-slate-600 line-clamp-3">
                  {jobDescription}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-[#f0f4fa] pt-4">
              <button
                type="button"
                onClick={() => setShowPublishedModal(false)}
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={handleResetForm}
                className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs font-bold text-[#1260ed] hover:bg-blue-100"
              >
                Post Another Job
              </button>
              <Link
                to="/recruiter"
                className="rounded-xl bg-[#1260ed] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostJobPage
