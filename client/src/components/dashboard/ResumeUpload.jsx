import React, { useState, useRef } from 'react'
import { Upload, FileText, Download, Trash2, Check } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import api from '../../api/axios'

export default function ResumeUpload() {
  const { state, updateResume } = useApp()
  const { resume } = state
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleFileSelect = async (file) => {
    updateResume({ uploading: true, uploadProgress: 10 })

    const formData = new FormData()
    formData.append('file', file)

    // Mock Upload Process
    setTimeout(() => {
      updateResume({
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(0)} KB`,
        uploadDate: new Date().toISOString().split('T')[0],
        uploadProgress: 100,
        uploading: false,
      })
    }, 1500)
  }

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleDeleteResume = () => {
    updateResume({
      fileName: null,
      fileSize: null,
      uploadDate: null,
      uploadProgress: 0,
      uploading: false,
    })
  }

  return (
    <div className="glass-card rounded-xl p-6 md:p-8">
      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-6">Resume Upload</h3>

      {!resume.fileName ? (
        <>
          {/* Upload Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              dragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                : 'border-slate-300 dark:border-slate-600 hover:border-blue-500'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleInputChange}
              className="hidden"
            />

            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center">
                <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>

            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
              Drop your resume here
            </h4>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              or click to browse from your computer
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              Supported formats: PDF, DOC, DOCX (Max 10MB)
            </p>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: FileText, title: 'Parse Content', desc: 'We extract and analyze your resume content' },
              { icon: Check, title: 'Auto Check', desc: 'Verify completeness and formatting' },
              { icon: Download, title: 'Easy Access', desc: 'Download anytime for interviews' },
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center mb-3">
                    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h5 className="font-semibold text-slate-900 dark:text-slate-50 mb-1">{feature.title}</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <>
          {/* Resume Uploaded */}
          <div className="space-y-4">
            {resume.uploading && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Uploading... {resume.uploadProgress}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-blue-500 to-indigo-600 transition-all duration-300"
                    style={{ width: `${resume.uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {!resume.uploading && resume.uploadProgress === 100 && (
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                <div>
                  <p className="font-medium text-green-900 dark:text-green-100">Resume uploaded successfully!</p>
                  <p className="text-sm text-green-700 dark:text-green-200">Ready to use in interviews</p>
                </div>
              </div>
            )}

            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950/50 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 dark:text-slate-50 wrap-break-word">
                      {resume.fileName}
                    </h4>
                    <div className="flex gap-4 text-xs text-slate-600 dark:text-slate-400 mt-1">
                      <span>{resume.fileSize}</span>
                      <span>Uploaded on {resume.uploadDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={handleDeleteResume}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-red-100 dark:bg-red-950/30 hover:bg-red-200 dark:hover:bg-red-950/50 text-red-700 dark:text-red-400 rounded-lg font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
