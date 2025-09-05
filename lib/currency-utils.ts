// Currency utility functions for Indian market
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatPrice(amount: number): string {
  return formatINR(amount);
}

// Convert USD to INR (approximate rate: 1 USD = 83 INR)
export function convertUSDToINR(usdAmount: number): number {
  return Math.round(usdAmount * 83);
}
