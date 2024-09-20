// AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

import axios from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('/api/user/signinWithToken', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUser(response.data);
          setIsAuthenticated(true);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        });
    }
  }, []);

  const login = async (email, password) => {
    const response = await axios.post('/api/user/signin', { email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setUser(user);
  };

  const forgotPassword = async (email) => {
    const response = await axios.post('/api/user/forgotPassword', { email });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return <AuthContext.Provider value={{ user, isAuthenticated, login, logout, forgotPassword }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);