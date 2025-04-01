// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // On mount, check if there's a currently logged-in user
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Also check if we have ANY registered users at all
    // If not, create a default user
    const registeredUsers = localStorage.getItem('registeredUsers');
    if (!registeredUsers) {
      const defaultUsers = [
        {
          email: 'test@example.com',
          password: '123456'
        }
      ];
      localStorage.setItem('registeredUsers', JSON.stringify(defaultUsers));
    }
  }, []);

  // Helper: read array of users
  const getRegisteredUsers = () => {
    const usersJSON = localStorage.getItem('registeredUsers');
    return usersJSON ? JSON.parse(usersJSON) : [];
  };

  // Helper: write array of users
  const saveRegisteredUsers = (usersArray) => {
    localStorage.setItem('registeredUsers', JSON.stringify(usersArray));
  };

  // Sign up
  const signup = (email, password) => {
    const users = getRegisteredUsers();
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('Email already registered');
    }
    users.push({ email, password });
    saveRegisteredUsers(users);
    return true;
  };

  // Login
  const login = (email, password) => {
    const users = getRegisteredUsers();
    const existingUser = users.find(u => u.email === email && u.password === password);
    if (!existingUser) {
      throw new Error('Invalid credentials');
    }
    setUser(existingUser);
    localStorage.setItem('user', JSON.stringify(existingUser));
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
