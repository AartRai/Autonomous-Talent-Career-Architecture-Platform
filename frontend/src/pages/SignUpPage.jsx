import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { FieldIcon, GoogleMark } from '../components.jsx'

const roles = [
  { id: 'student', title: 'Student', description: 'Learn, build skills\nand grow', color: 'blue', icon: 'student' },
  { id: 'faculty', title: 'Faculty', description: 'Teach, guide and\ninspire students', color: 'green', icon: 'faculty' },
  { id: 'recruiter', title: 'Recruiter', description: 'Hire talent and\nbuild teams', color: 'rose', icon: 'recruiter' },
]

function RoleIcon({ type }) {
  if (type === 'student') {
    return (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="h-8 w-8">
        <path d="m3 12 13-7 13 7-13 7-13-7Z" fill="currentColor" />
        <path d="M8 15v7c4 3.5 12 3.5 16 0v-7l-8 4-8-4Zm20-3v9" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    )
  }
  if (type === 'faculty') {
    return (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="h-8 w-8">
        <path d="M15 27V14m0 7c-6 0-9-3-9-8 5 0 9 2 9 8Zm1-5c0-6 3-10 9-10 0 5-3 10-9 10Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 28h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="24" cy="8" r="2" fill="currentColor" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="h-8 w-8">
      <rect x="4" y="9" width="24" height="18" rx="3" fill="currentColor" />
      <path d="M11 9V6h10v3m-7 0v5h4V9m-14 5h24" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SignupIllustration() {
  return (
    <svg
      viewBox="0 0 560 500"
      fill="none"
      role="img"
      aria-label="Students, faculty, and recruiters working together"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="signup-orbit" x1="139" y1="73" x2="433" y2="419" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EFF6FF" />
          <stop offset="1" stopColor="#D8E7FF" />
        </linearGradient>
        <linearGradient id="signup-core" x1="248" y1="186" x2="326" y2="267" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3187F5" />
          <stop offset="1" stopColor="#155CE0" />
        </linearGradient>
      </defs>
      <path d="M0 362c69-49 127-46 187-19 62 28 106 11 161-21 74-42 151-20 212 24v154H0V362Z" fill="url(#signup-orbit)" />
      <circle cx="283" cy="228" r="141" fill="url(#signup-orbit)" />
      <circle cx="283" cy="228" r="111" stroke="#B9D1FB" strokeDasharray="4 8" />
      <circle cx="283" cy="228" r="78" stroke="#B9D1FB" strokeDasharray="4 8" />
      <path d="m185 151 73 64m121-66-73 66m-112 94 89-68m108 66-91-69m-17 3v111m0-113-105 4m105-4 107 4" stroke="#8DB3F5" strokeWidth="2" strokeDasharray="5 7" />

      <g transform="translate(240 184)">
        <circle cx="43" cy="43" r="45" fill="#B8D2FF" opacity=".42" />
        <circle cx="43" cy="43" r="37" fill="url(#signup-core)" />
        <circle cx="43" cy="43" r="30" stroke="white" strokeOpacity=".35" />
        <text x="43" y="51" textAnchor="middle" fill="white" fontFamily="Arial, sans-serif" fontSize="26" fontWeight="700">AI</text>
      </g>

      <g transform="translate(89 141)">
        <circle cx="28" cy="28" r="27" fill="white" />
        <circle cx="28" cy="28" r="26" stroke="#C7D9F5" strokeWidth="2" />
        <circle cx="24" cy="22" r="6" fill="#2877E8" />
        <circle cx="37" cy="24" r="5" fill="#5996EF" />
        <path d="M12 44c0-9 5-15 13-15s13 6 13 15m-3-12c2-2 4-3 7-3 6 0 9 5 9 11" stroke="#2877E8" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g transform="translate(382 124)">
        <circle cx="28" cy="28" r="27" fill="white" />
        <circle cx="28" cy="28" r="26" stroke="#C7D9F5" strokeWidth="2" />
        <rect x="13" y="18" width="30" height="23" rx="3" fill="#2877E8" />
        <path d="M21 18v-5h14v5m-10 0v7h6v-7" stroke="#2877E8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g transform="translate(76 288)">
        <circle cx="28" cy="28" r="27" fill="white" />
        <circle cx="28" cy="28" r="26" stroke="#C7D9F5" strokeWidth="2" />
        <path d="m9 23 19-10 19 10-19 10-19-10Z" fill="#2877E8" />
        <path d="M16 27v11c7 6 17 6 24 0V27l-12 7-12-7Z" fill="#2877E8" />
      </g>
      <g transform="translate(394 287)">
        <circle cx="28" cy="28" r="27" fill="white" />
        <circle cx="28" cy="28" r="26" stroke="#C7D9F5" strokeWidth="2" />
        <rect x="15" y="30" width="6" height="12" rx="2" fill="#2877E8" />
        <rect x="25" y="23" width="6" height="19" rx="2" fill="#2877E8" />
        <rect x="35" y="16" width="6" height="26" rx="2" fill="#2877E8" />
      </g>

      <circle cx="282" cy="119" r="5" fill="#6D9EF0" />
      <circle cx="424" cy="219" r="5" fill="#6D9EF0" />
      <circle cx="283" cy="341" r="5" fill="#6D9EF0" />
      <circle cx="139" cy="228" r="5" fill="#6D9EF0" />

      <path d="M63 466c3-41 24-65 53-65 29 0 46 22 48 64v35H63v-34Z" fill="#42B99F" />
      <path d="M95 413c0-20 9-34 25-34 16 0 26 14 26 35v12H95v-13Z" fill="#F3B69C" />
      <path d="M94 411c-1-23 10-39 28-39 16 0 26 12 27 32-11-2-19-8-24-17-5 10-15 17-31 19Z" fill="#203458" />
      <path d="m80 467-22 25m78-25 19 22" stroke="#F3B69C" strokeWidth="8" strokeLinecap="round" />
      <path d="M66 499h94" stroke="#203D70" strokeWidth="8" strokeLinecap="round" />

      <path d="M194 425c2-40 22-63 52-63s49 23 51 63v76H190l4-76Z" fill="#367FF0" />
      <path d="M218 378c0-23 10-38 28-38s28 15 28 38v12h-56v-12Z" fill="#F0B59A" />
      <path d="M216 378c0-27 11-43 31-43 18 0 29 13 30 36-13-2-22-9-27-19-5 12-17 21-34 22Z" fill="#182F57" />
      <path d="M212 428v43m65-43v43" stroke="#1F60CE" strokeWidth="5" strokeLinecap="round" />
      <path d="M243 404c6 4 12 4 18 0" stroke="#B75E55" strokeWidth="3" strokeLinecap="round" />
      <circle cx="237" cy="389" r="2.5" fill="#263957" />
      <circle cx="262" cy="389" r="2.5" fill="#263957" />

      <path d="M372 466c2-40 22-63 51-63 30 0 49 23 51 63v35H368l4-35Z" fill="#69A6F7" />
      <path d="M396 414c0-22 10-36 28-36s28 14 28 36v13h-56v-13Z" fill="#F1B69C" />
      <path d="M393 412c0-25 12-41 31-41 18 0 29 14 30 36-13-2-23-9-28-20-5 13-17 21-33 22Z" fill="#1A3157" />
      <path d="m388 465-19 25m83-25 21 25" stroke="#F1B69C" strokeWidth="8" strokeLinecap="round" />
      <path d="M373 499h95" stroke="#25487E" strokeWidth="8" strokeLinecap="round" />

      <path d="M50 496h466v14H50z" fill="#BCD3FA" />
      <path d="M51 496h464v5H51z" fill="#8CB2F1" />
      <path d="M163 456h94l22 40h-127l11-40Zm140 0h94l12 40H281l22-40Z" fill="#A9C7F4" />
      <path d="M176 456h80l5 8h-88l3-8Zm140 0h79l4 8h-87l4-8Z" fill="#739BE0" />
      <path d="M43 109h3m10 0h3m10 0h3m-29 12h3m10 0h3m10 0h3m-29 12h3m10 0h3m10 0h3" stroke="#C4D9FC" strokeWidth="3" strokeLinecap="round" />
      <path d="M470 90h3m10 0h3m10 0h3m-29 12h3m10 0h3m10 0h3m-29 12h3m10 0h3m10 0h3" stroke="#C4D9FC" strokeWidth="3" strokeLinecap="round" />
      <path d="M479 401h3m10 0h3m10 0h3m-29 12h3m10 0h3m10 0h3" stroke="#C4D9FC" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState('student')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [notice, setNotice] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    setNotice('Your account details are ready. Connect an authentication service to finish creating your account.')
  }

  return (
    <main className="min-h-screen bg-[#f1f6ff] px-3 py-3 text-[#101c3d] sm:px-5 sm:py-5">
      <div className="mx-auto flex min-h-[calc(100svh-24px)] max-w-[1200px] flex-col overflow-hidden rounded-[22px] border border-[#e2eaf7] bg-white shadow-[0_4px_24px_rgba(29,62,115,0.12)] sm:min-h-[calc(100svh-40px)]">
        <Navbar />

        <section className="grid flex-1 gap-8 bg-[#f8fbff] px-5 py-8 sm:px-9 sm:py-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-10 lg:px-10">
          <div className="mx-auto w-full max-w-[520px] rounded-[20px] border border-[#e4ebf5] bg-white px-5 py-7 shadow-[0_5px_22px_rgba(29,62,115,0.06)] sm:px-8 sm:py-8">
            <h1 className="text-[29px] leading-tight font-bold tracking-[-0.04em] text-[#101c3d] sm:text-[32px]">Create your account</h1>
            <p className="mt-2 text-[14px] text-[#66738d]">Connect your skills to opportunities</p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="signup-name" className="mb-1.5 block text-[12px] font-semibold text-[#253451]">Full name</label>
                <div className="flex h-[43px] items-center gap-3 rounded-lg border border-[#cdd9ec] px-3 text-[#72819d] transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                  <FieldIcon type="user" />
                  <input id="signup-name" name="name" type="text" autoComplete="name" required placeholder="Enter your full name" className="h-full min-w-0 flex-1 bg-transparent text-[12px] text-slate-800 outline-none placeholder:text-[#9aa6b9]" />
                </div>
              </div>

              <div>
                <label htmlFor="signup-email" className="mb-1.5 block text-[12px] font-semibold text-[#253451]">Email address</label>
                <div className="flex h-[43px] items-center gap-3 rounded-lg border border-[#cdd9ec] px-3 text-[#72819d] transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                  <FieldIcon type="email" />
                  <input id="signup-email" name="email" type="email" autoComplete="email" required placeholder="Enter your email" className="h-full min-w-0 flex-1 bg-transparent text-[12px] text-slate-800 outline-none placeholder:text-[#9aa6b9]" />
                </div>
              </div>

              <div>
                <label htmlFor="signup-password" className="mb-1.5 block text-[12px] font-semibold text-[#253451]">Password</label>
                <div className="flex h-[43px] items-center gap-3 rounded-lg border border-[#cdd9ec] px-3 text-[#72819d] transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                  <FieldIcon type="lock" />
                  <input id="signup-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required minLength="8" placeholder="Create a strong password" className="h-full min-w-0 flex-1 bg-transparent text-[12px] text-slate-800 outline-none placeholder:text-[#9aa6b9]" />
                  <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="rounded p-1 transition hover:bg-slate-100">
                    <FieldIcon type="eye" />
                  </button>
                </div>
              </div>

              <fieldset>
                <legend className="mb-1.5 text-[12px] font-semibold text-[#253451]">I am a</legend>
                <div className="grid grid-cols-3 gap-2">
                  {roles.map((role) => {
                    const isSelected = selectedRole === role.id
                    const colorClass = role.color === 'blue'
                      ? 'text-[#1764ed]'
                      : role.color === 'green'
                        ? 'text-[#36b894]'
                        : 'text-[#e34562]'
                    return (
                      <label key={role.id} className={`relative flex min-h-[112px] cursor-pointer flex-col items-center justify-center rounded-lg border px-1.5 py-2 text-center transition ${isSelected ? 'border-2 border-[#2875ff] bg-blue-50/40 shadow-[0_2px_8px_rgba(40,117,232,0.09)]' : 'border-[#d7e0ed] hover:border-blue-300'}`}>
                        <input
                          type="radio"
                          name="role"
                          value={role.id}
                          checked={isSelected}
                          onChange={() => setSelectedRole(role.id)}
                          className="sr-only"
                        />
                        {isSelected && <span aria-hidden="true" className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[12px] font-bold text-white">✓</span>}
                        <span className={colorClass}><RoleIcon type={role.icon} /></span>
                        <span className="mt-1 text-[12px] font-semibold text-[#243451]">{role.title}</span>
                        <span className="mt-0.5 whitespace-pre-line text-[9px] leading-[1.35] text-[#697791]">{role.description}</span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>

              <label className="flex cursor-pointer items-start gap-2 text-[11px] leading-5 text-[#46536d]">
                <input type="checkbox" required checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#b9c6d9] accent-blue-600" />
                <span>I agree to the <a href="#terms" className="font-semibold text-[#1764ed] hover:text-blue-800">Terms</a> and <a href="#privacy" className="font-semibold text-[#1764ed] hover:text-blue-800">Privacy Policy</a></span>
              </label>

              {notice && <p role="status" className="rounded-lg bg-blue-50 px-3 py-2 text-xs leading-5 text-blue-800">{notice}</p>}

              <button type="submit" className="flex h-[44px] w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#1260ed] to-[#1264f5] text-[14px] font-semibold text-white shadow-[0_4px_10px_rgba(20,94,235,0.18)] transition hover:from-blue-700 hover:to-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                Create Account
              </button>
            </form>

            <div className="my-4 flex items-center gap-3 text-[11px] text-[#77839a]">
              <span className="h-px flex-1 bg-[#dfe6f0]" />
              <span>or sign up with</span>
              <span className="h-px flex-1 bg-[#dfe6f0]" />
            </div>

            <button type="button" onClick={() => setNotice('Google sign-up will be available after an authentication provider is connected.')} className="flex h-[43px] w-full items-center justify-center gap-3 rounded-lg border border-[#cdd9ec] text-[12px] font-medium text-[#263653] transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
              <GoogleMark />
              Sign up with Google
            </button>

            <p className="mt-5 text-center text-[12px] text-[#66738d]">
              Already have an account? <Link to="/login" className="ml-1 font-semibold text-[#1764ed] hover:text-blue-800">Log in</Link>
            </p>
          </div>

          <aside className="mx-auto w-full max-w-[530px] self-stretch lg:flex lg:flex-col lg:justify-center">
            <div className="px-2 pt-2 sm:px-5 lg:px-4">
              <h2 className="text-[27px] leading-tight font-bold tracking-[-0.04em] text-[#101c3d] sm:text-[30px]">
                One Platform.
                <br />
                Endless <span className="text-[#2875e8]">Possibilities.</span>
              </h2>
              <p className="mt-3 max-w-[330px] text-[13px] leading-5 text-[#5e6c86]">
                Join a community where students, educators and recruiters collaborate and succeed together.
              </p>
            </div>
            <div className="mt-2 h-[310px] sm:h-[370px] lg:mt-1 lg:h-[430px]">
              <SignupIllustration />
            </div>
          </aside>
        </section>

        <footer className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 px-6 py-5 text-[11px] text-[#71809a] sm:flex-row sm:px-8">
          <span>© 2025 Synapse. All rights reserved.</span>
          <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link to="/" className="hover:text-blue-700">About</Link>
            <a href="#privacy" className="hover:text-blue-700">Privacy Policy</a>
            <a href="#terms" className="hover:text-blue-700">Terms of Service</a>
            <a href="mailto:hello@synapse.example" className="hover:text-blue-700">Contact Us</a>
          </nav>
          <div className="flex items-center gap-4 text-[#647795]" aria-label="Social links">
            <a href="#linkedin" aria-label="LinkedIn" className="font-bold hover:text-blue-700">in</a>
            <a href="#twitter" aria-label="Twitter" className="font-bold hover:text-blue-700">𝕏</a>
            <a href="#website" aria-label="Website" className="hover:text-blue-700">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-[17px] w-[17px]">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
                <path d="M3.5 12h17M12 3c2.2 2.4 3.3 5.4 3.3 9S14.2 18.6 12 21c-2.2-2.4-3.3-5.4-3.3-9S9.8 5.4 12 3Z" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </a>
          </div>
        </footer>
      </div>
    </main>
  )
}

export default SignUpPage
