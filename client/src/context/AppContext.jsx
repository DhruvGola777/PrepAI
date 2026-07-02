import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { userService } from '../services/userService';
import toast from 'react-hot-toast';

const AppContext = createContext()

const initialState = {
  user: null, // Will hold authenticated user profile
  resume: {
    fileName: '',
    fileSize: '',
    uploadDate: '',
    uploadProgress: 0,
    uploading: false,
  },
  interviewHistory: [],
  stats: null, // Will hold fetched stats
  settings: {
    emailNotifications: true,
    darkMode: true,
    soundEnabled: true,
  },
  aiRecommendations: []
}

function appReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE_DATA': {
      const user = action.payload.user;
      let resumeState = { ...state.resume };
      if (user?.resumes?.length > 0) {
        const currentResume = user.currentResumeId 
          ? user.resumes.find(r => r._id === user.currentResumeId) || user.resumes[user.resumes.length - 1]
          : user.resumes[user.resumes.length - 1];
        
        if (currentResume) {
          resumeState = {
            ...resumeState,
            fileName: currentResume.originalName || currentResume.filename || 'resume.pdf',
            fileSize: currentResume.size ? `${(currentResume.size / 1024).toFixed(0)} KB` : 'Unknown size',
            uploadDate: currentResume.uploadedAt ? new Date(currentResume.uploadedAt).toISOString().split('T')[0] : '',
            uploadProgress: 100,
            uploading: false,
          };
        }
      }

      return {
        ...state,
        user: { ...state.user, ...user },
        resume: resumeState,
        stats: action.payload.stats,
        interviewHistory: action.payload.interviewHistory,
        aiRecommendations: action.payload.aiRecommendations,
      }
    }
    case 'LOGIN_SUCCESS': {
      return {
        ...state,
        user: action.payload,
      }
    }
    case 'LOGOUT': {
      return initialState;
    }
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
    case 'UPDATE_INTERVIEW': {
      return {
        ...state,
        interviewHistory: state.interviewHistory.map((i) => 
          (i._id || i.id) === action.payload.id ? { ...i, ...action.payload.data } : i
        ),
      }
    }
    case 'DELETE_INTERVIEW': {
      return {
        ...state,
        interviewHistory: state.interviewHistory.filter((i) => (i._id || i.id) !== action.payload),
        stats: state.stats ? {
          ...state.stats,
          totalInterviews: Math.max(0, state.stats.totalInterviews - 1)
        } : null,
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
    case 'SET_INTERVIEWS': {
      return {
        ...state,
        interviewHistory: action.payload,
      }
    }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const [profileRes, statsRes, interviewsRes, recsRes] = await Promise.all([
            userService.getProfile(),
            userService.getScoreSummary(),
            userService.getInterviews(),
            userService.getRecommendations()
          ]);
          
          dispatch({ 
            type: 'HYDRATE_DATA', 
            payload: {
              user: profileRes.data,
              stats: statsRes.data,
              interviewHistory: interviewsRes.data,
              aiRecommendations: recsRes.data
            } 
          });
        } catch (err) {
          console.error("Failed to hydrate data:", err);
          if (err.response?.status === 401) {
            localStorage.removeItem('token');
            dispatch({ type: 'LOGOUT' });
          }
        }
      }
    };
    initAuth();
  }, []);

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
    updateInterview: async (id, data) => {
      try {
        await userService.updateInterview(id, data);
        dispatch({ type: 'UPDATE_INTERVIEW', payload: { id, data } });
        toast.success("Interview updated successfully!");
      } catch (err) {
        console.error("Failed to update interview:", err);
        toast.error("Failed to update interview.");
      }
    },
    deleteInterview: async (id) => {
      try {
        await userService.deleteInterview(id);
        dispatch({ type: 'DELETE_INTERVIEW', payload: id });
        toast.success("Interview deleted successfully!");
        
        // Refresh stats to ensure average score and counts are accurate
        try {
          const statsRes = await userService.getScoreSummary();
          dispatch({ type: 'UPDATE_STATS', payload: statsRes.data });
        } catch (statsErr) {
          console.error("Failed to refresh stats:", statsErr);
        }
      } catch (err) {
        console.error("Failed to delete interview:", err);
        toast.error("Failed to delete interview.");
      }
    },
    refreshInterviews: async () => {
      try {
        const res = await userService.getInterviews();
        dispatch({ type: 'SET_INTERVIEWS', payload: res.data });
      } catch (err) {
        console.error("Failed to refresh interviews:", err);
      }
    },
    
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
