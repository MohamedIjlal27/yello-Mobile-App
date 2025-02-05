import { API_BASE_URL, DEFAULT_HEADERS, API_ERROR_MESSAGES, DASHBOARD_API_URL } from './config';

// Interface definitions for invoice data
interface LocalizedString {
    en_US: string;
}

// Login interfaces
interface LoginParams {
    user_id: string;
    email: string;
    password: string;
    biometrics: string;
}

export interface LoginResponse {
    jsonrpc: string;
    id: null;
    result: {
        message: string;
        emp_id: number;
        emp_name: string;
        job_title: {
            en_US: string;
        };
        profile_pic: string | null;
        sales_id: number;
        sales_name: string;
        user_id?: string;
        role?: string;
    };
}

export interface Product {
    product_id: number;
    product_name: LocalizedString;
    quantity: number;
    uom: LocalizedString;
    unit_price: number;
    discount_percentage: number;
    line_amount: number;
}

export interface Customer {
    name: string;
    address: string;
}

export interface Order {
    order_id: number;
    order_number: number;
    order_date: string;
    total_amount: number;
    customer: Customer;
    order_lines: Product[];
}

export interface InvoiceReceiptsResponse {
    jsonrpc: string;
    id: null;
    result: {
        total_orders: number;
        orders: Order[];
    };
}

// Biometric interfaces
interface BiometricEnrollParams {
    userId: string;
    biometricHash: string;
}

interface BiometricEnrollResponse {
    jsonrpc: string;
    id: null;
    result: {
        message: string;
    };
}

// Discount Adjustment interfaces
interface DiscountAdjustmentParams {
    type: 'adjustment' | 'cancel';
    salesperson_id: string;
    sales_order_id: string;
    description?: string;
    value: string;
}

interface DiscountAdjustmentResponse {
    jsonrpc: string;
    id: null;
    result: {
        message: string;
        sales_order_id: string;
    };
}

// Image Attachment interfaces
export interface ImageAttachmentParams {
    sales_order_id: string;
    image_base64: string;
    filename: string;
}

export interface ImageAttachmentResponse {
    jsonrpc: string;
    id: null;
    result: {
        message?: string;
        attachment_id?: number;
        error?: string;
        bank_accounts?: { [key: string]: string };
        customer_accounts?: string[];
    };
}

// Payment Creation interfaces
interface CreatePaymentParams {
    salesperson_id: number;
    sales_order_id: number;
    amount: number;
    date: string;
    type: string;
    cheque_no?: string;
    account_no?: string;
    attachment?: string;
}

interface CreatePaymentResponse {
    jsonrpc: string;
    id: null;
    result: {
        message: string;
    };
}

// Password Change interfaces
interface ChangePasswordParams {
    userId: string;
    currentPassword: string;
    newPassword: string;
}

interface ChangePasswordResponse {
    jsonrpc: string;
    id: null;
    result: {
        message: string;
        success: boolean;
    };
}

// Endpoint paths
export const ENDPOINTS = {
    INVOICE_RECEIPTS: `${API_BASE_URL}/getInvoiceReceipts`,
    LOGIN: `${API_BASE_URL}/login`,
    SET_BIOMETRIC: `${API_BASE_URL}/setbiometric`,
    DISCOUNT_ADJUSTMENT: `${API_BASE_URL}/sales-order/cancel`,
    ATTACH_IMAGE: `${API_BASE_URL}/sales-order/attach-image`,
    CREATE_PAYMENT: `${API_BASE_URL}/sales-order/create-payment`,
    CANCELLED_INVOICES: `${API_BASE_URL}/sales-order/cancellations`,
    CHECK_EMAIL: `${DASHBOARD_API_URL}/access/check-email`,
    CHANGE_PASSWORD: `${API_BASE_URL}/change-password`,
};

// Type for invoice receipts params
interface InvoiceReceiptsParams {
    salesperson_id: string;
    date: string;
}

// Type for cancelled invoices params
interface CancelledInvoicesParams {
    salesperson_id: string;
    type: 'cancel' | 'adjustment';
    date: string;
}

export interface CancelledOrder {
    order_id: number;
    order_number: string;
    total_amount: number;
    discount_amount?: number;
    cancel_status: string;
    customer: {
        name: string;
        address: string;
    };
}

interface CancelledInvoicesResponse {
    jsonrpc: string;
    id: null;
    result: {
        status: string;
        orders: CancelledOrder[];
    };
}

// Interface for email check response
interface EmailCheckResponse {
    success: boolean;
    data: {
        email: string;
        isAvailable: boolean;
        exists: boolean;
    };
}

// Function to login
export const login = async (params: LoginParams): Promise<LoginResponse> => {
    try {
        const response = await fetch(ENDPOINTS.LOGIN, {
            method: 'POST',
            headers: DEFAULT_HEADERS,
            body: JSON.stringify({
                params: {
                    user_id: params.user_id,
                    email: params.email,
                    password: params.password,
                    biometrics: params.biometrics
                }
            }),
        });
        
        if (!response.ok) {
            throw new Error(API_ERROR_MESSAGES.SERVER_ERROR);
        }

        const data = await response.json();
        console.log('Login Response:', data); // Add logging to debug

        // Update validation to match actual response structure
        if (!data || !data.result) {
            throw new Error(API_ERROR_MESSAGES.INVALID_RESPONSE);
        }

        return data;
    } catch (error) {
        console.error('API Error:', error); // Add error logging
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(API_ERROR_MESSAGES.NETWORK_ERROR);
    }
};

// Function to fetch invoice receipts
export const fetchInvoiceReceipts = async (params: InvoiceReceiptsParams): Promise<InvoiceReceiptsResponse> => {
    try {
        console.log('Calling fetchInvoiceReceipts with params:', params); // Add this log
        const response = await fetch(ENDPOINTS.INVOICE_RECEIPTS, {
            method: 'POST',
            headers: DEFAULT_HEADERS,
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: null,
                params: params
            }),
        });
        
        if (!response.ok) {
            console.error('Server error response:', response.status, response.statusText); // Add this log
            throw new Error(API_ERROR_MESSAGES.SERVER_ERROR);
        }

        const data = await response.json();
        console.log('Invoice receipts API response:', data); // Add this log

        if (!data || !data.result || !Array.isArray(data.result.orders)) {
            console.error('Invalid response structure:', data);
            throw new Error(API_ERROR_MESSAGES.INVALID_RESPONSE);
        }

        return data;
    } catch (error) {
        console.error('API Error in fetchInvoiceReceipts:', error); // Updated error log
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(API_ERROR_MESSAGES.NETWORK_ERROR);
    }
};

// Function to enroll biometric
export const enrollBiometric = async (params: BiometricEnrollParams): Promise<BiometricEnrollResponse> => {
    try {
        const response = await fetch(ENDPOINTS.SET_BIOMETRIC, {
            method: 'POST',
            headers: DEFAULT_HEADERS,
            body: JSON.stringify({
                params: {
                    userId: params.userId,
                    biometricHash: params.biometricHash
                }
            }),
        });
        
        if (!response.ok) {
            throw new Error(API_ERROR_MESSAGES.SERVER_ERROR);
        }

        const data = await response.json();

        if (!data.result || !data.result.message) {
            throw new Error(API_ERROR_MESSAGES.INVALID_RESPONSE);
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(API_ERROR_MESSAGES.NETWORK_ERROR);
    }
};

// Function to apply discount adjustment
export const applyDiscountAdjustment = async (params: DiscountAdjustmentParams): Promise<DiscountAdjustmentResponse> => {
    try {
        const response = await fetch(ENDPOINTS.DISCOUNT_ADJUSTMENT, {
            method: 'POST',
            headers: DEFAULT_HEADERS,
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: null,
                params: {
                    type: params.type,
                    salesperson_id: params.salesperson_id,
                    sales_order_id: params.sales_order_id,
                    value: params.value,
                    description: params.description || ''
                }
            }),
        });
        
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || API_ERROR_MESSAGES.SERVER_ERROR);
        }

        if (!data || !data.result) {
            throw new Error(API_ERROR_MESSAGES.INVALID_RESPONSE);
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(API_ERROR_MESSAGES.NETWORK_ERROR);
    }
};

// Function to attach image
export const attachImage = async (params: ImageAttachmentParams): Promise<ImageAttachmentResponse> => {
    try {
        const response = await fetch(ENDPOINTS.ATTACH_IMAGE, {
            method: 'POST',
            headers: DEFAULT_HEADERS,
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: null,
                params: {
                    sales_order_id: parseInt(params.sales_order_id),
                    image_base64: params.image_base64,
                    filename: params.filename
                }
            }),
        });
        
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || API_ERROR_MESSAGES.SERVER_ERROR);
        }

        if (!data || !data.result) {
            throw new Error(API_ERROR_MESSAGES.INVALID_RESPONSE);
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(API_ERROR_MESSAGES.NETWORK_ERROR);
    }
};

// Function to create payment
export const createPayment = async (params: CreatePaymentParams): Promise<CreatePaymentResponse> => {
    try {
        const response = await fetch(ENDPOINTS.CREATE_PAYMENT, {
            method: 'POST',
            headers: DEFAULT_HEADERS,
            body: JSON.stringify({
                params: {
                    salesperson_id: params.salesperson_id,
                    sales_order_id: params.sales_order_id,
                    amount: params.amount,
                    date: params.date,
                    type: params.type,
                    cheque_no: params.cheque_no || "",
                    account_no: params.account_no || "",
                    attachment: params.attachment || ""
                }
            }),
        });
        
        if (!response.ok) {
            throw new Error(API_ERROR_MESSAGES.SERVER_ERROR);
        }

        const data = await response.json();
        console.log('Create Payment Response:', data);

        if (!data || !data.result) {
            throw new Error(API_ERROR_MESSAGES.INVALID_RESPONSE);
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(API_ERROR_MESSAGES.NETWORK_ERROR);
    }
};

// Function to fetch cancelled invoices
export const fetchCancelledInvoices = async (params: CancelledInvoicesParams): Promise<CancelledInvoicesResponse> => {
    try {
        const response = await fetch(ENDPOINTS.CANCELLED_INVOICES, {
            method: 'POST',
            headers: DEFAULT_HEADERS,
            body: JSON.stringify({
                params: params
            }),
        });
        
        if (!response.ok) {
            throw new Error(API_ERROR_MESSAGES.SERVER_ERROR);
        }

        const data = await response.json();

        if (!data || !data.result) {
            throw new Error(API_ERROR_MESSAGES.INVALID_RESPONSE);
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(API_ERROR_MESSAGES.NETWORK_ERROR);
    }
};

// Function to check email availability
export const checkEmailAvailability = async (email: string): Promise<EmailCheckResponse> => {
    try {
        console.log('[EMAIL CHECK] Checking email:', email);
        console.log('[EMAIL CHECK] Using URL:', `${ENDPOINTS.CHECK_EMAIL}?email=${encodeURIComponent(email)}`);
        
        const response = await fetch(`${ENDPOINTS.CHECK_EMAIL}?email=${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                ...DEFAULT_HEADERS,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            console.error('[EMAIL CHECK] Server error:', response.status, response.statusText);
            throw new Error(API_ERROR_MESSAGES.SERVER_ERROR);
        }

        const data = await response.json();
        console.log('[EMAIL CHECK] Response:', data);

        if (!data || !data.data) {
            console.error('[EMAIL CHECK] Invalid response:', data);
            throw new Error(API_ERROR_MESSAGES.INVALID_RESPONSE);
        }

        return data;
    } catch (error) {
        console.error('[EMAIL CHECK] Error:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(API_ERROR_MESSAGES.NETWORK_ERROR);
    }
};

// Function to change password
export const changePassword = async (params: ChangePasswordParams): Promise<ChangePasswordResponse> => {
    try {
        console.log('[PASSWORD] Changing password for user:', params.userId);
        
        const response = await fetch(ENDPOINTS.CHANGE_PASSWORD, {
            method: 'POST',
            headers: DEFAULT_HEADERS,
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: null,
                params: {
                    userId: params.userId,
                    currentPassword: params.currentPassword,
                    newPassword: params.newPassword
                }
            }),
        });

        if (!response.ok) {
            console.error('[PASSWORD] Server error:', response.status, response.statusText);
            throw new Error(API_ERROR_MESSAGES.SERVER_ERROR);
        }

        const data = await response.json();
        console.log('[PASSWORD] Response:', data);

        if (!data || !data.result) {
            console.error('[PASSWORD] Invalid response:', data);
            throw new Error(API_ERROR_MESSAGES.INVALID_RESPONSE);
        }

        return data;
    } catch (error) {
        console.error('[PASSWORD] Error:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(API_ERROR_MESSAGES.PASSWORD_CHANGE_FAILED);
    }
}; 