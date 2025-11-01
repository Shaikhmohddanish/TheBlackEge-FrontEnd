import { API_BASE_URL, handleAPIResponse } from '../api-client';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  category?: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  businessHours: {
    [key: string]: string;
  };
  supportHours: {
    phone: string;
    chat: string;
    email: string;
  };
}

/**
 * Submit contact form
 */
export const submitContactForm = async (formData: ContactFormData): Promise<ContactResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/contact/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    return await handleAPIResponse(response);
  } catch (error) {
    throw error;
  }
};

/**
 * Get contact information
 */
export const getContactInfo = async (): Promise<{ success: boolean; data: ContactInfo }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/contact/info`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return await handleAPIResponse(response);
  } catch (error) {
    throw error;
  }
};