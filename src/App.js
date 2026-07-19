import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { AuthProvider } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';
import { WishlistProvider } from './context/WishlistContext';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Pages
import { Home } from './pages/Home';
import { CourseList } from './pages/CourseList';
import { CourseDetail } from './pages/CourseDetail';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { StudentDashboard } from './pages/StudentDashboard';
import { AdminCourses } from './pages/AdminCourses';
import { AdminUsers } from './pages/AdminUsers';
import { UserProfile } from './pages/UserProfile';

function App() {
  return (
    <AuthProvider>
      <CourseProvider>
        <WishlistProvider>
          <Routes>
            
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="courses" element={<CourseList />} />
              <Route path="courses/:id" element={<CourseDetail />} />
            </Route>

            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
            </Route>

            {/* Student Dashboard Routes */}
            <Route path="dashboard" element={<DashboardLayout />}>
              <Route index element={<StudentDashboard />} />
              <Route path="profile" element={<UserProfile />} />
              {/* Optional subpage fallback */}
              <Route path="courses" element={<StudentDashboard />} />
            </Route>

            {/* Admin Control Center Routes */}
            <Route path="admin" element={<AdminLayout />}>
              <Route path="courses" element={<AdminCourses />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="users/:id" element={<UserProfile />} />
              {/* Redirect /admin to /admin/courses */}
              <Route index element={<Navigate to="courses" replace />} />
            </Route>

            {/* Fallback Catch-All */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </WishlistProvider>
      </CourseProvider>
    </AuthProvider>
  );
}

export default App;
