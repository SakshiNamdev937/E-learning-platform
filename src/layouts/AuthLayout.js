import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { BookOpen, CheckCircle, Star } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex bg-neutral-50">
      
      {/* Visual Left Sidebar - Desktop only */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 p-12 text-white flex-col justify-between relative overflow-hidden">
        {/* Background Decorative Circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-20 -mt-20 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full -ml-20 -mb-20 blur-2xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-primary-600 shadow-lg shadow-black/10 group-hover:scale-105 transition-transform">
              <BookOpen className="h-5.5 w-5.5" />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-white">
              EduSphere
            </span>
          </Link>
        </div>

        {/* Middle Value Props */}
        <div className="space-y-8 relative max-w-md">
          <h2 className="font-heading font-bold text-4xl leading-tight">
            Unlock Your True Creative & Technical Potential.
          </h2>
          
          <ul className="space-y-4 text-sm text-primary-100">
            <li className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-secondary-500 flex-shrink-0" />
              <span>Learn from vetted world-class industry experts</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-secondary-500 flex-shrink-0" />
              <span>Full curriculum access and download-ready source files</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-secondary-500 flex-shrink-0" />
              <span>Professional certificate generated upon completion</span>
            </li>
          </ul>
        </div>

        {/* Bottom Testimonial */}
        <div className="border-t border-white/10 pt-6 relative max-w-md">
          <div className="flex items-center gap-1.5 mb-2.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="italic text-sm text-primary-100 mb-3">
            "The curriculum depth and modern approach at EduSphere completely changed my web dev career. I landed a senior role in record time!"
          </p>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
              JD
            </div>
            <span className="text-xs font-semibold text-white">Jane Doe, Student</span>
          </div>
        </div>

      </div>

      {/* Main Content Area - Form Pages */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-10 relative">
        <Link 
          to="/" 
          className="absolute top-6 left-6 lg:hidden inline-flex items-center gap-2"
        >
          <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center text-white">
            <BookOpen className="h-4.5 w-4.5" />
          </div>
          <span className="font-heading font-bold text-base tracking-tight text-neutral-900">
            EduSphere
          </span>
        </Link>

        <div className="w-full max-w-md space-y-6">
          <Outlet />
        </div>
      </div>

    </div>
  );
};
