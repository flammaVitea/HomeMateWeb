import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Household {

  private api = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Генерація коду
  generateInviteCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // Запис коду у household
  async setInviteCode(householdId: string) {
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const house = await firstValueFrom(this.http.get<any>(`${this.api}/households/${householdId}`));
    house.inviteCode = newCode;
    await firstValueFrom(this.http.put(`${this.api}/households/${householdId}`, house));
    return newCode;
  }

  // Отримання info про household
  async getHousehold(householdId: string) {
    return firstValueFrom(this.http.get<any>(`${this.api}/households/${householdId}`));
  }
}
