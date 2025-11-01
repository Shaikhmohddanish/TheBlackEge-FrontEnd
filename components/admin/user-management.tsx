'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';
import { useToast } from '@/hooks/use-toast';
import { PasswordStrengthMeter } from '@/components/auth/password-strength-meter';
import { 
  getAdminUserDetails, 
  resetUserPassword, 
  toggleUserLock, 
  toggleUserEnable,
  type AdminUser 
} from '@/lib/api/admin';

interface AdminUserManagementProps {
  userId: string;
  onUserUpdate?: () => void;
}

export function AdminUserManagement({ userId, onUserUpdate }: AdminUserManagementProps) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      setIsLoading(true);
      const userData = await getAdminUserDetails(userId);
      setUser(userData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load user details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      setMessage('Please enter a new password');
      setMessageType('error');
      return;
    }

    try {
      setIsUpdating(true);
      await resetUserPassword(userId, { newPassword });
      setMessage('Password reset successfully');
      setMessageType('success');
      setNewPassword('');
      toast({
        title: 'Password reset',
        description: 'User password has been reset successfully',
      });
      if (onUserUpdate) onUserUpdate();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
      setMessage(errorMessage);
      setMessageType('error');
      toast({
        title: 'Password reset failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleLock = async () => {
    if (!user) return;

    try {
      setIsUpdating(true);
      // For now, we'll use enabled field until backend has lock functionality
      const shouldLock = user.enabled;
      await toggleUserLock(userId, shouldLock);
      
      // Refresh user data to get updated status
      await fetchUserDetails();
      setMessage(`User ${shouldLock ? 'locked' : 'unlocked'} successfully`);
      setMessageType('success');
      
      toast({
        title: 'Account updated',
        description: `User account has been ${shouldLock ? 'locked' : 'unlocked'}`,
      });
      if (onUserUpdate) onUserUpdate();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update user lock status';
      setMessage(errorMessage);
      setMessageType('error');
      toast({
        title: 'Update failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleEnable = async () => {
    if (!user) return;

    try {
      setIsUpdating(true);
      const newEnabledStatus = !user.enabled;
      await toggleUserEnable(userId, newEnabledStatus);
      
      // Refresh user data to get updated status
      await fetchUserDetails();
      setMessage(`User ${newEnabledStatus ? 'enabled' : 'disabled'} successfully`);
      setMessageType('success');
      
      toast({
        title: 'Account updated',
        description: `User account has been ${newEnabledStatus ? 'enabled' : 'disabled'}`,
      });
      if (onUserUpdate) onUserUpdate();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update user enable status';
      setMessage(errorMessage);
      setMessageType('error');
      toast({
        title: 'Update failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Icons.spinner className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading user details...</span>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <Icons.x className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p>User not found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
          <CardDescription>
            Manage user account settings and security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <Alert variant={messageType === 'error' ? 'destructive' : 'default'}>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-medium">Name</Label>
              <p className="text-sm text-muted-foreground">{user.name}</p>
            </div>
            <div>
              <Label className="font-medium">Username</Label>
              <p className="text-sm text-muted-foreground">{user.username}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-medium">Email</Label>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div>
              <Label className="font-medium">Phone</Label>
              <p className="text-sm text-muted-foreground">{user.phone || 'Not provided'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-medium">Roles</Label>
              <div className="flex flex-wrap gap-1">
                {user.roles.map((role, index) => (
                  <Badge key={index} variant="outline">{role}</Badge>
                ))}
              </div>
            </div>
            <div>
              <Label className="font-medium">Status</Label>
              <div className="flex items-center gap-2">
                <Badge variant={user.enabled ? 'default' : 'destructive'}>
                  {user.enabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-medium">Created</Label>
              <p className="text-sm text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <Label className="font-medium">Profile Image</Label>
              {user.imageUrl ? (
                <img src={user.imageUrl} alt="Profile" className="w-8 h-8 rounded-full" />
              ) : (
                <p className="text-sm text-muted-foreground">No image</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password Reset</CardTitle>
          <CardDescription>
            Reset the user's password to a new secure password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              disabled={isUpdating}
            />
            <PasswordStrengthMeter password={newPassword} />
          </div>
          
          <Button 
            onClick={handleResetPassword} 
            disabled={isUpdating || !newPassword}
            className="w-full"
          >
            {isUpdating && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Reset Password
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Controls</CardTitle>
          <CardDescription>
            Manage user account access and permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={handleToggleLock}
              disabled={isUpdating}
            >
              {isUpdating && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Lock/Unlock Account
            </Button>
            
            <Button
              variant={user.enabled ? "destructive" : "default"}
              onClick={handleToggleEnable}
              disabled={isUpdating}
            >
              {isUpdating && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              {user.enabled ? 'Disable User' : 'Enable User'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
