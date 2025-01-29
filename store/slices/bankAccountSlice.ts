import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BankAccount, CustomerAccount } from '../database';

interface BankAccountState {
  bankAccounts: BankAccount[];
  customerAccounts: CustomerAccount[];
}

const initialState: BankAccountState = {
  bankAccounts: [],
  customerAccounts: [],
};

const bankAccountSlice = createSlice({
  name: 'bankAccount',
  initialState,
  reducers: {
    setBankAccounts: (state, action: PayloadAction<BankAccount[]>) => {
      state.bankAccounts = action.payload;
    },
    setCustomerAccounts: (state, action: PayloadAction<CustomerAccount[]>) => {
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