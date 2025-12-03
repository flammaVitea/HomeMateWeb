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

  async addExpense(amount: number, householdId: string, note: string) {
    const newExpense = {
      id: Date.now().toString(),
      amount,
      category: "Food",
      date: new Date().toISOString().slice(0, 10),
      note,
      householdId
    };

    return firstValueFrom(this.http.post(`${this.api}/expenses`, newExpense));
  }

}
