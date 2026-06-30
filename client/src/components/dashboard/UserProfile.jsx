import React, { useState } from 'react'
import { Mail, MapPin, Edit2, Save, X, Briefcase, Code } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function UserProfile() {
  const { state, updateUser, toggleEditMode } = useApp()
  const { user } = state
  const [formData, setFormData] = useState(user)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSave = () => {
    // Keep local updates without calling API as requested
    updateUser({
      ...formData,
      experienceYears: Number(formData.experienceYears) || 0,
      skills: typeof formData.skills === 'string' 
        ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) 
        : (formData.skills || [])
    })
    toggleEditMode()
  }

  const handleCancel = () => {
    setFormData(user)
    toggleEditMode()
  }

  if (user.editMode) {
    return (
      <div className="glass-card rounded-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-6">Edit Profile</h2>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Experience (Years)
              </label>
              <input
                type="number"
                name="experienceYears"
                value={formData.experienceYears || ''}
                onChange={handleChange}
                min="0"
                max="70"
                className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Skills (comma separated)
            </label>
            <input
              type="text"
              name="skills"
              value={Array.isArray(formData.skills) ? formData.skills.join(', ') : (formData.skills || '')}
              onChange={handleChange}
              placeholder="e.g. React, Node.js, Python"
              className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-2 px-6 py-2 bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-slate-50 rounded-lg font-medium hover:bg-slate-400 dark:hover:bg-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between md:gap-8">
        {/* Left: Avatar and Basic Info */}
        <div className="flex items-center gap-4 mb-6 md:mb-0">
          <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {user.avatar}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{user.name}</h2>
            <p className="text-blue-600 dark:text-blue-400 font-medium">
              {user.experienceYears != null ? `${user.experienceYears} Years Experience` : ''}
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{user.bio}</p>
          </div>
        </div>

        {/* Right: Contact Info and Button */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Mail className="w-4 h-4" />
            <span className="text-sm">{user.email}</span>
          </div>
          {user.skills && user.skills.length > 0 && (
            <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
              <Code className="w-4 h-4 mt-0.5 shrink-0" />
              <span className="text-sm leading-tight">{user.skills.join(', ')}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{user.location}</span>
          </div>
          <button
            onClick={toggleEditMode}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors w-full md:w-auto justify-center md:justify-start"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  )
}
