import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail, Lock, Eye, EyeOff, User,
  AlertCircle, Shield, Briefcase, Loader2, CheckCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from "../assets/FSS_I.png"

type UserRole = 'admin' | 'agent' | null;

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    role?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ── handlers ── */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
  };

  const validate = (): boolean => {
    const errs: typeof errors = {};

    if (!formData.name.trim()) {
      errs.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Enter a valid email address';
    }

    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (!selectedRole) {
      errs.role = 'Please select a role';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    const result = await register({
      email: formData.email,
      full_name: formData.name,
      role: selectedRole!,
      password: formData.password,
    });

    setIsLoading(false);

    if (result.success) {
      setSuccess(true);
      // Redirect to sign-in after 2 seconds
      setTimeout(() => navigate('/signin'), 2000);
    } else {
      // Map backend field errors to form fields
      if (result.fieldErrors) {
        const mapped: typeof errors = {};

        if (result.fieldErrors.email) {
          mapped.email = result.fieldErrors.email[0];
        }
        if (result.fieldErrors.full_name) {
          mapped.name = result.fieldErrors.full_name[0];
        }
        if (result.fieldErrors.password) {
          mapped.password = result.fieldErrors.password[0];
        }
        if (result.fieldErrors.role) {
          mapped.role = result.fieldErrors.role[0];
        }
        // Catch-all for non_field_errors
        if (result.fieldErrors.non_field_errors) {
          mapped.general = result.fieldErrors.non_field_errors[0];
        }

        setErrors(mapped);
      } else {
        setErrors({ general: result.error || 'Registration failed.' });
      }
    }
  };

  /* ── success state ── */
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-10">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary-green" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Account Created!
            </h2>
            <p className="text-gray-600 mb-6">
              Your FieldScope account has been created successfully. Redirecting to sign in…
            </p>
            <div className="flex items-center justify-center gap-2 text-primary-green">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">Redirecting…</span>
            </div>
            <Link
              to="/signin"
              className="inline-block mt-6 text-sm text-primary-green font-semibold hover:underline"
            >
              Go to Sign In now →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        {/* ── Logo & Title ── */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
                src={logo}
                alt="FieldScope Logo"
                className="h-24 w-24 object-contain"
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Crect fill="%23008800" width="40" height="40"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Montserrat" font-size="20" fill="%23FFFDD0" font-weight="bold"%3EFS%3C/text%3E%3C/svg%3E';
                }}
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Create Your Account</h2>
          <p className="mt-2 text-gray-600">
            Join FieldScope and start monitoring your fields
          </p>
        </div>

        {/* ── Card ── */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* General Error */}
          {errors.general && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errors.general}</span>
            </div>
          )}

          {/* ── Role Selection ── */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              I am signing up as a:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Admin */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('admin');
                  setErrors((prev) => ({ ...prev, role: undefined }));
                }}
                className={`relative p-6 rounded-xl border-2 transition-all ${
                  selectedRole === 'admin'
                    ? 'border-primary-green bg-green-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                      selectedRole === 'admin'
                        ? 'bg-primary-green text-primary-cream'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Shield size={32} />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Administrator</h3>
                  <p className="text-sm text-gray-600">
                    Manage fields, assign agents, and monitor all operations
                  </p>
                </div>
                {selectedRole === 'admin' && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-primary-green rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </button>

              {/* Agent */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('agent');
                  setErrors((prev) => ({ ...prev, role: undefined }));
                }}
                className={`relative p-6 rounded-xl border-2 transition-all ${
                  selectedRole === 'agent'
                    ? 'border-primary-green bg-green-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                      selectedRole === 'agent'
                        ? 'bg-primary-green text-primary-cream'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Briefcase size={32} />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Field Agent</h3>
                  <p className="text-sm text-gray-600">
                    Monitor assigned fields and update crop progress
                  </p>
                </div>
                {selectedRole === 'agent' && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-primary-green rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </button>
            </div>
            {errors.role && (
              <div className="mt-2 flex items-center text-sm text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.role}
              </div>
            )}
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green transition-colors ${
                    errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green transition-colors ${
                    errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green transition-colors ${
                      errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green transition-colors ${
                      errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Password Strength Indicator */}
            {formData.password.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-600">Password strength:</p>
                <div className="flex gap-1">
                  {[
                    formData.password.length >= 8,
                    /[A-Z]/.test(formData.password),
                    /[0-9]/.test(formData.password),
                    /[^A-Za-z0-9]/.test(formData.password),
                  ].map((met, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        met ? 'bg-primary-green' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span className={formData.password.length >= 8 ? 'text-primary-green' : ''}>
                    {formData.password.length >= 8 ? '✓' : '○'} 8+ characters
                  </span>
                  <span className={/[A-Z]/.test(formData.password) ? 'text-primary-green' : ''}>
                    {/[A-Z]/.test(formData.password) ? '✓' : '○'} Uppercase
                  </span>
                  <span className={/[0-9]/.test(formData.password) ? 'text-primary-green' : ''}>
                    {/[0-9]/.test(formData.password) ? '✓' : '○'} Number
                  </span>
                  <span className={/[^A-Za-z0-9]/.test(formData.password) ? 'text-primary-green' : ''}>
                    {/[^A-Za-z0-9]/.test(formData.password) ? '✓' : '○'} Special char
                  </span>
                </div>
              </div>
            )}

            {/* Terms */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-primary-green focus:ring-primary-green border-gray-300 rounded mt-1"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-primary-green hover:text-green-700 font-medium">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary-green hover:text-green-700 font-medium">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-primary-green text-primary-cream rounded-xl font-semibold
                         hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-primary-green
                         transition-colors disabled:opacity-60 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account…
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Sign-in link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/signin" className="font-medium text-primary-green hover:text-green-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;