import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { AudioInputBarComponent } from '../components/audio-input-bar.component';
import { MessagesComponent } from '../components/messages.component';
import { AlertComponent } from '../components/alert.component';
import { HomePageRoutingModule } from './home-routing.module';

@NgModule({
  
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage,AudioInputBarComponent,MessagesComponent,AlertComponent],
})
export class HomePageModule {}
