import React, { createContext, useContext, useReducer } from 'react'

const AppContext = createContext()

const initialState = {
  user: {
    id: 'user-001',
    name: 'Sarah Johnson',
    title: 'Software Engineer',
    email: 'sarah.johnson@example.com',
    location: 'San Francisco, CA',
    avatar: 'SJ',
    bio: 'Passionate about technology and continuous learning',
    phone: '+1 (555) 123-4567',
    editMode: false,
  },
  resume: {
    fileName: 'Sarah_Johnson_Resume.pdf',
    fileSize: '245 KB',
    uploadDate: '2024-06-15',
    uploadProgress: 100,
    uploading: false,
  },
  interviewHistory: [
    {
      id: 1,
      title: 'React Technical Interview',
      difficulty: 'Intermediate',
      score: 87,
      status: 'completed',
      duration: '45 mins',
      date: '2024-06-20',
      feedbackLink: '#',
    },
    {
      id: 2,
      title: 'System Design Interview',
      difficulty: 'Advanced',
      score: null,
      status: 'running',
      duration: 'In Progress',
      date: '2024-06-18',
      feedbackLink: '#',
    },
    {
      id: 3,
      title: 'JavaScript Fundamentals',
      difficulty: 'Beginner',
      score: null,
      status: 'draft',
      duration: 'Not Started',
      date: '2024-06-16',
      feedbackLink: '#',
    },
    {
      id: 4,
      title: 'Node.js and Backend',
      difficulty: 'Intermediate',
      score: 81,
      status: 'completed',
      duration: '50 mins',
      date: '2024-06-14',
      feedbackLink: '#',
    },
    {
      id: 5,
      title: 'Database Design',
      difficulty: 'Advanced',
      score: 78,
      status: 'completed',
      duration: '55 mins',
      date: '2024-06-12',
      feedbackLink: '#',
    },
  ],
  stats: {
    totalInterviews: 24,
    averageScore: 84,
    currentStreak: 7,
    completedThisMonth: 12,
  },
  settings: {
    emailNotifications: true,
    difficultyLevel: 'Intermediate',
    darkMode: true,
    soundEnabled: true,
  },
}

function appReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_USER': {
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      }
    }
    case 'TOGGLE_EDIT_MODE': {
      return {
        ...state,
        user: { ...state.user, editMode: !state.user.editMode },
      }
    }
    case 'UPDATE_RESUME': {
      return {
        ...state,
        resume: { ...state.resume, ...action.payload },
      }
    }
    case 'ADD_INTERVIEW': {
      return {
        ...state,
        interviewHistory: [action.payload, ...state.interviewHistory],
        stats: {
          ...state.stats,
          totalInterviews: state.stats.totalInterviews + 1,
          completedThisMonth: state.stats.completedThisMonth + 1,
        },
      }
    }
    case 'UPDATE_SETTINGS': {
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      }
    }
    case 'UPDATE_STATS': {
      return {
        ...state,
        stats: { ...state.stats, ...action.payload },
      }
    }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const value = {
    state,
    dispatch,
    // User actions
    updateUser: (userData) => dispatch({ type: 'UPDATE_USER', payload: userData }),
    toggleEditMode: () => dispatch({ type: 'TOGGLE_EDIT_MODE' }),
    
    // Resume actions
    updateResume: (resumeData) => dispatch({ type: 'UPDATE_RESUME', payload: resumeData }),
    
    // Interview actions
    addInterview: (interview) => dispatch({ type: 'ADD_INTERVIEW', payload: interview }),
    
    // Settings actions
    updateSettings: (settings) => dispatch({ type: 'UPDATE_SETTINGS', payload: settings }),
    
    // Stats actions
    updateStats: (stats) => dispatch({ type: 'UPDATE_STATS', payload: stats }),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
