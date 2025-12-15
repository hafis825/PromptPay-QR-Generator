/**
 * Thai PromptPay EMV QRCPS Payload Generator
 * Standard ID: A000000677010111
 */

// Format mobile number to international format (66XXXXXXXXX)
function formatMobileNumber(mobile) {
  // Remove any non-digit characters
  const cleaned = mobile.replace(/\D/g, '');
  
  // Convert 0XXXXXXXXX to 66XXXXXXXXX
  if (cleaned.startsWith('0')) {
    return '0066' + cleaned.substring(1);
  }
  return cleaned;
}

// Format ID for payload (padded to appropriate length with leading zeros)
function formatId(id, type) {
  const cleaned = id.replace(/\D/g, '');
  if (type === 'mobile') {
    return formatMobileNumber(cleaned);
  }
  return cleaned; // National ID stays as-is
}

// Calculate CRC16-CCITT checksum
function crc16(str) {
  let crc = 0xFFFF;
  const polynomial = 0x1021;
  
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ polynomial;
      } else {
        crc = crc << 1;
      }
    }
    crc &= 0xFFFF;
  }
  
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

// Create EMV TLV (Tag-Length-Value) format
function tlv(tag, value) {
  const length = value.length.toString().padStart(2, '0');
  return `${tag}${length}${value}`;
}

// Generate PromptPay EMV QRCPS payload
export function generatePromptPayPayload(id, type, amount = null) {
  // Payload Format Indicator
  let payload = tlv('00', '01');
  
  // Point of Initiation Method
  // 11 = Static (no amount), 12 = Dynamic (with amount)
  payload += tlv('01', amount ? '12' : '11');
  
  // Merchant Account Information for PromptPay
  const promptPayAID = 'A000000677010111'; // PromptPay Application ID
  const formattedId = formatId(id, type);
  
  // Sub-tags for PromptPay
  const idType = type === 'mobile' ? '01' : '02'; // 01 = Mobile, 02 = National ID
  const merchantInfo = tlv('00', promptPayAID) + tlv(idType, formattedId);
  
  // Tag 29 for PromptPay
  payload += tlv('29', merchantInfo);
  
  // Transaction Currency (Tag 53) - THB = 764
  payload += tlv('53', '764');
  
  // Transaction Amount (Tag 54) - Optional
  if (amount && parseFloat(amount) > 0) {
    const formattedAmount = parseFloat(amount).toFixed(2);
    payload += tlv('54', formattedAmount);
  }
  
  // Country Code (Tag 58) - TH
  payload += tlv('58', 'TH');
  
  // CRC (Tag 63) - Calculate at the end
  // First add the CRC tag and length placeholder
  payload += '6304';
  
  // Calculate CRC16 and append
  const crc = crc16(payload);
  payload += crc;
  
  return payload;
}
