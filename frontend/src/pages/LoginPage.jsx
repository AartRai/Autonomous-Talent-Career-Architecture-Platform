import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import { BenefitIcon, FieldIcon, GoogleMark, LearningIllustration } from '../components.jsx'
import { benefits } from '../benefits.js'

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [notice, setNotice] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    setNotice('Your details are ready. Connect an authentication service to finish signing in.')
  }

  function handleForgotPassword() {
    const email = document.getElementById('email').value.trim()
    setNotice(email ? `Password reset can be sent to ${email} once email service is connected.` : 'Enter your email address above to request a password reset.')
    if (!email) document.getElementById('email').focus()
  }

  return (
    <main className="min-h-screen bg-[#f1f6ff] px-3 py-3 text-[#101c3d] sm:px-5 sm:py-5">
      <div className="mx-auto flex min-h-[calc(100svh-24px)] max-w-[1200px] flex-col overflow-hidden rounded-[22px] border border-[#e2eaf7] bg-white shadow-[0_4px_24px_rgba(29,62,115,0.12)] sm:min-h-[calc(100svh-40px)]">
        <Navbar />

        <section className="grid flex-1 md:grid-cols-2">
          <div className="relative min-h-[390px] overflow-hidden bg-[#f1f6ff] px-7 pb-0 pt-11 sm:px-10 sm:pt-14 md:min-h-[640px] md:rounded-br-[36px] md:px-12 md:pt-16">
            <div className="relative z-[1] max-w-[390px]">
              <h1 className="text-[32px] leading-[1.18] font-extrabold tracking-[-0.045em] text-[#101c3d] sm:text-[38px]">
                <span className="text-[#1764ed]">Smarter</span> Learning.
                <br />
                <span className="text-[#1764ed]">Stronger</span> Careers.
              </h1>
              <p className="mt-4 max-w-[320px] text-[14px] leading-6 text-[#43516e] sm:text-[15px]">
                Synapse connects talent, education and industry using the power of AI.
              </p>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-[72%] min-h-[300px]">
              <LearningIllustration />
            </div>
          </div>

          <div className="flex items-center justify-center px-5 py-9 sm:px-10 md:px-8 md:py-10 lg:px-12">
            <section className="w-full max-w-[430px] rounded-[20px] border border-[#e4ebf5] bg-white px-6 py-8 shadow-[0_5px_22px_rgba(29,62,115,0.06)] sm:px-9 sm:py-9">
              <h2 className="text-[29px] leading-tight font-bold tracking-[-0.04em] text-[#101c3d] sm:text-[32px]">Welcome back!</h2>
              <p className="mt-2 text-[14px] text-[#66738d]">Continue your journey with Synapse</p>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="mb-2 block text-[13px] font-semibold text-[#253451]">Email address</label>
                  <div className="flex h-[48px] items-center gap-3 rounded-lg border border-[#cdd9ec] px-3 text-[#72819d] shadow-[0_1px_2px_rgba(20,40,80,0.03)] transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                    <FieldIcon type="email" />
                    <input id="email" name="email" type="email" autoComplete="email" required placeholder="Enter your email" className="h-full min-w-0 flex-1 bg-transparent text-[13px] text-slate-800 outline-none placeholder:text-[#9aa6b9]" />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="mb-2 block text-[13px] font-semibold text-[#253451]">Password</label>
                  <div className="flex h-[48px] items-center gap-3 rounded-lg border border-[#cdd9ec] px-3 text-[#72819d] shadow-[0_1px_2px_rgba(20,40,80,0.03)] transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                    <FieldIcon type="lock" />
                    <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required minLength="6" placeholder="Enter your password" className="h-full min-w-0 flex-1 bg-transparent text-[13px] text-slate-800 outline-none placeholder:text-[#9aa6b9]" />
                    <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="rounded p-1 transition hover:bg-slate-100">
                      <FieldIcon type="eye" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5">
                  <label className="flex cursor-pointer items-center gap-2 text-[12px] text-[#46536d]">
                    <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} className="h-4 w-4 rounded border-[#b9c6d9] accent-blue-600" />
                    Remember me
                  </label>
                  <button type="button" onClick={handleForgotPassword} className="text-[12px] font-semibold text-[#1764ed] hover:text-blue-800">
                    Forgot password?
                  </button>
                </div>

                {notice && <p role="status" className="rounded-lg bg-blue-50 px-3 py-2.5 text-xs leading-5 text-blue-800">{notice}</p>}

                <button type="submit" className="flex h-[48px] w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#1260ed] to-[#1264f5] text-[15px] font-semibold text-white shadow-[0_4px_10px_rgba(20,94,235,0.18)] transition hover:from-blue-700 hover:to-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                  Log In
                </button>
              </form>

              <div className="my-7 flex items-center gap-3 text-[12px] text-[#77839a]">
                <span className="h-px flex-1 bg-[#dfe6f0]" />
                <span>or continue with</span>
                <span className="h-px flex-1 bg-[#dfe6f0]" />
              </div>

              <button type="button" onClick={() => setNotice('Google sign-in will be available after an authentication provider is connected.')} className="flex h-[48px] w-full items-center justify-center gap-3 rounded-lg border border-[#cdd9ec] text-[13px] font-medium text-[#263653] transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                <GoogleMark />
                Continue with Google
              </button>

              <p className="mt-7 text-center text-[13px] text-[#66738d]">
                New to Synapse? <button type="button" onClick={() => setNotice('Account creation will be available after an authentication service is connected.')} className="ml-1 font-semibold text-[#1764ed] hover:text-blue-800">Create an account</button>
              </p>
            </section>
          </div>
        </section>

        <section aria-label="Platform benefits" className="grid gap-4 border-t border-slate-100 px-6 py-7 sm:grid-cols-2 sm:px-9 md:grid-cols-4 md:gap-3 lg:px-8">
          {benefits.map(({ title, description, icon }) => (
            <div key={title} className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eef4ff] text-[#2857aa]">
                <BenefitIcon type={icon} />
              </span>
              <span>
                <span className="block text-[11px] font-bold text-[#1b2b4c]">{title}</span>
                <span className="mt-1 block text-[10px] leading-[1.45] text-[#738099]">{description}</span>
              </span>
            </div>
          ))}
        </section>

        <footer className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 px-6 py-5 text-[11px] text-[#71809a] sm:flex-row sm:px-9">
          <span>© 2025 Synapse. All rights reserved.</span>
          <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <a href="#about" className="hover:text-blue-700">About</a>
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

export default LoginPage
