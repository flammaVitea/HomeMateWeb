import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface DashboardData {
  shoppingCount: number;
  calendarDate: Date;
  budgetAllocated: number;
  budgetSpent: number;
  tasksCount: number;
}

export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  gender: string;
  avatarUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private api = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  async getDashboardData(userId: string, householdId: number): Promise<DashboardData> {
    // Список покупок
    const shoppingLists: any[] = await firstValueFrom(this.http.get<any[]>(`${this.api}/shoppingLists`));
    const shoppingCount = shoppingLists.reduce((acc, list) => acc + list.items.length, 0);

    // Календар — найближча подія
    const events: any[] = await firstValueFrom(this.http.get<any[]>(`${this.api}/calendarEvents`));
    let calendarDate = new Date();
    if (events.length > 0) {
      const nearest = events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
      calendarDate = new Date(nearest.date);
    }

    // Бюджет
    const expenses: any[] = await firstValueFrom(
      this.http.get<any[]>(`${this.api}/expenses?householdId=${householdId}`)
    );
    const budgetSpent = expenses.reduce((acc, exp) => acc + exp.amount, 0);
    const budgetAllocated = 5000;

    // Завдання
    const tasks: any[] = await firstValueFrom(
      this.http.get<any[]>(`${this.api}/tasks?assignedTo=${userId}`)
    );
    const tasksCount = tasks.length;

    return {
      shoppingCount,
      calendarDate,
      budgetAllocated,
      budgetSpent,
      tasksCount
    };
  }

  async getFamilyMembers(householdId: number): Promise<FamilyMember[]> {
    const members: any[] = await firstValueFrom(
      this.http.get<any[]>(`${this.api}/users?householdId=${householdId}`)
    );

    return members.map(member => ({
      id: member.id,
      name: member.name,
      email: member.email,
      gender: member.gender,
      avatarUrl: member.avatarUrl
    }));
  }
}
