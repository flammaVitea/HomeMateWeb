import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from "@angular/router";
import { } from "@angular/router";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, RouterModule, ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
