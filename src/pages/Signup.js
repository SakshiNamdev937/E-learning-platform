import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Eye, EyeOff, Mail, Lock, User, Phone, ShieldAlert } from 'lucide-react';

export const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      mobile: '',
      role: 'Student',
      password: '',
      confirmPassword: '',
      agreeTerms: false
    }
  });

  const passwordValue = watch('password');

  const onSubmit = async (data) => {
    setAuthError(null);
    setIsLoading(true);
    try {
      const user = signup(data.name, data.email, data.mobile, data.role);
      if (user.role === 'Admin') {
        navigate('/admin/courses');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setAuthError(err.message || 'Failed to create your account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-neutral-200/80 shadow-premium w-full max-w-md space-y-6">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="font-heading font-extrabold text-2xl text-neutral-900">
          Create Account
        </h1>
        <p className="text-xs text-neutral-500">
          Start mastering your technical and design skills
        </p>
      </div>

      {/* Global Auth Error Alert */}
      {authError && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-3.5 flex items-start gap-2.5 text-xs text-rose-700">
          <ShieldAlert className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
          <p>{authError}</p>
        </div>
      )}

      {/* Signup Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Name Input */}
        <Input
          label="Full Name"
          placeholder="e.g. Jane Doe"
          iconLeft={<User className="h-4.5 w-4.5" />}
          error={errors.name?.message}
          {...register('name', {
            required: 'Full name is required',
            minLength: {
              value: 3,
              message: 'Name must be at least 3 characters'
            }
          })}
        />

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

        {/* Mobile Input */}
        <Input
          label="Mobile Number"
          type="tel"
          placeholder="e.g. +1 (555) 000-0000"
          iconLeft={<Phone className="h-4.5 w-4.5" />}
          error={errors.mobile?.message}
          {...register('mobile', {
            required: 'Mobile number is required',
            pattern: {
              value: /^(\+?\d{1,3}[- ]?)?\d{10}$/,
              message: 'Please provide a valid 10-digit number'
            }
          })}
        />

        {/* Role Select Input */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-neutral-800">
            Account Role
          </label>
          <select
            className="w-full text-xs p-2.5 bg-white border border-neutral-200 rounded-lg outline-none text-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-semibold"
            {...register('role')}
          >
            <option value="Student">Student</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

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

        {/* Confirm Password Input */}
        <div className="relative">
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            iconLeft={<Lock className="h-4.5 w-4.5" />}
            error={errors.confirmPassword?.message}
            iconRight={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-neutral-400 hover:text-neutral-600 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (val) => val === passwordValue || 'Passwords do not match'
            })}
          />
        </div>

        {/* Agree To Terms Checkbox */}
        <div className="space-y-1">
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-neutral-600 hover:text-neutral-800">
            <input
              type="checkbox"
              className="rounded text-primary-600 focus:ring-primary-500/20 border-neutral-300 h-4 w-4 mt-0.5"
              {...register('agreeTerms', {
                required: 'You must agree to the Terms of Service'
              })}
            />
            <span className="leading-tight">
              I agree to the{' '}
              <a href="#terms" className="text-primary-600 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#privacy" className="text-primary-600 hover:underline">
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="text-[10px] text-semantic-error font-medium">
              {errors.agreeTerms.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          loading={isLoading}
          className="w-full py-3 text-sm shadow-md shadow-primary-500/10 mt-2"
        >
          Create Account
        </Button>
      </form>

      {/* Footer link */}
      <div className="text-center text-xs text-neutral-500 border-t border-neutral-100 pt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 hover:underline font-semibold">
          Sign In
        </Link>
      </div>

    </div>
  );
};
