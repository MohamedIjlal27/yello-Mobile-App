// Dashboard API URL for configuration
export const DASHBOARD_API_URL = 'http://192.168.1.176:3000/api';

// Common headers
export const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'API-Key': 'e945368c4069fb46f001ab87c7ec9cbd89751bf6'
};

// API request timeout in milliseconds
export const REQUEST_TIMEOUT = 30000;

// Company configuration interface
interface CompanyConfig {
    id: string;
    name: string;
    apiBaseUrl: string;
    isActive: boolean;
}

// Mutable API base URL that will be set after fetching from database
export let API_BASE_URL: string | null = null;

// Function to fetch company configuration and set the API URL
export const fetchCompanyConfig = async (): Promise<void> => {
    try {
        const response = await fetch(`${DASHBOARD_API_URL}/company`, {
            method: 'GET',
            headers: DEFAULT_HEADERS
        });

        if (!response.ok) {
            throw new Error('Failed to fetch company configuration');
        }

        const data: CompanyConfig = await response.json();
        
        // Only update if the company is active and has a valid API URL
        if (data.isActive && data.apiBaseUrl) {
            API_BASE_URL = data.apiBaseUrl.endsWith('/v1') 
                ? data.apiBaseUrl 
                : `${data.apiBaseUrl}/v1`;
            console.log('Updated API base URL:', API_BASE_URL);
        } else {
            throw new Error('Company is inactive or missing API URL');
        }
    } catch (error) {
        console.error('Error fetching company config:', error);
        throw error;
    }
};

// Function to get the API base URL, ensuring it's been initialized
export const getApiBaseUrl = async (): Promise<string> => {
    if (!API_BASE_URL) {
        await fetchCompanyConfig();
        if (!API_BASE_URL) {
            throw new Error('Failed to initialize API base URL');
        }
    }
    return API_BASE_URL;
};

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