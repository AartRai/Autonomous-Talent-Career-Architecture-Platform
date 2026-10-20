import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ProfileExpertiseIcon,
  AcademicCapIcon,
  BuildingIcon,
  ClockIcon,
  CloseIcon,
  CheckCircleIcon,
  SparklesIcon,
  GlobeIcon,
  BookOpenIcon,
  MailIcon,
  PlusIcon,
} from '../../components/faculty/FacultyIcons.jsx'

import { getFacultyProfileData } from '../../services/facultyService.js'

function validateUrl(url) {
  if (!url || !url.trim()) return ''
  try {
    const parsed = new URL(url.trim())
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return 'URL must start with http:// or https://'
    }
    return ''
  } catch {
    return 'Please enter a valid URL (e.g., https://orcid.org/0000-0002-1825-0097)'
  }
}

function validateEmail(email) {
  if (!email || !email.trim()) return 'Official email is required.'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address.'
  }
  return ''
}

export default function FacultyProfilePage() {
  const [formData, setFormData] = useState({
    fullName: '',
    initials: 'DR',
    officialEmail: '',
    designation: '',
    department: '',
    institution: '',
    highestQualification: '',
    yearsOfExperience: '',
    researchSpecialization: '',
    biography: '',
    publicationsCount: 0,
    orcidUrl: '',
    researchInterests: [],
    areasOfExpertise: [],
    researchKeywords: [],
  })

  const [savedData, setSavedData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Tag input states
  const [newInterestInput, setNewInterestInput] = useState('')
  const [newExpertiseInput, setNewExpertiseInput] = useState('')
  const [newKeywordInput, setNewKeywordInput] = useState('')

  // Validation & feedback states
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [feedback, setFeedback] = useState(null)

  // Load initial demo profile data
  useEffect(() => {
    let isMounted = true
    getFacultyProfileData()
      .then((data) => {
        if (isMounted) {
          setFormData(data)
          setSavedData(data)
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  // Auto-dismiss feedback alert
  useEffect(() => {
    if (!feedback) return
    const timer = setTimeout(() => {
      setFeedback(null)
    }, 4000)
    return () => clearTimeout(timer)
  }, [feedback])

  // Check if current form is dirty (modified from saved data)
  const isDirty = useMemo(() => {
    if (!savedData) return false
    const scalarKeys = [
      'fullName',
      'officialEmail',
      'designation',
      'department',
      'institution',
      'highestQualification',
      'yearsOfExperience',
      'researchSpecialization',
      'biography',
      'publicationsCount',
      'orcidUrl',
    ]

    const scalarsDiffer = scalarKeys.some((key) => formData[key] !== savedData[key])
    if (scalarsDiffer) return true

    // Check array differences
    const arraysDiffer =
      JSON.stringify(formData.researchInterests) !== JSON.stringify(savedData.researchInterests) ||
      JSON.stringify(formData.areasOfExpertise) !== JSON.stringify(savedData.areasOfExpertise) ||
      JSON.stringify(formData.researchKeywords) !== JSON.stringify(savedData.researchKeywords)

    return arraysDiffer
  }, [formData, savedData])

  // Field validation
  const validateSingleField = (name, value) => {
    switch (name) {
      case 'fullName':
        if (!value || !value.trim()) return 'Full Name is required.'
        if (value.trim().length < 3) return 'Full Name must be at least 3 characters.'
        return ''
      case 'officialEmail':
        return validateEmail(value)
      case 'designation':
        if (!value || !value.trim()) return 'Designation is required.'
        return ''
      case 'department':
        if (!value || !value.trim()) return 'Department is required.'
        return ''
      case 'institution':
        if (!value || !value.trim()) return 'Institution is required.'
        return ''
      case 'highestQualification':
        if (!value || !value.trim()) return 'Highest Qualification is required.'
        return ''
      case 'yearsOfExperience':
        if (value === '' || value === null || value === undefined) {
          return 'Years of experience is required.'
        }
        if (Number(value) < 0 || isNaN(Number(value))) {
          return 'Please enter a valid positive number.'
        }
        return ''
      case 'orcidUrl':
        return validateUrl(value)
      default:
        return ''
    }
  }

  // Handle standard input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (hasSubmitted || touched[name]) {
      const err = validateSingleField(name, value)
      setErrors((prev) => ({ ...prev, [name]: err }))
    } else if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // Handle blur
  const handleInputBlur = (e) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const err = validateSingleField(name, value)
    setErrors((prev) => ({ ...prev, [name]: err }))
  }

  // Tag management: Research Interests
  const handleAddInterest = () => {
    const trimmed = newInterestInput.trim()
    if (!trimmed) return
    if (formData.researchInterests.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      setFeedback({
        type: 'info',
        title: 'Tag Already Exists',
        message: `"${trimmed}" is already present in your research interests.`,
      })
      return
    }
    setFormData((prev) => ({
      ...prev,
      researchInterests: [...prev.researchInterests, trimmed],
    }))
    setNewInterestInput('')
  }

  const handleRemoveInterest = (tag) => {
    setFormData((prev) => ({
      ...prev,
      researchInterests: prev.researchInterests.filter((t) => t !== tag),
    }))
  }

  // Tag management: Areas of Expertise
  const handleAddExpertise = () => {
    const trimmed = newExpertiseInput.trim()
    if (!trimmed) return
    if (formData.areasOfExpertise.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      setFeedback({
        type: 'info',
        title: 'Tag Already Exists',
        message: `"${trimmed}" is already present in your areas of expertise.`,
      })
      return
    }
    setFormData((prev) => ({
      ...prev,
      areasOfExpertise: [...prev.areasOfExpertise, trimmed],
    }))
    setNewExpertiseInput('')
  }

  const handleRemoveExpertise = (tag) => {
    setFormData((prev) => ({
      ...prev,
      areasOfExpertise: prev.areasOfExpertise.filter((t) => t !== tag),
    }))
  }

  // Tag management: Research Keywords
  const handleAddKeyword = () => {
    const trimmed = newKeywordInput.trim()
    if (!trimmed) return
    if (formData.researchKeywords.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      setFeedback({
        type: 'info',
        title: 'Keyword Already Exists',
        message: `"${trimmed}" is already present in your research keywords.`,
      })
      return
    }
    setFormData((prev) => ({
      ...prev,
      researchKeywords: [...prev.researchKeywords, trimmed],
    }))
    setNewKeywordInput('')
  }

  const handleRemoveKeyword = (tag) => {
    setFormData((prev) => ({
      ...prev,
      researchKeywords: prev.researchKeywords.filter((t) => t !== tag),
    }))
  }

  // Save changes handler
  const handleSave = (e) => {
    if (e) e.preventDefault()
    setHasSubmitted(true)

    const requiredFields = [
      'fullName',
      'officialEmail',
      'designation',
      'department',
      'institution',
      'highestQualification',
      'yearsOfExperience',
      'orcidUrl',
    ]

    const newErrors = {}
    requiredFields.forEach((field) => {
      const err = validateSingleField(field, formData[field] || '')
      if (err) {
        newErrors[field] = err
      }
    })

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      setFeedback({
        type: 'error',
        title: 'Validation Errors Detected',
        message: 'Please review and resolve the highlighted errors before saving.',
      })

      const firstInvalid = requiredFields.find((f) => newErrors[f])
      if (firstInvalid) {
        const elem = document.getElementById(firstInvalid)
        if (elem) elem.focus()
      }
      return
    }

    // Compute initials from full name
    const computedInitials = formData.fullName
      .split(' ')
      .filter((n) => n && !n.includes('.'))
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'DR'

    const updated = {
      ...formData,
      initials: computedInitials,
    }

    setFormData(updated)
    setSavedData(updated)
    setHasSubmitted(false)
    setTouched({})
    setErrors({})

    setFeedback({
      type: 'success',
      title: 'Profile & Expertise Saved (Demo Mode)',
      message:
        'Your profile changes have been saved to your local demonstration session. These updates remain in component memory and are not persisted to a backend database.',
    })
  }

  // Cancel handler restores saved baseline
  const handleCancel = () => {
    if (!isDirty) return
    setFormData({ ...savedData })
    setErrors({})
    setTouched({})
    setHasSubmitted(false)
    setNewInterestInput('')
    setNewExpertiseInput('')
    setNewKeywordInput('')
    setFeedback({
      type: 'info',
      title: 'Changes Discarded',
      message: 'Form inputs and tags have been restored to your last saved demo values.',
    })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-[#e2ecf9] bg-white p-8">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1260ed] border-r-transparent" />
          <p className="mt-3 text-xs font-semibold text-[#50617c]">
            Loading faculty profile and expertise...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-7">
      {/* Feedback Toast Notification */}
      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex max-w-md items-start gap-3 rounded-xl border border-[#cbdff8] bg-white p-4 shadow-xl transition-all duration-200 animate-in fade-in slide-in-from-bottom-3"
        >
          <span
            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-600'
                : feedback.type === 'error'
                ? 'bg-rose-50 text-rose-600'
                : 'bg-blue-50 text-[#1260ed]'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircleIcon className="h-4 w-4" />
            ) : feedback.type === 'error' ? (
              <CloseIcon className="h-4 w-4" />
            ) : (
              <SparklesIcon className="h-4 w-4" />
            )}
          </span>
          <div className="flex-1 text-xs">
            <p className="font-bold text-[#101c3d]">{feedback.title}</p>
            <p className="mt-0.5 text-[#50617c]">{feedback.message}</p>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Dismiss notification"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header & Breadcrumb */}
      <div>
        <nav aria-label="Breadcrumb" className="mb-2.5 flex items-center gap-2 text-xs">
          <Link
            to="/faculty"
            className="font-medium text-[#50617c] transition-colors hover:text-[#1260ed]"
          >
            Faculty Dashboard
          </Link>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-[#101c3d]" aria-current="page">
            Profile / Expertise
          </span>
        </nav>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#101c3d] sm:text-3xl">
              Profile / Expertise
            </h1>
            <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-[#50617c]">
              Manage your academic profile, research interests, and areas of expertise.
            </p>
          </div>

          <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50/70 px-3 py-1 text-xs font-semibold text-[#1260ed]">
            <SparklesIcon className="h-3.5 w-3.5" />
            <span>Demo Mode • Local Session State</span>
          </div>
        </div>
      </div>

      {/* Section A: Profile Summary Card */}
      <section
        aria-labelledby="profile-summary-heading"
        className="rounded-2xl border border-[#e2ecf9] bg-white p-6 shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-7"
      >
        <h2 id="profile-summary-heading" className="sr-only">
          Faculty Profile Summary
        </h2>

        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            {/* Avatar Initials Badge */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1260ed] to-[#2563eb] text-2xl font-extrabold text-white shadow-lg shadow-blue-500/20 ring-4 ring-blue-50">
              {formData.initials || 'DR'}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-extrabold text-[#101c3d] sm:text-2xl">
                  {formData.fullName || 'Dr. Radhika Sharma'}
                </h3>
                <span className="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-[#1260ed]">
                  Verified Faculty
                </span>
              </div>

              <p className="text-xs font-semibold text-[#1260ed] sm:text-sm">
                {formData.designation} • {formData.department}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-[#50617c]">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <BuildingIcon className="h-3.5 w-3.5 text-[#1260ed]" />
                  <span>{formData.institution}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <ClockIcon className="h-3.5 w-3.5 text-[#7c3aed]" />
                  <span>{formData.yearsOfExperience} Years Academic Experience</span>
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <BookOpenIcon className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{formData.publicationsCount} Peer-Reviewed Publications</span>
                </span>
              </div>
            </div>
          </div>

          {/* Specialization & ORCID badge */}
          <div className="flex flex-col items-start gap-2 rounded-xl bg-[#f8fbff] p-4 text-xs md:max-w-xs md:items-end md:text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Primary Specialization
            </span>
            <span className="font-bold text-[#101c3d]">
              {formData.researchSpecialization || 'Distributed AI & Hardware Security'}
            </span>
            {formData.orcidUrl && (
              <a
                href={formData.orcidUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex items-center gap-1 font-semibold text-[#1260ed] hover:underline"
              >
                <GlobeIcon className="h-3.5 w-3.5" />
                <span>ORCID Profile</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Main Form Layout: 2 Column Grid */}
      <form onSubmit={handleSave} noValidate className="space-y-7">
        {/* Section B: Academic Information Form */}
        <section
          aria-labelledby="academic-info-heading"
          className="rounded-2xl border border-[#e2ecf9] bg-white p-6 shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-7"
        >
          <div className="flex items-center gap-2 border-b border-[#eef4fc] pb-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#edf4ff] text-[#1260ed]">
              <AcademicCapIcon className="h-4 w-4" />
            </span>
            <div>
              <h2 id="academic-info-heading" className="text-sm font-bold text-[#101c3d] sm:text-base">
                Academic & Institutional Information
              </h2>
              <p className="text-[11px] text-[#50617c]">
                Update your primary faculty credentials, appointment, and university affiliation.
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="mb-1.5 block text-xs font-semibold text-[#50617c]">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                placeholder="e.g. Dr. Radhika Sharma"
                className={`w-full rounded-xl border bg-[#fbfdff] px-3.5 py-2.5 text-xs text-[#101c3d] transition focus:bg-white focus:outline-none focus:ring-2 ${
                  errors.fullName
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                    : 'border-[#d6e6fe] focus:border-[#1260ed] focus:ring-[#1260ed]/20'
                }`}
              />
              {errors.fullName && (
                <p className="mt-1 text-[11px] font-medium text-rose-600">{errors.fullName}</p>
              )}
            </div>

            {/* Official Email */}
            <div>
              <label htmlFor="officialEmail" className="mb-1.5 block text-xs font-semibold text-[#50617c]">
                Official Institutional Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <MailIcon className="h-4 w-4" />
                </span>
                <input
                  id="officialEmail"
                  name="officialEmail"
                  type="email"
                  value={formData.officialEmail}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder="e.g. r.sharma@apextech.edu.demo"
                  className={`w-full rounded-xl border bg-[#fbfdff] py-2.5 pl-9 pr-3 text-xs text-[#101c3d] transition focus:bg-white focus:outline-none focus:ring-2 ${
                    errors.officialEmail
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                      : 'border-[#d6e6fe] focus:border-[#1260ed] focus:ring-[#1260ed]/20'
                  }`}
                />
              </div>
              {errors.officialEmail && (
                <p className="mt-1 text-[11px] font-medium text-rose-600">{errors.officialEmail}</p>
              )}
            </div>

            {/* Designation */}
            <div>
              <label htmlFor="designation" className="mb-1.5 block text-xs font-semibold text-[#50617c]">
                Designation / Title <span className="text-rose-500">*</span>
              </label>
              <input
                id="designation"
                name="designation"
                type="text"
                value={formData.designation}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                placeholder="e.g. Professor & Research Lead"
                className={`w-full rounded-xl border bg-[#fbfdff] px-3.5 py-2.5 text-xs text-[#101c3d] transition focus:bg-white focus:outline-none focus:ring-2 ${
                  errors.designation
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                    : 'border-[#d6e6fe] focus:border-[#1260ed] focus:ring-[#1260ed]/20'
                }`}
              />
              {errors.designation && (
                <p className="mt-1 text-[11px] font-medium text-rose-600">{errors.designation}</p>
              )}
            </div>

            {/* Department */}
            <div>
              <label htmlFor="department" className="mb-1.5 block text-xs font-semibold text-[#50617c]">
                Department <span className="text-rose-500">*</span>
              </label>
              <input
                id="department"
                name="department"
                type="text"
                value={formData.department}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                placeholder="e.g. Department of Computer Science & Engineering"
                className={`w-full rounded-xl border bg-[#fbfdff] px-3.5 py-2.5 text-xs text-[#101c3d] transition focus:bg-white focus:outline-none focus:ring-2 ${
                  errors.department
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                    : 'border-[#d6e6fe] focus:border-[#1260ed] focus:ring-[#1260ed]/20'
                }`}
              />
              {errors.department && (
                <p className="mt-1 text-[11px] font-medium text-rose-600">{errors.department}</p>
              )}
            </div>

            {/* Institution */}
            <div>
              <label htmlFor="institution" className="mb-1.5 block text-xs font-semibold text-[#50617c]">
                Institution / University <span className="text-rose-500">*</span>
              </label>
              <input
                id="institution"
                name="institution"
                type="text"
                value={formData.institution}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                placeholder="e.g. Apex Institute of Technology & Advanced Sciences"
                className={`w-full rounded-xl border bg-[#fbfdff] px-3.5 py-2.5 text-xs text-[#101c3d] transition focus:bg-white focus:outline-none focus:ring-2 ${
                  errors.institution
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                    : 'border-[#d6e6fe] focus:border-[#1260ed] focus:ring-[#1260ed]/20'
                }`}
              />
              {errors.institution && (
                <p className="mt-1 text-[11px] font-medium text-rose-600">{errors.institution}</p>
              )}
            </div>

            {/* Highest Qualification */}
            <div>
              <label htmlFor="highestQualification" className="mb-1.5 block text-xs font-semibold text-[#50617c]">
                Highest Qualification <span className="text-rose-500">*</span>
              </label>
              <input
                id="highestQualification"
                name="highestQualification"
                type="text"
                value={formData.highestQualification}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                placeholder="e.g. Ph.D. in Computer Science & Engineering"
                className={`w-full rounded-xl border bg-[#fbfdff] px-3.5 py-2.5 text-xs text-[#101c3d] transition focus:bg-white focus:outline-none focus:ring-2 ${
                  errors.highestQualification
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                    : 'border-[#d6e6fe] focus:border-[#1260ed] focus:ring-[#1260ed]/20'
                }`}
              />
              {errors.highestQualification && (
                <p className="mt-1 text-[11px] font-medium text-rose-600">{errors.highestQualification}</p>
              )}
            </div>

            {/* Years of Experience */}
            <div>
              <label htmlFor="yearsOfExperience" className="mb-1.5 block text-xs font-semibold text-[#50617c]">
                Years of Academic Experience <span className="text-rose-500">*</span>
              </label>
              <input
                id="yearsOfExperience"
                name="yearsOfExperience"
                type="number"
                min="0"
                max="60"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                placeholder="e.g. 14"
                className={`w-full rounded-xl border bg-[#fbfdff] px-3.5 py-2.5 text-xs text-[#101c3d] transition focus:bg-white focus:outline-none focus:ring-2 ${
                  errors.yearsOfExperience
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                    : 'border-[#d6e6fe] focus:border-[#1260ed] focus:ring-[#1260ed]/20'
                }`}
              />
              {errors.yearsOfExperience && (
                <p className="mt-1 text-[11px] font-medium text-rose-600">{errors.yearsOfExperience}</p>
              )}
            </div>

            {/* Research Specialization Title */}
            <div>
              <label htmlFor="researchSpecialization" className="mb-1.5 block text-xs font-semibold text-[#50617c]">
                Primary Research Specialization
              </label>
              <input
                id="researchSpecialization"
                name="researchSpecialization"
                type="text"
                value={formData.researchSpecialization}
                onChange={handleInputChange}
                placeholder="e.g. Edge AI, Federated Learning & Hardware-Accelerated Security"
                className="w-full rounded-xl border border-[#d6e6fe] bg-[#fbfdff] px-3.5 py-2.5 text-xs text-[#101c3d] transition focus:border-[#1260ed] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1260ed]/20"
              />
            </div>

            {/* Biography */}
            <div className="md:col-span-2">
              <label htmlFor="biography" className="mb-1.5 block text-xs font-semibold text-[#50617c]">
                Profile / Biography
              </label>
              <textarea
                id="biography"
                name="biography"
                rows="4"
                value={formData.biography}
                onChange={handleInputChange}
                placeholder="Brief academic biography, laboratory direction, research vision, and institutional achievements..."
                className="w-full rounded-xl border border-[#d6e6fe] bg-[#fbfdff] p-3 text-xs leading-relaxed text-[#101c3d] transition focus:border-[#1260ed] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1260ed]/20"
              />
            </div>
          </div>
        </section>

        {/* Section C: Research & Expertise Section */}
        <section
          aria-labelledby="research-expertise-heading"
          className="rounded-2xl border border-[#e2ecf9] bg-white p-6 shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-7"
        >
          <div className="flex items-center gap-2 border-b border-[#eef4fc] pb-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#edf4ff] text-[#1260ed]">
              <ProfileExpertiseIcon className="h-4 w-4" />
            </span>
            <div>
              <h2 id="research-expertise-heading" className="text-sm font-bold text-[#101c3d] sm:text-base">
                Research Domains, Expertise & Scholarly Metrics
              </h2>
              <p className="text-[11px] text-[#50617c]">
                Manage technical tags, research interests, publication tallies, and professional identity links.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-6">
            {/* Tag Group 1: Research Interests */}
            <div>
              <label htmlFor="interest-input" className="mb-1 block text-xs font-bold text-[#101c3d]">
                Research Interests
              </label>
              <p className="mb-2 text-[11px] text-[#50617c]">
                Add core research domains and scientific themes. Press Enter or click Add Tag.
              </p>

              {/* Tag Chips */}
              <div className="mb-2.5 flex flex-wrap gap-1.5">
                {formData.researchInterests.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#cbdff8] bg-[#edf4ff] px-2.5 py-1 text-xs font-semibold text-[#1260ed]"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(tag)}
                      className="rounded hover:bg-blue-100 text-[#1260ed]"
                      aria-label={`Remove ${tag}`}
                    >
                      <CloseIcon className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Input */}
              <div className="flex max-w-md items-center gap-2">
                <input
                  id="interest-input"
                  type="text"
                  value={newInterestInput}
                  onChange={(e) => setNewInterestInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddInterest()
                    }
                  }}
                  placeholder="e.g. Neuromorphic Computing..."
                  className="flex-1 rounded-xl border border-[#d6e6fe] bg-[#fbfdff] px-3 py-2 text-xs text-[#101c3d] transition focus:border-[#1260ed] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1260ed]/20"
                />
                <button
                  type="button"
                  onClick={handleAddInterest}
                  className="inline-flex items-center gap-1 rounded-xl bg-[#edf4ff] px-3.5 py-2 text-xs font-bold text-[#1260ed] transition hover:bg-[#dbe9fe]"
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Tag Group 2: Areas of Expertise */}
            <div className="border-t border-[#f0f6fd] pt-5">
              <label htmlFor="expertise-input" className="mb-1 block text-xs font-bold text-[#101c3d]">
                Areas of Technical Expertise
              </label>
              <p className="mb-2 text-[11px] text-[#50617c]">
                Specific applied engineering competencies, architectures, and laboratory methods.
              </p>

              {/* Tag Chips */}
              <div className="mb-2.5 flex flex-wrap gap-1.5">
                {formData.areasOfExpertise.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExpertise(tag)}
                      className="rounded hover:bg-purple-100 text-purple-700"
                      aria-label={`Remove ${tag}`}
                    >
                      <CloseIcon className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Input */}
              <div className="flex max-w-md items-center gap-2">
                <input
                  id="expertise-input"
                  type="text"
                  value={newExpertiseInput}
                  onChange={(e) => setNewExpertiseInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddExpertise()
                    }
                  }}
                  placeholder="e.g. Side-Channel Analysis..."
                  className="flex-1 rounded-xl border border-[#d6e6fe] bg-[#fbfdff] px-3 py-2 text-xs text-[#101c3d] transition focus:border-[#1260ed] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1260ed]/20"
                />
                <button
                  type="button"
                  onClick={handleAddExpertise}
                  className="inline-flex items-center gap-1 rounded-xl bg-purple-50 px-3.5 py-2 text-xs font-bold text-purple-700 transition hover:bg-purple-100"
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Tag Group 3: Research Keywords */}
            <div className="border-t border-[#f0f6fd] pt-5">
              <label htmlFor="keyword-input" className="mb-1 block text-xs font-bold text-[#101c3d]">
                Research Keywords & Toolsets
              </label>
              <p className="mb-2 text-[11px] text-[#50617c]">
                Specific tools, languages, and hardware frameworks for indexing across industry opportunity searches.
              </p>

              {/* Tag Chips */}
              <div className="mb-2.5 flex flex-wrap gap-1.5">
                {formData.researchKeywords.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(tag)}
                      className="rounded hover:bg-emerald-100 text-emerald-800"
                      aria-label={`Remove ${tag}`}
                    >
                      <CloseIcon className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Input */}
              <div className="flex max-w-md items-center gap-2">
                <input
                  id="keyword-input"
                  type="text"
                  value={newKeywordInput}
                  onChange={(e) => setNewKeywordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddKeyword()
                    }
                  }}
                  placeholder="e.g. RISC-V, Docker..."
                  className="flex-1 rounded-xl border border-[#d6e6fe] bg-[#fbfdff] px-3 py-2 text-xs text-[#101c3d] transition focus:border-[#1260ed] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1260ed]/20"
                />
                <button
                  type="button"
                  onClick={handleAddKeyword}
                  className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100"
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Metrics & Links Row */}
            <div className="grid grid-cols-1 gap-5 border-t border-[#f0f6fd] pt-5 md:grid-cols-2">
              {/* Publications Count */}
              <div>
                <label htmlFor="publicationsCount" className="mb-1.5 block text-xs font-semibold text-[#50617c]">
                  Publications Count
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <BookOpenIcon className="h-4 w-4" />
                  </span>
                  <input
                    id="publicationsCount"
                    name="publicationsCount"
                    type="number"
                    min="0"
                    value={formData.publicationsCount}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        publicationsCount: Math.max(0, parseInt(e.target.value, 10) || 0),
                      }))
                    }
                    className="w-full rounded-xl border border-[#d6e6fe] bg-[#fbfdff] py-2.5 pl-9 pr-3 text-xs text-[#101c3d] transition focus:border-[#1260ed] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1260ed]/20"
                  />
                </div>
              </div>

              {/* ORCID / Profile URL */}
              <div>
                <label htmlFor="orcidUrl" className="mb-1.5 block text-xs font-semibold text-[#50617c]">
                  ORCID / Google Scholar Profile URL
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <GlobeIcon className="h-4 w-4" />
                  </span>
                  <input
                    id="orcidUrl"
                    name="orcidUrl"
                    type="url"
                    value={formData.orcidUrl}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    placeholder="https://orcid.org/0000-0002-1825-0097"
                    className={`w-full rounded-xl border bg-[#fbfdff] py-2.5 pl-9 pr-3 text-xs text-[#101c3d] transition focus:bg-white focus:outline-none focus:ring-2 ${
                      errors.orcidUrl
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                        : 'border-[#d6e6fe] focus:border-[#1260ed] focus:ring-[#1260ed]/20'
                    }`}
                  />
                </div>
                {errors.orcidUrl && (
                  <p className="mt-1 text-[11px] font-medium text-rose-600">{errors.orcidUrl}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Section D: Form Action Buttons Bar */}
        <div className="flex flex-col gap-3 rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-2 text-xs text-[#50617c]">
            {isDirty ? (
              <span className="flex items-center gap-1.5 font-bold text-amber-600">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                Unsaved changes in current form session
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-slate-400">
                <CheckCircleIcon className="h-3.5 w-3.5 text-emerald-500" />
                All changes saved to session
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={!isDirty}
              className={`rounded-xl border px-4 py-2 text-xs font-semibold transition ${
                isDirty
                  ? 'border-slate-300 text-[#50617c] hover:bg-slate-50'
                  : 'cursor-not-allowed border-slate-200 text-slate-300'
              }`}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#1260ed] px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#0d4ecc] focus:outline-none focus:ring-2 focus:ring-[#1260ed]/30"
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
