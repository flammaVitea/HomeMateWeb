// src/app/features/planner/task-dialog/task-dialog.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

import { TaskService } from '../../../core/services/task-service';
import { FamilyService } from '../../../core/services/family';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  templateUrl: './task-dialog.html',
  styleUrls: ['./task-dialog.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
  ]
})
export class TaskDialogComponent {

  task: any = {
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignedTo: '',
    status: 'pending',
    recurrence: ''
  };

  members: any[] = [];

  priorities = ['low', 'medium', 'high'];

  constructor(
    private dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taskService: TaskService,
    private familyService: FamilyService
  ) {}

  async ngOnInit() {
    // Якщо передали існуюче завдання, заповнюємо форму
    if (this.data.task) {
      this.task = { ...this.data.task };
    }

    // Завантажуємо учасників домогосподарства
    this.members = await this.familyService.getMembers(this.data.householdId);
  }

  async save() {
    if (this.task.id) {
      // редагування існуючого
      await this.taskService.updateTask(this.task);
    } else {
      // створення нового
      this.task.id = crypto.randomUUID();
      this.task.householdId = this.data.householdId;
      await this.taskService.addTask(this.task);
    }

    this.dialogRef.close(true); // закриваємо діалог і повертаємо true для оновлення списку
  }

  close() {
    this.dialogRef.close();
  }
}
