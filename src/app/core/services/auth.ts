// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  householdId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = 'http://localhost:3000';

  constructor(private http: HttpClient, private router: Router) {}

  // Логін користувача
  async login(email: string, password: string): Promise<boolean> {
    const users: User[] = await firstValueFrom(this.http.get<User[]>(`${this.api}/users`));
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem('token', 'FAKE-TOKEN-123');
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    }
    return false;
  }

  // Реєстрація нового користувача
  async register(name: string, email: string, password: string): Promise<boolean> {
    const users: User[] = await firstValueFrom(this.http.get<User[]>(`${this.api}/users`));
    if (users.find(u => u.email === email)) {
      return false; // email вже існує
    }

    const newUser: User = {
      id: (users.length + 1).toString(),
      name,
      email,
      password,
      householdId: 1 // можна зробити динамічно пізніше
    };

    await firstValueFrom(this.http.post(`${this.api}/users`, newUser));

    localStorage.setItem('token', 'FAKE-TOKEN-123');
    localStorage.setItem('user', JSON.stringify(newUser));
    return true;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}