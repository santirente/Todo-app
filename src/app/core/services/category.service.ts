import { Injectable, signal } from '@angular/core';
import { Category } from '../models/todo.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private _categories = signal<Category[]>([]);
  public categories = this._categories.asReadonly();
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
    this._categories.set(categories);
  }

  async addCategory(name: string, color: string) {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name,
      color
    };
    this._categories.update(cats => [...cats, newCategory]);
    await this.storageService.set(this.STORAGE_KEY, this._categories());
  }

  async updateCategory(updatedCategory: Category) {
    this._categories.update(cats => {
      const index = cats.findIndex(c => c.id === updatedCategory.id);
      if (index > -1) {
        const newCats = [...cats];
        newCats[index] = updatedCategory;
        return newCats;
      }
      return cats;
    });
    await this.storageService.set(this.STORAGE_KEY, this._categories());
  }

  async deleteCategory(categoryId: string) {
    this._categories.update(cats => cats.filter(c => c.id !== categoryId));
    await this.storageService.set(this.STORAGE_KEY, this._categories());
  }
}
