import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


import { BudgetService, Expense } from '../../../core/services/budget-service';

@Component({
  selector: 'app-budget-dialog',
  standalone: true,
  templateUrl: './budget-dialog.html',
  imports: [CommonModule, FormsModule]
})
export class BudgetDialogComponent {

  expense: Expense = {
    id: '',
    amount: 0,
    category: '',
    date: '',
    note: '',
    householdId: ''
  };

  constructor(
    private dialogRef: MatDialogRef<BudgetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private budgetService: BudgetService
  ) {
    if (data.expense) {
      this.expense = { ...data.expense };
    }
    this.expense.householdId = data.householdId;
  }

  async save() {
    if (this.expense.id) {
      await this.budgetService.updateExpense(this.expense);
    } else {
      this.expense.id = crypto.randomUUID();
      await this.budgetService.addExpense(this.expense);
    }

    this.dialogRef.close(true);
  }

  close() {
    this.dialogRef.close();
  }
}
