# Password Security - UI Integration Guide

## 📋 Overview
This document provides the UI team with comprehensive integration instructions for the new **Enhanced Password Security System** including HaveIBeenPwned integration, password strength validation, and secure authentication flows.

---

## 🚀 New Security Features for UI Integration

### ✅ **Backend Security Updates Completed**
1. **Advanced Password Validation**: Multi-criteria password strength checking
2. **HaveIBeenPwned Integration**: Real-time compromised password detection
3. **BCrypt Encryption**: Industry-standard password hashing
4. **Password Strength Scoring**: 0-100 strength calculation with visual feedback
5. **Secure Authentication**: JWT-based auth with comprehensive user management
6. **Admin Security Controls**: Password reset, account management
7. **Real-time Validation**: Instant password checking API

### 🎯 **UI Components Required**
1. **Enhanced Registration Form**: Password validation with real-time feedback
2. **Secure Login Form**: Improved authentication with better error handling
3. **Password Strength Meter**: Visual strength indicator with color coding
4. **Password Change Form**: Secure password updates
5. **Admin User Management**: Password reset and account controls
6. **Compromise Warning**: Alert users about compromised passwords

---

## 🔗 API Endpoints

### **Public Authentication APIs**

#### 1. User Registration (Enhanced)
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecureP@ssw0rd123!",
  "phone": "+1-555-0123"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "phone": "+1-555-0123",
    "enabled": true,
    "roles": ["ROLE_USER"],
    "createdAt": "2024-09-01T10:00:00"
  }
}
```

**Password Validation Error Response:**
```json
{
  "success": false,
  "message": "Password validation failed: Password must contain at least one uppercase letter; Password must contain at least one special character; This password has been found in data breaches. Please choose a different password"
}
```

#### 2. Real-time Password Validation
```http
POST /api/auth/validate-password
Content-Type: application/json

{
  "password": "TestPassword123!"
}
```

**Response:**
```json
{
  "valid": true,
  "strength": 85,
  "compromised": false,
  "errors": []
}
```

**Example with Validation Errors:**
```json
{
  "valid": false,
  "strength": 25,
  "compromised": true,
  "errors": [
    "Password must contain at least one uppercase letter",
    "Password must contain at least one special character",
    "This password has been found in data breaches. Please choose a different password"
  ]
}
```

#### 3. User Login (Enhanced)
```http
POST /api/auth/login
Content-Type: application/json

{
  "usernameOrEmail": "johndoe",
  "password": "SecureP@ssw0rd123!"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "name": "John Doe",
    "email": "john@example.com",
    "roles": ["ROLE_USER"]
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

#### 4. Change Password
```http
POST /api/auth/change-password
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewSecureP@ssw0rd456!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

#### 5. Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "phone": "+1-555-0123",
  "enabled": true,
  "roles": ["ROLE_USER"],
  "createdAt": "2024-09-01T10:00:00"
}
```

#### 6. Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "phone": "+1-555-0124"
}
```

### **Admin APIs (Requires ADMIN role)**

#### 1. Reset User Password
```http
POST /api/admin/users/{userId}/reset-password
Authorization: Bearer {admin_jwt_token}
Content-Type: application/json

{
  "newPassword": "TempP@ssw0rd789!"
}
```

#### 2. Lock/Unlock User Account
```http
POST /api/admin/users/{userId}/lock
Authorization: Bearer {admin_jwt_token}
Content-Type: application/json

{
  "lock": true
}
```

#### 3. Enable/Disable User Account
```http
POST /api/admin/users/{userId}/enable
Authorization: Bearer {admin_jwt_token}
Content-Type: application/json

{
  "enable": false
}
```

#### 4. Get User Details (Admin)
```http
GET /api/admin/users/{userId}
Authorization: Bearer {admin_jwt_token}
```

---

## 🎨 UI Components Implementation

### **1. Enhanced Registration Form**

#### **React Component**
```jsx
import React, { useState, useEffect } from 'react';
import './PasswordSecurity.css';

const EnhancedRegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    phone: ''
  });
  
  const [passwordValidation, setPasswordValidation] = useState({
    valid: false,
    strength: 0,
    compromised: false,
    errors: []
  });
  
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real-time password validation
  useEffect(() => {
    if (formData.password.length > 0) {
      validatePassword(formData.password);
    } else {
      setPasswordValidation({ valid: false, strength: 0, compromised: false, errors: [] });
    }
  }, [formData.password]);

  const validatePassword = async (password) => {
    setIsValidating(true);
    try {
      const response = await fetch('/api/auth/validate-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      const result = await response.json();
      setPasswordValidation(result);
    } catch (error) {
      console.error('Password validation failed:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwordValidation.valid) {
      alert('Please fix password validation errors before submitting');
      return;
    }

    if (passwordValidation.compromised) {
      const confirm = window.confirm(
        'This password has been found in data breaches. Are you sure you want to use it?'
      );
      if (!confirm) return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('Registration successful!');
        // Redirect to login or dashboard
        window.location.href = '/login';
      } else {
        alert(`Registration failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStrengthLabel = () => {
    if (passwordValidation.strength < 30) return 'Weak';
    if (passwordValidation.strength < 60) return 'Medium';
    if (passwordValidation.strength < 80) return 'Strong';
    return 'Very Strong';
  };

  const getStrengthClass = () => {
    if (passwordValidation.strength < 30) return 'weak';
    if (passwordValidation.strength < 60) return 'medium';
    if (passwordValidation.strength < 80) return 'strong';
    return 'very-strong';
  };

  return (
    <div className="registration-form-container">
      <h2>Create Account</h2>
      
      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            placeholder="Choose a username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">
            Password
            {isValidating && <span className="validating"> 🔄</span>}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            placeholder="Create a strong password"
          />
          
          {/* Password Strength Meter */}
          {formData.password && (
            <div className="password-strength-container">
              <div className="strength-meter-background">
                <div 
                  className={`strength-meter-fill ${getStrengthClass()}`}
                  style={{ width: `${passwordValidation.strength}%` }}
                />
              </div>
              
              <div className="strength-info">
                <span className={`strength-label ${getStrengthClass()}`}>
                  {getStrengthLabel()} ({passwordValidation.strength}%)
                </span>
              </div>
              
              {/* Compromise Warning */}
              {passwordValidation.compromised && (
                <div className="compromise-warning">
                  ⚠️ This password has been found in data breaches. Consider using a different password.
                </div>
              )}
              
              {/* Validation Errors */}
              {passwordValidation.errors.length > 0 && (
                <div className="password-errors">
                  <div className="errors-title">Password Requirements:</div>
                  {passwordValidation.errors.map((error, index) => (
                    <div key={index} className="error-item">• {error}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone (Optional)</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Enter your phone number"
          />
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={!passwordValidation.valid || isSubmitting}
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default EnhancedRegistrationForm;
```

### **2. Password Strength Component (Reusable)**

```jsx
import React, { useState, useEffect } from 'react';

const PasswordStrengthMeter = ({ password, showRequirements = true }) => {
  const [validation, setValidation] = useState({
    valid: false,
    strength: 0,
    compromised: false,
    errors: []
  });
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (password && password.length > 0) {
      validatePassword(password);
    } else {
      setValidation({ valid: false, strength: 0, compromised: false, errors: [] });
    }
  }, [password]);

  const validatePassword = async (password) => {
    setIsValidating(true);
    try {
      const response = await fetch('/api/auth/validate-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      const result = await response.json();
      setValidation(result);
    } catch (error) {
      console.error('Password validation failed:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const getStrengthLabel = () => {
    if (validation.strength < 30) return 'Weak';
    if (validation.strength < 60) return 'Medium';
    if (validation.strength < 80) return 'Strong';
    return 'Very Strong';
  };

  const getStrengthClass = () => {
    if (validation.strength < 30) return 'weak';
    if (validation.strength < 60) return 'medium';
    if (validation.strength < 80) return 'strong';
    return 'very-strong';
  };

  if (!password) return null;

  return (
    <div className="password-strength-meter">
      <div className="strength-meter-background">
        <div 
          className={`strength-meter-fill ${getStrengthClass()}`}
          style={{ width: `${validation.strength}%` }}
        />
      </div>
      
      <div className="strength-info">
        <span className={`strength-label ${getStrengthClass()}`}>
          {getStrengthLabel()} ({validation.strength}%)
        </span>
        {isValidating && <span className="validating"> 🔄</span>}
      </div>
      
      {validation.compromised && (
        <div className="compromise-warning">
          ⚠️ This password has been found in data breaches
        </div>
      )}
      
      {showRequirements && validation.errors.length > 0 && (
        <div className="password-requirements">
          <div className="requirements-title">Requirements:</div>
          {validation.errors.map((error, index) => (
            <div key={index} className="requirement-item">• {error}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;
```

### **3. Enhanced Login Form**

```jsx
import React, { useState } from 'react';

const EnhancedLoginForm = () => {
  const [credentials, setCredentials] = useState({
    usernameOrEmail: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Store token and user info
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <h2>Sign In</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="usernameOrEmail">Username or Email</label>
          <input
            type="text"
            id="usernameOrEmail"
            name="usernameOrEmail"
            value={credentials.usernameOrEmail}
            onChange={handleInputChange}
            required
            placeholder="Enter username or email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleInputChange}
            required
            placeholder="Enter your password"
          />
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      
      <div className="form-footer">
        <a href="/forgot-password">Forgot Password?</a>
        <span> | </span>
        <a href="/register">Create Account</a>
      </div>
    </div>
  );
};

export default EnhancedLoginForm;
```

### **4. Password Change Form**

```jsx
import React, { useState } from 'react';
import PasswordStrengthMeter from './PasswordStrengthMeter';

const PasswordChangeForm = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleInputChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value
    });
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage('New passwords do not match');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessage('Password changed successfully');
        setMessageType('success');
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessage(result.message || 'Password change failed');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Password change error:', error);
      setMessage('Password change failed. Please try again.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="password-change-container">
      <h3>Change Password</h3>
      
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="password-change-form">
        <div className="form-group">
          <label htmlFor="currentPassword">Current Password</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={passwords.currentPassword}
            onChange={handleInputChange}
            required
            placeholder="Enter current password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handleInputChange}
            required
            placeholder="Enter new password"
          />
          
          <PasswordStrengthMeter password={passwords.newPassword} />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handleInputChange}
            required
            placeholder="Confirm new password"
          />
          
          {passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword && (
            <div className="error-text">Passwords do not match</div>
          )}
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isLoading || passwords.newPassword !== passwords.confirmPassword}
        >
          {isLoading ? 'Changing Password...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

export default PasswordChangeForm;
```

### **5. Admin User Management Component**

```jsx
import React, { useState, useEffect } from 'react';

const AdminUserManagement = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!newPassword) {
      alert('Please enter a new password');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessage('Password reset successfully');
        setNewPassword('');
      } else {
        setMessage(`Failed to reset password: ${result.message}`);
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setMessage('Password reset failed');
    }
  };

  const toggleUserLock = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${userId}/lock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ lock: !user.accountNonLocked })
      });
      
      if (response.ok) {
        setUser({ ...user, accountNonLocked: !user.accountNonLocked });
        setMessage(`User ${user.accountNonLocked ? 'locked' : 'unlocked'} successfully`);
      }
    } catch (error) {
      console.error('Toggle lock error:', error);
      setMessage('Failed to update user lock status');
    }
  };

  const toggleUserEnable = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${userId}/enable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ enable: !user.enabled })
      });
      
      if (response.ok) {
        setUser({ ...user, enabled: !user.enabled });
        setMessage(`User ${user.enabled ? 'disabled' : 'enabled'} successfully`);
      }
    } catch (error) {
      console.error('Toggle enable error:', error);
      setMessage('Failed to update user enable status');
    }
  };

  if (isLoading) return <div>Loading user details...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="admin-user-management">
      <h3>User Management</h3>
      
      {message && (
        <div className="admin-message">
          {message}
        </div>
      )}
      
      <div className="user-info">
        <h4>User Details</h4>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Status:</strong> 
          <span className={user.enabled ? 'status-enabled' : 'status-disabled'}>
            {user.enabled ? 'Enabled' : 'Disabled'}
          </span>
        </p>
        <p><strong>Account:</strong> 
          <span className={user.accountNonLocked ? 'status-unlocked' : 'status-locked'}>
            {user.accountNonLocked ? 'Unlocked' : 'Locked'}
          </span>
        </p>
      </div>
      
      <div className="admin-actions">
        <h4>Admin Actions</h4>
        
        <div className="action-group">
          <h5>Reset Password</h5>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
          <button onClick={resetPassword} className="action-button reset">
            Reset Password
          </button>
        </div>
        
        <div className="action-group">
          <h5>Account Controls</h5>
          <button 
            onClick={toggleUserLock} 
            className={`action-button ${user.accountNonLocked ? 'lock' : 'unlock'}`}
          >
            {user.accountNonLocked ? 'Lock Account' : 'Unlock Account'}
          </button>
          
          <button 
            onClick={toggleUserEnable} 
            className={`action-button ${user.enabled ? 'disable' : 'enable'}`}
          >
            {user.enabled ? 'Disable User' : 'Enable User'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;
```

---

## 🎨 CSS Styles

### **Password Security Styles (`PasswordSecurity.css`)**

```css
/* Password Strength Meter */
.password-strength-container {
  margin-top: 8px;
}

.strength-meter-background {
  width: 100%;
  height: 6px;
  background-color: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}

.strength-meter-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 3px;
}

.strength-meter-fill.weak {
  background: linear-gradient(90deg, #ff4444, #ff6666);
}

.strength-meter-fill.medium {
  background: linear-gradient(90deg, #ffaa00, #ffcc44);
}

.strength-meter-fill.strong {
  background: linear-gradient(90deg, #44aa44, #66cc66);
}

.strength-meter-fill.very-strong {
  background: linear-gradient(90deg, #008800, #44aa44);
}

.strength-info {
  margin-top: 5px;
  font-size: 0.9em;
}

.strength-label.weak { color: #ff4444; }
.strength-label.medium { color: #ffaa00; }
.strength-label.strong { color: #44aa44; }
.strength-label.very-strong { color: #008800; }

.validating {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Compromise Warning */
.compromise-warning {
  background: #fff3cd;
  border: 1px solid #ffecb5;
  color: #856404;
  padding: 10px;
  border-radius: 5px;
  margin-top: 8px;
  font-size: 0.9em;
}

/* Password Requirements */
.password-errors,
.password-requirements {
  margin-top: 8px;
  padding: 10px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  font-size: 0.85em;
}

.errors-title,
.requirements-title {
  font-weight: bold;
  margin-bottom: 5px;
  color: #495057;
}

.error-item,
.requirement-item {
  color: #dc3545;
  margin-bottom: 2px;
}

/* Form Styles */
.registration-form-container,
.login-form-container,
.password-change-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.submit-button {
  width: 100%;
  padding: 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background: #0056b3;
}

.submit-button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

/* Message Styles */
.error-message {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
  padding: 12px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.message.success {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
  padding: 12px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.message.error {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
  padding: 12px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.error-text {
  color: #dc3545;
  font-size: 0.9em;
  margin-top: 5px;
}

/* Admin Styles */
.admin-user-management {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.user-info {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.status-enabled { color: #28a745; }
.status-disabled { color: #dc3545; }
.status-unlocked { color: #28a745; }
.status-locked { color: #dc3545; }

.admin-actions {
  border-top: 1px solid #dee2e6;
  padding-top: 20px;
}

.action-group {
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 5px;
}

.action-group h5 {
  margin-bottom: 10px;
  color: #495057;
}

.action-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  margin-top: 5px;
  font-weight: bold;
}

.action-button.reset {
  background: #ffc107;
  color: #212529;
}

.action-button.lock {
  background: #dc3545;
  color: white;
}

.action-button.unlock {
  background: #28a745;
  color: white;
}

.action-button.disable {
  background: #6c757d;
  color: white;
}

.action-button.enable {
  background: #007bff;
  color: white;
}

.action-button:hover {
  opacity: 0.8;
}

.admin-message {
  background: #d1ecf1;
  border: 1px solid #bee5eb;
  color: #0c5460;
  padding: 12px;
  border-radius: 5px;
  margin-bottom: 20px;
}

/* Form Footer */
.form-footer {
  text-align: center;
  margin-top: 20px;
  color: #6c757d;
}

.form-footer a {
  color: #007bff;
  text-decoration: none;
}

.form-footer a:hover {
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 768px) {
  .registration-form-container,
  .login-form-container,
  .password-change-container,
  .admin-user-management {
    padding: 15px;
    margin: 10px;
  }
  
  .action-button {
    width: 100%;
    margin-right: 0;
    margin-bottom: 10px;
  }
}
```

---

## 📱 JavaScript Utilities

### **Authentication Helper**

```javascript
// auth.js - Authentication utility functions

class AuthService {
  constructor() {
    this.baseURL = '/api/auth';
  }

  // Get stored token
  getToken() {
    return localStorage.getItem('token');
  }

  // Get stored user
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;
    
    // Check if token is expired (basic check)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch (e) {
      return false;
    }
  }

  // Validate password strength
  async validatePassword(password) {
    try {
      const response = await fetch(`${this.baseURL}/validate-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      return await response.json();
    } catch (error) {
      console.error('Password validation failed:', error);
      return { valid: false, strength: 0, errors: ['Validation failed'] };
    }
  }

  // Register user
  async register(userData) {
    try {
      const response = await fetch(`${this.baseURL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      const result = await response.json();
      
      if (result.success && result.token) {
        this.setAuthData(result.token, result.user);
      }
      
      return result;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  // Login user
  async login(credentials) {
    try {
      const response = await fetch(`${this.baseURL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      const result = await response.json();
      
      if (result.success && result.token) {
        this.setAuthData(result.token, result.user);
      }
      
      return result;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await fetch(`${this.baseURL}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      
      return await response.json();
    } catch (error) {
      console.error('Password change failed:', error);
      throw error;
    }
  }

  // Get user profile
  async getProfile() {
    try {
      const response = await fetch(`${this.baseURL}/profile`, {
        headers: { 'Authorization': `Bearer ${this.getToken()}` }
      });
      
      if (response.ok) {
        return await response.json();
      }
      
      throw new Error('Failed to get profile');
    } catch (error) {
      console.error('Get profile failed:', error);
      throw error;
    }
  }

  // Update profile
  async updateProfile(profileData) {
    try {
      const response = await fetch(`${this.baseURL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify(profileData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // Update stored user data
        localStorage.setItem('user', JSON.stringify(result));
      }
      
      return result;
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  }

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  // Set authentication data
  setAuthData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Make authenticated request
  async authenticatedRequest(url, options = {}) {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('No authentication token');
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (response.status === 401) {
      this.logout(); // Token expired
      throw new Error('Authentication expired');
    }

    return response;
  }
}

// Export singleton instance
const authService = new AuthService();
export default authService;
```

### **Password Validation Utility**

```javascript
// passwordUtils.js - Password validation utilities

export const PasswordValidator = {
  // Real-time validation
  async validatePassword(password) {
    try {
      const response = await fetch('/api/auth/validate-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      return await response.json();
    } catch (error) {
      console.error('Password validation failed:', error);
      return { valid: false, strength: 0, errors: ['Validation failed'] };
    }
  },

  // Client-side basic validation
  validateBasic(password) {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one digit');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  },

  // Calculate basic strength score
  calculateBasicStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score += 25;
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;
    if (/[A-Z]/.test(password)) score += 10;
    if (/[a-z]/.test(password)) score += 10;
    if (/\d/.test(password)) score += 10;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 15;
    
    return Math.min(100, score);
  },

  // Get strength label
  getStrengthLabel(strength) {
    if (strength < 30) return 'Weak';
    if (strength < 60) return 'Medium';
    if (strength < 80) return 'Strong';
    return 'Very Strong';
  },

  // Get strength color
  getStrengthColor(strength) {
    if (strength < 30) return '#ff4444';
    if (strength < 60) return '#ffaa00';
    if (strength < 80) return '#44aa44';
    return '#008800';
  }
};
```

---

## 🧪 Testing

### **Test Cases for UI Components**

1. **Password Strength Testing**:
   - Test with weak password: `weak`
   - Test with medium password: `Password123`
   - Test with strong password: `SecureP@ssw0rd123!`
   - Test with compromised password: `123456789`

2. **Registration Flow Testing**:
   - Test successful registration
   - Test duplicate username/email
   - Test password validation errors
   - Test compromise warning flow

3. **Login Flow Testing**:
   - Test successful login
   - Test invalid credentials
   - Test account locked/disabled scenarios

### **Example Testing Data**

```javascript
// Test passwords for different scenarios
const testPasswords = {
  weak: 'weak',
  tooShort: '1234',
  noUppercase: 'password123!',
  noLowercase: 'PASSWORD123!',
  noDigits: 'Password!',
  noSpecial: 'Password123',
  common: 'password123',
  compromised: '123456789',
  strong: 'SecureP@ssw0rd123!',
  veryStrong: 'MyVerySecure&Complex!P@ssw0rd2024'
};

// Test user registration data
const testUser = {
  name: 'Test User',
  username: 'testuser',
  email: 'test@example.com',
  password: 'SecureP@ssw0rd123!',
  phone: '+1-555-0123'
};
```

---

## 📞 Implementation Support

### **Integration Checklist**

#### **For UI Team:**
- [ ] Implement enhanced registration form with password validation
- [ ] Add password strength meter component
- [ ] Create secure login form
- [ ] Implement password change functionality
- [ ] Add admin user management interface
- [ ] Include compromise warning alerts
- [ ] Add CSS styling for security components
- [ ] Implement real-time password validation
- [ ] Add error handling for API calls
- [ ] Test with provided test cases

#### **Key Integration Points:**
- [ ] Replace existing registration form
- [ ] Update login form with enhanced error handling
- [ ] Add password change to user profile
- [ ] Integrate admin controls in admin panel
- [ ] Add security indicators throughout app
- [ ] Update password-related forms
- [ ] Add loading states for async operations
- [ ] Implement responsive design for mobile

### **API Rate Limiting Notes**
- Password validation API is cached on backend
- HaveIBeenPwned checks are throttled to prevent abuse
- Consider debouncing real-time validation calls
- Implement fallback for API failures

---

This comprehensive guide provides everything needed to integrate the enhanced password security system into your frontend application. The APIs are fully functional and ready for integration with proper error handling, real-time validation, and security best practices!
