import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import RecruiterSidebar from './RecruiterSidebar.jsx'
import RecruiterNavbar from './RecruiterNavbar.jsx'

function RecruiterLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen w-full bg-[#f8fbff] text-[#101c3d] antialiased">
      {/* Sidebar (Desktop static + Mobile slide-over) */}
      <RecruiterSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        <RecruiterNavbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-5 sm:p-7 lg:p-9">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default RecruiterLayout
