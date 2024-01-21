import { Component } from '@angular/core';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-loading-bar',
  template: '',
})
export class LoadingBarComponent {
  constructor(private loadingService: LoadingService) {}

  async presentLoading() {
    await this.loadingService.presentLoading();
  }
}
