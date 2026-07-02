import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { Bell } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { state } = useApp()
  const { user } = state

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-[#111423] text-slate-800 dark:text-white transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header (Desktop & Mobile) */}
        <div className="sticky top-0 z-30 bg-white dark:bg-[#0B0F19] border-b border-slate-200 dark:border-gray-800/80 px-6 py-3 flex items-center justify-between transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 border border-slate-200 dark:border-gray-800 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800 bg-white dark:bg-[#151924] transition-all flex items-center justify-center shadow-md dark:shadow-lg"
            >
              <svg className="w-5 h-5 text-indigo-500 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-6">
            <button className="p-2 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800 rounded-xl transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full"></span>
            </button>

            <div className="flex items-center gap-3 border-l border-slate-200 dark:border-gray-800 pl-6">
              <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-indigo-600/30 border border-blue-200 dark:border-indigo-500/20 text-blue-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
                {user?.picture ? (
                  <img src={user.picture} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'AP'
                )}
              </div>
              <span className="hidden sm:block text-sm font-semibold text-slate-700 dark:text-gray-200">
                {user?.name || 'Aria Patel'}
              </span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-slate-50 dark:bg-[#111423] custom-scrollbar transition-colors duration-300">
          <Outlet />
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
