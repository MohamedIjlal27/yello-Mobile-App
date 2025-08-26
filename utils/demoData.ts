// Demo data types and interfaces
export interface DemoUser {
  emp_id: number;
  emp_name: string;
  job_title: { en_US: string };
  profile_pic: string | null;
  sales_id: number;
  sales_name: string;
}

export interface DemoOrder {
  id: number;
  name: string;
  partner_id: [number, string];
  amount_total: number;
  state: string;
  date_order: string;
  invoice_status: string;
  payment_status: string;
  salesperson_id: [number, string];
  partner_name: string;
  salesperson_name: string;
  order_id: number;
  order_number: string;
  total_amount: number;
  order_date: string;
  customer: {
    name: string;
    address?: string;
  };
  order_lines?: Array<{
    product_name: { en_US: string };
    quantity: number;
    uom: { en_US: string };
    unit_price: number;
    line_amount: number;
    discount_percentage: number;
  }>;
}

export interface DemoCancelledOrder {
  id: number;
  name: string;
  partner_id: [number, string];
  amount_total: number;
  state: string;
  date_order: string;
  invoice_status: string;
  payment_status: string;
  salesperson_id: [number, string];
  partner_name: string;
  salesperson_name: string;
  cancellation_reason?: string;
  order_id: number;
  order_number: string;
  total_amount: number;
  customer: {
    name: string;
  };
}

export interface DemoCreditInvoice {
  id: number;
  name: string;
  partner_id: [number, string];
  amount_total: number;
  state: string;
  date_order: string;
  invoice_status: string;
  payment_status: string;
  salesperson_id: [number, string];
  partner_name: string;
  salesperson_name: string;
  credit_amount?: number;
}

// Demo user data
export const demoUser: DemoUser = {
  emp_id: 1,
  emp_name: "John Doe",
  job_title: { en_US: "Sales Representative" },
  profile_pic: null,
  sales_id: 101,
  sales_name: "John Doe"
};

// Demo login response
export const demoLoginResponse = {
  result: {
    message: "Login successful",
    sales_id: "101",
    emp_id: 1,
    emp_name: "John Doe",
    job_title: { en_US: "Sales Representative" },
    profile_pic: null,
    sales_name: "John Doe",
    role: "Cash Collector"
  }
};

// Login response type
export interface LoginResponse {
  result: {
    message: string;
    sales_id: string;
    emp_id: number;
    emp_name: string;
    job_title: { en_US: string };
    profile_pic: string | null;
    sales_name: string;
    role?: string;
  };
}

// Demo invoice receipts data
export const demoInvoiceReceipts = {
  result: {
    orders: [
      {
        id: 1001,
        name: "INV/2024/001",
        partner_id: [1, "ABC Company Ltd"] as [number, string],
        amount_total: 15000.00,
        state: "sale",
        date_order: "2024-01-15 10:30:00",
        invoice_status: "to_invoice",
        payment_status: "not_paid",
        salesperson_id: [101, "John Doe"] as [number, string],
        partner_name: "ABC Company Ltd",
        salesperson_name: "John Doe",
        order_id: 1001,
        order_number: "INV/2024/001",
        total_amount: 15000.00,
        order_date: "2024-01-15",
        customer: { 
          name: "ABC Company Ltd",
          address: "123 Main Street, Colombo, Western Province, 10000"
        },
        order_lines: [
          {
            product_name: { en_US: "Product A" },
            quantity: 5,
            uom: { en_US: "PCS" },
            unit_price: 3000.00,
            line_amount: 15000.00,
            discount_percentage: 0
          }
        ]
      },
      {
        id: 1002,
        name: "INV/2024/002",
        partner_id: [2, "XYZ Corporation"] as [number, string],
        amount_total: 25000.00,
        state: "sale",
        date_order: "2024-01-16 14:20:00",
        invoice_status: "invoiced",
        payment_status: "paid",
        salesperson_id: [101, "John Doe"] as [number, string],
        partner_name: "XYZ Corporation",
        salesperson_name: "John Doe",
        order_id: 1002,
        order_number: "INV/2024/002",
        total_amount: 25000.00,
        order_date: "2024-01-16",
        customer: { 
          name: "XYZ Corporation",
          address: "456 Business Ave, Kandy, Central Province, 20000"
        },
        order_lines: [
          {
            product_name: { en_US: "Product B" },
            quantity: 10,
            uom: { en_US: "PCS" },
            unit_price: 2500.00,
            line_amount: 25000.00,
            discount_percentage: 0
          }
        ]
      },
      {
        id: 1003,
        name: "INV/2024/003",
        partner_id: [3, "DEF Industries"] as [number, string],
        amount_total: 18000.00,
        state: "sale",
        date_order: "2024-01-17 09:15:00",
        invoice_status: "invoiced",
        payment_status: "partial",
        salesperson_id: [101, "John Doe"] as [number, string],
        partner_name: "DEF Industries",
        salesperson_name: "John Doe",
        order_id: 1003,
        order_number: "INV/2024/003",
        total_amount: 18000.00,
        order_date: "2024-01-17",
        customer: { 
          name: "DEF Industries",
          address: "789 Industrial Rd, Galle, Southern Province, 80000"
        },
        order_lines: [
          {
            product_name: { en_US: "Product C" },
            quantity: 6,
            uom: { en_US: "PCS" },
            unit_price: 3000.00,
            line_amount: 18000.00,
            discount_percentage: 0
          }
        ]
      }
    ]
  }
};

// Demo cancelled invoices data
export const demoCancelledInvoices = {
  result: {
    orders: [
      {
        id: 2001,
        name: "INV/2024/CANCEL/001",
        partner_id: [4, "GHI Trading Co"] as [number, string],
        amount_total: 12000.00,
        state: "cancel",
        date_order: "2024-01-10 11:45:00",
        invoice_status: "cancelled",
        payment_status: "not_paid",
        salesperson_id: [101, "John Doe"] as [number, string],
        partner_name: "GHI Trading Co",
        salesperson_name: "John Doe",
        cancellation_reason: "Customer requested cancellation",
        order_id: 2001,
        order_number: "INV/2024/CANCEL/001",
        total_amount: 12000.00,
        customer: { name: "GHI Trading Co" }
      },
      {
        id: 2002,
        name: "INV/2024/CANCEL/002",
        partner_id: [5, "JKL Enterprises"] as [number, string],
        amount_total: 8500.00,
        state: "cancel",
        date_order: "2024-01-12 16:30:00",
        invoice_status: "cancelled",
        payment_status: "not_paid",
        salesperson_id: [101, "John Doe"] as [number, string],
        partner_name: "JKL Enterprises",
        salesperson_name: "John Doe",
        cancellation_reason: "Product out of stock",
        order_id: 2002,
        order_number: "INV/2024/CANCEL/002",
        total_amount: 8500.00,
        customer: { name: "JKL Enterprises" }
      }
    ]
  }
};

// Demo credit invoices data
export const demoCreditInvoices = {
  result: {
    orders: [
      {
        id: 3001,
        name: "INV/2024/CREDIT/001",
        partner_id: [6, "MNO Solutions"] as [number, string],
        amount_total: 22000.00,
        state: "sale",
        date_order: "2024-01-08 13:20:00",
        invoice_status: "invoiced",
        payment_status: "partial",
        salesperson_id: [101, "John Doe"] as [number, string],
        partner_name: "MNO Solutions",
        salesperson_name: "John Doe",
        credit_amount: 5000.00
      },
      {
        id: 3002,
        name: "INV/2024/CREDIT/002",
        partner_id: [7, "PQR Technologies"] as [number, string],
        amount_total: 18000.00,
        state: "sale",
        date_order: "2024-01-09 15:45:00",
        invoice_status: "invoiced",
        payment_status: "partial",
        salesperson_id: [101, "John Doe"] as [number, string],
        partner_name: "PQR Technologies",
        salesperson_name: "John Doe",
        credit_amount: 3000.00
      }
    ]
  }
};

// Demo response functions
export const demoResponses = {
  success: { result: { message: "Operation completed successfully" } },
  error: { error: { message: "Operation failed" } },
  emailExists: { data: { exists: true } },
  emailNotExists: { data: { exists: false } }
};

// Demo bank accounts
export const demoBankAccounts = {
  "1": "HBL Bank - 1234567890",
  "2": "UBL Bank - 0987654321",
  "3": "MCB Bank - 1122334455"
};

// Demo customer accounts
export const demoCustomerAccounts = [
  "Customer A",
  "Customer B", 
  "Customer C",
  "Customer D"
];
