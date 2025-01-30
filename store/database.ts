import * as SQLite from 'expo-sqlite';

export interface BankAccount {
  id: string;
  value: string;
}

export interface CustomerAccount {
  id: string;
  value: string;
}

export interface UserData {
  emp_id: number;
  emp_name: string;
  job_title: string;
  profile_pic: string | null;
  sales_id: number;
  sales_name: string;
}

// Open the database
const db = SQLite.openDatabaseSync('yello.db');

// Database version
const CURRENT_VERSION = 3;

// Initialize database tables
export const initDatabase = () => {
  try {
    // Create tables if they don't exist
    db.execSync(`
      CREATE TABLE IF NOT EXISTS bank_accounts (
        id TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS customer_accounts (
        id TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS uploaded_invoices (
        order_id INTEGER PRIMARY KEY NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS user_data (
        emp_id INTEGER PRIMARY KEY NOT NULL,
        emp_name TEXT NOT NULL,
        job_title TEXT NOT NULL,
        profile_pic TEXT,
        sales_id INTEGER NOT NULL,
        sales_name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Get current database version
    const versionResult = db.getFirstSync<{ user_version: number }>('PRAGMA user_version');
    const currentDbVersion = versionResult?.user_version || 0;

    if (currentDbVersion < CURRENT_VERSION) {
      // Update database version
      db.execSync(`PRAGMA user_version = ${CURRENT_VERSION}`);
    }

    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

// Bank Account Operations
export const insertBankAccount = (bankAccount: BankAccount) => {
  const statement = db.prepareSync(
    'INSERT OR REPLACE INTO bank_accounts (id, value) VALUES (?, ?)'
  );
  try {
    const result = statement.executeSync([
      bankAccount.id,
      bankAccount.value,
    ]);
    return result.lastInsertRowId;
  } finally {
    statement.finalizeSync();
  }
};

export const insertBankAccounts = (accounts: { [key: string]: string }) => {
  db.withTransactionSync(() => {
    Object.entries(accounts).forEach(([id, value]) => {
      insertBankAccount({ id, value });
    });
  });
};

export const getBankAccounts = (): BankAccount[] => {
  return db.getAllSync('SELECT * FROM bank_accounts');
};

// Customer Account Operations
export const insertCustomerAccount = (customerAccount: CustomerAccount) => {
  const statement = db.prepareSync(
    'INSERT OR REPLACE INTO customer_accounts (id, value) VALUES (?, ?)'
  );
  try {
    const result = statement.executeSync([
      customerAccount.id,
      customerAccount.value,
    ]);
    return result.lastInsertRowId;
  } finally {
    statement.finalizeSync();
  }
};

export const insertCustomerAccounts = (accounts: string[]) => {
  db.withTransactionSync(() => {
    accounts.forEach((value, index) => {
      insertCustomerAccount({ 
        id: index.toString(), 
        value 
      });
    });
  });
};

export const getCustomerAccounts = (): CustomerAccount[] => {
  return db.getAllSync('SELECT * FROM customer_accounts');
};

// Uploaded Invoices Operations
export const markInvoiceAsUploaded = (orderId: number) => {
  const statement = db.prepareSync(
    'INSERT OR REPLACE INTO uploaded_invoices (order_id) VALUES (?)'
  );
  try {
    statement.executeSync([orderId]);
  } finally {
    statement.finalizeSync();
  }
};

export const isInvoiceUploaded = (orderId: number): boolean => {
  const result = db.getFirstSync<{ order_id: number }>(
    'SELECT order_id FROM uploaded_invoices WHERE order_id = ?',
    [orderId]
  );
  return !!result;
};

export const getUploadedInvoices = (): Set<number> => {
  const results = db.getAllSync<{ order_id: number }>(
    'SELECT order_id FROM uploaded_invoices'
  );
  return new Set(results.map(row => row.order_id));
};

// User Data Operations
export const saveUserData = (userData: UserData) => {
  const statement = db.prepareSync(`
    INSERT OR REPLACE INTO user_data (
      emp_id, emp_name, job_title, profile_pic, sales_id, sales_name
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);
  try {
    const result = statement.executeSync([
      userData.emp_id,
      userData.emp_name,
      userData.job_title,
      userData.profile_pic,
      userData.sales_id,
      userData.sales_name,
    ]);
    return result.lastInsertRowId;
  } finally {
    statement.finalizeSync();
  }
};

export const getUserData = (): UserData | null => {
  const result = db.getFirstSync<UserData>('SELECT * FROM user_data ORDER BY created_at DESC LIMIT 1');
  return result || null;
};

export const clearUserData = () => {
  db.execSync('DELETE FROM user_data');
}; 