import { useEffect, useState } from 'react'
import { StudentProfileIcon } from '../../components/student/StudentIcons.jsx'
import { getStudentProfileData } from '../../services/studentService.js'

const profileTabs = ['About', 'Education', 'Skills', 'Projects', 'Certifications', 'Resume']

function ProfileSectionCard({ title, children, className = '' }) {
  return (
    <section className={`rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-6 ${className}`}>
      <h2 className="text-sm font-bold text-[#172744]">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function DetailRow({ label, value }) {
  return (
    <div className="grid grid-cols-[minmax(100px,0.7fr)_1fr] gap-3 py-2.5 text-xs">
      <dt className="font-semibold text-[#53647e]">{label}</dt>
      <dd className="text-[#708099]">{value}</dd>
    </div>
  )
}

function ResumeSection({ file, onFileChange, onView, sampleResume }) {
  return (
    <ProfileSectionCard title="Resume" className="h-full">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e1eafa] bg-[#f6f9ff] text-[#1260ed]">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
            <path d="M8 3h6l5 5v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            <path d="M14 3v5h5M9 13h6m-6 3h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <p className="break-all text-xs font-semibold text-[#34435d]">{file?.name ?? sampleResume.name}</p>
          <p className="mt-1 text-[11px] leading-5 text-[#8290a5]">
            {file ? 'Selected for this session' : `Sample resume · Uploaded ${sampleResume.uploadedAt}`}
          </p>
          {file && (
            <p className="text-[11px] text-[#8290a5]">
              {(file.size / 1024).toFixed(0)} KB
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onView}
        className="mt-4 rounded-lg border border-[#b8d1fb] px-4 py-2 text-xs font-semibold text-[#1260ed] transition hover:bg-[#f4f8ff]"
      >
        View resume
      </button>

      <label className="mt-3 flex cursor-pointer items-center justify-center rounded-lg border border-[#b8d1fb] px-3 py-2.5 text-center text-xs font-semibold text-[#1260ed] transition hover:bg-[#f4f8ff]">
        {file ? 'Choose another resume' : 'Upload new resume'}
        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={onFileChange}
          className="sr-only"
          aria-label="Upload a PDF resume"
        />
      </label>
      <p className="mt-2 text-[10px] leading-4 text-[#8a98ad]">PDF only. The selected file stays in this browser session.</p>
    </ProfileSectionCard>
  )
}

function StudentProfilePage() {
  const [profileData, setProfileData] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [activeTab, setActiveTab] = useState('About')
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(null)
  const [draftProfile, setDraftProfile] = useState(null)
  const [resumeFile, setResumeFile] = useState(null)
  const [resumePreviewUrl, setResumePreviewUrl] = useState('')
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    let isMounted = true

    getStudentProfileData()
      .then((data) => {
        if (isMounted) {
          setProfileData(data)
          setProfile(data.details)
          setDraftProfile(data.details)
        }
      })
      .catch((error) => {
        if (isMounted) setLoadError(`Could not load student profile data: ${error.message}`)
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(
    () => () => {
      if (resumePreviewUrl) URL.revokeObjectURL(resumePreviewUrl)
    },
    [resumePreviewUrl]
  )

  const handleEdit = () => {
    setDraftProfile(profile)
    setIsEditing(true)
    setNotice('')
  }

  const handleSave = (event) => {
    event.preventDefault()
    setProfile(draftProfile)
    setIsEditing(false)
    setNotice('Profile changes saved for this session.')
  }

  const handleResumeChange = (event) => {
    const [file] = event.target.files ?? []
    if (!file) return
    if (file.type !== 'application/pdf') {
      setNotice('Please select a PDF file for your resume.')
      event.target.value = ''
      return
    }

    setResumePreviewUrl(URL.createObjectURL(file))
    setResumeFile(file)
    setNotice('Resume selected for this session. It has not been uploaded to a server.')
  }

  const renderTabContent = () => {
    if (activeTab === 'About') {
      return (
        <div className="grid gap-5 lg:grid-cols-[1.55fr_0.9fr]">
          <ProfileSectionCard title="About Me">
            <p className="text-xs leading-6 text-[#71809a]">{profile.about}</p>
            <dl className="mt-4 divide-y divide-[#edf2f8]">
              <DetailRow label="Date of Birth" value={profileData.dateOfBirth} />
              <DetailRow label="Gender" value={profileData.gender} />
              <DetailRow label="Languages" value={profileData.languages.join(', ')} />
            </dl>
          </ProfileSectionCard>
          <ResumeSection
            file={resumeFile}
            sampleResume={profileData.resume}
            onFileChange={handleResumeChange}
            onView={() => setResumeDialogOpen(true)}
          />
        </div>
      )
    }

    if (activeTab === 'Resume') {
      return (
        <div className="max-w-xl">
          <ResumeSection
            file={resumeFile}
            sampleResume={profileData.resume}
            onFileChange={handleResumeChange}
            onView={() => setResumeDialogOpen(true)}
          />
        </div>
      )
    }

    if (activeTab === 'Skills') {
      return (
        <ProfileSectionCard title="Skills">
          <p className="mb-4 text-xs text-[#71809a]">Skills listed on this sample student profile.</p>
          <div className="flex flex-wrap gap-2">
            {profileData.tabs.Skills.map((skill) => (
              <span key={skill} className="rounded-full border border-[#dce7f6] bg-[#f7faff] px-3.5 py-2 text-xs font-medium text-[#365374]">
                {skill}
              </span>
            ))}
          </div>
        </ProfileSectionCard>
      )
    }

    return (
      <div className="space-y-4">
        {profileData.tabs[activeTab].map((item) => (
          <ProfileSectionCard key={item.id} title={item.title}>
            <p className="text-xs font-semibold text-[#50617c]">{item.subtitle}</p>
            <p className="mt-2 text-xs leading-5 text-[#71809a]">{item.detail}</p>
          </ProfileSectionCard>
        ))}
      </div>
    )
  }

  if (loadError) {
    return <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{loadError}</p>
  }

  if (!profileData || !profile || !draftProfile) {
    return <p role="status" className="text-sm text-[#71809a]">Loading student profile...</p>
  }

  return (
    <div className="space-y-6 sm:space-y-7">
      <div>
        <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-[#101c3d] sm:text-3xl">Profile</h1>
        <p className="mt-1.5 text-sm text-[#66738d]">Manage your personal information and career profile.</p>
      </div>

      <section aria-label="Student profile summary" className="rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full border-4 border-[#edf4ff] bg-gradient-to-br from-[#d9f4ef] via-[#e8efff] to-[#f8e8e0] text-xl font-extrabold text-[#315982] shadow-inner sm:h-[88px] sm:w-[88px]">
              AR
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold tracking-tight text-[#172744]">{profile.name}</h2>
              <p className="mt-1 text-xs text-[#71809a]">{profile.education}</p>
              <div className="mt-3 grid gap-x-5 gap-y-2 text-[11px] text-[#71809a] sm:grid-cols-2">
                <span className="flex min-w-0 items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[#6c83a4]">
                    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
                    <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                  </svg>
                  <span className="truncate">{profile.email}</span>
                </span>
                <span className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-3.5 w-3.5 text-[#6c83a4]">
                    <path d="M7 3h3l2 5-2 1.5a14 14 0 0 0 4.5 4.5L16 12l5 2v3a3 3 0 0 1-3 3A15 15 0 0 1 4 6a3 3 0 0 1 3-3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                  </svg>
                  {profile.phone}
                </span>
                <span className="flex items-center gap-2 sm:col-span-2">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-3.5 w-3.5 text-[#6c83a4]">
                    <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" stroke="currentColor" strokeWidth="1.7" />
                    <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.7" />
                  </svg>
                  {profile.location}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-[#edf2f8] pt-4 sm:flex-col sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
            <div className="flex items-center gap-3 sm:flex-col sm:gap-1">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full" style={{ background: `conic-gradient(#19b596 0deg ${profileData.completion * 3.6}deg,#e7edf5 ${profileData.completion * 3.6}deg 360deg)` }}>
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xs font-extrabold text-[#16856b]">{profileData.completion}%</div>
              </div>
              <span className="text-[10px] font-medium text-[#8290a5]">Profile completion</span>
            </div>
            {!isEditing && (
              <button
                type="button"
                onClick={handleEdit}
                className="inline-flex items-center gap-2 rounded-lg border border-[#b8d1fb] px-3.5 py-2 text-xs font-semibold text-[#1260ed] transition hover:bg-[#f4f8ff]"
              >
                <StudentProfileIcon className="h-4 w-4" />
                Edit profile
              </button>
            )}
          </div>
        </div>
      </section>

      {isEditing && (
        <form onSubmit={handleSave} className="rounded-2xl border border-[#dbe7f7] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-6">
          <h2 className="text-sm font-bold text-[#172744]">Edit profile details</h2>
          <p className="mt-1 text-xs text-[#8290a5]">Changes are only saved in this browser session.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {[
              ['name', 'Full name'],
              ['education', 'Education'],
              ['email', 'Email'],
              ['phone', 'Phone'],
              ['location', 'Location'],
            ].map(([field, label]) => (
              <label key={field} className="grid gap-1.5 text-xs font-semibold text-[#53647e]">
                {label}
                <input
                  type="text"
                  value={draftProfile[field]}
                  onChange={(event) => setDraftProfile({ ...draftProfile, [field]: event.target.value })}
                  className="h-10 rounded-lg border border-[#dce5f1] px-3 text-xs font-normal text-[#34435d] outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </label>
            ))}
            <label className="grid gap-1.5 text-xs font-semibold text-[#53647e] sm:col-span-2">
              About me
              <textarea
                value={draftProfile.about}
                onChange={(event) => setDraftProfile({ ...draftProfile, about: event.target.value })}
                rows={3}
                className="rounded-lg border border-[#dce5f1] p-3 text-xs font-normal leading-5 text-[#34435d] outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-lg border border-[#dce5f1] px-4 py-2 text-xs font-semibold text-[#53647e] hover:bg-[#f8fbff]"
            >
              Cancel
            </button>
            <button type="submit" className="rounded-lg bg-[#1260ed] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0d52cf]">
              Save profile
            </button>
          </div>
        </form>
      )}

      <div>
        <div className="flex gap-1 overflow-x-auto border-b border-[#dfe8f3]" role="tablist" aria-label="Profile sections">
          {profileTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`relative shrink-0 px-4 py-3 text-xs font-semibold transition ${
                activeTab === tab ? 'text-[#1260ed]' : 'text-[#71809a] hover:text-[#315982]'
              }`}
            >
              {tab}
              {activeTab === tab && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[#1260ed]" />}
            </button>
          ))}
        </div>
        <div className="pt-4" role="tabpanel" aria-label={`${activeTab} profile details`}>
          {renderTabContent()}
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">{notice}</p>

      {resumeDialogOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setResumeDialogOpen(false)
          }}
        >
          <section role="dialog" aria-modal="true" aria-labelledby="resume-title" className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e7edf5] px-5 py-4">
              <div className="min-w-0">
                <h2 id="resume-title" className="truncate text-sm font-bold text-[#172744]">
                  {resumeFile?.name ?? profileData.resume.name}
                </h2>
                <p className="mt-1 text-[11px] text-[#8290a5]">
                  {resumeFile ? 'Local preview' : 'Sample resume preview'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setResumeDialogOpen(false)}
                className="ml-4 rounded-lg px-3 py-2 text-xs font-semibold text-[#53647e] hover:bg-[#f3f6fa]"
              >
                Close
              </button>
            </div>
            {resumePreviewUrl ? (
              <iframe title="Uploaded resume preview" src={resumePreviewUrl} className="min-h-[60vh] w-full bg-[#f3f6fa]" />
            ) : (
              <div className="grid min-h-[280px] place-items-center bg-[#f6f9fd] p-6">
                <div className="max-w-sm rounded-xl border border-[#e2ecf9] bg-white p-6 text-center">
                  <StudentProfileIcon className="mx-auto h-8 w-8 text-[#1260ed]" />
                  <p className="mt-3 text-sm font-bold text-[#243653]">Sample resume preview</p>
                  <p className="mt-2 text-xs leading-5 text-[#71809a]">
                    Upload a PDF resume to preview your own document here. The sample file name is for demonstration only.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

export default StudentProfilePage
