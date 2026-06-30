import React from 'react'
import UserProfile from '../components/dashboard/UserProfile'
import QuickStats from '../components/dashboard/QuickStats'
import ResumeUpload from '../components/dashboard/ResumeUpload'
import InterviewHistory from '../components/dashboard/InterviewHistory'

const Dashboard = () => {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 min-h-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
          Welcome to PrepAI!
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Track your interview progress and improve your skills.
        </p>
      </div>

      {/* User Profile */}
      <UserProfile />

      {/* Quick Stats */}
      <QuickStats />

      {/* Resume Upload */}
      <ResumeUpload />

      {/* Interview History */}
      <InterviewHistory limit={5} showViewAll={true} />
    </div>
  )
}

export default Dashboard
