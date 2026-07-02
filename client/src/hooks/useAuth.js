import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const { dispatch } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      const { accessToken, user } = response.data;
      localStorage.setItem('token', accessToken);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      toast.success('Logged in successfully!');
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register(userData);
      const { accessToken, user } = response.data;
      localStorage.setItem('token', accessToken);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      toast.success('Registered successfully!');
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.forgotPassword(email);
      toast.success(response.data.message || 'Password reset link sent!');
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Backend logout failed', err);
    } finally {
      localStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' });
      toast.success('Logged out successfully!');
    }
  };

  return { login, register, forgotPassword, logout, isLoading, error };
};
