import React from 'react'
import { Sparkles, TrendingUp, Target, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

export default function AIRecommendations() {
  const { state } = useApp()
  const { aiRecommendations } = state
  const navigate = useNavigate()

  if (!aiRecommendations || aiRecommendations.length === 0) {
    return null;
  }

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">AI Recommendations</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Personalized insights based on your recent performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
        {aiRecommendations.map((rec, index) => {
          // Backend provides { title, url }. We'll derive the rest.
          const isImprovement = index % 2 === 0; // Just alternating for visual variety since backend doesn't specify type
          const Icon = isImprovement ? Target : TrendingUp;

          return (
            <div
              key={index}
              className={`p-5 rounded-xl border ${isImprovement
                ? 'bg-amber-50/50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/50'
                : 'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/50'
                } flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`w-5 h-5 ${isImprovement ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
                  <h4 className="font-bold text-slate-900 dark:text-slate-50">{rec.title}</h4>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 mb-6">
                  {rec.description || 'Review this area to improve your interview performance.'}
                </p>
              </div>

              <button
                onClick={() => rec.url ? window.open(rec.url, '_blank') : navigate('/practice')}
                className={`flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${isImprovement
                  ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:hover:bg-amber-900/60'
                  : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:hover:bg-emerald-900/60'
                  }`}
              >
                {rec.actionText || 'Explore Resource'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
