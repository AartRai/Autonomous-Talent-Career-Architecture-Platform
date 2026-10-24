import { useEffect, useMemo, useState } from 'react'
import { getStudentNotificationsData } from '../../services/studentService.js'

const categories = ['All', 'Jobs', 'Applications', 'Courses', 'System']
const categoryIcons = {
  All: 'bell',
  Jobs: 'job',
  Applications: 'application',
  Courses: 'course',
  System: 'system',
}

const categoryStyles = {
  Jobs: { box: 'bg-[#edf4ff] text-[#1260ed]', dot: '#3978f6' },
  Applications: { box: 'bg-[#e7f8f1] text-[#15966d]', dot: '#25b889' },
  Courses: { box: 'bg-[#fff4e5] text-[#d88719]', dot: '#f3a51b' },
  System: { box: 'bg-[#f3efff] text-[#7543c5]', dot: '#8b5cf6' },
}

const initialPreferences = [
  { id: 'email', label: 'Email Notifications', description: 'Receive updates via email', icon: 'envelope', enabled: true },
  { id: 'push', label: 'Push Notifications', description: 'Receive push notifications', icon: 'bell', enabled: true },
  { id: 'jobs', label: 'Job Alerts', description: 'New job matches and alerts', icon: 'bell', enabled: true },
  { id: 'applications', label: 'Application Updates', description: 'Updates on your applications', icon: 'application', enabled: true },
  { id: 'courses', label: 'Course Recommendations', description: 'Course suggestions and updates', icon: 'megaphone', enabled: true },
  { id: 'system', label: 'System Updates', description: 'Important system updates', icon: 'clock', enabled: false },
]

function NotificationGlyph({ type, className = 'h-5 w-5' }) {
  const paths = {
    job: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-13 5h18m-11-1v3h4v-3" /></>,
    application: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M9 3v4h6V3m-6 10 2 2 4-4" /></>,
    interview: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18m-11 4 2 2 4-4" /></>,
    course: <><path d="m3 8 9-5 9 5-9 5-9-5Z" /><path d="M6 10v6c4 3 8 3 12 0v-6m3-2v8" /></>,
    learn: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5v-12Z" /><path d="M4 16.5A2.5 2.5 0 0 1 6.5 14H20M8 7h8m-8 3h6" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9m-8 4 2-3m0 0 2 3m-2-3v6" /><path d="M10 21h4" /></>,
    system: <><path d="M4 13a8 8 0 1 0 2.3-5.7L4 9" /><path d="M4 4v5h5m3-1v5l3 2" /></>,
    profile: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M8 9h8m-8 4h8m-8 4h5" /></>,
    envelope: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
    megaphone: <><path d="m3 11 18-7v16L3 13v-2Z" /><path d="M11 16v4m-5-6 2 6" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      {paths[type] ?? paths.bell}
    </svg>
  )
}

function NotificationCard({ notification, onOpen }) {
  const style = categoryStyles[notification.category] ?? categoryStyles.System

  return (
    <button
      type="button"
      onClick={() => onOpen(notification)}
      className="group flex w-full items-center gap-3 rounded-xl border border-[#e4ebf4] bg-white p-3 text-left shadow-[0_2px_10px_rgba(26,50,90,0.025)] transition hover:border-[#cbdcf5] hover:shadow-[0_4px_14px_rgba(26,50,90,0.06)] sm:gap-3.5 sm:px-3.5"
    >
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${style.box}`}>
        <NotificationGlyph type={notification.icon} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[11px] font-bold text-[#172744]">{notification.title}</span>
        <span className="mt-1 block truncate text-[10px] text-[#62728e]">{notification.message}</span>
      </span>
      <span className="hidden shrink-0 text-[9px] text-[#71809a] sm:block">{notification.date}, {notification.time}</span>
      <span className="grid w-5 shrink-0 place-items-center">
        {notification.unread && <span className="h-2 w-2 rounded-full bg-[#1260ed]" aria-label="Unread" />}
      </span>
      <span className="shrink-0 text-lg leading-none text-[#8191aa] transition group-hover:translate-x-0.5 group-hover:text-[#1260ed]" aria-hidden="true">›</span>
    </button>
  )
}

function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [visibleCount, setVisibleCount] = useState(8)
  const [preferences, setPreferences] = useState(initialPreferences)
  const [announcement, setAnnouncement] = useState('')
  const [selectedNotification, setSelectedNotification] = useState(null)

  useEffect(() => {
    let active = true

    getStudentNotificationsData().then((data) => {
      if (active) setNotifications(data)
    })

    return () => {
      active = false
    }
  }, [])

  const counts = useMemo(() => ({
    All: notifications.length,
    Jobs: notifications.filter((item) => item.category === 'Jobs').length,
    Applications: notifications.filter((item) => item.category === 'Applications').length,
    Courses: notifications.filter((item) => item.category === 'Courses').length,
    System: notifications.filter((item) => item.category === 'System').length,
    Unread: notifications.filter((item) => item.unread).length,
  }), [notifications])

  const filteredNotifications = useMemo(() => notifications.filter((item) => (
    (selectedCategory === 'All' || item.category === selectedCategory)
      && (!unreadOnly || item.unread)
  )), [notifications, selectedCategory, unreadOnly])

  const visibleNotifications = filteredNotifications.slice(0, visibleCount)

  const markRead = (notification) => {
    setNotifications((current) => current.map((item) => (
      item.id === notification.id ? { ...item, unread: false } : item
    )))
    setSelectedNotification({ ...notification, unread: false })
  }

  const togglePreference = (id) => {
    setPreferences((current) => current.map((preference) => (
      preference.id === id ? { ...preference, enabled: !preference.enabled } : preference
    )))
  }

  const savePreferences = () => {
    setAnnouncement('Notification preferences saved for this demo session.')
  }

  const selectCategory = (category) => {
    setSelectedCategory(category)
    setUnreadOnly(false)
    setVisibleCount(8)
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-[#101c3d]">Notifications</h2>
        <p className="mt-1 text-sm text-[#66738d]">Stay updated with the latest alerts and updates.</p>
      </div>

      {announcement && (
        <p role="status" aria-live="polite" className="rounded-xl border border-[#cfe9df] bg-[#effaf6] px-4 py-3 text-xs font-medium text-[#16856b]">
          {announcement}
        </p>
      )}

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,2.1fr)_minmax(270px,0.9fr)]">
        <section className="min-w-0">
          <div role="tablist" aria-label="Notification categories" className="flex overflow-x-auto border-b border-[#e5ebf3]">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={selectedCategory === category && !unreadOnly}
                onClick={() => selectCategory(category)}
                className={`shrink-0 border-b-2 px-4 py-3 text-[10px] font-semibold transition sm:text-[11px] ${
                  selectedCategory === category && !unreadOnly
                    ? 'border-[#1260ed] text-[#1260ed]'
                    : 'border-transparent text-[#52627d] hover:text-[#1260ed]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mt-3 space-y-2">
            {visibleNotifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} onOpen={markRead} />
            ))}
            {visibleNotifications.length === 0 && (
              <div className="rounded-xl border border-dashed border-[#cdd9e9] bg-white px-5 py-12 text-center">
                <p className="text-sm font-bold text-[#283955]">No notifications found</p>
                <p className="mt-1 text-xs text-[#71809a]">Try another category or filter.</p>
              </div>
            )}
          </div>

          {filteredNotifications.length > visibleCount && (
            <div className="flex justify-center pt-3">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + 4)}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#edf4ff] px-5 text-xs font-bold text-[#1260ed] transition hover:bg-[#e2edff]"
              >
                Load More <span aria-hidden="true">⌄</span>
              </button>
            </div>
          )}
        </section>

        <aside className="space-y-3">
          <section className="rounded-xl border border-[#e4ebf4] bg-white p-3.5 shadow-[0_2px_10px_rgba(26,50,90,0.025)]">
            <h3 className="px-1 text-xs font-bold text-[#172744]">Filter Notifications</h3>
            <div className="mt-2 space-y-1">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  aria-pressed={selectedCategory === category && !unreadOnly}
                  onClick={() => selectCategory(category)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[10px] font-medium transition ${
                    selectedCategory === category && !unreadOnly ? 'bg-[#edf4ff] text-[#1260ed]' : 'text-[#52627d] hover:bg-[#f6f9fe]'
                  }`}
                >
                  <NotificationGlyph type={categoryIcons[category]} className="h-3.5 w-3.5" />
                  <span className="flex-1">{category === 'All' ? 'All Notifications' : category}</span>
                  <span className="rounded-full bg-[#f1f4f9] px-1.5 py-0.5 text-[9px] font-semibold text-[#34445f]">{counts[category]}</span>
                </button>
              ))}
              <div className="border-t border-[#edf1f7] pt-1">
                <button
                  type="button"
                  aria-pressed={unreadOnly}
                  onClick={() => {
                    setUnreadOnly((current) => !current)
                    setVisibleCount(8)
                  }}
                  className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[10px] font-medium transition ${
                    unreadOnly ? 'bg-[#edf4ff] text-[#1260ed]' : 'text-[#52627d] hover:bg-[#f6f9fe]'
                  }`}
                >
                  <NotificationGlyph type="envelope" className="h-3.5 w-3.5" />
                  <span className="flex-1">Unread</span>
                  <span className="rounded-full bg-[#f1f4f9] px-1.5 py-0.5 text-[9px] font-semibold text-[#34445f]">{counts.Unread}</span>
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#e4ebf4] bg-white p-3.5 shadow-[0_2px_10px_rgba(26,50,90,0.025)]">
            <h3 className="text-xs font-bold text-[#172744]">Notification Preferences</h3>
            <p className="mt-1 text-[9px] text-[#71809a]">Manage how you want to receive notifications.</p>
            <div className="mt-2 divide-y divide-[#edf1f7]">
              {preferences.map((preference) => (
                <label key={preference.id} className="flex cursor-pointer items-center gap-2.5 py-2">
                  <span className="shrink-0 text-[#52627d]">
                    <NotificationGlyph type={preference.icon} className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[9px] font-bold text-[#34445f]">{preference.label}</span>
                    <span className="mt-0.5 block text-[8px] text-[#71809a]">{preference.description}</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={preference.enabled}
                    onChange={() => togglePreference(preference.id)}
                    className="peer sr-only"
                  />
                  <span className={`relative h-4 w-7 shrink-0 rounded-full transition ${
                    preference.enabled ? 'bg-[#1260ed]' : 'bg-[#c5cfdd]'
                  } after:absolute after:left-0.5 after:top-0.5 after:h-3 after:w-3 after:rounded-full after:bg-white after:transition ${
                    preference.enabled ? 'after:translate-x-3' : ''
                  }`} aria-hidden="true" />
                </label>
              ))}
            </div>
            <button type="button" onClick={savePreferences} className="mt-2 h-8 w-full rounded-lg bg-[#edf4ff] text-[10px] font-bold text-[#1260ed] transition hover:bg-[#e2edff]">
              Update Preferences
            </button>
          </section>
        </aside>
      </div>

      {selectedNotification && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/40 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedNotification(null)
          }}
        >
          <section role="dialog" aria-modal="true" aria-labelledby="notification-detail-title" className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-start gap-3">
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${(categoryStyles[selectedNotification.category] ?? categoryStyles.System).box}`}>
                <NotificationGlyph type={selectedNotification.icon} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 id="notification-detail-title" className="text-sm font-bold text-[#172744]">{selectedNotification.title}</h3>
                <p className="mt-1 text-[10px] text-[#71809a]">{selectedNotification.category} · {selectedNotification.date}, {selectedNotification.time}</p>
              </div>
              <button type="button" onClick={() => setSelectedNotification(null)} aria-label="Close notification" className="grid h-8 w-8 place-items-center rounded-lg text-lg text-[#64748b] hover:bg-[#f1f5f9]">×</button>
            </div>
            <p className="mt-4 rounded-lg bg-[#f7f9fc] p-3 text-xs leading-5 text-[#52627d]">{selectedNotification.message}</p>
            <p className="mt-3 text-[9px] text-[#71809a]">This notification is sample data for the SYNAPSE demo.</p>
          </section>
        </div>
      )}

      <p className="sr-only">Notifications and preferences use fictional demo data and are saved only for this page session.</p>
    </div>
  )
}

export default NotificationsPage
