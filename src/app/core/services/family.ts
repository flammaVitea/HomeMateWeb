import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FamilyService {
  private api = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getMembers(householdId: string) {
    return firstValueFrom(
      this.http.get<any[]>(`${this.api}/users?householdId=${householdId}`)
    );
  }

  addMember(member: any) {
    return firstValueFrom(
      this.http.post(`${this.api}/users`, member)
    );
  }

  getHousehold(householdId: string) {
    return firstValueFrom(
      this.http.get(`${this.api}/households/${householdId}`)
    );
  }


}