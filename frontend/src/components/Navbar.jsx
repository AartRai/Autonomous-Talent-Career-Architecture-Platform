import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { BrandMark } from '../components.jsx'

const futureLinks = [
  { label: 'For Students', to: '/student' },
  { label: 'For Faculty' },
]

function FutureLink({ children, onClick, className = '', to }) {
  const linkClassName = `whitespace-nowrap text-left font-medium text-slate-600 transition-colors hover:text-blue-600 ${className}`

  if (to) {
    return (
      <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) => `${linkClassName} ${isActive ? 'text-blue-700' : ''}`}
      >
        {children}
      </NavLink>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={linkClassName}
    >
      {children}
    </button>
  )
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="relative z-20 flex min-h-[76px] items-center justify-between border-b border-slate-100 bg-white px-5 sm:px-8 lg:px-14">
      <Link to="/" onClick={closeMenu} className="flex shrink-0 items-center gap-2 text-[#17335e]" aria-label="Synapse home">
        <BrandMark />
        <span className="text-[20px] font-extrabold tracking-[-0.06em]">SYNAPSE</span>
      </Link>

      <nav aria-label="Main navigation" className="hidden items-center gap-5 xl:flex">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `relative whitespace-nowrap py-7 text-[13px] font-medium transition-colors hover:text-blue-600 ${isActive ? 'text-slate-800 after:absolute after:inset-x-1 after:bottom-0 after:h-0.5 after:rounded-full after:bg-blue-500' : 'text-slate-600'}`}
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => `relative whitespace-nowrap py-7 text-[13px] font-medium transition-colors hover:text-blue-600 ${isActive ? 'text-blue-700 after:absolute after:inset-x-1 after:bottom-0 after:h-0.5 after:rounded-full after:bg-blue-500' : 'text-slate-600'}`}
        >
          About
        </NavLink>
        <NavLink
          to="/features"
          className={({ isActive }) => `relative whitespace-nowrap py-7 text-[13px] font-medium transition-colors hover:text-blue-600 ${isActive ? 'text-blue-700 after:absolute after:inset-x-1 after:bottom-0 after:h-0.5 after:rounded-full after:bg-blue-500' : 'text-slate-600'}`}
        >
          Features
        </NavLink>
        {futureLinks.map(({ label, to }) => (
          <FutureLink key={label} to={to} className="py-7 text-[13px]">{label}</FutureLink>
        ))}
        <NavLink
          to="/recruiter"
          className={({ isActive }) => `relative whitespace-nowrap py-7 text-[13px] font-medium transition-colors hover:text-blue-600 ${isActive ? 'text-slate-800 after:absolute after:inset-x-1 after:bottom-0 after:h-0.5 after:rounded-full after:bg-blue-500' : 'text-slate-600'}`}
        >
          For Recruiters
        </NavLink>
      </nav>

      <div className="hidden items-center gap-3 xl:flex">
        <NavLink
          to="/login"
          className={({ isActive }) => `rounded-full px-5 py-2.5 text-[13px] font-semibold transition-colors hover:bg-slate-50 ${isActive ? 'text-blue-700' : 'text-slate-700'}`}
        >
          Login
        </NavLink>
        <NavLink
          to="/signup"
          className={({ isActive }) => `rounded-full bg-[#2875e8] px-6 py-2.5 text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(40,117,232,0.25)] transition hover:bg-blue-700 ${isActive ? 'ring-2 ring-blue-200 ring-offset-2' : ''}`}
        >
          Sign Up
        </NavLink>
      </div>

      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 xl:hidden"
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
          {menuOpen
            ? <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            : <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
        </svg>
      </button>

      {menuOpen && (
        <nav aria-label="Mobile navigation" className="absolute inset-x-4 top-[68px] flex flex-col rounded-2xl border border-slate-100 bg-white p-3 shadow-xl xl:hidden">
          <NavLink to="/" end onClick={closeMenu} className={({ isActive }) => `rounded-lg px-4 py-3 text-sm font-medium hover:bg-blue-50 hover:text-blue-700 ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>
            Home
          </NavLink>
          <NavLink to="/about" onClick={closeMenu} className={({ isActive }) => `rounded-lg px-4 py-3 text-sm font-medium hover:bg-blue-50 hover:text-blue-700 ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>
            About
          </NavLink>
          <NavLink to="/features" onClick={closeMenu} className={({ isActive }) => `rounded-lg px-4 py-3 text-sm font-medium hover:bg-blue-50 hover:text-blue-700 ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>
            Features
          </NavLink>
          {futureLinks.map(({ label, to }) => (
            <FutureLink key={label} to={to} onClick={closeMenu} className="rounded-lg px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-700">
              {label}
            </FutureLink>
          ))}
          <NavLink to="/recruiter" onClick={closeMenu} className={({ isActive }) => `rounded-lg px-4 py-3 text-sm font-medium hover:bg-blue-50 hover:text-blue-700 ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>
            For Recruiters
          </NavLink>
          <div className="mt-2 flex gap-2 border-t border-slate-100 pt-3">
            <NavLink to="/login" onClick={closeMenu} className="flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-700">
              Login
            </NavLink>
            <NavLink to="/signup" onClick={closeMenu} className="flex-1 rounded-full bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700">
              Sign Up
            </NavLink>
          </div>
        </nav>
      )}
    </header>
  )
}

export default Navbar
