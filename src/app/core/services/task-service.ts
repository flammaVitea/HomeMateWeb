import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  assignedTo: string;
  status: string;
  recurrence: string | null;
  householdId: string;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private api = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient) {}

  getTasks(householdId: string) {
    return firstValueFrom(
      this.http.get<Task[]>(`${this.api}?householdId=${householdId}`)
    );
  }

  addTask(task: Task) {
    return firstValueFrom(
      this.http.post<Task>(this.api, task)
    );
  }

  updateTask(task: Task) {
    return firstValueFrom(
      this.http.put<Task>(`${this.api}/${task.id}`, task)
    );
  }

  deleteTask(id: string) {
    return firstValueFrom(
      this.http.delete(`${this.api}/${id}`)
    );
  }
}
