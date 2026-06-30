import React, { useState, useEffect } from 'react'
import { Bell, Volume2, Zap, Moon, Save } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useTheme } from '../context/ThemeContext' 

export default function Settings() {
  const { state, updateSettings } = useApp()
  const { theme, toggleTheme } = useTheme() 
  
  const { settings } = state
  const [localSettings, setLocalSettings] = useState(settings)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setLocalSettings(prev => ({
      ...prev,
      darkMode: theme === 'dark'
    }))
  }, [theme])

  const handleToggle = (key) => {
    setLocalSettings({ ...localSettings, [key]: !localSettings[key] })
  }

  const handleDifficultyChange = (difficulty) => {
    setLocalSettings({ ...localSettings, difficultyLevel: difficulty })
  }

  const handleSave = () => {
    updateSettings(localSettings)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
          Settings
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Customize your PrepAI experience.
        </p>
      </div>

      {/* Save Notification */}
      {saved && (
        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4 text-green-700 dark:text-green-400">
          Settings saved successfully!
        </div>
      )}

      {/* Notification Settings */}
      <div className="glass-card rounded-xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center">
            <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Notifications</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg gap-4">
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 dark:text-slate-50">Email Notifications</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Receive updates about your interviews and progress
              </p>
            </div>
            <button
              onClick={() => handleToggle('emailNotifications')}
              className={`relative w-14 h-8 rounded-full transition-colors duration-200 shrink-0 ${
                localSettings.emailNotifications ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-200 ease-in-out ${
                  localSettings.emailNotifications ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-50">Sound Effects</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Enable audio feedback during interviews
              </p>
            </div>
            <button
              onClick={() => handleToggle('soundEnabled')}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                localSettings.soundEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                  localSettings.soundEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Difficulty Settings */}
      <div className="glass-card rounded-xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-950/30 flex items-center justify-center">
            <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Interview Preferences</h2>
        </div>

        <div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-4">Default Difficulty Level</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
              <button
                key={level}
                onClick={() => handleDifficultyChange(level)}
                className={`p-4 rounded-lg font-medium transition-all ${
                  localSettings.difficultyLevel === level
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="glass-card rounded-xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center">
            <Moon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Appearance</h2>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-50">Dark Mode</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {theme === 'dark' ? 'Currently enabled' : 'Currently disabled'}
              </p>
            </div>
            {/* 4. Render interactive slider linked straight to ThemeContext */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                theme === 'dark' ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center text-xs transition-transform ${
                  theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                }`}
              >
                {theme === 'dark' ? '🌙' : '☀️'}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="glass-card rounded-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-6">Account</h2>
        <div className="space-y-3">
          <button className="w-full px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-left">
            Change Password
          </button>
          <button className="w-full px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-left">
            Privacy & Security
          </button>
          <button className="w-full px-6 py-3 bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 rounded-lg font-medium hover:bg-red-200 dark:hover:bg-red-950/50 transition-colors text-left">
            Delete Account
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </div>
    </div>
  )
}