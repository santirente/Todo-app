import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getRemoteConfig, fetchAndActivate, getValue } from 'firebase/remote-config';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({ providedIn: 'root' })
export class RemoteConfigService {
  private remoteConfig: any;
  public categoryFilterEnabled$ = new BehaviorSubject<boolean>(true);
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
      this.categoryFilterEnabled$.next(isEnabled);
    } catch (err) {
      console.error('Error cargando Remote Config:', err);
    }
  }
}