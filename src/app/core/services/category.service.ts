import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Category } from '../models/todo.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private _categories = new BehaviorSubject<Category[]>([]);
  public categories$ = this._categories.asObservable();
  private readonly STORAGE_KEY = 'categories';

  constructor(private storageService: StorageService) {
    this.loadCategories();
  }

  async loadCategories() {
    let categories = await this.storageService.get(this.STORAGE_KEY);
    if (!categories || categories.length === 0) {
      // Default categories
      categories = [
        { id: '1', name: 'Work', color: 'primary' },
        { id: '2', name: 'Personal', color: 'secondary' }
      ];
      await this.storageService.set(this.STORAGE_KEY, categories);
    }
    this._categories.next(categories);
  }

  async addCategory(name: string, color: string) {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name,
      color
    };
    const updatedCategories = [...this._categories.getValue(), newCategory];
    this._categories.next(updatedCategories);
    await this.storageService.set(this.STORAGE_KEY, updatedCategories);
  }

  async updateCategory(updatedCategory: Category) {
    const currentCategories = this._categories.getValue();
    const index = currentCategories.findIndex(c => c.id === updatedCategory.id);
    if (index > -1) {
      currentCategories[index] = updatedCategory;
      this._categories.next([...currentCategories]);
      await this.storageService.set(this.STORAGE_KEY, currentCategories);
    }
  }

  async deleteCategory(categoryId: string) {
    const updatedCategories = this._categories.getValue().filter(c => c.id !== categoryId);
    this._categories.next(updatedCategories);
    await this.storageService.set(this.STORAGE_KEY, updatedCategories);
  }
}
