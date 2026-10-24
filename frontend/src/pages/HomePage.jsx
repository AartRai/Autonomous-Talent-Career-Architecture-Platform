import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { BenefitIcon } from '../components.jsx'

function LandingIllustration() {
  return (
    <svg viewBox="0 0 560 410" fill="none" role="img" aria-label="Students, educators, and employers connecting through AI" className="h-full w-full">
      <defs>
        <linearGradient id="landing-orbit" x1="100" y1="50" x2="450" y2="370" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EAF3FF" />
          <stop offset="1" stopColor="#DCE8FF" />
        </linearGradient>
        <linearGradient id="landing-hub" x1="239" y1="129" x2="329" y2="230" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2780F5" />
          <stop offset="1" stopColor="#1761D6" />
        </linearGradient>
      </defs>
      <ellipse cx="286" cy="207" rx="191" ry="170" fill="url(#landing-orbit)" />
      <ellipse cx="286" cy="207" rx="151" ry="132" stroke="#C6D9FA" strokeDasharray="4 7" />
      <ellipse cx="286" cy="207" rx="112" ry="96" stroke="#C6D9FA" strokeDasharray="4 7" />
      <path d="m150 113 122 90m141-92-127 91M155 296l117-91m141 88-127-87" stroke="#9BBBF0" strokeWidth="2" strokeDasharray="5 7" />
      <circle cx="286" cy="205" r="48" fill="url(#landing-hub)" />
      <circle cx="286" cy="205" r="39" stroke="white" strokeOpacity=".35" />
      <path d="M286 179c-13 0-22 10-22 23 0 8 4 13 8 17v9h28v-9c5-4 8-9 8-17 0-13-9-23-22-23Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M278 195c-4-4-9 1-5 5m18-5c4-4 9 1 5 5m-18 0-4 6 7 2m10-8 4 6-7 2m-8-15v-4m12 4v-4m-10 23v-4m8 4v-4m-10 11h12" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <g transform="translate(219 28)">
        <rect y="45" width="78" height="49" rx="8" fill="white" />
        <path d="M12 84V58h41l11 26H12Z" fill="#24385D" />
        <path d="m16 82 7-11 8 6 9-14 15 19H16Z" fill="#93B5ED" />
        <path d="M25 51c0-13 8-23 19-23 10 0 17 8 17 20v10H25V51Z" fill="#F2B8A1" />
        <path d="M24 49c-1-15 7-24 19-24 10 0 17 7 17 18-5-1-8-4-10-9-5 7-13 11-26 11v4h-3Z" fill="#24385D" />
        <path d="M35 63h17l8 10H28l7-10Z" fill="#3F80E8" />
      </g>
      <g transform="translate(38 149)">
        <rect x="27" width="34" height="34" rx="8" fill="white" />
        <path d="M44 8v18m-9-9h18m-15-6 12 12m0-12L38 23" stroke="#4C88E7" strokeWidth="2" strokeLinecap="round" />
        <path d="M40 54c0-13 7-22 17-22s17 9 17 22v27H39l1-27Z" fill="#345A94" />
        <path d="M46 38c1-7 5-11 11-11 7 0 11 5 11 12v5H46v-6Z" fill="#F1B7A0" />
        <path d="M46 39c0-9 4-15 12-15 7 0 11 4 12 12-5-1-9-5-10-8-3 4-7 7-14 8Z" fill="#172746" />
        <path d="m40 52-12 15-14-6-4 6 19 12 20-15m-9-8v25m16-25v25m-31 0h47" stroke="#203C68" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g transform="translate(448 147)">
        <rect width="34" height="34" rx="8" fill="white" />
        <path d="M17 8 25 12v6c0 5-3 8-8 10-5-2-8-5-8-10v-6l8-4Z" stroke="#45B993" strokeWidth="2" strokeLinejoin="round" />
        <path d="m14 18 2 2 4-5" stroke="#45B993" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M0 56c0-13 7-21 17-21s17 8 17 21v29H0V56Z" fill="#548DEB" />
        <path d="M8 43c0-8 4-13 10-13s10 5 10 13v5H8v-5Z" fill="#F2BAA2" />
        <path d="M7 43c0-10 4-16 12-16 7 0 11 6 11 14-6-1-10-4-12-9-2 5-5 8-11 9Z" fill="#1E3157" />
        <path d="M4 85 0 104m27-19 5 19m-34 0h44m-42-48-8 20m36-20 8 19" stroke="#34558D" strokeWidth="6" strokeLinecap="round" />
      </g>
      <g transform="translate(140 267)">
        <path d="M10 43c0-12 9-21 21-21h28c10 0 18 8 18 18v25H10V43Z" fill="#18B89A" />
        <path d="M30 24c0-8 5-14 13-14s13 6 13 14v5H30v-5Z" fill="#F1B79F" />
        <path d="M29 24c-1-10 5-17 14-17 8 0 13 5 14 14-7-1-11-5-13-9-3 6-7 9-15 10Z" fill="#25365B" />
        <path d="M10 57h66l24 18H30c-11 0-20-7-20-18Zm18 1 4 40m37-39 9 38m-54 0h72m-20-54 12 15 19-7m-7-2 8-15" stroke="#253D68" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g transform="translate(352 278)">
        <path d="M6 31c0-11 8-19 19-19h24c11 0 19 8 19 19v26H6V31Z" fill="#63B9E9" />
        <path d="M20 17c0-8 5-13 13-13s13 5 13 13v6H20v-6Z" fill="#F0B79E" />
        <path d="M19 17c0-10 5-16 14-16 7 0 12 5 13 13-5-1-10-5-12-9-2 5-7 8-15 9Z" fill="#1F3153" />
        <path d="M14 55 8 87m47-31 7 31M0 88h77m-70-54-10 13 9 9m59-22 10 14-9 8" stroke="#253D68" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g transform="translate(251 283)">
        <rect width="50" height="37" rx="7" fill="white" />
        <path d="M12 26v-8m9 8V11m9 15v-5m9 5V8m-27 25h27" stroke="#4C88E7" strokeWidth="3" strokeLinecap="round" />
      </g>
      <circle cx="393" cy="93" r="5" fill="#90B4F1" />
      <circle cx="175" cy="254" r="4" fill="#90B4F1" />
      <circle cx="403" cy="260" r="4" fill="#90B4F1" />
    </svg>
  )
}

const landingAudiences = [
  { id: 'students', title: 'For Students', description: 'Find opportunities,\nskill up, grow', tone: 'blue', icon: 'cap' },
  { id: 'faculty', title: 'For Faculty', description: 'Collaborate, research,\nindustry connect', tone: 'green', icon: 'plant' },
  { id: 'recruiters', title: 'For Recruiters', description: 'Find verified talent,\nhire smarter', tone: 'rose', icon: 'people' },
]

function LandingAudienceIcon({ type }) {
  if (type === 'cap') {
    return (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="h-7 w-7">
        <path d="m4.5 13.5 11.5-6 11.5 6L16 19.6 4.5 13.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M9 16v6c4.5 3.6 9.5 3.6 14 0v-6m5-2.5v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="28" cy="22.5" r="1.5" fill="currentColor" />
      </svg>
    )
  }
  if (type === 'plant') {
    return (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="h-7 w-7">
        <path d="M16 26V13m0 7c-6.5 0-9-3.3-9-8 5.8 0 9 2.1 9 8Zm0-5c0-5.7 3.2-9 9-9 0 4.7-2.5 9-9 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 27h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
  return <BenefitIcon type="people" />
}

function HomePage() {
  const [demoOpen, setDemoOpen] = useState(false)

  return (
    <main id="home" className="mx-auto min-h-screen max-w-[1440px] overflow-hidden bg-white text-slate-900 shadow-[0_10px_40px_rgba(31,58,95,0.08)]">
      <Navbar />

      <section id="about" className="grid items-center gap-7 bg-[#f7faff] px-6 py-12 sm:px-10 md:min-h-[485px] md:grid-cols-[1.05fr_0.95fr] md:px-14 md:py-10 lg:px-20">
        <div className="relative z-[1] max-w-[590px]">
          <h1 className="max-w-[610px] text-[42px] leading-[1.04] font-extrabold tracking-[-0.045em] text-[#111d34] sm:text-[52px] lg:text-[64px]">
            Connecting Talent, Education and <span className="text-[#2875e8]">Industry</span> with AI
          </h1>
          <p className="mt-5 max-w-[540px] text-[15px] leading-7 text-slate-600 sm:text-[16px]">
            An intelligent platform to match student skills with industry opportunities, enable faculty-industry collaboration, and build a future-ready workforce.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link to="/login" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#2875e8] px-7 text-sm font-bold text-white shadow-[0_5px_15px_rgba(40,117,232,0.22)] transition hover:-translate-y-0.5 hover:bg-blue-700">Get Started</Link>
            <button type="button" onClick={() => setDemoOpen(true)} className="inline-flex min-h-12 items-center gap-2.5 rounded-full border border-[#a9bddb] bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:bg-blue-50">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="ml-0.5 h-3.5 w-3.5"><path d="M6.5 4.9c0-.7.8-1.1 1.4-.7l7.3 4.7a1.3 1.3 0 0 1 0 2.2l-7.3 4.7c-.6.4-1.4 0-1.4-.7V4.9Z" /></svg>
              </span>
              Watch Demo
            </button>
          </div>
        </div>
        <div className="mx-auto aspect-[560/410] w-full max-w-[570px] md:translate-x-2">
          <LandingIllustration />
        </div>
      </section>

      <section id="features" aria-label="Platform benefits" className="grid gap-5 border-b border-slate-100 px-6 py-7 sm:grid-cols-3 sm:gap-4 sm:px-10 md:px-14 lg:px-20">
        {landingAudiences.map(({ id, title, description, tone, icon }) => (
          <Link key={id} id={id} to={id === 'students' ? '/student' : '/login'} className="group flex items-center gap-4 rounded-2xl px-3 py-2 transition hover:bg-slate-50 sm:gap-4">
            <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${tone === 'blue' ? 'bg-[#edf6ff] text-[#4a91de]' : tone === 'green' ? 'bg-[#e9faf3] text-[#33b88b]' : 'bg-[#fff0f1] text-[#dc737d]'}`}>
              <LandingAudienceIcon type={icon} />
            </span>
            <span>
              <span className="block text-[15px] font-bold text-slate-800 group-hover:text-blue-700">{title}</span>
              <span className="mt-1 block whitespace-pre-line text-[13px] leading-[1.45] text-slate-500">{description}</span>
            </span>
          </Link>
        ))}
      </section>

      <section className="px-6 py-9 text-center sm:px-10 md:py-10">
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-slate-700 sm:text-[17px]">Trusted by Universities, Companies and Learners</h2>
        <div className="mx-auto mt-7 flex max-w-[970px] flex-wrap items-center justify-center gap-x-10 gap-y-5 sm:gap-x-12 md:justify-between md:gap-x-8">
          <span className="text-[20px] font-semibold tracking-[-0.06em] text-[#4285f4]">Google</span>
          <span className="flex items-center gap-2 text-[18px] font-medium tracking-[-0.04em] text-[#626b79]"><span className="grid h-4 w-4 grid-cols-2 gap-[2px]"><i className="bg-[#f35325]" /><i className="bg-[#81bc06]" /><i className="bg-[#05a6f0]" /><i className="bg-[#ffba08]" /></span>Microsoft</span>
          <span className="text-[20px] font-extrabold tracking-[-0.06em] text-[#202b3b]">amazon</span>
          <span className="text-[18px] font-medium tracking-[-0.06em] text-[#4d86c9]">Infosys</span>
          <span className="text-[20px] font-bold tracking-[-0.08em] text-[#e74b75]">TCS</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-400 text-sm font-bold tracking-[0.12em] text-white" aria-label="More partners">•••</span>
        </div>
      </section>

      {demoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setDemoOpen(false) }}>
          <section role="dialog" aria-modal="true" aria-labelledby="demo-title" className="relative w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl sm:p-9">
            <button type="button" onClick={() => setDemoOpen(false)} aria-label="Close demo" className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200">×</button>
            <h2 id="demo-title" className="text-2xl font-bold tracking-tight text-slate-900">One connected talent ecosystem</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">Synapse brings students, faculty, and industry together. Discover skills, build meaningful collaborations, and connect learning to real opportunities.</p>
            <Link to="/login" onClick={() => setDemoOpen(false)} className="mt-7 inline-flex rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700">Explore Synapse</Link>
          </section>
        </div>
      )}
    </main>
  )
}

export default HomePage
