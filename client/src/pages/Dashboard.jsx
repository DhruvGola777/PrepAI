import React, { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import UserProfile from '../components/dashboard/UserProfile'
import QuickStats from '../components/dashboard/QuickStats'
import ResumeUpload from '../components/dashboard/ResumeUpload'
import InterviewHistory from '../components/dashboard/InterviewHistory'
import AIRecommendations from '../components/dashboard/AIRecommendations'

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshInterviews } = useApp();

  useEffect(() => {
    refreshInterviews();
  }, []);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      navigate('/dashboard', { replace: true });
      window.location.reload();
    }
  }, [searchParams, navigate]);

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

      {/* AI Recommendations */}
      <AIRecommendations />
    </div>
  )
}

export default Dashboard
