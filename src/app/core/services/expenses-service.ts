import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  note?: string;
  householdId: string;
}

@Injectable({ providedIn: 'root' })
export class ExpensesService {
  private api = 'http://localhost:3000/expenses';

  constructor(private http: HttpClient) {}

  // Отримати всі витрати для конкретного дому
  async getExpenses(householdId: string): Promise<Expense[]> {
    const expenses = await firstValueFrom(this.http.get<Expense[]>(`${this.api}?householdId=${householdId}`));
    return expenses;
  }

  // Підсумок витрат
  async getTotalExpenses(householdId: string): Promise<number> {
    const expenses = await this.getExpenses(householdId);
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  }

  // Додати нову витрату
  async addExpense(amount: number, householdId: string, note: string, category = 'Food') {
    const newExpense: Expense = {
      id: Date.now().toString(),
      amount,
      category,
      date: new Date().toISOString().slice(0, 10),
      note,
      householdId
    };
    return firstValueFrom(this.http.post(this.api, newExpense));
  }
}