import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Trophy, MessageSquare, AlertTriangle, CheckCircle2, BookOpen, ExternalLink, Calendar, Clock, Loader2, Sparkles, Target, BarChart2, ChevronDown, ChevronUp, PlayCircle } from 'lucide-react'

export default function InterviewDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [interview, setInterview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expanded, setExpanded] = useState({})

  const toggleExpand = (key) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const getMockDetails = (mockId) => {
    const mockTitles = {
      '1': 'React Technical Interview',
      '2': 'System Design Interview',
      '3': 'JavaScript Fundamentals',
      '4': 'Node.js and Backend',
      '5': 'Database Design'
    }

    const title = mockTitles[mockId] || 'Practice Interview Session'
    const scoresMap = {
      '1': { overall: 87, technical: 85, communication: 88, confidence: 90, problemSolving: 85 },
      '2': { overall: 72, technical: 70, communication: 75, confidence: 70, problemSolving: 75 },
      '3': { overall: 95, technical: 96, communication: 94, confidence: 95, problemSolving: 95 },
      '4': { overall: 81, technical: 80, communication: 82, confidence: 80, problemSolving: 82 },
      '5': { overall: 78, technical: 75, communication: 80, confidence: 80, problemSolving: 77 }
    }
    const scores = scoresMap[mockId] || { overall: 80, technical: 80, communication: 80, confidence: 80, problemSolving: 80 }

    return {
      _id: mockId,
      title: title,
      type: mockId === '2' ? 'mixed' : 'technical',
      startedAt: new Date(Date.now() - 3600000).toISOString(),
      endedAt: new Date().toISOString(),
      score: scores.overall,
      transcript: [
        {
          question: `Explain the fundamental logic behind your recent ${title} projects. What optimizations did you perform?`,
          answer: "In my recent projects, I structured the architecture using container-component patterns, separation of concerns, and clean context state management. We reduced re-renders and optimized core database indexes to handle traffic spikes. We also implemented lazy loading for components outside the primary viewport and structured virtual lists to optimize DOM element size, which brought the initial bundle payload size down by almost 45%.",
          score: scores.overall + 3,
          feedback: "Great structure in the answer. Clear emphasis on architectural design, optimization, and problem-solving metrics. You accurately described modern patterns such as bundle division, lazy loading, and list virtualisation which are key performance benchmarks.",
          idealAnswer: "In recent projects, I led the architecture by combining component-container patterns with efficient global state (Context/Redux). For optimization, I addressed rendering bottlenecks using useMemo and React.memo. I also split the bundle via dynamic imports (React.lazy) and implemented windowing for long lists, which decreased initial load times by 40% and improved TTI (Time to Interactive).",
          starEvaluation: {
            situation: "Asked to explain recent project logic and optimizations.",
            task: "Outline architectural decisions and specific performance improvements.",
            action: "Structured architecture, optimized database indexes, implemented lazy loading and virtual lists.",
            result: "Reduced bundle size by 45% and handled traffic spikes effectively."
          }
        },
        {
          question: "How do you handle global error boundaries and boundary test cases?",
          answer: "We wrap our components with global custom error boundaries to catch runtime errors gracefully. On the backend, we implement a central async handler middleware that catches all unhandled rejections and sends a clean format response. Additionally, we use integration tests that assert mock components that throw rendering errors, checking that the fallback custom UI shows up and files error logs properly.",
          score: scores.overall - 4,
          feedback: "Solid technical explanation. Good mention of central error middlewares and global component boundary safety nets. You could expand this by explaining how React 18 recovery mechanisms work or explaining logging service integrations.",
          idealAnswer: "I implement Error Boundaries at the route level to catch rendering errors and display a graceful fallback UI, while logging the stack trace to an external service like Sentry. For boundary testing, I write Jest/React Testing Library specs that intentionally throw errors in child components to assert that the Error Boundary catches them. On the backend, I use a centralized error handling middleware to format and log unhandled rejections.",
          starEvaluation: {
            situation: "Asked about handling global error boundaries and testing them.",
            task: "Explain implementation of error boundaries and corresponding test strategies.",
            action: "Wrapped components with global error boundaries, implemented backend async handler, and wrote integration tests.",
            result: "Gracefully caught runtime errors and verified fallback UIs."
          }
        }
      ],
      feedbackRef: {
        feedbackText: `This detailed analysis report represents the evaluation summary of the ${title} session. The candidate demonstrated key core strengths in this track.`,
        scores: scores,
        behavioralEvaluation: {
          starMethod: {
            score: scores.overall + 2,
            feedback: "Candidate effectively utilized the STAR method to structure their responses, providing clear context and measurable results."
          }
        },
        technicalAnalysis: {
          idealAnswerComparison: "The candidate's technical responses aligned with 80%+ of key index checks, showing stable performance metrics.",
          missingPoints: ["Load balancing details", "Cache validation logic", "Unit test assertion frameworks"],
          weaknesses: ["Deep-dive performance benchmarks", "Strict memory constraints handling"],
          strengths: ["Clear terminology explanation", "Central error safety architectures", "Concise structuring"]
        },
        learningLinks: [
          { title: `${title} Reference Guide`, url: "https://react.dev/" },
          { title: "React Performance Tuning Guide (YouTube Tutorial)", url: "https://www.youtube.com/watch?v=dpw9EHDh2bM" },
          { title: "PrepAI Best Practice Cheatsheet", url: "https://github.com" }
        ],
        recommendations: [
          { title: "System Architecture Constraints & Scalability (YouTube Video)", url: "https://www.youtube.com/watch?v=I532r6-b2BY" },
          { title: "Study advanced caching algorithms", url: "https://github.com" }
        ]
      }
    }
  }

  useEffect(() => {
    const fetchInterviewDetails = () => {
      setLoading(true)
      setTimeout(() => {
        setInterview(getMockDetails(id || '1'))
        setLoading(false)
      }, 500)
    }
    fetchInterviewDetails()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-slate-600 dark:text-gray-400">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-xl font-medium">Analyzing interview report...</p>
      </div>
    )
  }

  if (error || !interview) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Failed to load report</h2>
        <p className="text-slate-600 dark:text-gray-400 mb-6">{error || 'Interview not found'}</p>
        <button 
          onClick={() => navigate('/history')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to History
        </button>
      </div>
    )
  }

  const { title, type, startedAt, endedAt, score, transcript, feedbackRef } = interview
  const feedback = feedbackRef || {}
  const scores = feedback.scores || {
    overall: score || 0,
    communication: 80,
    technical: 75,
    confidence: 85,
    problemSolving: 80
  }
  
  const technicalAnalysis = feedback.technicalAnalysis || {
    idealAnswerComparison: "Comparison is ready. Review ideal responses per question below.",
    missingPoints: [],
    weaknesses: [],
    strengths: []
  }

  const behavioralEvaluation = feedback.behavioralEvaluation || {
    starMethod: {
      score: 0,
      feedback: "No behavioral evaluation available."
    }
  }

  const dateStr = startedAt ? new Date(startedAt).toLocaleDateString() : 'N/A'
  
  const durationStr = startedAt && endedAt 
    ? `${Math.round((new Date(endedAt) - new Date(startedAt)) / 1000 / 60)} mins`
    : 'N/A'

  const getScoreColor = (value) => {
    if (value >= 85) return 'text-green-600 dark:text-green-400 stroke-green-500'
    if (value >= 70) return 'text-yellow-600 dark:text-yellow-400 stroke-yellow-500'
    return 'text-red-600 dark:text-red-400 stroke-red-500'
  }

  // Circular gauge config
  const strokeDasharray = 251.2
  const strokeDashoffset = strokeDasharray - (strokeDasharray * scores.overall) / 100

  // Helper to separate YouTube links from regular links
  const allLinks = [...(feedback.learningLinks || []), ...(feedback.recommendations || [])]
  const youtubeLinks = allLinks.filter(l => l.url.includes('youtube.com') || l.url.includes('youtu.be') || l.title.toLowerCase().includes('youtube'))
  const otherLinks = allLinks.filter(l => !youtubeLinks.includes(l))

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 text-slate-800 dark:text-slate-200">
      
      {/* Dynamic keyframe styles for progress circle animation */}
      <style>{`
        @keyframes progress-circle {
          from { stroke-dashoffset: ${strokeDasharray}; }
          to { stroke-dashoffset: ${strokeDashoffset}; }
        }
        .animate-progress {
          stroke-dasharray: ${strokeDasharray};
          stroke-dashoffset: ${strokeDasharray};
          animation: progress-circle 1.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>

      {/* Top Navigation */}
      <button 
        onClick={() => navigate('/history')}
        className="flex items-center gap-2 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white font-semibold text-base transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to History
      </button>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-[#151924] border border-slate-200 dark:border-gray-800 rounded-3xl p-8 shadow-md transition-colors duration-300">
        <div className="space-y-3">
          <span className="px-3.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full uppercase tracking-wider">
            {type}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">{title || 'Interview Analysis'}</h1>
          <div className="flex flex-wrap gap-5 text-base text-slate-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              <span>{dateStr}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              <span>{durationStr}</span>
            </div>
          </div>
        </div>

        {/* Enlarged overall score circle */}
        <div className="flex items-center gap-6 shrink-0 bg-slate-50/50 dark:bg-[#111423]/40 p-4 rounded-2xl border border-slate-100 dark:border-gray-800/30">
          <div className="relative w-32 h-32 md:w-36 md:h-36">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-slate-100 dark:stroke-gray-800"
                strokeWidth="7"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className={`${getScoreColor(scores.overall)} animate-progress`}
                strokeWidth="7"
                fill="none"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{scores.overall}%</span>
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900 dark:text-gray-200">Overall Score</div>
            <div className="text-sm text-slate-500 dark:text-gray-400">AI Evaluation Index</div>
          </div>
        </div>
      </div>

      {/* Grid: Scores & Technical Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Detailed Scores Card */}
        <div className="lg:col-span-1 bg-white dark:bg-[#151924] border border-slate-200 dark:border-gray-800 rounded-3xl p-6 shadow-md flex flex-col justify-between transition-colors duration-300">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <BarChart2 className="w-6 h-6 text-indigo-500" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Evaluation Breakdown</h3>
            </div>
            
            {/* Custom Bar Graphs for metrics */}
            <div className="space-y-6">
              {[
                { name: 'Technical Depth', val: scores.technical },
                { name: 'Communication', val: scores.communication },
                { name: 'Confidence', val: scores.confidence },
                { name: 'Problem Solving', val: scores.problemSolving }
              ].map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-base font-semibold">
                    <span className="text-slate-700 dark:text-gray-300">{item.name}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{item.val}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-linear-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${item.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-gray-800/80">
            <p className="text-sm text-slate-500 dark:text-gray-400 italic">
              *Scores are derived using GPT evaluation matching your answer's coherence, relevance, and keyword occurrences.
            </p>
          </div>
        </div>

        {/* Technical/Behavioral Analysis Feedback Panel */}
        <div className="lg:col-span-2 bg-white dark:bg-[#151924] border border-slate-200 dark:border-gray-800 rounded-3xl p-6 shadow-md space-y-6 transition-colors duration-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-500" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI Analysis & Observations</h3>
          </div>

          {/* Feedback summary */}
          {feedback.feedbackText && (
            <div className="bg-slate-50 dark:bg-[#111423] border border-slate-100 dark:border-gray-800/50 rounded-2xl p-5 text-slate-700 dark:text-gray-300 leading-relaxed text-base">
              {feedback.feedbackText}
            </div>
          )}

          {/* STAR Method Behavioral Evaluation */}
          {behavioralEvaluation?.starMethod && (
            <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-2 text-sm uppercase tracking-wider">
                  <Trophy className="w-5 h-5 text-indigo-500" />
                  STAR Method Evaluation
                </h4>
                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-bold">
                  Score: {behavioralEvaluation.starMethod.score}%
                </span>
              </div>
              <p className="text-sm text-slate-700 dark:text-indigo-200/80 leading-relaxed">
                {behavioralEvaluation.starMethod.feedback}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-gray-200 flex items-center gap-1.5 text-sm uppercase tracking-wider">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Strengths
              </h4>
              {technicalAnalysis.strengths?.length > 0 ? (
                <ul className="space-y-2 list-disc pl-5 text-base text-slate-600 dark:text-gray-400">
                  {technicalAnalysis.strengths.map((str, i) => <li key={i}>{str}</li>)}
                </ul>
              ) : (
                <p className="text-base text-slate-500 italic">No specific strengths listed.</p>
              )}
            </div>

            {/* Weaknesses */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-gray-200 flex items-center gap-1.5 text-sm uppercase tracking-wider">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Key Weaknesses
              </h4>
              {technicalAnalysis.weaknesses?.length > 0 ? (
                <ul className="space-y-2 list-disc pl-5 text-base text-slate-600 dark:text-gray-400">
                  {technicalAnalysis.weaknesses.map((weak, i) => <li key={i}>{weak}</li>)}
                </ul>
              ) : (
                <p className="text-base text-slate-500 italic">No specific weaknesses listed.</p>
              )}
            </div>
          </div>

          {/* Missing Points list */}
          {technicalAnalysis.missingPoints?.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-gray-800/80">
              <h4 className="font-bold text-slate-900 dark:text-gray-200 text-sm flex items-center gap-1.5 uppercase tracking-wider">
                <Target className="w-5 h-5 text-indigo-400" />
                Missing Key Concepts
              </h4>
              <div className="flex flex-wrap gap-2">
                {technicalAnalysis.missingPoints.map((point, i) => (
                  <span key={i} className="px-3.5 py-1 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-full text-xs font-bold">
                    {point}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full QA Transcript */}
      <div className="bg-white dark:bg-[#151924] border border-slate-200 dark:border-gray-800 rounded-3xl p-6 shadow-md space-y-6 transition-colors duration-300">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-gray-800 pb-4">
          <MessageSquare className="w-6 h-6 text-indigo-500" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Q&A Dialogue Transcript</h3>
        </div>

        {transcript && transcript.length > 0 ? (
          <div className="space-y-8 divide-y divide-slate-100 dark:divide-gray-800/60">
            {transcript.map((item, idx) => (
              <div key={idx} className={`pt-8 first:pt-0 space-y-4`}>
                {/* Question */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                    <span>Question {idx + 1}</span>
                    <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-full text-[10px]">
                      Score: {item.score || 0}%
                    </span>
                  </div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    {item.question}
                  </p>
                </div>

                {/* User Answer (with expand/collapse toggle) */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Your Answer</div>
                  <div className="relative bg-slate-50 dark:bg-[#111423] p-5 rounded-2xl border border-slate-200/50 dark:border-gray-800/40 transition-all duration-300">
                    <div className={`overflow-hidden transition-all duration-300 ${expanded[`${idx}-user`] ? 'max-h-[1000px]' : 'max-h-24'}`}>
                      <p className="text-base text-slate-700 dark:text-gray-300 italic whitespace-pre-wrap leading-relaxed">
                        {item.answer || '🎙️ No answer recorded (Skipped).'}
                      </p>
                    </div>
                    {item.answer && item.answer.length > 120 && (
                      <button 
                        onClick={() => toggleExpand(`${idx}-user`)}
                        className="mt-3 text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        {expanded[`${idx}-user`] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {expanded[`${idx}-user`] ? 'Collapse Answer' : 'Expand Full Answer'}
                      </button>
                    )}
                  </div>
                </div>

                {/* AI Explanation / Feedback (with expand/collapse toggle) */}
                {item.feedback && (
                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">AI Assessment</div>
                    <div className="relative bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-100/30 dark:border-emerald-900/20 p-5 rounded-2xl transition-all duration-300">
                      <div className={`overflow-hidden transition-all duration-300 ${expanded[`${idx}-ai`] ? 'max-h-[1000px]' : 'max-h-24'}`}>
                        <p className="text-base text-slate-600 dark:text-gray-400 leading-relaxed mb-4">
                          {item.feedback}
                        </p>
                        
                        {item.idealAnswer && (
                          <div className="mt-4 pt-4 border-t border-emerald-200/50 dark:border-emerald-800/50">
                            <h5 className="text-sm font-bold text-emerald-800 dark:text-emerald-300 mb-2">Ideal Answer Approach:</h5>
                            <p className="text-sm text-slate-600 dark:text-gray-400 italic">
                              {item.idealAnswer}
                            </p>
                          </div>
                        )}
                        
                        {item.starEvaluation && (
                          <div className="mt-4 pt-4 border-t border-emerald-200/50 dark:border-emerald-800/50">
                            <h5 className="text-sm font-bold text-emerald-800 dark:text-emerald-300 mb-3">STAR Method Breakdown:</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg">
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-500 uppercase">Situation</span>
                                <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">{item.starEvaluation.situation}</p>
                              </div>
                              <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg">
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-500 uppercase">Task</span>
                                <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">{item.starEvaluation.task}</p>
                              </div>
                              <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg">
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-500 uppercase">Action</span>
                                <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">{item.starEvaluation.action}</p>
                              </div>
                              <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg">
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-500 uppercase">Result</span>
                                <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">{item.starEvaluation.result}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      {(item.feedback.length > 120 || item.idealAnswer || item.starEvaluation) && (
                        <button 
                          onClick={() => toggleExpand(`${idx}-ai`)}
                          className="mt-3 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          {expanded[`${idx}-ai`] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          {expanded[`${idx}-ai`] ? 'Collapse Assessment' : 'Expand Full Assessment'}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 italic text-sm">No Q&A transcript entries recorded for this interview session.</p>
        )}
      </div>

      {/* Recommendations & Links */}
      {(youtubeLinks.length > 0 || otherLinks.length > 0) && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-500" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Suggested Resources</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Study Links */}
            {youtubeLinks.length > 0 && (
              <div className="bg-white dark:bg-[#151924] border border-slate-200 dark:border-gray-800 rounded-3xl p-6 shadow-md space-y-4 transition-colors duration-300">
                <h4 className="font-bold text-red-600 dark:text-red-500 flex items-center gap-2 text-base uppercase tracking-wider">
                  <PlayCircle className="w-5 h-5" />
                  AI Suggested YouTube Resources
                </h4>
                <div className="space-y-3">
                  {youtubeLinks.map((link, i) => (
                    <a 
                      key={i} 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 dark:bg-[#111423] dark:hover:bg-gray-800 border border-slate-100 dark:border-gray-800/80 rounded-2xl transition-all shadow-xs"
                    >
                      <span className="font-semibold text-sm text-slate-800 dark:text-gray-200">{link.title}</span>
                      <ExternalLink className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Dynamic recommendations */}
            {otherLinks.length > 0 && (
              <div className="bg-white dark:bg-[#151924] border border-slate-200 dark:border-gray-800 rounded-3xl p-6 shadow-md space-y-4 transition-colors duration-300">
                <h4 className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 text-base uppercase tracking-wider">
                  <ExternalLink className="w-5 h-5" />
                  Recommended Reference Web Links
                </h4>
                <div className="space-y-3">
                  {otherLinks.map((rec, i) => (
                    <a 
                      key={i} 
                      href={rec.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 dark:bg-[#111423] dark:hover:bg-gray-800 border border-slate-100 dark:border-gray-800/80 rounded-2xl transition-all shadow-xs"
                    >
                      <span className="font-semibold text-sm text-slate-800 dark:text-gray-200">{rec.title}</span>
                      <ExternalLink className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recommendations Summary */}
          <div className="bg-linear-to-r from-blue-50/50 to-indigo-50/50 dark:from-indigo-950/20 dark:to-blue-950/20 border border-blue-100 dark:border-indigo-900/30 rounded-3xl p-6 shadow-xs">
            <h4 className="text-base font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Recommendations Summary
            </h4>
            <p className="text-base text-slate-700 dark:text-gray-300 leading-relaxed">
              Based on your evaluation score of <strong>{scores.overall}%</strong>, the AI suggests focusing on the missing concept points mentioned above. Utilizing the curated YouTube video guides and official web reference sheets will help you cover structural design, virtual list management, and cache validation techniques before your next interview round.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
