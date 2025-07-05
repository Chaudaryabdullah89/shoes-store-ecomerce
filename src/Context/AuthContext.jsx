import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();
export default AuthContext;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to load user and token from localStorage
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    console.log('AuthContext - Loading from localStorage:', { storedUser: !!storedUser, storedToken: !!storedToken });
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      console.log('AuthContext - User loaded from localStorage');
    } else {
      console.log('AuthContext - No stored user/token found');
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    console.log('AuthContext - Login called with:', { userData, hasToken: !!authToken });
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
    console.log('AuthContext - User logged in and stored');
  };

  const logout = () => {
    console.log('AuthContext - Logout called');
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    console.log('AuthContext - User logged out and cleared');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
} 