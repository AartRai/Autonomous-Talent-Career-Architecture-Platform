import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import StudentNavbar from './StudentNavbar.jsx'
import StudentSidebar from './StudentSidebar.jsx'

function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen w-full bg-[#f8fbff] text-[#101c3d] antialiased">
      <StudentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        <StudentNavbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-5 sm:p-7 lg:p-9">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default StudentLayout
