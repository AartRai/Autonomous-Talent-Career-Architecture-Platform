import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { BenefitIcon } from '../components.jsx'

const metrics = [
  { value: '50K+', label: 'Students', detail: 'Growing every day', icon: 'people' },
  { value: '2K+', label: 'Institutions', detail: 'Across the country', icon: 'cap' },
  { value: '1K+', label: 'Companies', detail: 'Hiring top talent', icon: 'briefcase' },
]

const differences = [
  { title: 'AI-Powered', description: 'Smart matching and recommendations powered by advanced AI.', icon: 'spark' },
  { title: 'Connected Ecosystem', description: 'Students, faculty and recruiters collaborating in one unified platform.', icon: 'network' },
  { title: 'Trusted & Secure', description: 'Enterprise-grade security to protect your data and privacy.', icon: 'shield' },
  { title: 'Future Ready', description: 'Equipping learners with skills and opportunities for tomorrow.', icon: 'chart' },
]

function AboutIllustration() {
  return (
    <svg viewBox="0 0 560 410" fill="none" role="img" aria-label="Students, faculty, and employers collaborating" className="h-full w-full">
      <defs>
        <linearGradient id="about-glow" x1="115" y1="40" x2="463" y2="380" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EAF3FF" />
          <stop offset="1" stopColor="#DCE8FF" />
        </linearGradient>
        <linearGradient id="about-core" x1="248" y1="142" x2="326" y2="224" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3187F5" />
          <stop offset="1" stopColor="#155CE0" />
        </linearGradient>
      </defs>
      <path d="M99 83c50-42 103-16 157-2 51 14 81-20 133-8 81 19 127 85 118 166-9 83-78 132-163 131-77-1-100-28-175-13-67 13-135-24-147-95-12-69 18-141 77-179Z" fill="url(#about-glow)" />
      <circle cx="285" cy="198" r="117" stroke="#BFD4F7" strokeDasharray="4 8" />
      <circle cx="285" cy="198" r="83" stroke="#BFD4F7" strokeDasharray="4 8" />
      <path d="m181 117 76 69m136-67-82 69M174 279l91-74m147 75-96-75m-31-7v116m0-116-116 2m116-2 120 3" stroke="#91B7F2" strokeWidth="2" strokeDasharray="5 7" />
      <circle cx="285" cy="198" r="43" fill="url(#about-core)" />
      <circle cx="285" cy="198" r="35" stroke="white" strokeOpacity=".35" />
      <path d="M285 175c-12 0-20 9-20 21 0 7 4 12 8 16v8h24v-8c4-4 8-9 8-16 0-12-8-21-20-21Z" stroke="white" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M278 189c-4-4-8 1-4 5m16-5c4-4 8 1 4 5m-16 1-4 5 6 2m10-7 4 5-6 2m-8-13v-4m10 4v-4m-9 20v-4m7 4v-4m-9 10h10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <g transform="translate(205 26)">
        <rect x="9" y="44" width="61" height="43" rx="7" fill="white" />
        <path d="M17 78V56h34l12 22H17Z" fill="#24385D" />
        <path d="M30 47c0-12 7-21 17-21s17 8 17 21v9H30v-9Z" fill="#F1B79F" />
        <path d="M29 46c0-14 7-22 18-22 11 0 17 7 18 18-8-1-13-5-16-11-4 8-11 12-20 13Z" fill="#24385D" />
        <path d="M38 58h17l7 9H31l7-9Z" fill="#4386E8" />
      </g>
      <g transform="translate(29 115)">
        <rect x="38" width="34" height="34" rx="8" fill="white" />
        <path d="m55 8 9 5v7c0 5-4 8-9 10-5-2-9-5-9-10v-7l9-5Z" stroke="#45B993" strokeWidth="2" />
        <path d="M34 67c0-18 9-29 23-29s23 11 23 29v68H34V67Z" fill="#3478DB" />
        <path d="M46 47c0-9 5-15 12-15s12 6 12 15v7H46v-7Z" fill="#F0B69D" />
        <path d="M45 47c0-11 5-18 14-18 8 0 13 5 14 15-6 0-11-5-14-10-2 7-7 11-14 13Z" fill="#172746" />
        <path d="m37 69-19 23-14-7m72-17 17 23" stroke="#F0B69D" strokeWidth="7" strokeLinecap="round" />
        <path d="M43 130v27m27-27v27m-41 0h55" stroke="#203C68" strokeWidth="7" strokeLinecap="round" />
      </g>
      <g transform="translate(432 115)">
        <rect x="7" width="34" height="34" rx="8" fill="white" />
        <path d="M24 8v18m-9-9h18m-15-6 12 12m0-12L18 23" stroke="#4C88E7" strokeWidth="2" strokeLinecap="round" />
        <path d="M0 67c0-18 9-29 23-29s23 11 23 29v68H0V67Z" fill="#548DEB" />
        <path d="M11 47c0-9 5-15 12-15s12 6 12 15v7H11v-7Z" fill="#F2BAA2" />
        <path d="M10 47c0-11 5-18 14-18 8 0 13 5 14 15-6 0-11-5-14-10-2 7-7 11-14 13Z" fill="#1E3157" />
        <path d="M9 130v27m27-27v27m-41 0h55m-50-88L-9 91m54-22 17 23" stroke="#34558D" strokeWidth="7" strokeLinecap="round" />
      </g>
      <g transform="translate(152 260)">
        <path d="M6 42c0-14 10-23 25-23h41c14 0 24 10 24 24v40H6V42Z" fill="#17B695" />
        <path d="M29 24c0-10 6-16 15-16s15 6 15 16v6H29v-6Z" fill="#F1B79F" />
        <path d="M28 24c0-12 6-19 16-19 9 0 15 6 16 17-7-1-12-5-15-11-3 7-9 11-17 13Z" fill="#25365B" />
        <path d="M7 70h70l21 17H27c-12 0-20-6-20-17Zm25 7 4 39m39-39 8 39m-58 0h79" stroke="#253D68" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g transform="translate(344 270)">
        <path d="M4 35c0-14 10-23 24-23h34c14 0 23 9 23 23v47H4V35Z" fill="#62B6E8" />
        <path d="M20 17c0-9 5-15 14-15s14 6 14 15v6H20v-6Z" fill="#F0B79E" />
        <path d="M19 17c0-11 6-18 15-18 9 0 14 6 15 16-7-1-12-5-14-11-3 7-9 11-16 13Z" fill="#1F3153" />
        <path d="M12 76h63m-58-5-6 34m49-34 8 34m-64 0h80" stroke="#253D68" strokeWidth="7" strokeLinecap="round" />
      </g>
      <g transform="translate(256 287)">
        <rect width="52" height="37" rx="7" fill="white" />
        <path d="M12 26v-8m9 8V11m9 15v-5m9 5V8m-27 25h27" stroke="#4C88E7" strokeWidth="3" strokeLinecap="round" />
      </g>
      <circle cx="380" cy="82" r="5" fill="#90B4F1" />
      <circle cx="172" cy="248" r="4" fill="#90B4F1" />
      <circle cx="410" cy="255" r="4" fill="#90B4F1" />
    </svg>
  )
}

function AboutPage() {
  return (
    <main className="mx-auto min-h-screen max-w-[1440px] overflow-hidden bg-white text-[#101c3d] shadow-[0_10px_40px_rgba(31,58,95,0.08)]">
      <Navbar />

      <section className="grid items-center gap-6 bg-[#f8fbff] px-6 py-10 sm:px-10 md:grid-cols-[1fr_0.95fr] md:px-14 md:py-12 lg:px-16">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#2875e8]">About Synapse</p>
          <h1 className="mt-3 max-w-[570px] text-[34px] leading-[1.13] font-extrabold tracking-[-0.045em] sm:text-[43px]">
            Building the future of education, industry and opportunities with <span className="text-[#2875e8]">AI.</span>
          </h1>
          <p className="mt-4 max-w-[535px] text-[14px] leading-6 text-slate-600">
            Synapse is an intelligent platform that connects students, faculty, and recruiters to create a skilled, collaborative and future-ready ecosystem.
          </p>
          <div className="mt-6 grid max-w-[530px] grid-cols-3 gap-3">
            {metrics.map((metric) => (
              <article key={metric.label} className="rounded-xl border border-[#e2eaf5] bg-white p-3 shadow-[0_2px_8px_rgba(31,58,95,0.03)] sm:p-4">
                <span className="text-[#1764ed]"><BenefitIcon type={metric.icon} /></span>
                <p className="mt-2 text-[23px] leading-none font-extrabold tracking-tight">{metric.value}</p>
                <p className="mt-2 text-[12px] font-semibold">{metric.label}</p>
                <p className="mt-1 text-[10px] leading-4 text-slate-500">{metric.detail}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="mx-auto aspect-[560/410] w-full max-w-[540px]">
          <AboutIllustration />
        </div>
      </section>

      <section className="grid gap-4 px-6 py-7 sm:px-10 md:grid-cols-2 md:px-14">
        <article className="flex gap-4 rounded-2xl border border-[#e5ecf6] p-5">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#1764ed]"><BenefitIcon type="spark" /></span>
          <div>
            <h2 className="text-[15px] font-bold">Our Mission</h2>
            <p className="mt-2 text-[12px] leading-5 text-slate-600">To empower learners and professionals by bridging the gap between education and industry through AI-driven insights, collaboration and real-world opportunities.</p>
          </div>
        </article>
        <article className="flex gap-4 rounded-2xl border border-[#e5ecf6] p-5">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#1764ed]"><BenefitIcon type="people" /></span>
          <div>
            <h2 className="text-[15px] font-bold">Our Vision</h2>
            <p className="mt-2 text-[12px] leading-5 text-slate-600">To be the most trusted platform that transforms learning into impact and talent into global success.</p>
          </div>
        </article>
      </section>

      <section className="px-6 pb-8 sm:px-10 md:px-14">
        <h2 className="text-center text-[20px] font-bold tracking-tight">What Makes Synapse Different?</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {differences.map((item) => (
            <article key={item.title} className="rounded-2xl border border-[#e5ecf6] px-5 py-5 text-center transition hover:-translate-y-1 hover:shadow-md">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-[#1764ed]"><BenefitIcon type={item.icon} /></span>
              <h3 className="mt-3 text-[14px] font-bold">{item.title}</h3>
              <p className="mt-2 text-[11px] leading-5 text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-6 mb-8 grid items-center gap-4 overflow-hidden rounded-2xl bg-[#eff6ff] px-6 py-6 sm:mx-10 sm:px-8 md:mx-14 md:grid-cols-[1fr_auto]">
        <div>
          <h2 className="text-[18px] font-bold">Together, let’s build a smarter tomorrow.</h2>
          <p className="mt-2 max-w-[500px] text-[12px] leading-5 text-slate-600">Join Synapse and be part of a community that learns, collaborates and grows together.</p>
          <Link to="/signup" className="mt-4 inline-flex rounded-lg bg-[#2875e8] px-5 py-2.5 text-[12px] font-semibold text-white transition hover:bg-blue-700">Get Started</Link>
        </div>
        <div className="hidden h-24 w-64 items-center justify-center rounded-full bg-white/60 text-[#2875e8] md:flex">
          <BenefitIcon type="people" />
          <span className="mx-4 text-3xl font-light">+</span>
          <BenefitIcon type="people" />
        </div>
      </section>

      <footer className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-6 py-5 text-[11px] text-slate-500 sm:flex-row sm:px-10">
        <span>© 2025 Synapse. All rights reserved.</span>
        <div className="flex gap-5"><Link to="/" className="hover:text-blue-700">Home</Link><Link to="/features" className="hover:text-blue-700">Features</Link><Link to="/login" className="hover:text-blue-700">Login</Link></div>
      </footer>
    </main>
  )
}

export default AboutPage
