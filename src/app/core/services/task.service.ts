import { Injectable, signal } from '@angular/core';
import { Task } from '../models/todo.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private _tasks = signal<Task[]>([]);
  public tasks = this._tasks.asReadonly();
  private readonly STORAGE_KEY = 'tasks';

  constructor(private storageService: StorageService) {
    this.loadTasks();
  }

  async loadTasks() {
    const tasks = await this.storageService.get(this.STORAGE_KEY) || [];
    this._tasks.set(tasks);
  }

  async addTask(task: Omit<Task, 'id' | 'createdAt'>) {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: Date.now()
    };
    this._tasks.update(tasks => [newTask, ...tasks]);
    await this.storageService.set(this.STORAGE_KEY, this._tasks());
  }

  async updateTask(updatedTask: Task) {
    this._tasks.update(tasks => {
      const index = tasks.findIndex(t => t.id === updatedTask.id);
      if (index > -1) {
        const newTasks = [...tasks];
        newTasks[index] = updatedTask;
        return newTasks;
      }
      return tasks;
    });
    await this.storageService.set(this.STORAGE_KEY, this._tasks());
  }

  async deleteTask(taskId: string) {
    this._tasks.update(tasks => tasks.filter(t => t.id !== taskId));
    await this.storageService.set(this.STORAGE_KEY, this._tasks());
  }
}
