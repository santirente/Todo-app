import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
  IonCheckbox, IonFab, IonFabButton, IonIcon, IonBadge, IonSegment, IonSegmentButton,
  AlertController
} from '@ionic/angular/standalone';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TaskService } from '../../core/services/task.service';
import { CategoryService } from '../../core/services/category.service';
import { RemoteConfigService } from '../../core/services/remote-config.service';
import { addIcons } from 'ionicons';
import { add, trash, create } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
    IonCheckbox, IonFab, IonFabButton, IonIcon, IonBadge, IonSegment, IonSegmentButton,
    ScrollingModule
  ],
})
export class HomePage {
  public taskService = inject(TaskService);
  public categoryService = inject(CategoryService);
  public remoteConfig = inject(RemoteConfigService);
  private alertController = inject(AlertController);

  public selectedCategoryId = signal<string | null>(null);

  public filteredTasks = computed(() => {
    const tasks = this.taskService.tasks();
    const catId = this.selectedCategoryId();
    if (!catId) return tasks;
    return tasks.filter(t => t.categoryId === catId);
  });

  constructor() {
    addIcons({ add, trash, create });
  }

  async toggleTask(task: any) {
    await this.taskService.updateTask({ ...task, completed: !task.completed });
  }

  async deleteTask(taskId: string) {
    await this.taskService.deleteTask(taskId);
  }

  async addTask() {
    const alert = await this.alertController.create({
      header: 'Nueva Tarea',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: '¿Qué vas a hacer?'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Agregar',
          handler: async (data) => {
            if (data.title && data.title.trim() !== '') {
              await this.taskService.addTask({
                title: data.title.trim(),
                completed: false,
                categoryId: this.selectedCategoryId() || undefined
              });
            }
          }
        }
      ]
    });

    await alert.present();
  }

  setCategory(event: any) {
    const val = event.detail.value;
    this.selectedCategoryId.set(val === 'all' ? null : val);
  }

  getCategoryColor(categoryId?: string) {
    if (!categoryId) return 'medium';
    const cat = this.categoryService.categories().find(c => c.id === categoryId);
    return cat ? cat.color : 'medium';
  }
}
