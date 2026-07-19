import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../hooks/useWishlist';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { 
  BookOpen, Search, Menu, X, Heart, LogOut, 
  LayoutDashboard, Shield, User, HelpCircle, Mail, MapPin, Phone 
} from 'lucide-react';

export const PublicLayout = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle sticky header shadows
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on page navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/courses');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 w-full z-40 bg-white transition-all duration-300 ${
          isScrolled 
            ? 'shadow-md border-b border-neutral-100 py-3' 
            : 'border-b border-neutral-100 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="h-10 w-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-md shadow-primary-500/25 group-hover:bg-primary-700 transition-colors">
                <BookOpen className="h-5.5 w-5.5" />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight text-neutral-900 group-hover:text-primary-600 transition-colors">
                EduSphere
              </span>
            </Link>

            {/* Nav Menu - Desktop */}
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                to="/" 
                className={`text-sm font-medium hover:text-primary-600 transition-colors ${
                  location.pathname === '/' ? 'text-primary-600' : 'text-neutral-600'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/courses" 
                className={`text-sm font-medium hover:text-primary-600 transition-colors ${
                  location.pathname.startsWith('/courses') ? 'text-primary-600' : 'text-neutral-600'
                }`}
              >
                Browse Courses
              </Link>
            </nav>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative max-w-xs w-full">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white text-neutral-900 border border-neutral-200 focus:border-primary-500 rounded-lg pl-3 pr-9 py-2 focus:ring-2 focus:ring-primary-500/20 outline-none"
              />
              <button type="submit" className="absolute right-2.5 text-neutral-400 hover:text-primary-600">
                <Search className="h-4 w-4" />
              </button>
            </form>

            {/* Actions - Desktop */}
            <div className="hidden md:flex items-center gap-4 flex-shrink-0">
              {currentUser && (
                <Link to="/dashboard" className="relative p-2 text-neutral-500 hover:text-primary-600 transition-colors" title="Wishlist">
                  <Heart className={`h-5.5 w-5.5 ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
                  {wishlist.length > 0 && (
                    <Badge variant="error" className="absolute -top-1 -right-1 px-1 py-0.5 min-w-[18px] text-[10px] justify-center">
                      {wishlist.length}
                    </Badge>
                  )}
                </Link>
              )}

              {currentUser ? (
                <div className="relative">
                  <button 
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
                    <span className="text-xs font-semibold text-neutral-700 hidden lg:inline max-w-[100px] truncate">
                      {currentUser.name}
                    </span>
                  </button>

                  {profileDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setProfileDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2.5 w-56 rounded-xl border border-neutral-200/60 bg-white p-2 shadow-lg ring-1 ring-black/5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="px-3 py-2 border-b border-neutral-100">
                          <p className="text-sm font-semibold text-neutral-900">{currentUser.name}</p>
                          <p className="text-xs text-neutral-500 truncate">{currentUser.email}</p>
                          <Badge variant={isAdmin ? 'primary' : 'neutral'} className="mt-1">
                            {currentUser.role}
                          </Badge>
                        </div>
                        <div className="py-1">
                          <Link 
                            to="/dashboard" 
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
                          >
                            <LayoutDashboard className="h-4 w-4 text-neutral-400" />
                            Dashboard
                          </Link>
                          {isAdmin && (
                            <Link 
                              to="/admin/courses" 
                              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
                            >
                              <Shield className="h-4 w-4 text-neutral-400" />
                              Admin Panel
                            </Link>
                          )}
                          <Link 
                            to="/dashboard" 
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
                          >
                            <User className="h-4 w-4 text-neutral-400" />
                            My Profile
                          </Link>
                        </div>
                        <div className="border-t border-neutral-100 pt-1">
                          <button 
                            onClick={logout}
                            className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm text-rose-600 hover:bg-rose-50"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm">Log In</Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger / Icons */}
            <div className="flex items-center gap-2 md:hidden">
              <form onSubmit={handleSearchSubmit} className="relative max-w-[140px]">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-lg pl-2 pr-7 py-1.5 outline-none"
                />
                <button type="submit" className="absolute right-2.5 top-2.5 text-neutral-400">
                  <Search className="h-3 w-3" />
                </button>
              </form>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 text-neutral-500 hover:text-primary-600 bg-neutral-50 rounded-lg"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-100 mt-3 px-4 pt-3 pb-4 bg-white shadow-lg space-y-3">
            <nav className="flex flex-col gap-2">
              <Link 
                to="/" 
                className="px-3 py-2 rounded-lg text-sm font-semibold hover:bg-neutral-50 text-neutral-700"
              >
                Home
              </Link>
              <Link 
                to="/courses" 
                className="px-3 py-2 rounded-lg text-sm font-semibold hover:bg-neutral-50 text-neutral-700"
              >
                Browse Courses
              </Link>
              {currentUser && (
                <Link 
                  to="/dashboard" 
                  className="px-3 py-2 rounded-lg text-sm font-semibold hover:bg-neutral-50 text-neutral-700"
                >
                  Student Dashboard
                </Link>
              )}
              {currentUser?.role === 'Admin' && (
                <Link 
                  to="/admin/courses" 
                  className="px-3 py-2 rounded-lg text-sm font-semibold hover:bg-neutral-50 text-neutral-700"
                >
                  Admin Panel
                </Link>
              )}
            </nav>

            <div className="border-t border-neutral-100 pt-3">
              {currentUser ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-3">
                    <Avatar src={currentUser.avatar} name={currentUser.name} size="md" />
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">{currentUser.name}</p>
                      <p className="text-xs text-neutral-500 truncate">{currentUser.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={logout}
                    className="flex items-center gap-2 w-full text-left px-3 py-2.5 rounded-lg text-sm text-rose-600 bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 px-2">
                  <Link to="/login" className="w-full">
                    <Button variant="outline" className="w-full">Log In</Button>
                  </Link>
                  <Link to="/signup" className="w-full">
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-primary-800 text-neutral-400 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Column 1: Brand Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white">
                <div className="h-9 w-9 rounded-lg bg-primary-600 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="font-heading font-bold text-lg tracking-tight">EduSphere</span>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Empowering learners around the globe with production-grade guides, real-world case studies, and career-accelerating courses.
              </p>
              <div className="flex gap-4">
                {/* Social icons fallback */}
                <a href="#twitter" className="hover:text-primary-500 text-neutral-500"><HelpCircle className="h-5 w-5" /></a>
                <a href="#linkedin" className="hover:text-primary-500 text-neutral-500"><HelpCircle className="h-5 w-5" /></a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Platform</h3>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="/courses" className="hover:text-white transition-colors">Browse Courses</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Student Dashboard</Link></li>
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#careers" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>

            {/* Column 3: Categories */}
            <div>
              <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Categories</h3>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="/courses?category=development" className="hover:text-white transition-colors">Development</Link></li>
                <li><Link to="/courses?category=design" className="hover:text-white transition-colors">Design & UI/UX</Link></li>
                <li><Link to="/courses?category=business" className="hover:text-white transition-colors">Business & Finance</Link></li>
                <li><Link to="/courses?category=marketing" className="hover:text-white transition-colors">Digital Marketing</Link></li>
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div className="space-y-3">
              <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Contact</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2.5">
                  <MapPin className="h-5 w-5 text-neutral-500 mt-0.5 flex-shrink-0" />
                  <span>100 Innovation Way, Suite 400, San Francisco, CA 94107</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4.5 w-4.5 text-neutral-500 flex-shrink-0" />
                  <span>support@edusphere.com</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4.5 w-4.5 text-neutral-500 flex-shrink-0" />
                  <span>+1 (800) 555-0199</span>
                </li>
              </ul>
            </div>

          </div>
          
          <div className="border-t border-neutral-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <p>© {new Date().getFullYear()} EduSphere, Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#cookies" className="hover:text-white transition-colors">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
