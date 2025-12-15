/**
 * Validation utilities for Thai PromptPay inputs
 */

// Validate Thai mobile number (must start with 0 and have 10 digits)
export function validateMobileNumber(number) {
  const cleaned = number.replace(/\D/g, '');
  
  if (cleaned.length === 0) {
    return { valid: false, error: null }; // Empty, no error yet
  }
  
  if (cleaned.length !== 10) {
    return { valid: false, error: 'Mobile number must be 10 digits' };
  }
  
  if (!cleaned.startsWith('0')) {
    return { valid: false, error: 'Mobile number must start with 0' };
  }
  
  return { valid: true, error: null };
}

// Luhn algorithm check for Thai National ID
function luhnCheck(id) {
  const digits = id.split('').map(Number);
  
  // Thai National ID Luhn check
  // Weights: 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 for first 12 digits
  // Check digit is the 13th digit
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += digits[i] * (13 - i);
  }
  
  const checkDigit = (11 - (sum % 11)) % 10;
  return checkDigit === digits[12];
}

// Validate Thai National ID (must be 13 digits with valid Luhn checksum)
export function validateNationalId(id) {
  const cleaned = id.replace(/\D/g, '');
  
  if (cleaned.length === 0) {
    return { valid: false, error: null }; // Empty, no error yet
  }
  
  if (cleaned.length !== 13) {
    return { valid: false, error: 'National ID must be 13 digits' };
  }
  
  if (!luhnCheck(cleaned)) {
    return { valid: false, error: 'Invalid National ID checksum' };
  }
  
  return { valid: true, error: null };
}

// Validate amount (optional, must be positive number if provided)
export function validateAmount(amount) {
  if (!amount || amount.trim() === '') {
    return { valid: true, error: null }; // Empty is valid
  }
  
  const num = parseFloat(amount);
  
  if (isNaN(num)) {
    return { valid: false, error: 'Amount must be a valid number' };
  }
  
  if (num < 0) {
    return { valid: false, error: 'Amount cannot be negative' };
  }
  
  if (num > 999999999.99) {
    return { valid: false, error: 'Amount is too large' };
  }
  
  return { valid: true, error: null };
}
