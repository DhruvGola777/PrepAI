import React, { useState, useEffect } from 'react'
import { Zap, BookOpen, Target, Users, CheckCircle2, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import ResumeUpload from '../components/dashboard/ResumeUpload'

export default function Practice() {
  const { state } = useApp()
  const hasResume = !!state.resume?.fileName
  
  const [position, setPosition] = useState('')
  const [selectedType, setSelectedType] = useState(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (hasResume && !isAnalyzing && !state.resume.uploading) {
      // Mock analyzing state when a new resume is detected
      setIsAnalyzing(true)
      const timer = setTimeout(() => {
        setIsAnalyzing(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [hasResume, state.resume.fileName])

  const practiceOptions = [
    {
      id: 'technical',
      icon: BookOpen,
      title: 'Technical Interview',
      description: 'Practice coding questions and technical problem-solving',
      topics: ['Data Structures', 'Algorithms', 'System Design'],
      color: 'from-blue-500 to-blue-600',
      lightColor: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      id: 'behavioral',
      icon: Target,
      title: 'Behavioral Interview',
      description: 'Master common interview questions and storytelling',
      topics: ['STAR Method', 'Company Culture', 'Career Goals'],
      color: 'from-green-500 to-emerald-600',
      lightColor: 'bg-green-50 dark:bg-green-950/30',
    },
    {
      id: 'mixed',
      icon: Users,
      title: 'Mock Interview',
      description: 'Simulate a real interview with AI feedback',
      topics: ['Full Practice', 'Time Management', 'Communication'],
      color: 'from-purple-500 to-indigo-600',
      lightColor: 'bg-purple-50 dark:bg-purple-950/30',
    },
  ]

  const difficulties = ['Beginner', 'Intermediate', 'Advanced']

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-12 mb-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 mb-4 tracking-tight">
          AI Interview Setup
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Upload your resume and configure your target role. Our AI will analyze your experience to generate a highly personalized interview session.
        </p>
      </div>

      <div className="space-y-12">
        
        {/* Step 1: Resume Upload */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${hasResume ? 'bg-green-100 text-green-700' : 'bg-blue-600 text-white shadow-md'}`}>
              {hasResume ? <CheckCircle2 className="w-5 h-5" /> : '1'}
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              Provide Resume
            </h2>
          </div>
          
          <div className="relative">
            <ResumeUpload />
            
            {/* Analysis Overlay */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center z-10 animate-in fade-in duration-300">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-lg font-bold text-slate-900 dark:text-white">Analyzing Resume...</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Extracting skills and experience</p>
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Configuration */}
        <div className={`space-y-8 transition-all duration-500 ${(!hasResume || isAnalyzing) ? 'opacity-40 pointer-events-none grayscale-[50%]' : ''}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${(!hasResume || isAnalyzing) ? 'bg-slate-200 text-slate-500' : 'bg-blue-600 text-white shadow-md'}`}>
              2
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              Configure Interview
            </h2>
          </div>

          {/* Target Job Role */}
          <div className="glass-card rounded-xl p-6 md:p-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-500" />
              Target Job Role
            </h3>
            <div className="max-w-xl">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                What position are you interviewing for?
              </label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="e.g. Senior Frontend Developer, Data Scientist..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Practice Options */}
          <div className="glass-card rounded-xl p-6 md:p-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" />
              Select Interview Type
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {practiceOptions.map((option, index) => {
                const Icon = option.icon
                const isSelected = selectedType === option.id
                return (
                  <div 
                    key={index} 
                    onClick={() => setSelectedType(option.id)}
                    className={`rounded-xl p-6 cursor-pointer transition-all border-2 ${
                      isSelected 
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 shadow-md transform scale-[1.02]' 
                        : 'border-transparent bg-slate-50 dark:bg-slate-800 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-full bg-linear-to-br ${option.color} flex items-center justify-center shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                        {option.title}
                      </h4>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                      {option.description}
                    </p>
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-2">Topics:</p>
                      <div className="flex flex-wrap gap-2">
                        {option.topics.map((topic, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-1 text-xs rounded-full ${option.lightColor} text-slate-700 dark:text-slate-300`}
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="glass-card rounded-xl p-6 md:p-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-6">Select Difficulty</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`p-6 rounded-lg font-semibold transition-all text-base ${
                    selectedDifficulty === difficulty
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          {selectedType && selectedDifficulty && position.trim().length > 0 && hasResume && !isAnalyzing && (
            <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl p-8 md:p-12 text-center text-white shadow-xl animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-3xl font-bold mb-4">Ready to Practice?</h3>
              <p className="mb-8 text-blue-100 text-lg max-w-2xl mx-auto">
                AI will use your resume and configure a <strong>{selectedDifficulty}</strong> <strong>{selectedType}</strong> interview for <strong>{position}</strong>.
              </p>
              <button 
                onClick={() => navigate(`/interview?position=${encodeURIComponent(position)}&type=${selectedType}&difficulty=${selectedDifficulty.toLowerCase()}`)}
                className="px-8 py-4 bg-white text-indigo-600 text-lg font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg flex items-center gap-2 mx-auto cursor-pointer hover:scale-105"
              >
                <Zap className="w-6 h-6" />
                Start AI Interview
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
