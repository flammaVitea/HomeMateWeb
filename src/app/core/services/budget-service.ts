import { Injectable } from '@angular/core';

export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  note: string;
  householdId: string | number;
}

@Injectable({ providedIn: 'root' })
export class BudgetService {

  baseUrl = 'http://localhost:3000/expenses';

  async getExpenses(householdId: string | number): Promise<Expense[]> {
    const res = await fetch(`${this.baseUrl}?householdId=${householdId}`);
    return await res.json();
  }

  async addExpense(expense: Expense): Promise<void> {
    await fetch(this.baseUrl, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expense)
    });
  }

  async updateExpense(expense: Expense): Promise<void> {
    await fetch(`${this.baseUrl}/${expense.id}`, {
      method: 'PUT',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expense)
    });
  }

  async deleteExpense(id: string): Promise<void> {
    await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE'
    });
  }
}
