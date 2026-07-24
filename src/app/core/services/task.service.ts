import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../models/todo.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private _tasks = new BehaviorSubject<Task[]>([]);
  public tasks$ = this._tasks.asObservable();
  private readonly STORAGE_KEY = 'tasks';

  constructor(private storageService: StorageService) {
    this.loadTasks();
  }

  async loadTasks() {
    const tasks = await this.storageService.get(this.STORAGE_KEY) || [];
    this._tasks.next(tasks);
  }

  async addTask(task: Omit<Task, 'id' | 'createdAt'>) {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: Date.now()
    };
    const updatedTasks = [newTask, ...this._tasks.getValue()];
    this._tasks.next(updatedTasks);
    await this.storageService.set(this.STORAGE_KEY, updatedTasks);
  }

  async updateTask(updatedTask: Task) {
    const currentTasks = this._tasks.getValue();
    const index = currentTasks.findIndex(t => t.id === updatedTask.id);
    if (index > -1) {
      currentTasks[index] = updatedTask;
      this._tasks.next([...currentTasks]);
      await this.storageService.set(this.STORAGE_KEY, currentTasks);
    }
  }

  async deleteTask(taskId: string) {
    const updatedTasks = this._tasks.getValue().filter(t => t.id !== taskId);
    this._tasks.next(updatedTasks);
    await this.storageService.set(this.STORAGE_KEY, updatedTasks);
  }
}
