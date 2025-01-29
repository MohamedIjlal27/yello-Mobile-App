import { API_BASE_URL, DEFAULT_HEADERS, API_ERROR_MESSAGES } from './config';

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
        success: boolean;
        user_id?: string;
        role?: string;
        message?: string;
        error_code?: 'USER_NOT_FOUND' | 'INVALID_CREDENTIALS';
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

interface Customer {
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

interface ApiResponse {
    jsonrpc: string;
    id: null;
    result: {
        total_orders: number;
        orders: Order[];
    };
}

// Biometric interfaces
interface BiometricEnrollParams {
    user_id: string;
    device_id: string;
    biometric_enabled: boolean;
}

interface BiometricEnrollResponse {
    jsonrpc: string;
    id: null;
    result: {
        success: boolean;
        message?: string;
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
interface ImageAttachmentParams {
    sales_order_id: string;
    image_base64: string;
    filename: string;
}

interface ImageAttachmentResponse {
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

// Endpoint paths
export const ENDPOINTS = {
    INVOICE_RECEIPTS: `${API_BASE_URL}/getInvoiceReceipts`,
    LOGIN: `${API_BASE_URL}/login`,
    SET_BIOMETRIC: `${API_BASE_URL}/setbiometric`,
    DISCOUNT_ADJUSTMENT: `${API_BASE_URL}/sales-order/cancel`,
    ATTACH_IMAGE: `${API_BASE_URL}/sales-order/attach-image`,
    CREATE_PAYMENT: `${API_BASE_URL}/sales-order/create-payment`,
};

// Type for invoice receipts params
interface InvoiceReceiptsParams {
    salesperson_id: string;
    date: string;
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
export const fetchInvoiceReceipts = async (params: InvoiceReceiptsParams): Promise<ApiResponse> => {
    try {
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
            throw new Error(API_ERROR_MESSAGES.SERVER_ERROR);
        }

        const data = await response.json();

        if (!data.result || !Array.isArray(data.result.orders)) {
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

// Function to enroll biometric
export const enrollBiometric = async (params: BiometricEnrollParams): Promise<BiometricEnrollResponse> => {
    try {
        const response = await fetch(ENDPOINTS.SET_BIOMETRIC, {
            method: 'POST',
            headers: DEFAULT_HEADERS,
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: null,
                params: params
            }),
        });
        
        if (!response.ok) {
            throw new Error(API_ERROR_MESSAGES.SERVER_ERROR);
        }

        const data = await response.json();

        if (!data.result || typeof data.result.success !== 'boolean') {
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