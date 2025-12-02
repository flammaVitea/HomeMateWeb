// src/app/features/auth/register/register.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatButtonToggleModule,
    RouterModule,
    NgIf
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  mode: 'join' | 'create' = 'join'; // поточний режим форми

  joinForm: FormGroup;
  createForm: FormGroup;

  error = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    // Форма приєднання до існуючого будинку
    this.joinForm = fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      inviteCode: ['', Validators.required],
      gender: ['', Validators.required],
      avatarUrl: ['']
    });

    // Форма створення нового будинку
    this.createForm = fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      houseName: ['', Validators.required],
      gender: ['', Validators.required],
      avatarUrl: ['']
    });
  }

  // Приєднання до існуючого будинку
  async onJoinSubmit() {
    if (this.joinForm.invalid) return;

    try {
      await this.authService.register(
        this.joinForm.value.name,
        this.joinForm.value.email,
        this.joinForm.value.password,
        this.joinForm.value.inviteCode,
        this.joinForm.value.gender,
        this.joinForm.value.avatarUrl
      );
      this.router.navigate(['/auth/login']);
    } catch (err: any) {
      this.error = err.message || 'Помилка при приєднанні до будинку';
      alert(this.error);
    }
  }

  // Створення нового будинку
  async onCreateSubmit() {
    if (this.createForm.invalid) return;

    try {
      await this.authService.createHouse(
        this.createForm.value.name,
        this.createForm.value.email,
        this.createForm.value.password,
        this.createForm.value.houseName,
        this.createForm.value.gender,
        this.createForm.value.avatarUrl
      );
      this.router.navigate(['/auth/login']);
    } catch (err: any) {
      this.error = err.message || 'Помилка при створенні будинку';
      alert(this.error);
    }
  }

  // Перемикання режиму форми
  setMode(mode: 'join' | 'create') {
    this.mode = mode;
    this.error = '';
  }
}
