// Google OAuth 2.0 implementation
export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

export interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
  clientId?: string;
}

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: GoogleConfig) => void;
          prompt: (config?: { moment_callback?: (notification: any) => void }) => void;
          renderButton: (parent: HTMLElement, options: GoogleButtonConfig) => void;
          disableAutoSelect: () => void;
          storeCredential: (credential: GoogleCredentialResponse) => void;
          cancel: () => void;
          onGoogleLibraryLoad: () => void;
          revoke: (hint: string, callback: (response: any) => void) => void;
        };
        oauth2: {
          initTokenClient: (config: TokenClientConfig) => TokenClient;
          hasGrantedAllScopes: (tokenResponse: any, ...scopes: string[]) => boolean;
          hasGrantedAnyScope: (tokenResponse: any, ...scopes: string[]) => boolean;
          revoke: (accessToken: string, callback?: (response: any) => void) => void;
        };
      };
    };
  }
}

interface GoogleConfig {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
  context?: 'signin' | 'signup' | 'use';
  itp_support?: boolean;
}

interface GoogleButtonConfig {
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  logo_alignment?: 'left' | 'center';
  width?: string | number;
  locale?: string;
}

interface TokenClientConfig {
  client_id: string;
  scope: string;
  callback: (response: any) => void;
  error_callback?: (error: any) => void;
  state?: string;
}

interface TokenClient {
  requestAccessToken: (overrideConfig?: Partial<TokenClientConfig>) => void;
}

class GoogleOAuthService {
  private clientId: string;
  private isLoaded: boolean = false;
  private loadPromise: Promise<void> | null = null;

  constructor() {
    // You'll need to set this with your actual Google OAuth Client ID
    this.clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  }

  // Load Google Identity Services library
  loadGoogleIdentityServices(): Promise<void> {
    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Google OAuth can only be used in browser environment'));
        return;
      }

      if (window.google?.accounts?.id) {
        this.isLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        this.isLoaded = true;
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Google Identity Services'));
      };

      document.head.appendChild(script);
    });

    return this.loadPromise;
  }

  // Initialize Google Sign-In
  async initialize(callback: (response: GoogleCredentialResponse) => void): Promise<void> {
    if (!this.clientId) {
      throw new Error('Google Client ID not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable.');
    }

    await this.loadGoogleIdentityServices();
    
    window.google.accounts.id.initialize({
      client_id: this.clientId,
      callback: callback,
      auto_select: false,
      cancel_on_tap_outside: true,
    });
  }

  // Render Google Sign-In button
  renderButton(element: HTMLElement, options: Partial<GoogleButtonConfig> = {}): void {
    if (!this.isLoaded) {
      throw new Error('Google Identity Services not loaded');
    }

    const defaultOptions: GoogleButtonConfig = {
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      shape: 'rectangular',
      logo_alignment: 'left',
      width: '100%',
    };

    window.google.accounts.id.renderButton(element, { ...defaultOptions, ...options });
  }

  // Parse JWT credential to get user info
  parseCredential(credential: string): GoogleUser {
    try {
      const payload = credential.split('.')[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      
      return {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        given_name: decoded.given_name,
        family_name: decoded.family_name,
      };
    } catch (error) {
      throw new Error('Failed to parse Google credential');
    }
  }

  // Prompt for Google Sign-In
  prompt(): void {
    if (!this.isLoaded) {
      throw new Error('Google Identity Services not loaded');
    }
    window.google.accounts.id.prompt();
  }

  // Cancel any ongoing sign-in flow
  cancel(): void {
    if (this.isLoaded) {
      window.google.accounts.id.cancel();
    }
  }

  // Disable auto-select
  disableAutoSelect(): void {
    if (this.isLoaded) {
      window.google.accounts.id.disableAutoSelect();
    }
  }
}

// Export singleton instance
export const googleOAuth = new GoogleOAuthService();

// Hook for using Google OAuth in React components
export const useGoogleOAuth = () => {
  const initializeGoogleOAuth = async (callback: (response: GoogleCredentialResponse) => void) => {
    try {
      await googleOAuth.initialize(callback);
      return true;
    } catch (error) {
      console.error('Failed to initialize Google OAuth:', error);
      return false;
    }
  };

  const renderGoogleButton = (element: HTMLElement, options?: Partial<GoogleButtonConfig>) => {
    try {
      googleOAuth.renderButton(element, options);
      return true;
    } catch (error) {
      console.error('Failed to render Google button:', error);
      return false;
    }
  };

  const parseGoogleCredential = (credential: string): GoogleUser | null => {
    try {
      return googleOAuth.parseCredential(credential);
    } catch (error) {
      console.error('Failed to parse Google credential:', error);
      return null;
    }
  };

  return {
    initializeGoogleOAuth,
    renderGoogleButton,
    parseGoogleCredential,
    promptGoogleSignIn: () => googleOAuth.prompt(),
    cancelGoogleSignIn: () => googleOAuth.cancel(),
    disableAutoSelect: () => googleOAuth.disableAutoSelect(),
  };
};
