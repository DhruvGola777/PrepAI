import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, MessageSquare, FileText, History, Settings, LogOut, Bot } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate("/")
  }

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/practice', label: 'Practice', icon: MessageSquare },
    { path: '/resume', label: 'Resume', icon: FileText },
    { path: '/history', label: 'Interview History', icon: History },
    { path: '/settings', label: 'Settings', icon: Settings },
  ]

  const isActive = (path) => {
    if (path.includes('#')) {
      return location.pathname + location.hash === path
    }
    return location.pathname === path
  }

  // Generate desktop sidebar container classes dynamically based on isOpen state
  const sidebarContainerClass = isOpen
    ? 'hidden lg:flex flex-col bg-linear-to-b from-blue-600 to-indigo-600 border-r border-blue-500/20 text-white shadow-lg w-64'
    : 'hidden lg:flex flex-col bg-white dark:bg-[#0B0F19] border-r border-slate-200 dark:border-gray-800 text-blue-600 dark:text-indigo-400 shadow-lg w-20'

  const logoBorderClass = isOpen
    ? 'p-4 flex justify-center border-b border-blue-400/20'
    : 'p-4 flex justify-center border-b border-slate-200 dark:border-gray-800/60'

  const botBoxClass = isOpen
    ? 'w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white shadow-lg shrink-0'
    : 'w-12 h-12 rounded-xl bg-blue-50 dark:bg-indigo-600/30 border border-blue-100 dark:border-indigo-500/20 text-blue-600 dark:text-indigo-400 flex items-center justify-center shadow-lg shrink-0'

  const footerBorderClass = isOpen
    ? 'p-4 border-t border-blue-400/20 flex justify-center'
    : 'p-4 border-t border-slate-200 dark:border-gray-800/60 flex justify-center'

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`${sidebarContainerClass} transition-all duration-300`}>
        {/* Logo / Bot Icon */}
        <div className={logoBorderClass}>
          <div className={botBoxClass}>
            <Bot className="w-7 h-7" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-4 flex flex-col items-center w-full">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = isActive(path)
            
            // Dynamic item classes for open vs closed
            let itemClass = ''
            if (isOpen) {
              itemClass = active
                ? 'bg-white/20 text-white shadow-lg justify-start px-4'
                : 'hover:bg-white/10 text-white/80 hover:text-white justify-start px-4'
            } else {
              itemClass = active
                ? 'bg-blue-50 dark:bg-[#1C2133] text-blue-600 dark:text-indigo-400 border border-blue-100 dark:border-indigo-500/20 shadow-md justify-center'
                : 'hover:bg-slate-50 dark:hover:bg-gray-800/40 text-blue-400 dark:text-indigo-500/60 hover:text-blue-600 dark:hover:text-indigo-400 justify-center'
            }

            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 w-full ${itemClass}`}
                title={label}
              >
                <Icon className="w-6 h-6 shrink-0" />
                {isOpen && <span className="font-medium text-sm">{label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className={footerBorderClass}>
          <button 
            onClick={handleLogout} 
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 w-full ${
              isOpen 
                ? 'hover:bg-white/10 text-white/80 hover:text-white justify-start px-4' 
                : 'hover:bg-slate-50 dark:hover:bg-gray-800/40 text-blue-400 dark:text-indigo-500/60 hover:text-blue-600 dark:hover:text-indigo-400 justify-center'
            }`}
            title="Logout"
          >
            <LogOut className="w-6 h-6 shrink-0" />
            {isOpen && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar (Drawer - always uses blue style for consistency) */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-40 w-64 bg-linear-to-b from-blue-600 to-indigo-600 text-white border-r border-blue-500/20 shadow-lg transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-blue-400/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">PrepAI</h1>
                <p className="text-xs text-blue-100">Master Your Skills</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-blue-100 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6 space-y-2">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = isActive(path)
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'hover:bg-white/10 text-white/80 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-400/20">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
