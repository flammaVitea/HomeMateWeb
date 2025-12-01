import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    RouterModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  error = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      inviteCode: ['', Validators.required], // поле коду запрошення
      gender: ['', Validators.required],       // нове поле
      avatarUrl: ['']                           // необов’язкове поле
    });
  }

  async onSubmit() {
    if (this.registerForm.invalid) return;

    try {
      await this.authService.register(
        this.registerForm.value.name,
        this.registerForm.value.email,
        this.registerForm.value.password,
        this.registerForm.value.inviteCode,
        this.registerForm.value.gender,
        this.registerForm.value.avatarUrl
      );


      // редірект після успішної реєстрації
      this.router.navigate(['/auth/login']);
    } catch (err: any) {
      this.error = err.message || 'Помилка при реєстрації';
      alert(this.error);
    }
  }
}
