import React, { useState, useEffect } from 'react'
import { ChevronRight, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

export default function InterviewHistory({ limit, showViewAll, data }) {
  const { state } = useApp()
  const { interviewHistory } = state
  
  const sourceData = data || interviewHistory;
  const displayData = limit ? sourceData.slice(0, limit) : sourceData;

  const [expandedId, setExpandedId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 850)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">Recent Interviews</h3>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {[1, 2, 3].map((n) => (
            <div key={n} className="p-6 animate-pulse flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div className="space-y-2 flex-1">
                  <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-2/5"></div>
                  <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                </div>
                <div className="w-5 h-5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-20"></div>
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400'
      case 'Intermediate':
        return 'bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400'
      case 'Advanced':
        return 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400'
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
    }
  }

  const getScoreColor = (score) => {
    if (score == null) return 'text-slate-500 dark:text-slate-400'
    if (score >= 85) return 'text-green-600 dark:text-green-400'
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">Completed</span>
      case 'running':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>Running</span>
      case 'draft':
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">Draft</span>
    }
  }

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">Recent Interviews</h3>
      </div>

      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {displayData.map((interview) => (
          <div
            key={interview.id}
            className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
            onClick={() => setExpandedId(expandedId === interview.id ? null : interview.id)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-3">
                  {interview.title}
                  {getStatusBadge(interview.status)}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {interview.date} • {interview.duration}
                </p>
              </div>
              <ChevronRight
                className={`w-5 h-5 text-slate-400 transition-transform ${
                  expandedId === interview.id ? 'rotate-90' : ''
                }`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(interview.difficulty)}`}>
                {interview.difficulty}
              </span>
              {interview.score != null ? (
                <span className={`text-lg font-bold ${getScoreColor(interview.score)}`}>
                  Score: {interview.score}%
                </span>
              ) : (
                <span className="text-sm font-medium text-slate-500 italic">
                  Pending Score
                </span>
              )}
            </div>

            {expandedId === interview.id && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 uppercase font-medium mb-1">
                      Duration
                    </p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                      {interview.duration}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 uppercase font-medium mb-1">
                      Date
                    </p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                      {interview.date}
                    </p>
                  </div>
                </div>
                {interview.status === 'completed' ? (
                  <button 
                    onClick={() => navigate(`/history/${interview._id || interview.id}`)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View Detailed Feedback
                  </button>
                ) : (
                  <button 
                    onClick={() => navigate(`/interview?id=${interview._id || interview.id}`)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                  >
                    {interview.status === 'running' ? 'Resume Interview' : 'Start Interview'}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {showViewAll && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <button 
            onClick={() => navigate('/history')}
            className="w-full py-3 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-50 rounded-lg font-medium transition-colors cursor-pointer"
          >
            View All History <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}
