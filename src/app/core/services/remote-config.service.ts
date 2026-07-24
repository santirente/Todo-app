import { Injectable, signal } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getRemoteConfig, fetchAndActivate, getValue } from 'firebase/remote-config';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class RemoteConfigService {
  private remoteConfig: any;
  private _categoryFilterEnabled = signal<boolean>(true);
  public categoryFilterEnabled = this._categoryFilterEnabled.asReadonly();

  constructor() {
    const app = initializeApp(environment.firebaseConfig);
    this.remoteConfig = getRemoteConfig(app);
    this.remoteConfig.settings.minimumFetchIntervalMillis = 10000; // 10 segundos para pruebas
    this.initRemoteConfig();
  }

  async initRemoteConfig() {
    try {
      await fetchAndActivate(this.remoteConfig);
      const isEnabled = getValue(this.remoteConfig, 'enable_category_filter').asBoolean();
      this._categoryFilterEnabled.set(isEnabled);
    } catch (err) {
      console.error('Error cargando Remote Config:', err);
    }
  }
}