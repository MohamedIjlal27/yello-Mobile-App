export const API_BASE_URL = 'https://uat.yelogroup.biz/api/v1';
// Replace YOUR_IP_ADDRESS with your actual IP (e.g., 192.168.1.5)
export const DASHBOARD_API_URL = 'http://192.168.1.176:3000/api';

// Common headers
export const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'API-Key': 'e945368c4069fb46f001ab87c7ec9cbd89751bf6'
};

// API request timeout in milliseconds
export const REQUEST_TIMEOUT = 30000;

// Error messages
export const API_ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error occurred',
    TIMEOUT: 'Request timed out. Please try again.',
    SERVER_ERROR: 'Server error occurred',
    INVALID_RESPONSE: 'Invalid response from server',
    INVALID_CREDENTIALS: 'Invalid credentials',
    USER_NOT_FOUND: 'User not found',
    PASSWORD_CHANGE_FAILED: 'Failed to change password',
    INVALID_PASSWORD: 'Invalid password format'
}; 