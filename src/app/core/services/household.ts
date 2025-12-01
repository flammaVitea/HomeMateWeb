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
  async setInviteCode(householdId: number) {
    const code = this.generateInviteCode();

    await firstValueFrom(
      this.http.patch(`${this.api}/households/${householdId}`, {
        inviteCode: code
      })
    );

    return code;
  }

  // Отримання info про household
  async getHousehold(householdId: number) {
    return await firstValueFrom(
      this.http.get<any>(`${this.api}/households/${householdId}`)
    );
  }
}
