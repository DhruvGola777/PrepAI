import { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { userService } from '../services/userService';

export const useUser = () => {
  const { dispatch } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [profileRes, statsRes, interviewsRes] = await Promise.all([
        userService.getProfile(),
        userService.getScoreSummary(),
        userService.getInterviews()
      ]);
      
      dispatch({ 
        type: 'HYDRATE_DATA', 
        payload: {
          user: profileRes.data,
          stats: statsRes.data,
          interviewHistory: interviewsRes.data
        } 
      });
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user data');
      // If unauthorized, clear token and logout
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const updateProfile = async (data) => {
    setIsLoading(true);
    try {
      const response = await userService.updateProfile(data);
      dispatch({ type: 'UPDATE_USER', payload: response.data });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message };
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchUserData, updateProfile, isLoading, error };
};
