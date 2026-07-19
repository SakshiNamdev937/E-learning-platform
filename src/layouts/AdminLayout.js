import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';
import {
  BookOpen, Users, FolderKanban, ShieldAlert, LogOut,
  Menu, X, Bell, LayoutGrid, ArrowLeftRight
} from 'lucide-react';

export const AdminLayout = () => {
  const { currentUser, logout, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Admin Route Guard
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!currentUser || currentUser.role?.toLowerCase() !== 'admin') {
      // Redirect students trying to access admin
      navigate('/dashboard');
    }
  }, [isAuthenticated, currentUser, navigate]);

  if (!currentUser || currentUser.role?.toLowerCase() !== 'admin') return null;

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const sidebarLinks = [
    { label: 'Manage Courses', path: '/admin/courses', icon: FolderKanban },
    { label: 'Manage Users', path: '/admin/users', icon: Users },
    { label: 'Profile', path: '/admin/profile', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Desktop Sidebar */}
      <aside
        className={`
          bg-neutral-900 text-neutral-300 fixed inset-y-0 left-0 z-30 transition-all duration-300
          ${sidebarOpen ? 'w-64' : 'w-20'}
          hidden md:flex flex-col justify-between p-4 border-r border-neutral-800
        `}
      >
        <div className="space-y-6">
          {/* Logo brand */}
          <div className={`flex items-center gap-3 px-2 ${sidebarOpen ? '' : 'justify-center'}`}>
            <Link to="/" className="flex items-center gap-2 group">
              <div className="h-10 w-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-md shadow-primary-500/20">
                <BookOpen className="h-5.5 w-5.5" />
              </div>
              {sidebarOpen && (
                <span className="font-heading font-bold text-lg text-white group-hover:text-primary-400 transition-colors">
                  EduSphere
                </span>
              )}
            </Link>
          </div>

          <div className="px-2">
            {sidebarOpen && (
              <Badge variant="primary" className="bg-primary-950 text-primary-400 border-primary-900 py-1 px-3 w-full justify-center">
                System Administration
              </Badge>
            )}
          </div>

          {/* Admin Navigation */}
          <nav className="space-y-1.5 pt-2">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path || (link.path === '/admin/users' && location.pathname.startsWith('/admin/users/'));
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors
                    ${isActive
                      ? 'bg-neutral-800 text-white border-l-2 border-primary-500'
                      : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-white'
                    }
                    ${!sidebarOpen && 'justify-center'}
                  `}
                  title={link.label}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-primary-400' : 'text-neutral-500'}`} />
                  {sidebarOpen && <span>{link.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="space-y-1.5 border-t border-neutral-800 pt-4">
          <Link
            to="/dashboard"
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-neutral-400 hover:bg-neutral-800 hover:text-white w-full
              ${!sidebarOpen && 'justify-center'}
            `}
            title="Go to Student View"
          >
            <ArrowLeftRight className="h-5 w-5 text-neutral-500" />
            {sidebarOpen && <span>Student Dashboard</span>}
          </Link>
          <button
            onClick={logout}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 w-full text-left
              ${!sidebarOpen && 'justify-center'}
            `}
            title="Sign Out"
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Sidebar */}
      {!sidebarOpen && (
        <div
          className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      <aside
        className={`
          bg-neutral-900 text-neutral-300 fixed inset-y-0 left-0 w-64 z-50 p-4 flex flex-col justify-between transition-transform duration-300 md:hidden
          ${!sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary-600 flex items-center justify-center text-white">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="font-heading font-bold text-base text-white">
                EduSphere
              </span>
            </Link>
            <button onClick={toggleSidebar} className="p-1 rounded-lg text-neutral-400 hover:bg-neutral-800">
              <X className="h-5.5 w-5.5" />
            </button>
          </div>

          <nav className="space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path || (link.path === '/admin/users' && location.pathname.startsWith('/admin/users/'));
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setSidebarOpen(true)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold
                    ${isActive ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-800'}
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-1.5 border-t border-neutral-800 pt-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <ArrowLeftRight className="h-5 w-5" />
            <span>Student Dashboard</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-rose-400 hover:bg-rose-950/35 hover:text-rose-300 w-full text-left"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div
        className={`
          flex-grow min-h-screen flex flex-col transition-all duration-300
          ${sidebarOpen ? 'md:pl-64' : 'md:pl-20'}
        `}
      >
        {/* Header Navigation bar */}
        <header className="bg-white border-b border-neutral-200/80 sticky top-0 z-20 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-50 focus:outline-none"
            >
              <Menu className="h-6.5 w-6.5" />
            </button>
            <h1 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary-600" />
              <span>Admin Control Center</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="primary" className="hidden sm:inline-flex bg-primary-100 text-primary-700">
              Admin Access Enabled
            </Badge>

            <div className="flex items-center gap-2">
              <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-neutral-800 leading-none">{currentUser.name}</p>
                <span className="text-[10px] text-neutral-400">System Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Panel */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
};
