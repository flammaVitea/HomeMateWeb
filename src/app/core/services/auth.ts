// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import * as bcrypt from 'bcryptjs';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';


export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  householdId: number;
  gender: string;
  avatarUrl?: string;
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
  const user = users.find(u => u.email === email);

  if (!user) return false;

  // Перевірка хешу
  const isValid = bcrypt.compareSync(password, user.password);

  if (isValid) {
    localStorage.setItem('token', 'FAKE-TOKEN-123');
    localStorage.setItem('user', JSON.stringify(user));
    return true;
  }

  return false;
}


async register(name: string, email: string, password: string, inviteCode: string, gender: any, avatarUrl: any): Promise<boolean> {
  const users: User[] = await firstValueFrom(this.http.get<User[]>(`${this.api}/users`));

  // Перевірка унікальності email
  if (users.find(u => u.email === email)) {
    return false; // email вже існує
  }

  // Перевірка inviteCode
  const households: any[] = await firstValueFrom(this.http.get<any[]>(`${this.api}/households?inviteCode=${inviteCode}`));
  if (!households || households.length === 0) {
    throw new Error('Невірний код запрошення');
  }

  const householdId = households[0].id;

  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser: User = {
    id: (users.length + 1).toString(),
    name,
    email,
    password: hashedPassword,
    householdId: householdId,
    gender: gender,       // нове поле
    avatarUrl: avatarUrl
  };

  await firstValueFrom(this.http.post(`${this.api}/users`, newUser));

  localStorage.setItem('token', 'FAKE-TOKEN-123');
  localStorage.setItem('user', JSON.stringify(newUser));
  return true;
}

// Додаємо метод у AuthService
async createHouse(name: string, email: string, password: string, houseName: string, gender: string, avatarUrl: string) {
  // 1. Отримуємо список користувачів
  const users: User[] = await firstValueFrom(this.http.get<User[]>(`${this.api}/users`));

  // 2. Створюємо нового користувача
  const newUser: User = {
    id: (users.length + 1).toString(),
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    householdId: 0, // тимчасово
    gender,
    avatarUrl
  };

  await firstValueFrom(this.http.post(`${this.api}/users`, newUser));

  // 3. Створюємо новий будинок з ownerId = id нового користувача
  const households: any[] = await firstValueFrom(this.http.get<any[]>(`${this.api}/households`));
  const newHouseId = households.length + 1; // число, як у старих будинках

  const newHouse = {
    id: (Math.floor(Math.random() * 10000)).toString(), // рядок
    name: houseName,
    ownerId: newUser.id,
    inviteCode: this.generateInviteCode()
  };


  await firstValueFrom(this.http.post(`${this.api}/households`, newHouse));

  // 4. Прив'язуємо користувача до будинку
  newUser.householdId = newHouseId;
  await firstValueFrom(this.http.put(`${this.api}/users/${newUser.id}`, newUser));

  // 5. Зберігаємо токен та дані
  localStorage.setItem('token', 'FAKE-TOKEN-123');
  localStorage.setItem('user', JSON.stringify(newUser));

  return true;
}

// Допоміжна функція генерації inviteCode
private generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}