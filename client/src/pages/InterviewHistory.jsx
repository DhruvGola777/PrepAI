import React, { useState, useEffect } from 'react'
import { Filter, Download, Archive } from 'lucide-react'
import InterviewHistory from '../components/dashboard/InterviewHistory'
import { useApp } from '../context/AppContext'

export default function InterviewHistoryPage() {
  const { state, refreshInterviews } = useApp()
  const { interviewHistory, stats } = state
  const filtered = interviewHistory

  useEffect(() => {
    refreshInterviews();
  }, []);

  const avgScore =
    filtered.length > 0
      ? Math.round(filtered.reduce((sum, i) => sum + i.score, 0) / filtered.length)
      : 0

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
          Interview History
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Review your past interviews and track your improvement over time.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-6">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Interviews</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">{filtered.length}</p>
        </div>
        <div className="glass-card rounded-xl p-6">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Average Score</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{avgScore}%</p>
        </div>
        <div className="glass-card rounded-xl p-6">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Time</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
            {Math.round(filtered.reduce((sum, i) => {
              if (i.startedAt && i.endedAt) {
                const diff = (new Date(i.endedAt) - new Date(i.startedAt)) / 60000;
                return sum + (diff > 0 ? diff : 0);
              }
              return sum;
            }, 0) / 60)}h
          </p>
        </div>
      </div>



      {/* Interview History Component */}
      <InterviewHistory data={filtered} />

      {/* Export Options */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Export & Archive</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex-1">
            <Download className="w-5 h-5" />
            Export as PDF
          </button>
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-50 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors flex-1">
            <Archive className="w-5 h-5" />
            Archive Old Interviews
          </button>
        </div>
      </div>
    </div>
  )
}
