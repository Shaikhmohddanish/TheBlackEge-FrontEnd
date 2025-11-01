'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Icons } from '@/components/ui/icons';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { PasswordStrengthMeter } from '@/components/auth/password-strength-meter';
import { validatePassword, type PasswordValidation } from '@/lib/api/auth';
import { GoogleSignInButton } from '@/components/auth/google-signin-button';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    valid: false,
    strength: 0,
    compromised: false,
    errors: []
  });
  const [showCompromiseWarning, setShowCompromiseWarning] = useState(false);

  const { register } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Real-time password validation
  useEffect(() => {
    if (formData.password.length > 0) {
      validatePasswordAsync(formData.password);
    } else {
      setPasswordValidation({ valid: false, strength: 0, compromised: false, errors: [] });
      setShowCompromiseWarning(false);
    }
  }, [formData.password]);

  const validatePasswordAsync = async (password: string) => {
    try {
      const result = await validatePassword(password);
      setPasswordValidation(result);
      setShowCompromiseWarning(result.compromised);
    } catch (error) {
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError(''); // Clear error when user types
  };

  const validateForm = () => {
    if (!passwordValidation.valid) {
      setError('Please fix password validation errors before submitting');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Handle compromised password warning
    if (passwordValidation.compromised && showCompromiseWarning) {
      const confirmed = window.confirm(
        'This password has been found in data breaches and may not be secure. Are you sure you want to use it?'
      );
      if (!confirmed) {
        return;
      }
      setShowCompromiseWarning(false);
    }

    setIsLoading(true);
    setError('');

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      toast({
        title: 'Registration successful',
        description: 'Welcome to THE BLACKEGE! Your account has been created.',
      });
      router.push('/');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      toast({
        title: 'Registration failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-600">Join Blackege and start shopping</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Create your account to get started
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    disabled={isLoading}
                    className="border-white bg-gray-900/50 text-white placeholder:text-gray-400 focus:border-blue-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Choose a username"
                    disabled={isLoading}
                    className="border-white bg-gray-900/50 text-white placeholder:text-gray-400 focus:border-blue-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    disabled={isLoading}
                    className="border-white bg-gray-900/50 text-white placeholder:text-gray-400 focus:border-blue-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone number (optional)"
                    disabled={isLoading}
                    className="border-white bg-gray-900/50 text-white placeholder:text-gray-400 focus:border-blue-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a strong password"
                    disabled={isLoading}
                    className="border-white bg-gray-900/50 text-white placeholder:text-gray-400 focus:border-blue-400"
                  />
                  <PasswordStrengthMeter password={formData.password} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    disabled={isLoading}
                    className="border-white bg-gray-900/50 text-white placeholder:text-gray-400 focus:border-blue-400"
                  />
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <Icons.x className="h-4 w-4" />
                      <span>Passwords do not match</span>
                    </div>
                  )}
                  {formData.confirmPassword && formData.password === formData.confirmPassword && formData.password.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Icons.shoppingCart className="h-4 w-4" />
                      <span>Passwords match</span>
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-600">
                  By creating an account, you agree to our{' '}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                    Privacy Policy
                  </Link>
                  .
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !passwordValidation.valid || formData.password !== formData.confirmPassword}
                >
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Account
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <GoogleSignInButton
                  mode="signup"
                  onSuccess={() => {
                    router.push('/');
                  }}
                  onError={(error) => {
                    toast({
                      title: 'Google Sign-Up failed',
                      description: error,
                      variant: 'destructive',
                    });
                  }}
                  disabled={isLoading}
                />

                <div className="text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>

          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-black"
            >
              ← Back to store
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

