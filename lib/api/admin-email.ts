import { makeAuthenticatedRequest, handleAPIResponse, API_BASE_URL } from '@/lib/api-client';

export interface EmailServiceStatus {
  emailServiceAvailable: boolean;
  mailSenderConfigured: boolean;
  smtpConnected: boolean;
  invoiceServiceAvailable: boolean;
  templatesLoaded: boolean;
  lastChecked: string;
}

export interface EmailTestRequest {
  email: string;
  name?: string;
  orderNumber?: string;
}

export interface EmailTestResponse {
  success: boolean;
  message: string;
  sentAt?: string;
  recipientEmail?: string;
  subject?: string;
  details?: any;
}

export interface ConnectivityTestResponse {
  success: boolean;
  message: string;
  smtpHost?: string;
  smtpPort?: number;
  connectionTime?: number;
  tlsEnabled?: boolean;
  authenticationMethod?: string;
  details?: any;
}

/**
 * Admin Email Testing API Client
 */

// Get email service status
export const getEmailServiceStatus = async (): Promise<EmailServiceStatus> => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/email/test/status`);
    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to get email service status:', error);
    throw error;
  }
};

// Test email connectivity
export const testEmailConnectivity = async (): Promise<ConnectivityTestResponse> => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/email/test/connectivity`, {
      method: 'POST',
    });
    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to test email connectivity:', error);
    throw error;
  }
};

// Send test welcome email
export const sendTestWelcomeEmail = async (testRequest: EmailTestRequest): Promise<EmailTestResponse> => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/email/test/welcome`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testRequest),
    });
    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to send test welcome email:', error);
    throw error;
  }
};

// Send test password reset email
export const sendTestPasswordResetEmail = async (testRequest: EmailTestRequest): Promise<EmailTestResponse> => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/email/test/password-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testRequest),
    });
    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to send test password reset email:', error);
    throw error;
  }
};

// Send test order confirmation email
export const sendTestOrderConfirmationEmail = async (testRequest: EmailTestRequest): Promise<EmailTestResponse> => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/email/test/order-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testRequest),
    });
    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to send test order confirmation email:', error);
    throw error;
  }
};

// Send test order confirmation email with invoice
export const sendTestOrderConfirmationWithInvoice = async (testRequest: EmailTestRequest): Promise<EmailTestResponse> => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/email/test/order-confirmation-with-invoice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testRequest),
    });
    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to send test order confirmation with invoice:', error);
    throw error;
  }
};

// Download sample invoice PDF
export const downloadSampleInvoice = async (): Promise<Blob> => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/email/test/sample-invoice`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.blob();
  } catch (error) {
    console.error('Failed to download sample invoice:', error);
    throw error;
  }
};

// Download invoice for specific order
export const downloadOrderInvoice = async (orderNumber: string): Promise<Blob> => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/email/test/invoice/${orderNumber}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.blob();
  } catch (error) {
    console.error('Failed to download order invoice:', error);
    throw error;
  }
};

// Utility function to download blob as file
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Email template validation
export const validateEmailRequest = (request: EmailTestRequest, type: 'welcome' | 'password-reset' | 'order-confirmation'): string[] => {
  const errors: string[] = [];

  if (!request.email?.trim()) {
    errors.push('Email address is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.email)) {
    errors.push('Please enter a valid email address');
  }

  if (type === 'welcome' && !request.name?.trim()) {
    errors.push('Name is required for welcome email');
  }

  if (type === 'order-confirmation' && !request.orderNumber?.trim()) {
    errors.push('Order number is required for order confirmation email');
  }

  return errors;
};

// Email service health check
export const isEmailServiceHealthy = (status: EmailServiceStatus): boolean => {
  return status.emailServiceAvailable && 
         status.mailSenderConfigured && 
         status.smtpConnected;
};

// Get service status color for UI
export const getServiceStatusColor = (isHealthy: boolean): string => {
  return isHealthy ? 'success' : 'destructive';
};

// Get service status text
export const getServiceStatusText = (isHealthy: boolean): string => {
  return isHealthy ? 'Healthy' : 'Issues Detected';
};
