'use client';

import React, { useState, useEffect } from 'react';
import { validatePassword, type PasswordValidation } from '@/lib/api/auth';
import { Icons } from '@/components/ui/icons';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PasswordStrengthMeterProps {
  password: string;
  showRequirements?: boolean;
  className?: string;
}

export function PasswordStrengthMeter({ 
  password, 
  showRequirements = true, 
  className 
}: PasswordStrengthMeterProps) {
  const [validation, setValidation] = useState<PasswordValidation>({
    valid: false,
    strength: 0,
    compromised: false,
    errors: []
  });
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (password && password.length > 0) {
      validatePasswordAsync(password);
    } else {
      setValidation({ valid: false, strength: 0, compromised: false, errors: [] });
    }
  }, [password]);

  const validatePasswordAsync = async (password: string) => {
    setIsValidating(true);
    try {
      const result = await validatePassword(password);
      setValidation(result);
    } catch (error) {
      setValidation({
        valid: false,
        strength: 0,
        compromised: false,
        errors: ['Password validation failed. Please try again.']
      });
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

  const getStrengthColor = () => {
    if (validation.strength < 30) return 'bg-red-500';
    if (validation.strength < 60) return 'bg-yellow-500';
    if (validation.strength < 80) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthTextColor = () => {
    if (validation.strength < 30) return 'text-red-600';
    if (validation.strength < 60) return 'text-yellow-600';
    if (validation.strength < 80) return 'text-blue-600';
    return 'text-green-600';
  };

  if (!password) return null;

  return (
    <div className={cn('password-strength-meter mt-2 space-y-2', className)}>
      {/* Strength Bar */}
      <div className="w-full">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn(
              'h-full transition-all duration-300 ease-out',
              getStrengthColor()
            )}
            style={{ width: `${validation.strength}%` }}
          />
        </div>
        
        {/* Strength Info */}
        <div className="flex items-center justify-between mt-1">
          <span className={cn('text-sm font-medium', getStrengthTextColor())}>
            {getStrengthLabel()} ({validation.strength}%)
          </span>
          {isValidating && (
            <Icons.shoppingCart className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
      </div>
      
      {/* Compromise Warning */}
      {validation.compromised && (
        <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <Icons.shoppingCart className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
          <div className="text-sm text-yellow-800">
            <span className="font-medium">Security Warning:</span> This password has been found in data breaches. 
            Consider using a different password for better security.
          </div>
        </div>
      )}
      
      {/* Password Requirements */}
      {showRequirements && validation.errors.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Password Requirements:</div>
          <div className="space-y-1">
            {validation.errors.map((error, index) => (
              <div key={index} className="flex items-start gap-2 text-sm text-red-600">
                <Icons.x className="h-3 w-3 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Success State */}
      {validation.valid && !validation.compromised && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <Icons.shoppingCart className="h-4 w-4" />
          <span>Password meets all security requirements</span>
        </div>
      )}
    </div>
  );
}
