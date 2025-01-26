import { API_BASE_URL, DEFAULT_HEADERS, API_ERROR_MESSAGES } from './config';

// Interface definitions for invoice data
interface LocalizedString {
    en_US: string;
}

// Login interfaces
interface LoginParams {
    username: string;
    password: string;
}

interface LoginResponse {
    jsonrpc: string;
    id: null;
    result: {
        success: boolean;
        user_id: string;
        role: string;
        message?: string;
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

// Endpoint paths
export const ENDPOINTS = {
    INVOICE_RECEIPTS: `${API_BASE_URL}/getInvoiceReceipts`,
    LOGIN: `${API_BASE_URL}/login`,
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