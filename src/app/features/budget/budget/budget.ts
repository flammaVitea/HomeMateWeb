import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { BudgetService, Expense } from '../../../core/services/budget-service';
import { FamilyService } from '../../../core/services/family';
import { BudgetDialogComponent } from '../budget-dialog/budget-dialog';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './budget.html',
  styleUrls: ['./budget.scss']
})
export class BudgetComponent implements OnInit {

  user = JSON.parse(localStorage.getItem('user') || '{}');
  expenses: Expense[] = [];
  household: any;

  displayedColumns = ['amount', 'category', 'date', 'note', 'actions'];

  constructor(
    private budgetService: BudgetService,
    private familyService: FamilyService,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    const householdId = this.user.householdId;
    this.household = await this.familyService.getHousehold(householdId);
    this.expenses = await this.budgetService.getExpenses(householdId);
  }

  get total(): number {
    return this.expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  }

  openExpenseDialog(expense?: Expense) {
    const dialogRef = this.dialog.open(BudgetDialogComponent, {
      width: '400px',
      data: { householdId: this.user.householdId, expense }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.expenses = await this.budgetService.getExpenses(this.user.householdId);
      }
    });
  }

  async deleteExpense(expense: Expense) {
    if (confirm("Видалити витрату?")) {
      await this.budgetService.deleteExpense(expense.id);
      this.expenses = await this.budgetService.getExpenses(this.user.householdId);
    }
  }
}
