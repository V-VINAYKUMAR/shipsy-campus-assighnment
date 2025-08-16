// src/types/expense.ts
export interface Expense {
    id: string;              // add id because you're updating by id
    description: string;
    category: string;
    reimbursable: boolean;
    amount: number;
    taxRate: number;
  }
  
  export interface FormState {
    description: string;
    category: string;
    reimbursable: boolean;
    amount: string;
    taxRate: string;
  }
  