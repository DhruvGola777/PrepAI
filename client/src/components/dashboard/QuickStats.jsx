import React from 'react'
import { Zap, TrendingUp, Flame, Calendar } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function QuickStats() {
  const { state } = useApp()
  const { stats } = state
  if (!stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="glass-card rounded-xl p-6 h-32 animate-pulse bg-slate-100 dark:bg-slate-800/50"></div>
        ))}
      </div>
    )
  }

  const statCards = [
    {
      icon: Zap,
      label: 'Total Interviews',
      value: stats.totalInterviews,
      color: 'from-blue-500 to-blue-600',
      lightColor: 'bg-blue-50 dark:bg-blue-950/30',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      icon: TrendingUp,
      label: 'Average Score',
      value: `${stats.averageScore}%`,
      color: 'from-green-500 to-emerald-600',
      lightColor: 'bg-green-50 dark:bg-green-950/30',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: `${stats.currentStreak} days`,
      color: 'from-orange-500 to-red-600',
      lightColor: 'bg-orange-50 dark:bg-orange-950/30',
      textColor: 'text-orange-600 dark:text-orange-400',
    },
    {
      icon: Calendar,
      label: 'This Month',
      value: stats.completedThisMonth,
      color: 'from-purple-500 to-indigo-600',
      lightColor: 'bg-purple-50 dark:bg-purple-950/30',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, index) => {
        const Icon = card.icon
        return (
          <div key={index} className="glass-card rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-full ${card.lightColor} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
              <div className={`w-8 h-8 rounded-full bg-linear-to-br ${card.color} flex items-center justify-center text-white text-xs font-bold`}>
                ✓
              </div>
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{card.label}</p>
            <p className={`text-2xl font-bold ${card.textColor}`}>{card.value}</p>
          </div>
        )
      })}
    </div>
  )
}
