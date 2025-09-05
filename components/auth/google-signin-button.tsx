'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { useGoogleOAuth, type GoogleUser } from '@/lib/google-oauth';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';

interface GoogleSignInButtonProps {
  mode: 'signin' | 'signup';
  onSuccess?: (user: GoogleUser) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
}

export function GoogleSignInButton({ 
  mode, 
  onSuccess, 
  onError, 
  disabled = false,
  className = "" 
}: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const { loginWithGoogle, registerWithGoogle } = useAuth();
  const { toast } = useToast();
  
  const {
    initializeGoogleOAuth,
    renderGoogleButton,
    parseGoogleCredential,
  } = useGoogleOAuth();

  useEffect(() => {
    const initGoogle = async () => {
      try {
        const success = await initializeGoogleOAuth(async (response) => {
          await handleGoogleResponse(response.credential);
        });
        
        if (success && buttonRef.current) {
          setIsInitialized(true);
          renderGoogleButton(buttonRef.current, {
            theme: 'outline',
            size: 'large',
            text: mode === 'signin' ? 'signin_with' : 'signup_with',
            shape: 'rectangular',
            width: '100%',
          });
        }
      } catch (error) {
        console.error('Failed to initialize Google OAuth:', error);
        onError?.('Failed to initialize Google sign-in');
      }
    };

    if (!disabled) {
      initGoogle();
    }
  }, [mode, disabled, onError]);

  const handleGoogleResponse = async (credential: string) => {
    try {
      setIsLoading(true);
      
      const googleUser = parseGoogleCredential(credential);
      if (!googleUser) {
        throw new Error('Failed to parse Google credentials');
      }

      // Call appropriate auth method based on mode
      const googleData = { credential };
      
      if (mode === 'signin') {
        await loginWithGoogle(googleData);
        toast({
          title: 'Welcome back!',
          description: `Signed in successfully as ${googleUser.name}`,
        });
      } else {
        await registerWithGoogle(googleData);
        toast({
          title: 'Account created!',
          description: `Welcome to THE BLACKEGE, ${googleUser.name}!`,
        });
      }

      onSuccess?.(googleUser);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      console.error('Google authentication failed:', error);
      
      toast({
        title: 'Authentication failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFallbackClick = () => {
    if (disabled || isLoading) return;
    
    toast({
      title: 'Google Sign-In unavailable',
      description: 'Please ensure you have a stable internet connection and try again.',
      variant: 'destructive',
    });
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Google Sign-In Button Container */}
      <div 
        ref={buttonRef} 
        className={`w-full ${!isInitialized ? 'hidden' : ''}`}
        style={{ minHeight: '44px' }}
      />
      
      {/* Fallback Button */}
      {!isInitialized && (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleFallbackClick}
          disabled={disabled || isLoading}
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {mode === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}
        </Button>
      )}
      
      {/* Loading Overlay */}
      {isLoading && isInitialized && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-md">
          <Icons.spinner className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      )}
    </div>
  );
}

// Simplified Google OAuth Button (without auth integration)
export function SimpleGoogleButton({ 
  text = 'Continue with Google',
  onClick,
  disabled = false,
  isLoading = false,
}: {
  text?: string;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      {text}
    </Button>
  );
}
