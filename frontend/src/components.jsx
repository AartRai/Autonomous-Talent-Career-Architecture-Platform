export function BrandMark() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true" className="h-8 w-8">
      <path
        d="M18 3.5 23 6.4l5.8-.1 1.3 5.6 4.1 4-2.7 5.2.7 5.8-5.4 2.1-3.4 4.7-5.4-2.2-5.5 1.8-3-5-5.2-2.5 1-5.7-2.4-5.3 4.3-3.8 1.6-5.5 5.8.4L18 3.5Z"
        fill="currentColor"
      />
      <circle cx="18" cy="18.5" r="8.1" fill="white" />
      <path
        d="M15.1 13.5h6.4M14 17.2h8.5m-7.5 3.8h6.4M17 12v13m3-13v13"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
    </svg>
  )
}

export function FieldIcon({ type }) {
  if (type === 'email') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    )
  }
  if (type === 'lock') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
        <rect x="5" y="10" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
      <path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

export function LearningIllustration() {
  return (
    <svg
      viewBox="0 0 560 580"
      fill="none"
      role="img"
      aria-label="A student learning with AI-powered tools"
      className="absolute inset-x-0 bottom-0 h-[86%] w-full"
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <linearGradient id="sceneBg" x1="54" y1="70" x2="481" y2="492" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F8FBFF" />
          <stop offset="1" stopColor="#D7E6FF" />
        </linearGradient>
        <linearGradient id="studentShirt" x1="144" y1="379" x2="273" y2="550" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4997FF" />
          <stop offset="1" stopColor="#1761D8" />
        </linearGradient>
        <linearGradient id="hubFill" x1="228" y1="215" x2="338" y2="324" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3794FF" />
          <stop offset="1" stopColor="#155ED5" />
        </linearGradient>
      </defs>
      <path d="M0 388c71-56 123-40 192-12s117 5 174-31 126-20 194 25v210H0V388Z" fill="url(#sceneBg)" />
      <path d="M30 438c64-45 132-29 197-6s132 1 188-29 105-14 145 11v116H30V438Z" fill="#E7F0FF" />

      <g stroke="#9BBEFF" strokeWidth="2" strokeDasharray="5 7">
        <path d="m126 157 148 104m157-118L284 260M129 309l145-48m158 71-148-72m-9 4-1 104m1-107-121-2" />
      </g>
      <circle cx="275" cy="262" r="61" fill="#B8D2FF" opacity=".35" />
      <circle cx="275" cy="262" r="48" fill="url(#hubFill)" />
      <circle cx="275" cy="262" r="39" stroke="white" strokeOpacity=".35" />
      <path d="M275 237c-13 0-22 10-22 23 0 8 4 14 9 18v8h26v-8c5-4 9-10 9-18 0-13-9-23-22-23Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M268 251c-4-4-9 1-5 5m18-5c4-4 9 1 5 5m-18 1-4 6 7 2m10-8 4 6-7 2m-8-14v-4m12 4v-4m-10 23v-4m8 4v-4m-10 10h12" stroke="white" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />

      <g transform="translate(65 104)">
        <rect width="78" height="78" rx="17" fill="white" />
        <rect x="1" y="1" width="76" height="76" rx="16" stroke="#BDD4FF" strokeWidth="2" />
        <rect x="18" y="45" width="9" height="17" rx="4.5" fill="#2877EA" />
        <rect x="35" y="33" width="9" height="29" rx="4.5" fill="#2877EA" />
        <rect x="52" y="22" width="9" height="40" rx="4.5" fill="#2877EA" />
      </g>
      <g transform="translate(362 91)">
        <rect width="79" height="75" rx="17" fill="white" />
        <rect x="1" y="1" width="77" height="73" rx="16" stroke="#BDD4FF" strokeWidth="2" />
        <path d="m34 23-13 14 13 14m12-28 13 14-13 14m5-19-11 12" stroke="#2577EF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g transform="translate(21 248)">
        <rect width="82" height="76" rx="17" fill="white" />
        <rect x="1" y="1" width="80" height="74" rx="16" stroke="#BDD4FF" strokeWidth="2" />
        <path d="m17 27 24-12 24 12-24 12-24-12Z" fill="#2677EA" />
        <path d="M25 35v14c10 8 21 8 31 0V35l-15 7-16-7Zm40-8v19" stroke="#2677EA" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      </g>
      <g transform="translate(380 235)">
        <rect width="73" height="68" rx="16" fill="white" />
        <rect x="1" y="1" width="71" height="66" rx="15" stroke="#BDD4FF" strokeWidth="2" />
        <circle cx="29" cy="26" r="9" fill="#4C8EF1" />
        <circle cx="47" cy="30" r="7" fill="#77A9F6" />
        <path d="M14 51c0-9 6-15 15-15s15 6 15 15m-3-11c2-3 5-4 8-4 6 0 10 5 10 12" stroke="#2677EA" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g transform="translate(352 331)">
        <rect width="76" height="72" rx="15" fill="white" />
        <rect x="1" y="1" width="74" height="70" rx="14" stroke="#BDD4FF" strokeWidth="2" />
        <path d="M19 27h38v27H19V27Zm10 0v-6h18v6m-9 0v27m-8-15h16" stroke="#2877E8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <circle cx="258" cy="179" r="6" fill="#79A9F8" />
      <circle cx="165" cy="241" r="4" fill="#79A9F8" />
      <circle cx="367" cy="209" r="5" fill="#79A9F8" />
      <circle cx="275" cy="366" r="6" fill="#79A9F8" />

      <path d="M112 407c0-36 24-60 61-60h51c32 0 57 24 57 58v126H92l20-124Z" fill="#133E83" opacity=".12" />
      <path d="M137 358c0-28 17-49 43-49 27 0 45 20 45 50v22h-88v-23Z" fill="#F3B79C" />
      <path d="M134 359c-3-35 15-57 45-57 26 0 43 17 46 46-19-2-34-11-42-25-8 15-24 24-49 27Z" fill="#152F5A" />
      <path d="M146 352c-9 10-11 25-10 42l-23 25 16 16 28-28v-48l-11-7Z" fill="#F3B79C" />
      <circle cx="167" cy="361" r="3" fill="#243957" />
      <path d="M179 381c8 6 16 6 22 0" stroke="#BA6558" strokeWidth="3" strokeLinecap="round" />
      <path d="M112 401c-9 3-17 13-20 31l-20 90c-7 34 15 52 47 52h160V431c0-25-16-43-42-43h-39l-31 33-35-33-20 13Z" fill="url(#studentShirt)" />
      <path d="m164 396 23 26 27-27m-29 28v70" stroke="#1761D8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m148 464 21 13m-20-1 20 11" stroke="#A9CBFF" strokeWidth="3" strokeLinecap="round" />
      <path d="M66 531h411v18H66z" fill="#B6CEFA" />
      <path d="M69 531h410v6H69z" fill="#8EB3F1" />

      <path d="M290 447h171l-37 84H268l22-84Z" fill="#ADC9F6" />
      <path d="M290 447h171l-7 14H286l4-14Z" fill="#739DE0" />
      <path d="m377 490 9 5-5 8-9-5 5-8Zm13-14 9 5-5 8-9-5 5-8Zm-28 10 9 5-5 8-9-5 5-8Zm9-14 9 5-5 8-9-5 5-8Z" fill="white" opacity=".86" />
      <path d="M417 479c-1-18 8-30 19-39m-17 61c3-17 15-23 30-27m-32 12c-12-14-13-27-8-40" stroke="#36A98B" strokeWidth="3" strokeLinecap="round" />
      <path d="M437 440c0-9 5-17 13-20 3 10-1 18-13 20Zm9 34c6-9 14-12 23-9-3 10-11 14-23 9Zm-35-20c-8-5-12-13-9-22 9 5 12 12 9 22Z" fill="#51BEA0" />
      <path d="M428 532h36" stroke="#8EB3F1" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function BenefitIcon({ type }) {
  if (type === 'people') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6">
        <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3.5 19c0-3 2.3-5 5.5-5s5.5 2 5.5 5m-.2-4.2c.8-.6 1.8-.9 2.9-.9 2.5 0 4 1.7 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }
  if (type === 'briefcase') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6">
        <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 7V4h8v3m-13 5h18m-11 0v2h4v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  if (type === 'shield') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6">
        <path d="m12 3 8 3v5c0 5-3.3 8.5-8 10-4.7-1.5-8-5-8-10V6l8-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="m8.5 12 2.3 2.3 4.8-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6">
      <path d="m12 2 1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9L12 2Zm7 13 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  )
}

export function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.8 3-4.3 3-7.3Z" />
      <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.5l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.2H3.1v2.6A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.4 13.8a6 6 0 0 1 0-3.6V7.6H3.1a10 10 0 0 0 0 8.8l3.3-2.6Z" />
      <path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.9 5.6l3.3 2.6C7.2 7.8 9.4 6 12 6Z" />
    </svg>
  )
}
