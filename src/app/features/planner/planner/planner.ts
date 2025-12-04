import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { TaskService, Task } from '../../../core/services/task-service';
import { FamilyService } from '../../../core/services/family';
import { TaskDialogComponent } from '../task-dialog/task-dialog';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './planner.html',
  styleUrls: ['./planner.scss']
})
export class TaskComponent implements OnInit {
  user = JSON.parse(localStorage.getItem('user') || '{}');
  household: any;
  familyMembers: { id: string; name: string }[] = [];
  tasks: Task[] = [];
  displayedColumns = ['title', 'dueDate', 'assignedTo', 'status', 'actions'];

  constructor(
    private taskService: TaskService,
    private familyService: FamilyService,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    const householdId = this.user.householdId;

    this.household = await this.familyService.getHousehold(Number(householdId));
    this.familyMembers = await this.familyService.getMembers(Number(householdId));
    this.tasks = await this.taskService.getTasks(householdId);
  }

  get isOwner(): boolean {
    return this.user.id?.toString() === this.household?.ownerId?.toString();
  }

  getAssignedName(id: string): string {
    return this.familyMembers.find(m => m.id.toString() === id.toString())?.name || '-';
  }

  openTaskDialog(task?: Task) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
      data: { householdId: this.user.householdId, task }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.tasks = await this.taskService.getTasks(this.user.householdId);
      }
    });
  }

  async deleteTask(task: Task) {
    if (confirm('Видалити завдання?')) {
      await this.taskService.deleteTask(task.id);
      this.tasks = await this.taskService.getTasks(this.user.householdId);
    }
  }
}
