import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Eye, EyeOff, Mail, Lock, ShieldAlert } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const onSubmit = async (data) => {
    setAuthError(null);
    setIsLoading(true);
    try {
      const user = login(data.email, data.password);
      if (user.role && user.role.toLowerCase() === 'admin') {
        navigate('/admin/courses');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setAuthError(err.message || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-neutral-200/80 shadow-premium w-full max-w-md space-y-6">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="font-heading font-extrabold text-2xl text-neutral-900">
          Welcome Back
        </h1>
        <p className="text-xs text-neutral-500">
          Sign in to continue your learning journey
        </p>
      </div>

      {/* Global Auth Error Alert */}
      {authError && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-3.5 flex items-start gap-2.5 text-xs text-rose-700">
          <ShieldAlert className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
          <p>{authError}</p>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Email Input */}
        <Input
          label="Email Address"
          type="email"
          placeholder="e.g. name@domain.com"
          iconLeft={<Mail className="h-4.5 w-4.5" />}
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
        />

        {/* Password Input */}
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            iconLeft={<Lock className="h-4.5 w-4.5" />}
            error={errors.password?.message}
            iconRight={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-neutral-400 hover:text-neutral-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
          />
        </div>

        {/* Extra options */}
        <div className="flex items-center justify-between text-xs pt-1.5">
          <label className="flex items-center gap-2 cursor-pointer text-neutral-600 hover:text-neutral-800">
            <input
              type="checkbox"
              className="rounded text-primary-600 focus:ring-primary-500/20 border-neutral-300 h-4 w-4"
              {...register('rememberMe')}
            />
            <span>Remember me</span>
          </label>
          <a href="#forgot" className="text-primary-600 hover:underline font-medium">
            Forgot password?
          </a>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          loading={isLoading}
          className="w-full py-3 text-sm shadow-md shadow-primary-500/10 mt-2"
        >
          Sign In
        </Button>
      </form>

      {/* Separator */}
      <div className="flex items-center gap-3 py-2 text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
        <hr className="flex-grow border-neutral-200" />
        <span>Or Continue With</span>
        <hr className="flex-grow border-neutral-200" />
      </div>

      {/* Google Login */}
      <button
        type="button"
        onClick={() => {
          // Mock login as student Jane Doe
          const user = login('jane@example.com', 'password');
          if (user.role && user.role.toLowerCase() === 'admin') {
            navigate('/admin/courses');
          } else {
            navigate('/dashboard');
          }
        }}
        className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 text-xs font-semibold text-neutral-700"
      >
        <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.745.986 15.014 0 12 0 7.35 0 3.395 2.677 1.486 6.573l3.78 3.192z"
          />
          <path
            fill="#4285F4"
            d="M23.49 12.273c0-.818-.073-1.609-.209-2.373H12v4.5h6.445c-.277 1.464-1.1 2.709-2.345 3.545l3.65 2.832c2.132-1.968 3.36-4.868 3.36-8.504z"
          />
          <path
            fill="#FBBC05"
            d="M5.266 14.235L1.486 17.427C3.395 21.323 7.35 24 12 24c3.064 0 5.636-.982 7.518-2.673l-3.65-2.832c-1.023.682-2.336 1.096-3.868 1.096-4.664 0-8.618-3.155-10.027-7.427L1.486 17.427z"
          />
          <path
            fill="#34A853"
            d="M5.266 9.765A7.02 7.02 0 015.09 12c0 .8.064 1.577.177 2.332l3.78-3.192-3.78-1.375z"
          />
        </svg>
        <span>Mock Sign In with Google</span>
      </button>

      {/* Info notice about accounts */}
      <div className="bg-neutral-50 rounded-lg p-3 text-[11px] text-neutral-500 border border-neutral-100">
        <p className="font-semibold text-neutral-800 mb-1">💡 Sandbox Credentials:</p>
        <ul className="space-y-0.5">
          <li>• Student: <span className="font-mono select-all font-semibold">jane@example.com</span></li>
          <li>• Administrator: <span className="font-mono select-all font-semibold">admin@example.com</span></li>
          <li>• Password: (Any character sequence of 6+ digits)</li>
        </ul>
      </div>

      {/* Footer link */}
      <div className="text-center text-xs text-neutral-500 border-t border-neutral-100 pt-4">
        Don't have an account?{' '}
        <Link to="/signup" className="text-primary-600 hover:underline font-semibold">
          Create Account
        </Link>
      </div>

    </div>
  );
};
