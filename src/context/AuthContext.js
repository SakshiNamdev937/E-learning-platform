import React, { createContext, useState, useEffect } from 'react';
import mockUsers from '../data/users.json';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const localUsers = localStorage.getItem('edusphere_users');
    return localUsers ? JSON.parse(localUsers) : mockUsers;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const localUser = localStorage.getItem('edusphere_current_user');
    if (localUser) {
      return JSON.parse(localUser);
    }
    // Default to the first student user (Jane Doe) for an immediate logged-in experience
    const defaultUser = mockUsers.find(u => u.role === 'Student');
    localStorage.setItem('edusphere_current_user', JSON.stringify(defaultUser));
    return defaultUser;
  });

  useEffect(() => {
    localStorage.setItem('edusphere_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('edusphere_current_user', JSON.stringify(currentUser));
      // Keep main users list in sync if current user's fields change
      setUsers(prev => prev.map(u => u.id === currentUser.id ? currentUser : u));
    } else {
      localStorage.removeItem('edusphere_current_user');
    }
  }, [currentUser]);

  const login = (email, password) => {
    // Basic mock authentication: find user by email.
    // If password is 'password' (or any, since this is mock), we authenticate
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      if (foundUser.status === 'Suspended') {
        throw new Error('Your account has been suspended. Please contact support.');
      }
      const normalizedUser = {
        ...foundUser,
        role: foundUser.role && foundUser.role.toLowerCase() === 'admin' ? 'Admin' : 'Student'
      };
      setCurrentUser(normalizedUser);
      return normalizedUser;
    } else {
      throw new Error('Invalid email or password.');
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const signup = (name, email, mobile, role = 'Student') => {
    const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      throw new Error('Email is already registered.');
    }
    const normalizedRole = role && role.toLowerCase() === 'admin' ? 'Admin' : 'Student';
    const newUser = {
      id: `user_${Date.now()}`,
      name,
      email,
      mobile,
      role: normalizedRole,
      status: 'Active',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150`, // default avatar
      joinDate: new Date().toISOString().split('T')[0],
      enrolledCourses: [],
      certificates: []
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return newUser;
  };

  const enrollInCourse = (courseId) => {
    if (!currentUser) return;
    const alreadyEnrolled = currentUser.enrolledCourses?.some(c => c.courseId === courseId);
    if (alreadyEnrolled) return;

    const updatedUser = {
      ...currentUser,
      enrolledCourses: [
        ...(currentUser.enrolledCourses || []),
        {
          courseId,
          progress: 0,
          lastAccessed: new Date().toISOString().split('T')[0]
        }
      ]
    };
    setCurrentUser(updatedUser);
  };

  const updateCourseProgress = (courseId, progressPercent) => {
    if (!currentUser) return;
    
    // Update progress
    let updatedCourses = (currentUser.enrolledCourses || []).map(item => {
      if (item.courseId === courseId) {
        return {
          ...item,
          progress: Math.min(progressPercent, 100),
          lastAccessed: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    });

    // Check if newly completed (100%) and add certificate if it doesn't exist
    let updatedCertificates = [...(currentUser.certificates || [])];
    const isCompleted = progressPercent >= 100;
    const certExists = updatedCertificates.some(c => c.courseId === courseId);
    
    if (isCompleted && !certExists) {
      updatedCertificates.push({
        id: `cert_${Date.now()}`,
        courseId,
        issueDate: new Date().toISOString().split('T')[0],
        credentialUrl: "#"
      });
    }

    const updatedUser = {
      ...currentUser,
      enrolledCourses: updatedCourses,
      certificates: updatedCertificates
    };
    setCurrentUser(updatedUser);
  };

  const updateProfileInfo = (info) => {
    if (!currentUser) return;
    setCurrentUser(prev => ({
      ...prev,
      ...info
    }));
  };

  // Admin-only functions
  const deleteUser = (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    if (currentUser?.id === userId) {
      setCurrentUser(null);
    }
  };

  const updateUserStatus = (userId, status) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => ({ ...prev, status }));
    }
  };

  const updateUserRole = (userId, role) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => ({ ...prev, role }));
    }
  };

  const createAdminUser = (userData) => {
    const emailExists = users.some(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (emailExists) {
      throw new Error('Email is already registered.');
    }
    const newUser = {
      id: `user_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      mobile: userData.mobile,
      role: userData.role || 'Student',
      status: userData.status || 'Active',
      avatar: userData.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150`,
      joinDate: new Date().toISOString().split('T')[0],
      enrolledCourses: [],
      certificates: []
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUserInfo = (userId, updatedData) => {
    if (updatedData.email) {
      const emailExists = users.some(u => u.id !== userId && u.email.toLowerCase() === updatedData.email.toLowerCase());
      if (emailExists) {
        throw new Error('Email is already registered by another account.');
      }
    }
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedData } : u));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => ({ ...prev, ...updatedData }));
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      users,
      isAuthenticated: !!currentUser,
      isAdmin: currentUser?.role === 'Admin',
      login,
      logout,
      signup,
      enrollInCourse,
      updateCourseProgress,
      updateProfileInfo,
      deleteUser,
      updateUserStatus,
      updateUserRole,
      createAdminUser,
      updateUserInfo
    }}>
      {children}
    </AuthContext.Provider>
  );
};
