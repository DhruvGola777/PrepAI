import React, { useState, useEffect } from 'react'
import { Bell, Volume2, Zap, Moon, Save } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useTheme } from '../context/ThemeContext' 
import { userService } from '../services/userService'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function Settings() {
  const { state, updateSettings } = useApp()
  const { theme, toggleTheme } = useTheme() 
  
  const { settings } = state
  const [localSettings, setLocalSettings] = useState(settings)
  const navigate = useNavigate()

  // Change Password State
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' })
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // Delete Account State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    setLocalSettings(prev => ({
      ...prev,
      darkMode: theme === 'dark'
    }))
  }, [theme])

  const handleToggle = (key) => {
    setLocalSettings({ ...localSettings, [key]: !localSettings[key] })
  }



  const handleSave = async () => {
    try {
      await userService.updateProfile({ settings: localSettings })
      updateSettings(localSettings)
      toast.success('Settings saved successfully!')
    } catch (error) {
      console.error('Failed to save settings:', error)
      toast.error('Failed to save settings to server.')
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }
    setIsChangingPassword(true)
    try {
      await authService.changePassword(passwordData.oldPassword, passwordData.newPassword)
      toast.success('Password changed successfully!')
      setShowChangePassword(false)
      setPasswordData({ oldPassword: '', newPassword: '' })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password')
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      await userService.deleteAccount()
      toast.success('Account deleted permanently')
      localStorage.removeItem('token')
      window.location.href = '/'
    } catch (error) {
      toast.error('Failed to delete account')
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
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
        <div className="space-y-4">
          
          {/* Change Password Toggle */}
          {!showChangePassword ? (
            <button 
              onClick={() => setShowChangePassword(true)}
              className="w-full px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-left"
            >
              Change Password
            </button>
          ) : (
            <form onSubmit={handleChangePassword} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg space-y-4 border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-slate-50">Change Password</h3>
              <input
                type="password"
                placeholder="Old Password"
                required
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500"
              />
              <input
                type="password"
                placeholder="New Password"
                required
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500"
              />
              <div className="flex gap-2">
                <button type="submit" disabled={isChangingPassword} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                  {isChangingPassword ? "Saving..." : "Save Password"}
                </button>
                <button type="button" onClick={() => setShowChangePassword(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Delete Account Toggle */}
          {!showDeleteConfirm ? (
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full px-6 py-3 bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 rounded-lg font-medium hover:bg-red-200 dark:hover:bg-red-950/50 transition-colors text-left"
            >
              Delete Account
            </button>
          ) : (
            <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg space-y-4 border border-red-200 dark:border-red-900/50">
              <h3 className="font-bold text-red-700 dark:text-red-400">Are you absolutely sure?</h3>
              <p className="text-sm text-red-600 dark:text-red-300">This action cannot be undone. All of your data, interviews, and analytics will be permanently deleted.</p>
              <div className="flex gap-2">
                <button onClick={handleDeleteAccount} disabled={isDeleting} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
                  {isDeleting ? "Deleting..." : "Yes, Delete My Account"}
                </button>
                <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600">
                  Cancel
                </button>
              </div>
            </div>
          )}
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