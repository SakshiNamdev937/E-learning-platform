import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { 
  BookOpen, LayoutDashboard, Settings, Award, LogOut, 
  Menu, X, Bell, Search, Compass, BookOpenCheck, Shield
} from 'lucide-react';

export const DashboardLayout = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(2);

  // Auth Guard
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!currentUser) return null;

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const notifications = [
    { id: 1, text: "Congratulations! You completed Section 1 of React Front-to-Back.", time: "2 hours ago" },
    { id: 2, text: "New lecture added: 'Tailwind CSS Custom Design Systems'.", time: "1 day ago" }
  ];

  const sidebarLinks = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Enrolled Courses', path: '/dashboard/courses', icon: BookOpenCheck },
    { label: 'Browse Catalog', path: '/courses', icon: Compass },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar Panel - Desktop */}
      <aside 
        className={`
          bg-white border-r border-neutral-200/80 fixed inset-y-0 left-0 z-30 transition-all duration-300
          ${sidebarOpen ? 'w-64' : 'w-20'}
          hidden md:flex flex-col justify-between p-4
        `}
      >
        <div className="space-y-6">
          {/* Logo Brand */}
          <div className={`flex items-center gap-3 px-2 ${sidebarOpen ? '' : 'justify-center'}`}>
            <Link to="/" className="flex items-center gap-2 group">
              <div className="h-10 w-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-md shadow-primary-500/20">
                <BookOpen className="h-5.5 w-5.5" />
              </div>
              {sidebarOpen && (
                <span className="font-heading font-bold text-lg text-neutral-900 group-hover:text-primary-600 transition-colors">
                  EduSphere
                </span>
              )}
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-4">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors
                    ${isActive 
                      ? 'bg-primary-50 text-primary-600' 
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                    }
                    ${!sidebarOpen && 'justify-center'}
                  `}
                  title={link.label}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-primary-600' : 'text-neutral-400'}`} />
                  {sidebarOpen && <span>{link.label}</span>}
                </Link>
              );
            })}

            {currentUser.role === 'Admin' && (
              <Link
                to="/admin/courses"
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900
                  ${!sidebarOpen && 'justify-center'}
                `}
                title="Admin Panel"
              >
                <Shield className="h-5 w-5 text-neutral-400" />
                {sidebarOpen && <span>Admin Panel</span>}
              </Link>
            )}
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="border-t border-neutral-100 pt-4">
          <button
            onClick={logout}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-rose-600 hover:bg-rose-50 w-full text-left
              ${!sidebarOpen && 'justify-center'}
            `}
            title="Sign Out"
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile Drawer */}
      {!sidebarOpen && (
        <div 
          className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      <aside
        className={`
          bg-white border-r border-neutral-200 fixed inset-y-0 left-0 w-64 z-50 p-4 flex flex-col justify-between transition-transform duration-300 md:hidden
          ${!sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary-600 flex items-center justify-center text-white">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="font-heading font-bold text-base text-neutral-900">
                EduSphere
              </span>
            </Link>
            <button onClick={toggleSidebar} className="p-1 rounded-lg text-neutral-500 hover:bg-neutral-100">
              <X className="h-5.5 w-5.5" />
            </button>
          </div>

          <nav className="space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setSidebarOpen(true)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold
                    ${isActive ? 'bg-primary-50 text-primary-600' : 'text-neutral-600 hover:bg-neutral-50'}
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            {currentUser.role === 'Admin' && (
              <Link
                to="/admin/courses"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-neutral-600 hover:bg-neutral-50"
              >
                <Shield className="h-5 w-5" />
                <span>Admin Panel</span>
              </Link>
            )}
          </nav>
        </div>

        <div className="border-t border-neutral-100 pt-4">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-rose-600 hover:bg-rose-50 w-full text-left"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Body */}
      <div 
        className={`
          flex-grow min-h-screen flex flex-col transition-all duration-300
          ${sidebarOpen ? 'md:pl-64' : 'md:pl-20'}
        `}
      >
        {/* Header Topbar */}
        <header className="bg-white border-b border-neutral-200/80 sticky top-0 z-20 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Sidebar toggle */}
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-50 focus:outline-none"
            >
              <Menu className="h-6.5 w-6.5" />
            </button>
            <h1 className="text-base font-bold text-neutral-900 hidden sm:inline">
              Student Workspace
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Icon */}
            <div className="relative">
              <button 
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setUnreadNotifications(0);
                }}
                className="p-2 text-neutral-500 hover:text-primary-600 hover:bg-neutral-50 rounded-lg relative"
              >
                <Bell className="h-5.5 w-5.5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-semantic-error animate-ping" />
                )}
              </button>

              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-2.5 w-80 rounded-xl border border-neutral-200/80 bg-white p-3 shadow-lg z-50">
                    <h3 className="text-sm font-bold text-neutral-900 mb-2 border-b border-neutral-100 pb-1.5">Notifications</h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                      {notifications.map(n => (
                        <div key={n.id} className="text-xs text-neutral-700 hover:bg-neutral-50 p-1.5 rounded-lg">
                          <p>{n.text}</p>
                          <span className="text-[10px] text-neutral-400 mt-1 block">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile widget */}
            <div className="flex items-center gap-2">
              <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-neutral-800 leading-none">{currentUser.name}</p>
                <span className="text-[10px] text-neutral-500">Student Account</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Outer */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
};
