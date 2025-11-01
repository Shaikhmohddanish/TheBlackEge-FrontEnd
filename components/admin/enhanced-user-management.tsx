'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/loading-spinner';
import { PasswordStrengthMeter } from '@/components/auth/password-strength-meter';
import { 
  getAllUsers,
  getAdminUserDetails,
  resetUserPassword,
  toggleUserLock,
  toggleUserEnable,
  updateUserRole,
  type AdminUser,
  type UsersResponse
} from '@/lib/api/admin';

export function EnhancedUserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
  const [isRoleUpdateOpen, setIsRoleUpdateOpen] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  const { toast } = useToast();

  // Password reset form state
  const [passwordResetForm, setPasswordResetForm] = useState<{
    userId: string | null;
    newPassword: string;
    confirmPassword: string;
  }>({
    userId: null,
    newPassword: '',
    confirmPassword: ''
  });

  // Role update form state
  const [roleUpdateForm, setRoleUpdateForm] = useState<{
    userId: string | null;
    roles: string[];
  }>({
    userId: null,
    roles: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableRoles = ['ROLE_CUSTOMER', 'ROLE_ADMIN'];

  // Load users on mount and when filters change
  useEffect(() => {
    loadUsers();
  }, [currentPage, sortBy, sortDir]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response: UsersResponse = await getAllUsers(currentPage, pageSize, searchQuery);

      setUsers(response.users);
      setTotalElements(response.totalElements);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load users. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    setCurrentPage(0);
    await loadUsers();
  };

  const handleViewUser = async (userId: string) => {
    try {
      const user = await getAdminUserDetails(userId);
      setSelectedUser(user);
      setIsUserDetailOpen(true);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load user details.',
        variant: 'destructive',
      });
    }
  };

  const handlePasswordReset = (user: AdminUser) => {
    setPasswordResetForm({
      userId: user.id,
      newPassword: '',
      confirmPassword: ''
    });
    setIsPasswordResetOpen(true);
  };

  const handleSubmitPasswordReset = async () => {
    if (!passwordResetForm.userId) return;

    if (passwordResetForm.newPassword !== passwordResetForm.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      return;
    }

    if (passwordResetForm.newPassword.length < 8) {
      toast({
        title: 'Error',
        description: 'Password must be at least 8 characters long.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await resetUserPassword(passwordResetForm.userId, passwordResetForm.newPassword);
      
      toast({
        title: 'Success',
        description: 'Password reset successfully.',
      });

      setIsPasswordResetOpen(false);
      setPasswordResetForm({ userId: null, newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reset password. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleUpdate = (user: AdminUser) => {
    setRoleUpdateForm({
      userId: user.id,
      roles: user.roles && user.roles.length > 0 ? [user.roles[0]] : []
    });
    setIsRoleUpdateOpen(true);
  };

  const handleSubmitRoleUpdate = async () => {
    if (!roleUpdateForm.userId || roleUpdateForm.roles.length === 0) return;

    try {
      setIsSubmitting(true);
      // Only support one role per user - use the first selected role
      const selectedRole = roleUpdateForm.roles[0];
      await updateUserRole(roleUpdateForm.userId, selectedRole);
      
      toast({
        title: 'Success',
        description: 'User role updated successfully.',
      });

      setIsRoleUpdateOpen(false);
      setRoleUpdateForm({ userId: null, roles: [] });
      await loadUsers();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user role. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleUserLock = async (userId: string, isCurrentlyLocked: boolean) => {
    try {
      await toggleUserLock(userId, !isCurrentlyLocked);
      toast({
        title: 'Success',
        description: `User ${!isCurrentlyLocked ? 'locked' : 'unlocked'} successfully.`,
      });
      await loadUsers();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user lock status.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleUserEnable = async (userId: string, isCurrentlyEnabled: boolean) => {
    try {
      await toggleUserEnable(userId, !isCurrentlyEnabled);
      toast({
        title: 'Success',
        description: `User ${!isCurrentlyEnabled ? 'enabled' : 'disabled'} successfully.`,
      });
      await loadUsers();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user enable status.',
        variant: 'destructive',
      });
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
    }
  };

  const handleBulkUserAction = async (action: 'enable' | 'disable' | 'lock' | 'unlock') => {
    if (selectedUsers.length === 0) return;

    try {
      const promises = selectedUsers.map(userId => {
        const user = users.find(u => u.id === userId);
        if (!user) return Promise.resolve();

        switch (action) {
          case 'enable':
            return toggleUserEnable(userId, true);
          case 'disable':
            return toggleUserEnable(userId, false);
          case 'lock':
            return toggleUserLock(userId, true);
          case 'unlock':
            return toggleUserLock(userId, false);
          default:
            return Promise.resolve();
        }
      });

      await Promise.all(promises);
      
      toast({
        title: 'Success',
        description: `${selectedUsers.length} users ${action}d successfully.`,
      });

      setSelectedUsers([]);
      await loadUsers();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action} users. Please try again.`,
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserStatusColor = (user: AdminUser) => {
    if (!user.enabled) return 'destructive';
    if (user.accountNonLocked === false) return 'secondary';
    return 'default';
  };

  const getUserStatusText = (user: AdminUser) => {
    if (!user.enabled) return 'Disabled';
    if (user.accountNonLocked === false) return 'Locked';
    return 'Active';
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPasswordResetForm(prev => ({ ...prev, newPassword: password, confirmPassword: password }));
  };

  const toggleRoleSelection = (role: string) => {
    setRoleUpdateForm(prev => ({
      ...prev,
      roles: [role] // Only allow one role selection
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">
            Manage user accounts, permissions, and security settings.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {totalElements} total users
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <Input
                  placeholder="Search by name, username, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} variant="outline">
                  <Icons.search className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Sort by Date</SelectItem>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="email">Sort by Email</SelectItem>
                  <SelectItem value="enabled">Sort by Status</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
              >
                {sortDir === 'asc' ? (
                  <Icons.chevronLeft className="w-4 h-4 rotate-90" />
                ) : (
                  <Icons.chevronRight className="w-4 h-4 rotate-90" />
                )}
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div className="flex items-center gap-2 mt-4 p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">
                {selectedUsers.length} user(s) selected
              </span>
              <div className="flex gap-2 ml-auto">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkUserAction('enable')}
                >
                  <Icons.plus className="w-4 h-4 mr-1" />
                  Enable
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkUserAction('disable')}
                >
                  <Icons.x className="w-4 h-4 mr-1" />
                  Disable
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkUserAction('lock')}
                >
                  <Icons.shield className="w-4 h-4 mr-1" />
                  Lock
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkUserAction('unlock')}
                >
                  <Icons.shield className="w-4 h-4 mr-1" />
                  Unlock
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-20">
              <Icons.users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No users found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? 'No users match your search criteria.' : 'No users registered yet.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="p-4">
                      <Checkbox
                        checked={selectedUsers.length === users.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="p-4 font-medium">User</th>
                    <th className="p-4 font-medium">Contact</th>
                    <th className="p-4 font-medium">Roles</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Joined</th>
                    <th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => handleSelectUser(user.id)}
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                            {user.imageUrl ? (
                              <img
                                src={user.imageUrl}
                                alt={user.name}
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <Icons.user className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">@{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="text-sm">{user.email}</div>
                          {user.phone && (
                            <div className="text-sm text-muted-foreground">{user.phone}</div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {user.roles?.map((role, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {role.replace('ROLE_', '')}
                            </Badge>
                          )) || (
                            <Badge variant="outline" className="text-xs">No roles</Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={getUserStatusColor(user) as any}>
                          {getUserStatusText(user)}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewUser(user.id)}
                          >
                            <Icons.star className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePasswordReset(user)}
                          >
                            <Icons.shield className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRoleUpdate(user)}
                          >
                            <Icons.users className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={user.enabled ? "destructive" : "default"}
                            onClick={() => handleToggleUserEnable(user.id, user.enabled)}
                          >
                            {user.enabled ? (
                              <Icons.x className="w-4 h-4" />
                            ) : (
                              <Icons.plus className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} users
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 0}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <Icons.chevronLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                const page = i + Math.max(0, currentPage - 2);
                if (page >= totalPages) return null;
                
                return (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page + 1}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages - 1}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
              <Icons.chevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      <Dialog open={isUserDetailOpen} onOpenChange={setIsUserDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Complete user information and account status
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-3">Personal Information</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Name:</strong> {selectedUser.name}</div>
                      <div><strong>Username:</strong> {selectedUser.username}</div>
                      <div><strong>Email:</strong> {selectedUser.email}</div>
                      {selectedUser.phone && (
                        <div><strong>Phone:</strong> {selectedUser.phone}</div>
                      )}
                      <div><strong>Provider:</strong> {selectedUser.provider || 'Local'}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-3">Account Status</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Status:</strong>
                        <Badge className="ml-2" variant={getUserStatusColor(selectedUser) as any}>
                          {getUserStatusText(selectedUser)}
                        </Badge>
                      </div>
                      <div><strong>Enabled:</strong> {selectedUser.enabled ? 'Yes' : 'No'}</div>
                      <div><strong>Account Locked:</strong> {selectedUser.accountNonLocked === false ? 'Yes' : 'No'}</div>
                      <div><strong>Credentials Expired:</strong> {selectedUser.credentialsNonExpired === false ? 'Yes' : 'No'}</div>
                      <div><strong>Account Expired:</strong> {selectedUser.accountNonExpired === false ? 'Yes' : 'No'}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Roles */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-3">Roles & Permissions</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.roles?.map((role, index) => (
                      <Badge key={index} variant="default">
                        {role.replace('ROLE_', '')}
                      </Badge>
                    )) || (
                      <p className="text-sm text-muted-foreground">No roles assigned</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Timestamps */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-3">Account History</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Created:</strong> {formatDate(selectedUser.createdAt)}</div>
                    <div><strong>Updated:</strong> {formatDate(selectedUser.updatedAt)}</div>
                    {selectedUser.createdBy && (
                      <div><strong>Created By:</strong> {selectedUser.createdBy}</div>
                    )}
                    {selectedUser.updatedBy && (
                      <div><strong>Updated By:</strong> {selectedUser.updatedBy}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Password Reset Modal */}
      <Dialog open={isPasswordResetOpen} onOpenChange={setIsPasswordResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset User Password</DialogTitle>
            <DialogDescription>
              Generate a new password for this user account.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="flex gap-2">
                <Input
                  id="new-password"
                  type="password"
                  value={passwordResetForm.newPassword}
                  onChange={(e) => setPasswordResetForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password"
                />
                <Button type="button" variant="outline" onClick={generateRandomPassword}>
                  Generate
                </Button>
              </div>
              {passwordResetForm.newPassword && (
                <PasswordStrengthMeter password={passwordResetForm.newPassword} />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordResetForm.confirmPassword}
                onChange={(e) => setPasswordResetForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm new password"
              />
            </div>

            {passwordResetForm.newPassword && passwordResetForm.confirmPassword && 
             passwordResetForm.newPassword !== passwordResetForm.confirmPassword && (
              <p className="text-sm text-destructive">Passwords do not match</p>
            )}
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsPasswordResetOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitPasswordReset} 
              disabled={isSubmitting || passwordResetForm.newPassword !== passwordResetForm.confirmPassword}
            >
              {isSubmitting ? (
                <>
                  <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Role Update Modal */}
      <Dialog open={isRoleUpdateOpen} onOpenChange={setIsRoleUpdateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User Roles</DialogTitle>
            <DialogDescription>
              Assign or remove roles for this user account.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-3">
              <Label>Available Roles</Label>
              {availableRoles.map((role) => (
                <div key={role} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={role}
                    name="userRole"
                    checked={roleUpdateForm.roles.includes(role)}
                    onChange={() => toggleRoleSelection(role)}
                    className="checkbox-light-border"
                  />
                  <Label htmlFor={role} className="text-sm cursor-pointer">
                    {role.replace('ROLE_', '').toLowerCase()}
                  </Label>
                </div>
              ))}
            </div>

            <div className="p-3 bg-muted rounded-lg">
              <h4 className="text-sm font-medium mb-2">Selected Role:</h4>
              <div className="flex flex-wrap gap-1">
                {roleUpdateForm.roles.length > 0 ? (
                  <Badge variant="default" className="text-xs">
                    {roleUpdateForm.roles[0].replace('ROLE_', '')}
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">No role selected</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsRoleUpdateOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitRoleUpdate} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Roles'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
