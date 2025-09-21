/**
 * Official Company Details - The Blackege
 * Based on GST Registration and Udyam Registration Certificates
 */

export const companyDetails = {
  // Basic Company Information
  legalName: "FARHAN ISRAR ANSARI",
  tradeName: "THE BLACKEGE",
  businessType: "Proprietorship",
  constitution: "Proprietorship",
  
  // Registration Details
  gstin: "27DYUPA2569B1ZB",
  pan: "DYUPA2569B",
  udyamRegistrationNumber: "UDYAM-MH-33-0481702",
  enterpriseType: "Micro",
  majorActivity: "Manufacturing",
  
  // Contact Information
  email: "theblackege0313@gmail.com",
  mobile: "8268772848",
  
  // Official Address (Principal Place of Business)
  address: {
    flat: "302, A Wing",
    building: "Arafat Apartment",
    road: "Amrut Nagar",
    locality: "Pipe Compound, Amrut Nagar",
    city: "Kalyan",
    district: "Thane",
    state: "Maharashtra",
    pincode: "400612",
    country: "India"
  },
  
  // Business Details
  dateOfIncorporation: "01/06/2024",
  dateOfCommencement: "01/06/2024",
  dateOfLiability: "01/06/2024",
  
  // Industry Classification
  industryCode: {
    nic2Digit: "13",
    nic2DigitDesc: "Manufacture of textiles",
    nic4Digit: "1313", 
    nic4DigitDesc: "Finishing of textiles",
    nic5Digit: "13136",
    nic5DigitDesc: "Activity related to screen printing"
  },
  
  // Employment Details
  employment: {
    male: 1,
    female: 0,
    other: 0,
    total: 1
  },
  
  // Investment Details
  investment: {
    plantAndMachinery: 80000.00,
    totalTurnover: 50000.00,
    exportTurnover: 0.00,
    netTurnover: 50000.00
  },
  
  // Bank Details
  bank: {
    name: "KOTAK MAHINDRA",
    ifscCode: "KKBK0001353",
    accountNumber: "5748713663"
  },
  
  // Jurisdictional Details
  jurisdictionalOffice: "THANE CITY",
  stateTaxOfficer: "NARENDRA MANOHAR BHAGWAT",
  designation: "State Tax Officer",
  
  // Registration Period
  registrationPeriod: {
    from: "01/06/2024",
    to: "Not Applicable"
  },
  
  // Social Category
  socialCategory: "General",
  gender: "Male",
  speciallyAbled: false,
  
  // Coordinates
  coordinates: {
    latitude: 19.175200918369672,
    longitude: 73.01937517484912
  }
};

// Helper functions
export const getFullAddress = () => {
  const { address } = companyDetails;
  return `${address.flat}, ${address.building}, ${address.road}, ${address.locality}, ${address.city}, ${address.district}, ${address.state} - ${address.pincode}, ${address.country}`;
};

export const getShortAddress = () => {
  const { address } = companyDetails;
  return `${address.city}, ${address.state} - ${address.pincode}`;
};

export const getGSTDisplay = () => {
  return `${companyDetails.gstin} (${companyDetails.address.state})`;
};

export const getUdyamDisplay = () => {
  return `${companyDetails.udyamRegistrationNumber} (${companyDetails.enterpriseType})`;
};

export const getIndustryDescription = () => {
  const { industryCode } = companyDetails;
  return `${industryCode.nic5DigitDesc} - ${industryCode.nic4DigitDesc}`;
};
