import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { UserMessageService } from '../components/user-message.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  username: string;
  loading:boolean = false;
  showContent: boolean = false;
  formData = new FormData();
  alertType: 'success' | 'error' = 'success';
  alertMessage: string = '';
  private idleTimeout: any;

  jsonData = {
    chat: [
      { type: '',audio: '' },
    ],
  };

  constructor(
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private userMessageService: UserMessageService
  ) {
    this.username = '';
  }


  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.validateToken();
      });

    this.startIdleTimeout();
  }

  validateToken() {
    if (this.userService.isAccessTokenExpired()) {
      this.refreshToken();
    } else {
      this.resetIdleTimeout();
      this.getUserInfo();
      this.showContent = true;
    }
  }

  refreshToken() {
    this.userService.refreshAccessToken().subscribe({
      next: (response) => {
        this.resetIdleTimeout();
        this.showContent = true;
      },
      error: (error) => {
        this.router.navigate(['/login']);
      },
    });
  }

  getUserInfo() {
    this.userService.getUserInfo().subscribe({
      next: (response) => {
        this.username = response.username;
      },
      error: (error) => {
      },
    });
  }

  async onAudioRecorded(recordedBlob: Blob) {
    const blobUrl = URL.createObjectURL(recordedBlob);

    try {
      const arrayBuffer = await this.blobToBuffer(blobUrl);
      this.uploadAudio(arrayBuffer);
    } catch (error) {
      console.error('Error converting blob to buffer:', error);
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  }

  uploadAudio(arrayBuffer: ArrayBuffer) {
    this.loading = true;
    this.formData = new FormData();
    const currentDateAndTime = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `message_${currentDateAndTime}.wav`;
  
    this.formData.append('file', new Blob([arrayBuffer]), fileName);
    this.formData.append('username', this.username);
  
    this.userService.uploadAudio(this.formData).subscribe({
      next: (response) => {
        this.userService.getResponse(fileName).subscribe({
          next: (response) => {
            this.userMessageService.getUserMessages();
            this.loading = false;
          },
          error: (error) => {
            console.error('Error generating response:', error);
            this.loading = false;
          },
        });
      },
      error: (error) => {
        console.error('Error uploading audio:', error);
        this.loading = false;
      },
    });
  }
  
  

  blobToBuffer(blobUrl: string): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      fetch(blobUrl)
        .then((response) => {
          if (!response.ok) {
            reject(
              new Error(
                `Failed to fetch blob: ${response.status} - ${response.statusText}`
              )
            );
            return;
          }
          return response.arrayBuffer();
        })
        .then((arrayBuffer) => {
          if (arrayBuffer) {
            resolve(arrayBuffer);
          } else {
            reject(new Error('ArrayBuffer is undefined.'));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  resetIdleTimeout() {
    // Clear the existing timeout and start a new one
    clearTimeout(this.idleTimeout);
    this.startIdleTimeout();
  }

  startIdleTimeout() {
    // Set an idle timeout (e.g., 15 minutes) to automatically log out the user
    const idleTime = 15 * 60 * 1000; // 15 minutes in milliseconds
    this.idleTimeout = setTimeout(() => {
      
      this.router.navigate(['/login']);
    }, idleTime);
  }

  showSuccessAlert() {
    this.alertType = 'success';
    this.alertMessage = 'Audio sent, wait for response!';
    this.cdr.detectChanges();
  }

  logoutFunction() {
    localStorage.clear();
    window.location.reload();
  }


}
