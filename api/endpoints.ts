import { API_BASE_URL, DEFAULT_HEADERS, API_ERROR_MESSAGES } from './config';

// Interface definitions for invoice data
interface LocalizedString {
    en_US: string;
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
};

// Type for invoice receipts params
interface InvoiceReceiptsParams {
    salesperson_id: string;
    date: string;
}

// Function to fetch invoice receipts
export const fetchInvoiceReceipts = async (params: InvoiceReceiptsParams): Promise<ApiResponse> => {
    try {
        console.log('Sending request to:', ENDPOINTS.INVOICE_RECEIPTS);
        console.log('Request params:', params);

        const response = await fetch(ENDPOINTS.INVOICE_RECEIPTS, {
            method: 'POST',
            headers: DEFAULT_HEADERS,
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: null,
                params: params
            }),
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(API_ERROR_MESSAGES.SERVER_ERROR);
        }

        const data = await response.json();
        console.log('Response data:', JSON.stringify(data, null, 2));

        if (!data.result || !Array.isArray(data.result.orders)) {
            console.error('Invalid response structure:', data);
            throw new Error(API_ERROR_MESSAGES.INVALID_RESPONSE);
        }

        return data;
    } catch (error) {
        console.error('API call error:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(API_ERROR_MESSAGES.NETWORK_ERROR);
    }
}; 