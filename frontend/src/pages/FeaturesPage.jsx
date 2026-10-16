import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { BenefitIcon } from '../components.jsx'

const audiences = {
  students: {
    label: 'For Students',
    color: 'blue',
    cards: [
      { title: 'Find Opportunities', description: 'Discover internships, jobs, research projects and training programs that match your skills.', icon: 'search' },
      { title: 'Skill Analysis', description: 'Get AI-powered insights about your skills and personalized suggestions to bridge the gap.', icon: 'chart' },
      { title: 'Recommended Jobs', description: 'Receive job recommendations that perfectly match your profile and career goals.', icon: 'document' },
      { title: 'Recommended Courses', description: 'Explore curated courses to upgrade your skills and boost your career.', icon: 'play' },
      { title: 'Applications', description: 'Track and manage all your applications and stay updated in one place.', icon: 'folder' },
      { title: 'Notifications', description: 'Never miss an update. Get real-time alerts about opportunities and important activities.', icon: 'bell' },
    ],
  },
  faculty: {
    label: 'For Faculty',
    color: 'green',
    cards: [
      { title: 'Research Partnerships', description: 'Connect with companies and peers to discover relevant research opportunities.', icon: 'network' },
      { title: 'Industry Projects', description: 'Bring real-world challenges into the classroom with collaborative projects.', icon: 'briefcase' },
      { title: 'Student Insights', description: 'Understand learner strengths and identify skills that need further development.', icon: 'chart' },
      { title: 'Mentorship', description: 'Guide students with pathways, resources and expert industry connections.', icon: 'people' },
      { title: 'Applications', description: 'Manage project and research applications with a clear, organized workflow.', icon: 'folder' },
      { title: 'Updates', description: 'Stay informed about new partnerships, opportunities and student progress.', icon: 'bell' },
    ],
  },
  recruiters: {
    label: 'For Recruiters',
    color: 'rose',
    cards: [
      { title: 'Discover Talent', description: 'Find verified candidates with the skills and experience your team needs.', icon: 'search' },
      { title: 'Skill Matching', description: 'Use AI-powered recommendations to identify candidates for each role.', icon: 'spark' },
      { title: 'Post Opportunities', description: 'Share jobs and internships with learners ready to take the next step.', icon: 'briefcase' },
      { title: 'Build Pipelines', description: 'Create a talent pipeline by connecting with institutions and faculty.', icon: 'network' },
      { title: 'Manage Applications', description: 'Review candidates and keep every hiring workflow organized.', icon: 'folder' },
      { title: 'Hiring Updates', description: 'Receive timely alerts and keep your hiring team in sync.', icon: 'bell' },
    ],
  },
}

function FeatureIcon({ type }) {
  if (type === 'search') {
    return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="h-7 w-7"><circle cx="13.5" cy="13.5" r="8" stroke="currentColor" strokeWidth="2.5" /><path d="m19.5 19.5 7 7m-13-17v8m-4-4h8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
  }
  if (type === 'document') {
    return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="h-7 w-7"><path d="M9 4h10l6 6v18H9V4Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" /><path d="M19 4v7h6m-12 6h8m-8 5h8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /><circle cx="24" cy="24" r="5" fill="white" /><path d="m22 24 1.4 1.4L26 23" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
  }
  if (type === 'play') {
    return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="h-7 w-7"><circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2.5" /><path d="M13 10.5c0-.8.9-1.2 1.5-.7l8 5.3a1.1 1.1 0 0 1 0 1.8l-8 5.3c-.6.5-1.5 0-1.5-.7V10.5Z" fill="currentColor" /></svg>
  }
  if (type === 'folder') {
    return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="h-7 w-7"><path d="M4 9a3 3 0 0 1 3-3h7l3 4h8a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V9Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" /><path d="m12 18 3 3 6-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  }
  if (type === 'bell') {
    return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="h-7 w-7"><path d="M24 13a8 8 0 0 0-16 0c0 9-4 9-4 12h24c0-3-4-3-4-12Zm-11 16h6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 2v3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
  }
  if (type === 'network') return <BenefitIcon type="people" />
  if (type === 'briefcase') return <BenefitIcon type="briefcase" />
  if (type === 'spark') return <BenefitIcon type="spark" />
  if (type === 'chart') {
    return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="h-7 w-7"><path d="M5 27V17h6v10H5Zm8 0V10h6v17h-6Zm8 0V4h6v23h-6Z" fill="currentColor" /><path d="M3 29h26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
  }
  return <BenefitIcon type="people" />
}

function ProductIllustration() {
  return (
    <svg viewBox="0 0 600 340" fill="none" role="img" aria-label="Synapse learning and talent matching dashboard" className="h-full w-full">
      <defs>
        <linearGradient id="feature-glow" x1="144" y1="19" x2="460" y2="320" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EAF3FF" />
          <stop offset="1" stopColor="#DCE8FF" />
        </linearGradient>
      </defs>
      <ellipse cx="328" cy="171" rx="236" ry="146" fill="url(#feature-glow)" />
      <circle cx="118" cy="63" r="26" fill="white" />
      <circle cx="118" cy="63" r="25" stroke="#D0E0F7" />
      <path d="m101 61 17-9 17 9-17 9-17-9Zm6 4v9c6 5 12 5 18 0v-9l-9 5-9-5Z" fill="#2475E9" />
      <circle cx="506" cy="70" r="26" fill="white" />
      <circle cx="506" cy="70" r="25" stroke="#D0E0F7" />
      <path d="M492 66h28v17h-28V66Zm6 0v-5h16v5m-11 0v6h6v-6" stroke="#2475E9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="546" cy="168" r="25" fill="white" />
      <circle cx="546" cy="168" r="24" stroke="#D0E0F7" />
      <circle cx="540" cy="162" r="5" fill="#2475E9" />
      <circle cx="552" cy="164" r="4" fill="#5595EF" />
      <path d="M532 179c0-7 4-11 9-11s9 4 9 11m-1-8c1-2 3-3 5-3 4 0 6 3 6 7" stroke="#2475E9" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M147 265h315l-18 20H163l-16-20Z" fill="#7798C9" />
      <rect x="154" y="87" width="305" height="187" rx="13" fill="#19365F" />
      <rect x="166" y="99" width="281" height="158" rx="6" fill="white" />
      <path d="M166 105a6 6 0 0 1 6-6h269a6 6 0 0 1 6 6v15H166v-15Z" fill="#F4F8FF" />
      <circle cx="178" cy="108" r="3" fill="#357FEA" />
      <text x="186" y="111" fill="#263957" fontFamily="Arial, sans-serif" fontSize="6" fontWeight="700">SYNAPSE</text>
      <rect x="176" y="129" width="53" height="119" rx="3" fill="#F5F8FD" />
      <circle cx="184" cy="139" r="3" fill="#317FEA" />
      <rect x="191" y="137" width="29" height="4" rx="2" fill="#A9B9D1" />
      <circle cx="184" cy="153" r="3" fill="#C3D1E5" />
      <rect x="191" y="151" width="25" height="4" rx="2" fill="#C3D1E5" />
      <circle cx="184" cy="167" r="3" fill="#C3D1E5" />
      <rect x="191" y="165" width="28" height="4" rx="2" fill="#C3D1E5" />
      <circle cx="184" cy="181" r="3" fill="#C3D1E5" />
      <rect x="191" y="179" width="24" height="4" rx="2" fill="#C3D1E5" />
      <circle cx="184" cy="195" r="3" fill="#C3D1E5" />
      <rect x="191" y="193" width="29" height="4" rx="2" fill="#C3D1E5" />
      <rect x="238" y="130" width="95" height="49" rx="5" fill="#F7FAFF" stroke="#E6EDF7" />
      <text x="247" y="142" fill="#62738F" fontFamily="Arial, sans-serif" fontSize="7">Your skill growth</text>
      <rect x="249" y="160" width="8" height="12" rx="2" fill="#80AFFF" />
      <rect x="263" y="153" width="8" height="19" rx="2" fill="#5793F0" />
      <rect x="277" y="148" width="8" height="24" rx="2" fill="#347FEA" />
      <rect x="291" y="156" width="8" height="16" rx="2" fill="#7EAAF0" />
      <rect x="305" y="144" width="8" height="28" rx="2" fill="#347FEA" />
      <rect x="341" y="130" width="95" height="49" rx="5" fill="#F7FAFF" stroke="#E6EDF7" />
      <text x="350" y="142" fill="#62738F" fontFamily="Arial, sans-serif" fontSize="7">Recommended matches</text>
      <circle cx="359" cy="157" r="7" fill="#DCEAFF" />
      <circle cx="359" cy="155" r="2.5" fill="#5290EA" />
      <path d="M354 161c0-3 2-4 5-4s5 1 5 4" fill="#5290EA" />
      <rect x="370" y="153" width="55" height="4" rx="2" fill="#AABAD1" />
      <rect x="370" y="161" width="39" height="3" rx="1.5" fill="#D0DBE9" />
      <rect x="238" y="188" width="95" height="58" rx="5" fill="#F7FAFF" stroke="#E6EDF7" />
      <text x="247" y="200" fill="#62738F" fontFamily="Arial, sans-serif" fontSize="7">Suggested pathways</text>
      <rect x="248" y="208" width="34" height="29" rx="4" fill="#EAF2FF" />
      <path d="m257 230 5-7 5 4 7-10" stroke="#347FEA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="290" y="208" width="34" height="29" rx="4" fill="#FDF4E9" />
      <circle cx="307" cy="219" r="5" fill="#E8B872" />
      <rect x="300" y="227" width="14" height="3" rx="1.5" fill="#E8B872" />
      <rect x="341" y="188" width="95" height="58" rx="5" fill="#F7FAFF" stroke="#E6EDF7" />
      <text x="350" y="200" fill="#62738F" fontFamily="Arial, sans-serif" fontSize="7">Applications</text>
      <rect x="351" y="210" width="75" height="7" rx="3.5" fill="#E5EDFA" />
      <rect x="351" y="222" width="56" height="7" rx="3.5" fill="#D8E7FB" />
      <path d="M80 299h441" stroke="#9DB7DE" strokeWidth="4" strokeLinecap="round" />
      <path d="M98 282c0-12 7-21 15-28m-9 43c2-11 9-15 19-18m-21 8c-8-9-9-18-6-27" stroke="#45B896" strokeWidth="3" strokeLinecap="round" />
      <path d="M112 256c0-7 4-12 10-14 2 7-1 13-10 14Zm7 23c4-6 10-9 16-6-2 7-8 10-16 6Zm-23-14c-6-3-8-9-6-15 6 3 8 9 6 15Z" fill="#55C4A2" />
      <circle cx="77" cy="211" r="3" fill="#70A4F4" />
      <circle cx="494" cy="229" r="4" fill="#70A4F4" />
    </svg>
  )
}

function FeaturesPage() {
  const [activeAudience, setActiveAudience] = useState('students')
  const currentAudience = audiences[activeAudience]

  return (
    <main className="mx-auto min-h-screen max-w-[1440px] overflow-hidden bg-white text-[#101c3d] shadow-[0_10px_40px_rgba(31,58,95,0.08)]">
      <Navbar />

      <section className="grid items-center gap-5 bg-[#f8fbff] px-6 py-9 sm:px-10 md:grid-cols-[0.9fr_1.1fr] md:px-14 md:py-10">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#2875e8]">Features</p>
          <h1 className="mt-3 max-w-[520px] text-[35px] leading-[1.13] font-extrabold tracking-[-0.045em] sm:text-[43px]">
            Everything you need to <span className="text-[#2875e8]">learn, connect</span> and grow.
          </h1>
          <p className="mt-4 max-w-[480px] text-[14px] leading-6 text-slate-600">
            Synapse comes with powerful features designed for students, faculty and recruiters to simplify collaboration and unlock limitless opportunities.
          </p>
        </div>
        <div className="mx-auto aspect-[600/340] w-full max-w-[620px]">
          <ProductIllustration />
        </div>
      </section>

      <section className="border-b border-slate-100 px-5 sm:px-10 md:px-14">
        <div role="tablist" aria-label="Features by audience" className="grid max-w-[760px] grid-cols-3">
          {Object.entries(audiences).map(([id, audience]) => {
            const isActive = activeAudience === id
            const color = audience.color === 'green' ? 'text-emerald-600' : audience.color === 'rose' ? 'text-rose-500' : 'text-blue-600'
            return (
              <button
                key={id}
                id={`tab-${id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="feature-grid"
                onClick={() => setActiveAudience(id)}
                className={`flex min-h-12 items-center justify-center gap-2 rounded-t-xl border px-2 text-[11px] font-semibold transition sm:text-[13px] ${isActive ? 'border-b-white border-[#dfe8f5] bg-white text-blue-700' : 'border-transparent text-slate-600 hover:bg-slate-50'}`}
              >
                <span className={color}><BenefitIcon type={id === 'students' ? 'people' : id === 'faculty' ? 'spark' : 'briefcase'} /></span>
                {audience.label}
              </button>
            )
          })}
        </div>
      </section>

      <section id="feature-grid" role="tabpanel" aria-labelledby={`tab-${activeAudience}`} className="grid gap-3 px-5 py-5 sm:grid-cols-2 sm:px-10 md:grid-cols-3 md:px-14 md:py-6">
        {currentAudience.cards.map((card) => (
          <article key={card.title} className="flex min-h-[190px] flex-col items-center rounded-2xl border border-[#e5ecf6] px-5 py-5 text-center transition hover:-translate-y-1 hover:shadow-md">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-[#2875e8]"><FeatureIcon type={card.icon} /></span>
            <h2 className="mt-3 text-[14px] font-bold">{card.title}</h2>
            <p className="mt-2 max-w-[245px] text-[11px] leading-5 text-slate-600">{card.description}</p>
            <Link to="/signup" className="mt-auto pt-3 text-[11px] font-semibold text-[#1764ed] hover:text-blue-800">Learn more →</Link>
          </article>
        ))}
      </section>

      <section className="mx-5 mb-7 grid items-center gap-4 overflow-hidden rounded-2xl bg-[#eff6ff] px-6 py-6 sm:mx-10 sm:px-8 md:mx-14 md:grid-cols-[1fr_auto]">
        <div>
          <h2 className="text-[18px] font-bold">Ready to explore all features?</h2>
          <p className="mt-2 max-w-[420px] text-[12px] leading-5 text-slate-600">Join Synapse today and experience the power of AI-driven opportunities.</p>
          <Link to="/signup" className="mt-4 inline-flex rounded-lg bg-[#2875e8] px-5 py-2.5 text-[12px] font-semibold text-white transition hover:bg-blue-700">Sign Up Now</Link>
        </div>
        <div className="hidden h-24 w-64 items-center justify-center rounded-full bg-white/60 text-[#2875e8] md:flex">
          <BenefitIcon type="people" />
          <span className="mx-4 text-3xl font-light">✦</span>
          <BenefitIcon type="chart" />
        </div>
      </section>

      <footer className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-6 py-5 text-[11px] text-slate-500 sm:flex-row sm:px-10">
        <span>© 2025 Synapse. All rights reserved.</span>
        <div className="flex gap-5"><Link to="/" className="hover:text-blue-700">Home</Link><Link to="/about" className="hover:text-blue-700">About Us</Link><Link to="/login" className="hover:text-blue-700">Login</Link></div>
      </footer>
    </main>
  )
}

export default FeaturesPage
