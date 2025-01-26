export const API_BASE_URL = 'https://yelo-uat.cloudpepper.site/api/v1';

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
    NETWORK_ERROR: 'Network error. Please check your internet connection.',
    TIMEOUT: 'Request timed out. Please try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
    INVALID_RESPONSE: 'Invalid response from server.',
}; 