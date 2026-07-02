import React, { useState, useEffect, useRef } from 'react'
import { Upload, FileText, Check, Download, Trash2, Sparkles, Target, ShieldCheck, Loader2, AlertCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { userService } from '../services/userService'
import { aiService } from '../services/aiService'
import toast from 'react-hot-toast'

export default function Resume() {
  const { state, updateResume } = useApp()
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)

  // AI Analysis State
  const [analyzingId, setAnalyzingId] = useState(null)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [analysisError, setAnalysisError] = useState(null)

  const fileInputRef = useRef(null)
  const analysisRef = useRef(null)

  // Fetch all resumes from backend on load
  const fetchResumes = async () => {
    setLoading(true)
    try {
      const res = await userService.getProfile()
      if (res.data && res.data.resumes) {
        setResumes(res.data.resumes.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)))
      }
    } catch (err) {
      console.error('Failed to fetch resumes:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResumes()
  }, [])

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  // Local File Upload
  const handleFileUpload = async (file) => {
    if (!file) return
    setUploading(true)
    setUploadProgress(20)

    const interval = setInterval(() => {
      setUploadProgress(prev => (prev < 90 ? prev + 15 : prev))
    }, 150)

    try {
      const res = await userService.uploadResume(file);
      
      clearInterval(interval)
      setUploadProgress(100)
      
      const newResume = res.data;
      setResumes(prev => [newResume, ...prev])
      updateResume({
        fileName: newResume.originalName || newResume.filename,
        fileSize: formatBytes(newResume.size),
        uploadDate: new Date().toLocaleDateString(),
        uploadProgress: 100,
        uploading: false
      })
      toast.success('Resume uploaded successfully!')
    } catch (err) {
      clearInterval(interval)
      setUploadProgress(0)
      console.error('Failed to upload resume:', err)
      toast.error('Failed to upload resume to server.')
    } finally {
      setTimeout(() => {
        setUploading(false)
        setUploadProgress(0)
      }, 500)
    }
  }

  // Trigger Resume parsing & AI analysis
  const handleAnalyzeResume = async (resumeId, filename) => {
    setAnalyzingId(resumeId)
    setAnalysisResult(null)
    setAnalysisError(null)

    // Scroll smoothly to analysis board loader as soon as it mounts
    setTimeout(() => {
      analysisRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)

    try {
      const res = await aiService.analyzeResume(resumeId)
      setAnalysisResult(res.data.result)
    } catch (err) {
      console.error('Analysis failed:', err)
      setAnalysisError(true)
    } finally {
      setAnalyzingId(null)
      // Scroll again once full analysis mounts to accommodate height change
      setTimeout(() => {
        analysisRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }

  // Delete Resume
  const handleDeleteResume = async (resumeId) => {
    try {
      setResumes(prev => prev.filter(r => r._id !== resumeId))
      if (resumes.length <= 1) {
        updateResume({
          fileName: null,
          fileSize: null,
          uploadDate: null,
          uploadProgress: 0,
          uploading: false
        })
      }
    } catch (error) {
      console.error('Error deleting resume:', error)
    }
  }

  // Helper formats
  const formatBytes = (bytes, decimals = 2) => {
    if (!bytes || bytes === 0) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">

      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
          Resume Hub
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Upload, manage, and analyze your CVs with our AI Recruiter tool to optimize job matching.
        </p>
      </div>

      {/* Main Grid: Upload & History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Drag and Drop Uploader */}
        <div className="bg-white dark:bg-[#151924] border border-slate-200 dark:border-gray-800 rounded-3xl p-6 shadow-md flex flex-col justify-between transition-colors duration-300">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-500" />
              Upload Resume
            </h3>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[220px] ${dragActive
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20'
                  : 'border-slate-300 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-slate-50/50 dark:bg-[#111423]/40'
                }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleInputChange}
                className="hidden"
              />

              <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center mb-4 border border-indigo-100 dark:border-indigo-900/30">
                <Upload className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>

              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Drag & Drop file here
              </h4>
              <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">
                or click to browse from files
              </p>
              <p className="text-xs text-slate-400 dark:text-gray-500 mt-2">
                Supports PDF, DOC, DOCX up to 10MB
              </p>
            </div>

            {/* Upload Progress Bar */}
            {uploading && (
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">Uploading File...</span>
                  <span className="font-bold text-slate-700 dark:text-gray-300">{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-gray-800/80 flex items-center gap-2 text-xs text-slate-500 dark:text-gray-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Files are encrypted and stored securely. Deleted items are fully wiped.</span>
          </div>
        </div>

        {/* Uploaded History List */}
        <div className="bg-white dark:bg-[#151924] border border-slate-200 dark:border-gray-800 rounded-3xl p-6 shadow-md transition-colors duration-300 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" />
              Resume Vault History
            </h3>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
                <span className="text-sm font-medium">Retrieving vault history...</span>
              </div>
            ) : resumes.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-200 dark:border-gray-800 rounded-2xl">
                <FileText className="w-12 h-12 text-slate-300 dark:text-gray-700 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-gray-400 text-sm">No resumes uploaded yet.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                {resumes.map((resume) => (
                  <div
                    key={resume._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-100 dark:bg-[#111423] border border-slate-100 dark:border-gray-800/60 rounded-2xl hover:border-slate-200 dark:hover:border-gray-700 transition-all gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-red-500 dark:text-red-400" />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-sm text-slate-800 dark:text-gray-200 truncate max-w-[220px]" title={resume.filename}>
                          {resume.filename}
                        </h4>
                        <div className="flex gap-3 text-xs text-slate-500 dark:text-gray-400 mt-1">
                          <span>{formatBytes(resume.size)}</span>
                          <span>Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAnalyzeResume(resume._id, resume.filename)}
                        disabled={analyzingId !== null}
                        className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 flex items-center gap-1 transition-all disabled:opacity-50"
                      >
                        {analyzingId === resume._id ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            Analyze
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDeleteResume(resume._id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Analysis Result Board */}
      {(analyzingId || analysisResult || analysisError) && (
        <div ref={analysisRef} className="bg-white dark:bg-[#151924] border border-slate-200 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-md space-y-6 transition-colors duration-300 animate-in slide-in-from-bottom-8 duration-500">

          <div className="flex items-center justify-between border-b border-slate-100 dark:border-gray-800 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-500" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">AI Recruiter Profile Analysis</h3>
            </div>
            {analyzingId && (
              <span className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 font-bold">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing resume...
              </span>
            )}
          </div>

          {analyzingId && !analysisResult ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500 space-y-4">
              <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
              <div className="text-center">
                <p className="text-lg font-bold text-slate-800 dark:text-white">Analyzing Resume Content</p>
                <p className="text-sm text-slate-500 dark:text-gray-400">Groq Recruiter is extracting key skills and benchmarking professional history...</p>
              </div>
            </div>
          ) : analysisResult ? (
            <div className="space-y-6 text-base leading-relaxed">

              {/* Executive Summary */}
              {analysisResult.summary && (
                <div className="bg-slate-100 dark:bg-[#111423] p-5 rounded-2xl border border-slate-200/40 dark:border-gray-800/40">
                  <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Executive Summary</h4>
                  <p className="text-slate-700 dark:text-gray-300">{analysisResult.summary}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Extracted Skills */}
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2 uppercase tracking-wider">
                    <Target className="w-5 h-5 text-indigo-500" />
                    Extracted Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.skills?.map((skill, idx) => (
                      <span key={idx} className="px-3.5 py-1 bg-blue-50 dark:bg-indigo-950/80 text-blue-600 dark:text-indigo-400 border border-blue-100 dark:border-indigo-900/30 rounded-full text-sm font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Suggested Roles */}
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2 uppercase tracking-wider">
                    <Sparkles className="w-5 h-5 text-indigo-500" />
                    Suggested Job Roles
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.suggestedRoles?.map((role, idx) => (
                      <span key={idx} className="px-3.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/20 rounded-full text-sm font-semibold">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Work Experience */}
              {analysisResult.experience && (
                <div className="pt-4 border-t border-slate-100 dark:border-gray-800/80">
                  <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Work Experience Overview</h4>
                  <p className="text-slate-700 dark:text-gray-300">{analysisResult.experience}</p>
                </div>
              )}

              {/* Education */}
              {analysisResult.education && (
                <div className="pt-4 border-t border-slate-100 dark:border-gray-800/80">
                  <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Education Background</h4>
                  <p className="text-slate-700 dark:text-gray-300">{analysisResult.education}</p>
                </div>
              )}

            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span>Failed to analyze this resume. Please ensure it contains structured text or try a different file format.</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
