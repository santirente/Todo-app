import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  private _initPromise: Promise<void> | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init(): Promise<void> {
    if (this._initPromise) {
      return this._initPromise;
    }
    
    this._initPromise = this.storage.create().then((storage) => {
      this._storage = storage;
    });

    return this._initPromise;
  }

  public async set(key: string, value: any): Promise<void> {
    await this.init();
    await this._storage?.set(key, value);
  }

  public async get(key: string): Promise<any> {
    await this.init();
    return await this._storage?.get(key);
  }

  public async remove(key: string): Promise<void> {
    await this.init();
    await this._storage?.remove(key);
  }
}
