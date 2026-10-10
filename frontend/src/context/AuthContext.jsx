import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('jharkhand_token'));
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('jharkhand_token');
      if (storedToken) {
        try {
          const userData = await api.auth.getMe();
          setUser(userData);
          loadNotifications();
        } catch (err) {
          console.error("Auth check failed:", err);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const loadNotifications = async () => {
    try {
      const notifs = await api.audit.getNotifications();
      setNotifications(notifs);
    } catch (err) {
      // ignore if unauthenticated
    }
  };

  const login = async (email, password) => {
    const data = await api.auth.login(email, password);
    localStorage.setItem('jharkhand_token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    loadNotifications();
    return data.user;
  };

  const register = async (userData) => {
    const data = await api.auth.register(userData);
    localStorage.setItem('jharkhand_token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  };

  const switchDemoRole = async (role) => {
    const data = await api.auth.switchDemoRole(role);
    localStorage.setItem('jharkhand_token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    loadNotifications();
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('jharkhand_token');
    setToken(null);
    setUser(null);
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      switchDemoRole,
      logout,
      notifications,
      unreadCount,
      refreshNotifications: loadNotifications
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
