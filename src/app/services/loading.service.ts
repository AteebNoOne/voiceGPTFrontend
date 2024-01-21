// loading.service.ts

import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loading: HTMLIonLoadingElement | undefined;

  constructor(private loadingController: LoadingController) {}

  async presentLoading() {
    this.loading = await this.loadingController.create({
      spinner: 'circular',
      message: 'Loading...',
      translucent: true,
      cssClass: 'custom-loading',
      duration: 5000, // Set a duration or remove it for infinite loading
    });

    await this.loading.present();
  }

  async dismissLoading() {
    if (this.loading) {
      await this.loading.dismiss();
    }
  }
}
