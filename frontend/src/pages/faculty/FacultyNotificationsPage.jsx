import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FacultyBellIcon,
  CheckCircleIcon,
  CloseIcon,
  FilterIcon,
  SearchIcon,
  SparklesIcon,
  ArrowRightIcon,
  InfoIcon,
  CheckIcon,
} from '../../components/faculty/FacultyIcons.jsx'
import {
  getFacultyNotifications,
  getFacultyNotificationsSummary,
} from '../../services/facultyService.js'

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'unread', label: 'Unread Only' },
  { value: 'Proposals', label: 'Proposals' },
  { value: 'Opportunities', label: 'Opportunities' },
  { value: 'Training & FDP', label: 'Training & FDP' },
  { value: 'Institutional', label: 'Institutional' },
]

function getCategoryBadge(category) {
  switch (category) {
    case 'Proposals':
      return 'border-[#cbdff8] bg-[#edf4ff] text-[#1260ed]'
    case 'Opportunities':
      return 'border-rose-200 bg-rose-50 text-rose-700'
    case 'Training & FDP':
      return 'border-purple-200 bg-purple-50 text-purple-700'
    case 'Institutional':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700'
    default:
      return 'border-slate-200 bg-slate-100 text-slate-700'
  }
}

export default function FacultyNotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [dismissedCount, setDismissedCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Feedback toast
  const [feedbackToast, setFeedbackToast] = useState(null)

  // Load initial notifications
  useEffect(() => {
    let isMounted = true
    Promise.all([getFacultyNotifications(), getFacultyNotificationsSummary()])
      .then(([items]) => {
        if (isMounted) {
          setNotifications(items)
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

  // Auto-dismiss toast
  useEffect(() => {
    if (!feedbackToast) return
    const timer = setTimeout(() => {
      setFeedbackToast(null)
    }, 3500)
    return () => clearTimeout(timer)
  }, [feedbackToast])

  // Computed summary metrics
  const totalCount = notifications.length
  const unreadCount = notifications.filter((n) => !n.isRead).length
  const actionRequiredCount = notifications.filter((n) => n.isActionRequired).length

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (selectedCategory === 'unread') {
        if (item.isRead) return false
      } else if (selectedCategory !== 'all') {
        if (item.category !== selectedCategory) return false
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchesTitle = item.title.toLowerCase().includes(q)
        const matchesSender = item.sender.toLowerCase().includes(q)
        const matchesDesc = item.description.toLowerCase().includes(q)
        const matchesCat = item.category.toLowerCase().includes(q)
        if (!matchesTitle && !matchesSender && !matchesDesc && !matchesCat) {
          return false
        }
      }

      return true
    })
  }, [notifications, selectedCategory, searchQuery])

  // Mark single notification as read / unread
  const handleToggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedRead = !item.isRead
          setFeedbackToast({
            type: 'info',
            title: updatedRead ? 'Marked as Read' : 'Marked as Unread',
            message: `Notification "${item.title}" updated for this session.`,
          })
          return { ...item, isRead: updatedRead }
        }
        return item
      })
    )
  }

  // Dismiss notification
  const handleDismiss = (id) => {
    const itemToDismiss = notifications.find((n) => n.id === id)
    setNotifications((prev) => prev.filter((item) => item.id !== id))
    setDismissedCount((prev) => prev + 1)
    setFeedbackToast({
      type: 'info',
      title: 'Notification Dismissed',
      message: `"${itemToDismiss?.title || 'Notification'}" removed from your view.`,
    })
  }

  // Mark all notifications as read
  const handleMarkAllAsRead = () => {
    if (unreadCount === 0) return
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, isRead: true }))
    )
    setFeedbackToast({
      type: 'success',
      title: 'All Alerts Marked as Read',
      message: 'All notifications are now marked as reviewed in this demo session.',
    })
  }

  const hasActiveFilters = Boolean(searchQuery.trim()) || selectedCategory !== 'all'

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
  }

  return (
    <div className="space-y-7">
      {/* Feedback Toast Notification */}
      {feedbackToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex max-w-md items-start gap-3 rounded-xl border border-[#cbdff8] bg-white p-4 shadow-xl transition-all duration-200 animate-in fade-in slide-in-from-bottom-3"
        >
          <span
            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
              feedbackToast.type === 'success'
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-blue-50 text-[#1260ed]'
            }`}
          >
            <CheckCircleIcon className="h-4 w-4" />
          </span>
          <div className="flex-1 text-xs">
            <p className="font-bold text-[#101c3d]">{feedbackToast.title}</p>
            <p className="mt-0.5 text-[#50617c]">{feedbackToast.message}</p>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackToast(null)}
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
            Notifications
          </span>
        </nav>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#101c3d] sm:text-3xl">
              Notifications
            </h1>
            <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-[#50617c]">
              Stay informed with real-time alerts on proposal reviews, institutional announcements, and deadline reminders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition shadow-xs ${
                unreadCount > 0
                  ? 'border border-[#dce7f5] bg-white text-[#101c3d] hover:bg-[#f3f7fd]'
                  : 'border border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <CheckIcon className="h-3.5 w-3.5 text-[#1260ed]" />
              <span>Mark All as Read</span>
            </button>

            <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50/70 px-3 py-1 text-xs font-semibold text-[#1260ed]">
              <SparklesIcon className="h-3.5 w-3.5" />
              <span>Demo Mode • In-Memory Session</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Notifications */}
        <div className="rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-6">
          <div className="flex items-center justify-between">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#d6e6fe] bg-[#edf4ff] text-[#1260ed]">
              <FacultyBellIcon className="h-6 w-6" />
            </span>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#1260ed]">
              Active
            </span>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-[#101c3d]">
                {isLoading ? '...' : totalCount}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Demo Records
              </span>
            </div>
            <h3 className="mt-1 text-xs font-semibold text-[#50617c] sm:text-sm">
              Total Notifications
            </h3>
            <p className="mt-1 text-[11px] text-[#71829e]">
              Current active feed items
            </p>
          </div>
        </div>

        {/* Unread Alerts */}
        <div className="rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-6">
          <div className="flex items-center justify-between">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600">
              <InfoIcon className="h-6 w-6" />
            </span>
            <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700">
              Needs Review
            </span>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-[#101c3d]">
                {isLoading ? '...' : unreadCount}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Unread
              </span>
            </div>
            <h3 className="mt-1 text-xs font-semibold text-[#50617c] sm:text-sm">
              Unread Alerts
            </h3>
            <p className="mt-1 text-[11px] text-[#71829e]">
              Pending your review
            </p>
          </div>
        </div>

        {/* Action Required */}
        <div className="rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-6">
          <div className="flex items-center justify-between">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-600">
              <SparklesIcon className="h-6 w-6" />
            </span>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
              High Priority
            </span>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-[#101c3d]">
                {isLoading ? '...' : actionRequiredCount}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Action Items
              </span>
            </div>
            <h3 className="mt-1 text-xs font-semibold text-[#50617c] sm:text-sm">
              Action Required
            </h3>
            <p className="mt-1 text-[11px] text-[#71829e]">
              Proposals & closing deadlines
            </p>
          </div>
        </div>

        {/* Dismissed in Session */}
        <div className="rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-6">
          <div className="flex items-center justify-between">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600">
              <CheckCircleIcon className="h-6 w-6" />
            </span>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
              Session
            </span>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-[#101c3d]">
                {dismissedCount}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Cleared
              </span>
            </div>
            <h3 className="mt-1 text-xs font-semibold text-[#50617c] sm:text-sm">
              Dismissed Items
            </h3>
            <p className="mt-1 text-[11px] text-[#71829e]">
              Removed in current visit
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-[#e2ecf9] bg-white p-5 shadow-[0_2px_12px_rgba(20,40,80,0.04)] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="mr-1 flex items-center gap-1.5 text-xs font-bold text-[#50617c]">
              <FilterIcon className="h-3.5 w-3.5 text-slate-400" />
              <span>Category:</span>
            </div>
            {categoryOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedCategory(opt.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  selectedCategory === opt.value
                    ? 'bg-[#1260ed] text-white shadow-xs'
                    : 'bg-[#f4f7fc] text-[#50617c] hover:bg-[#e7eef8]'
                }`}
              >
                {opt.label}
                {opt.value === 'unread' && unreadCount > 0 && (
                  <span className={`ml-1.5 rounded-full px-1.5 py-0.2 text-[10px] ${
                    selectedCategory === 'unread' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700 font-bold'
                  }`}>
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-72">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <SearchIcon className="h-4 w-4" />
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search alert, sender, or topic..."
                className="h-9 w-full rounded-xl border border-[#dce7f5] bg-white pl-9 pr-3 text-xs text-[#101c3d] placeholder:text-slate-400 focus:border-[#1260ed] focus:outline-hidden focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="shrink-0 rounded-lg border border-[#dce7f5] bg-white px-3 py-1.5 text-xs font-semibold text-[#1260ed] hover:bg-[#edf5ff] transition"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications Feed List */}
      <section aria-labelledby="notifications-feed-heading" className="space-y-3">
        <h2 id="notifications-feed-heading" className="sr-only">
          Notification Alerts Feed
        </h2>

        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((item) => (
            <div
              key={item.id}
              className={`group flex flex-col justify-between gap-4 rounded-2xl border p-4 sm:p-5 transition-all ${
                item.isRead
                  ? 'border-[#e8f0fa] bg-white opacity-85 hover:border-[#bfd8fb] hover:opacity-100'
                  : 'border-[#cbdff8] bg-[#f8fbff] shadow-[0_2px_10px_rgba(18,96,237,0.06)] hover:border-[#1260ed]/40'
              }`}
            >
              <div className="flex items-start gap-3.5">
                {/* Read / Unread Indicator Dot */}
                <div className="mt-1 shrink-0">
                  <span
                    className={`block h-2.5 w-2.5 rounded-full ${
                      item.isRead
                        ? 'bg-slate-300'
                        : 'bg-[#1260ed] ring-4 ring-blue-100 animate-pulse'
                    }`}
                    title={item.isRead ? 'Read' : 'Unread'}
                  />
                </div>

                {/* Content body */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold ${getCategoryBadge(
                        item.category
                      )}`}
                    >
                      {item.category}
                    </span>

                    {item.isActionRequired && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.2 text-[10px] font-bold text-amber-700">
                        Action Required
                      </span>
                    )}

                    <span className="text-xs font-medium text-slate-400">•</span>
                    <span className="text-xs font-semibold text-[#50617c]">
                      {item.sender}
                    </span>
                    <span className="text-xs font-medium text-slate-400">•</span>
                    <span className="text-xs text-slate-400">
                      {item.timestamp}
                    </span>
                  </div>

                  <h3
                    className={`mt-1.5 text-sm sm:text-base font-bold ${
                      item.isRead ? 'text-[#334155]' : 'text-[#101c3d]'
                    }`}
                  >
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs sm:text-sm text-[#50617c] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Dismiss button */}
                <button
                  type="button"
                  onClick={() => handleDismiss(item.id)}
                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label={`Dismiss notification: ${item.title}`}
                  title="Dismiss notification"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Bottom Card Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#edf3fc] pt-3 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleRead(item.id)}
                    className="font-semibold text-[#50617c] hover:text-[#1260ed] transition"
                  >
                    {item.isRead ? 'Mark as Unread' : 'Mark as Read'}
                  </button>
                </div>

                {item.linkTo && (
                  <Link
                    to={item.linkTo}
                    className="inline-flex items-center gap-1.5 font-bold text-[#1260ed] hover:underline"
                  >
                    <span>View Related Details</span>
                    <ArrowRightIcon className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#dce7f5] bg-white p-12 text-center shadow-xs">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-[#edf5ff] text-[#1260ed]">
              <FacultyBellIcon className="h-7 w-7" />
            </span>
            <p className="mt-3 text-base font-bold text-[#101c3d]">
              {hasActiveFilters ? 'No notifications match your filters' : 'All caught up!'}
            </p>
            <p className="mt-1 max-w-sm text-xs text-[#66738d]">
              {hasActiveFilters
                ? 'Try adjusting your search keywords or switch to "All Categories" to see all alerts.'
                : 'You have reviewed or dismissed all faculty alerts in this demonstration session.'}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-4 rounded-xl border border-[#dce7f5] bg-white px-4 py-2 text-xs font-bold text-[#1260ed] hover:bg-[#edf5ff] transition"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
