/**
 * Company API client
 */

import { companyDetails } from '@/lib/config/company-details';

export interface CompanyDetails {
  appName: string;
  appVersion: string;
  appDescription: string;
  supportEmail: string;
  companyName: string;
  legalName: string;
  gstin: string;
  pan: string;
  udyamRegistration: string;
  businessType: string;
  mobile: string;
  address: CompanyAddress;
}

export interface CompanyAddress {
  flat: string;
  building: string;
  road: string;
  locality: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  country: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

/**
 * Get company details from backend API
 */
export const getCompanyDetails = async (): Promise<CompanyDetails> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/company/details`);
    if (!response.ok) {
      throw new Error('Failed to fetch company details');
    }
    return await response.json();
  } catch (error) {
    // Fallback to static configuration
    return {
      appName: companyDetails.tradeName,
      appVersion: '1.0.0',
      appDescription: 'Premium streetwear e-commerce platform',
      supportEmail: companyDetails.email,
      companyName: companyDetails.tradeName,
      legalName: companyDetails.legalName,
      gstin: companyDetails.gstin,
      pan: companyDetails.pan,
      udyamRegistration: companyDetails.udyamRegistrationNumber,
      businessType: companyDetails.businessType,
      mobile: companyDetails.mobile,
      address: {
        flat: companyDetails.address.flat,
        building: companyDetails.address.building,
        road: companyDetails.address.road,
        locality: companyDetails.address.locality,
        city: companyDetails.address.city,
        district: companyDetails.address.district,
        state: companyDetails.address.state,
        pincode: companyDetails.address.pincode,
        country: companyDetails.address.country
      }
    };
  }
};

/**
 * Get formatted company address
 */
export const getFormattedAddress = async (): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/company/address`);
    if (!response.ok) {
      throw new Error('Failed to fetch address');
    }
    return await response.text();
  } catch (error) {
    // Fallback to static configuration
    return companyDetails.address.flat + ', ' + 
           companyDetails.address.building + ', ' + 
           companyDetails.address.road + ', ' + 
           companyDetails.address.locality + ', ' + 
           companyDetails.address.city + ', ' + 
           companyDetails.address.state + ' - ' + 
           companyDetails.address.pincode + ', ' + 
           companyDetails.address.country;
  }
};

/**
 * Get short company address
 */
export const getShortAddress = async (): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/company/address/short`);
    if (!response.ok) {
      throw new Error('Failed to fetch short address');
    }
    return await response.text();
  } catch (error) {
    // Fallback to static configuration
    return companyDetails.address.city + ', ' + 
           companyDetails.address.state + ' - ' + 
           companyDetails.address.pincode;
  }
};

/**
 * Get GST display information
 */
export const getGstDisplay = async (): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/company/gst`);
    if (!response.ok) {
      throw new Error('Failed to fetch GST info');
    }
    return await response.text();
  } catch (error) {
    // Fallback to static configuration
    return companyDetails.gstin + ' (' + companyDetails.address.state + ')';
  }
};

/**
 * Get Udyam registration display
 */
export const getUdyamDisplay = async (): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/company/udyam`);
    if (!response.ok) {
      throw new Error('Failed to fetch Udyam info');
    }
    return await response.text();
  } catch (error) {
    // Fallback to static configuration
    return companyDetails.udyamRegistrationNumber + ' (Micro)';
  }
};
