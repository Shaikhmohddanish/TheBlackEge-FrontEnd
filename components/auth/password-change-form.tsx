'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Icons } from '@/components/ui/icons';
import { useToast } from '@/hooks/use-toast';
import { PasswordStrengthMeter } from './password-strength-meter';
import { changePassword } from '@/lib/api/auth';

export function PasswordChangeForm() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!formData.currentPassword) {
      setError('Please enter your current password');
      return false;
    }

    if (!formData.newPassword) {
      setError('Please enter a new password');
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return false;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('New password must be different from current password');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      setSuccess('Password changed successfully');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      toast({
        title: 'Password changed',
        description: 'Your password has been updated successfully.',
      });
    } catch (err) {
      let errorMessage = 'Failed to change password. Please try again.';
      
      if (err instanceof Error) {
        if (err.message.includes('current password')) {
          errorMessage = 'Current password is incorrect. Please try again.';
        } else if (err.message.includes('weak') || err.message.includes('strength')) {
          errorMessage = 'New password does not meet security requirements.';
        } else if (err.message.includes('compromised')) {
          errorMessage = 'This password has been found in data breaches. Please choose a different password.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      toast({
        title: 'Password change failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <Icons.x className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <Icons.shoppingCart className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-white font-medium">Current Password</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              value={formData.currentPassword}
              onChange={handleInputChange}
              placeholder="Enter your current password"
              disabled={isLoading}
              className="border-gray-600 bg-gray-800/50 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20 rounded-lg h-12 px-4"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-white font-medium">New Password</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder="Enter your new password"
              disabled={isLoading}
              className="border-gray-600 bg-gray-800/50 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20 rounded-lg h-12 px-4"
            />
            <PasswordStrengthMeter password={formData.newPassword} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white font-medium">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your new password"
              disabled={isLoading}
              className="border-gray-600 bg-gray-800/50 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20 rounded-lg h-12 px-4"
            />
            {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <Icons.x className="h-4 w-4" />
                <span>Passwords do not match</span>
              </div>
            )}
            {formData.confirmPassword && formData.newPassword === formData.confirmPassword && formData.newPassword.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Icons.shoppingCart className="h-4 w-4" />
                <span>Passwords match</span>
              </div>
            )}
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              disabled={isLoading || formData.newPassword !== formData.confirmPassword || !formData.currentPassword}
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Change Password
            </Button>
          </div>
      </form>
    </div>
  );
}
