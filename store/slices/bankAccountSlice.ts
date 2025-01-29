import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BankAccount {
  id: string;
  name: string;
}

interface BankAccountState {
  bankAccounts: BankAccount[];
  customerAccounts: string[];
}

const initialState: BankAccountState = {
  bankAccounts: [],
  customerAccounts: []
};

const bankAccountSlice = createSlice({
  name: 'bankAccount',
  initialState,
  reducers: {
    setBankAccounts: (state, action: PayloadAction<{ [key: string]: string }>) => {
      // Convert the object to array of BankAccount objects with id and name
      state.bankAccounts = Object.entries(action.payload).map(([id, name]) => ({
        id,
        name
      }));
    },
    setCustomerAccounts: (state, action: PayloadAction<string[]>) => {
      state.customerAccounts = action.payload;
    },
    clearBankAccounts: (state) => {
      state.bankAccounts = [];
      state.customerAccounts = [];
    }
  }
});

export const { setBankAccounts, setCustomerAccounts, clearBankAccounts } = bankAccountSlice.actions;
export default bankAccountSlice.reducer; 