import React, { useState, useEffect } from 'react'
import { ChevronRight, Eye, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import EditInterviewModal from './EditInterviewModal'

export default function InterviewHistory({ limit, showViewAll, data }) {
  const { state, deleteInterview, refreshInterviews } = useApp()
  const { interviewHistory } = state

  const sourceData = data || interviewHistory;
  const displayData = limit ? sourceData.slice(0, limit) : sourceData;

  const [expandedId, setExpandedId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [editingInterview, setEditingInterview] = useState(null)
  const navigate = useNavigate()

  const handleEditClick = (e, interview) => {
    e.stopPropagation()
    setEditingInterview(interview)
  }

  useEffect(() => {
    // Refresh interviews on mount to ensure we have the latest data
    if (state.user) {
      refreshInterviews().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [state.user]);

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
        {displayData.map((interview) => {
          const interviewId = interview._id || interview.id;
          const startDate = interview.startedAt || interview.createdAt;
          const dateStr = startDate ? new Date(startDate).toLocaleDateString() : '';
          let durationStr = '';
          if (interview.startedAt && interview.endedAt) {
            const diff = Math.round((new Date(interview.endedAt) - new Date(interview.startedAt)) / 60000);
            durationStr = diff > 0 ? `${diff} mins` : '< 1 min';
          }

          return (
            <div
              key={interviewId}
              className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              onClick={() => setExpandedId(expandedId === interviewId ? null : interviewId)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-3">
                    {interview.title}
                    {getStatusBadge(interview.status)}
                  </h4>
                  {(dateStr || durationStr) && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {dateStr}{dateStr && durationStr ? ' • ' : ''}{durationStr}
                    </p>
                  )}
                </div>
                <ChevronRight
                  className={`w-5 h-5 text-slate-400 transition-transform ${expandedId === interviewId ? 'rotate-90' : ''
                    }`}
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">

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

              {expandedId === interviewId && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 uppercase font-medium mb-1">
                        Duration
                      </p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                        {durationStr || interview.duration || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 uppercase font-medium mb-1">
                        Date
                      </p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                        {dateStr || interview.date}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 uppercase font-medium mb-1">
                        Company
                      </p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                        {interview.company || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 uppercase font-medium mb-1">
                        Type
                      </p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-50 capitalize">
                        {interview.type || 'Not specified'}
                      </p>
                    </div>
                  </div>
                  {interview.notes && (
                    <div className="mb-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                      <p className="text-xs text-slate-600 dark:text-slate-400 uppercase font-medium mb-1">
                        Notes
                      </p>
                      <p className="text-sm text-slate-800 dark:text-slate-300">
                        {interview.notes}
                      </p>
                    </div>
                  )}
                  {interview.status === 'completed' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/history/${interviewId}`)
                        }}
                        className="flex-1 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 font-medium rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Full Details
                      </button>
                      <button
                        onClick={(e) => handleEditClick(e, interview)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                        title="Edit Title"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteInterview(interviewId)
                        }}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete Interview"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/interview?id=${interview._id || interview.id}`)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors cursor-pointer"
                      >
                        {interview.status === 'running' ? 'Resume Interview' : 'Start Interview'}
                      </button>
                      <button
                        onClick={() => deleteInterview(interview._id || interview.id)}
                        className="px-4 py-2 bg-red-100 dark:bg-red-950/30 text-red-600 hover:bg-red-200 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Interview"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
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

      {/* Edit Modal */}
      {editingInterview && (
        <EditInterviewModal
          interview={editingInterview}
          onClose={() => setEditingInterview(null)}
        />
      )}
    </div>
  )
}
