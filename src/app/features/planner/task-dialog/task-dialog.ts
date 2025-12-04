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

import { TaskService, Task } from '../../../core/services/task-service';
import { FamilyService } from '../../../core/services/family';


@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatIconModule],
  templateUrl: './task-dialog.html',
  styleUrls: ['./task-dialog.scss']
})
export class TaskDialogComponent {

  members: any[] = [];

  task: Task = {
    id: '',
    title: '',
    description: '',
    priority: '',
    dueDate: '',
    assignedTo: '',
    status: 'pending',
    recurrence: null,
    householdId: ''
  };

  constructor(
    private dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taskService: TaskService,
    private familyService: FamilyService
  ) {}

  async ngOnInit() {
    this.members = await this.familyService.getMembers(this.data.householdId);

    // Якщо редагування – підставляємо дані
    if (this.data.task) {
      this.task = { ...this.data.task };
    }
  }

  async save() {
    this.task.householdId = this.data.householdId.toString();

    if (!this.task.id) {
      this.task.id = crypto.randomUUID();
      await this.taskService.addTask(this.task);
    } else {
      await this.taskService.updateTask(this.task);
    }

    this.dialogRef.close(true);
  }

  close() {
    this.dialogRef.close();
  }
}