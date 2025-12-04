import { Injectable } from '@angular/core';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignedTo: string;
  status: 'pending' | 'completed';
  recurrence: string | null;
  householdId: string;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private storageKey = 'tasks';

  constructor() {}

  private getAllTasks(): Task[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private saveAllTasks(tasks: Task[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
  }

  async getTasks(householdId: string): Promise<Task[]> {
    const tasks = this.getAllTasks();
    return tasks.filter(t => t.householdId === householdId);
  }

  async addTask(task: Task): Promise<void> {
    const tasks = this.getAllTasks();
    tasks.push(task);
    this.saveAllTasks(tasks);
  }

  async updateTask(task: Task): Promise<void> {
    let tasks = this.getAllTasks();
    tasks = tasks.map(t => t.id === task.id ? task : t);
    this.saveAllTasks(tasks);
  }

  async deleteTask(id: string): Promise<void> {
    let tasks = this.getAllTasks();
    tasks = tasks.filter(t => t.id !== id);
    this.saveAllTasks(tasks);
  }
}
