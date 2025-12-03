import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FamilyService } from '../../core/services/family';
import { DashboardService } from '../../core/services/dashboard';
import { Household } from '../../core/services/household';
import localeUk from '@angular/common/locales/uk';
import { registerLocaleData } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { ExpensesService } from '../../core/services/expenses-service';


registerLocaleData(localeUk);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' }
  ]
})
export class DashboardComponent implements OnInit {

  user = JSON.parse(localStorage.getItem('user') || '{}');
  familyMembers: any[] = [];
  inviteCode = '';

  shoppingCount = 0;
  calendarDate = new Date();
  budgetAllocated = 0;
  budgetSpent = 0;
  tasksCount = 0;

  constructor(
    private familyService: FamilyService,
    private dashboardService: DashboardService,
    private household: Household,
    private router: Router,
    private expensesService: ExpensesService
  ) {}

  async ngOnInit() {

    // household info
    const hh = await this.household.getHousehold(this.user.householdId);
    
    // встановлюємо роль користувача

    this.user.role = hh.ownerId === this.user.id ? 'owner' : 'member';
    // якщо owner → генеруємо inviteCode
    if (this.user.role === 'owner') {
      this.inviteCode = await this.household.setInviteCode(this.user.householdId);
    } else {
      // для звичайних учасників просто показуємо поточний код
      this.inviteCode = hh.inviteCode;
    }

    // --- решта як є ---
    this.familyMembers = await this.familyService.getMembers(this.user.householdId);

    const dashboardData = await this.dashboardService.getDashboardData(
      this.user.id,
      this.user.householdId
    );

    this.shoppingCount = dashboardData.shoppingCount;
    this.calendarDate = dashboardData.calendarDate;
    this.budgetAllocated = dashboardData.budgetAllocated;
    this.budgetSpent = await this.expensesService.getTotalExpenses(this.user.householdId);
    this.tasksCount = dashboardData.tasksCount;
  }

  async generateNewCode() {
    this.inviteCode = await this.household.setInviteCode(this.user.householdId);
  }

  copyCode() {
    navigator.clipboard.writeText(this.inviteCode);
    alert('Код скопійовано!');
  }

}
