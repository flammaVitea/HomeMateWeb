import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FamilyService } from '../../core/services/family';
import { DashboardService } from '../../core/services/dashboard';
import { Household } from '../../core/services/household';
import localeUk from '@angular/common/locales/uk';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeUk);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule],
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
    private household: Household
  ) {}

  async ngOnInit() {

    // Члени сім'ї
    this.familyMembers = await this.familyService.getMembers(this.user.householdId);

    // Dashboard статистика
    const dashboardData = await this.dashboardService.getDashboardData(this.user.id, this.user.householdId);
    this.shoppingCount = dashboardData.shoppingCount;
    this.calendarDate = dashboardData.calendarDate;
    this.budgetAllocated = dashboardData.budgetAllocated;
    this.budgetSpent = dashboardData.budgetSpent;
    this.tasksCount = dashboardData.tasksCount;

    // Генеруємо і зберігаємо код запрошення
    this.inviteCode = await this.household.setInviteCode(this.user.householdId);
  }
}
