import * as SQLite from 'expo-sqlite';

export interface BankAccount {
  id: string;
  value: string;
}

export interface CustomerAccount {
  id: string;
  value: string;
}

// Open the database
const db = SQLite.openDatabaseSync('yello.db');

// Database version
const CURRENT_VERSION = 2;

// Initialize database tables
export const initDatabase = () => {
  try {
    // Get current database version
    const versionResult = db.getFirstSync<{ user_version: number }>('PRAGMA user_version');
    const currentDbVersion = versionResult?.user_version || 0;

    if (currentDbVersion < CURRENT_VERSION) {
      // Drop existing tables if they exist
      db.execSync(`
        DROP TABLE IF EXISTS bank_accounts;
        DROP TABLE IF EXISTS customer_accounts;
      `);

      // Create new tables with updated schema
      db.execSync(`
        CREATE TABLE IF NOT EXISTS bank_accounts (
          id TEXT PRIMARY KEY NOT NULL,
          value TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS customer_accounts (
          id TEXT PRIMARY KEY NOT NULL,
          value TEXT NOT NULL
        );
      `);

      // Update database version
      db.execSync(`PRAGMA user_version = ${CURRENT_VERSION}`);
    }
  } catch (error) {
    console.error('Database initialization error:', error);
    // If there's an error, try to recreate the tables
    db.execSync(`
      DROP TABLE IF EXISTS bank_accounts;
      DROP TABLE IF EXISTS customer_accounts;

      CREATE TABLE IF NOT EXISTS bank_accounts (
        id TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS customer_accounts (
        id TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );

      PRAGMA user_version = ${CURRENT_VERSION};
    `);
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