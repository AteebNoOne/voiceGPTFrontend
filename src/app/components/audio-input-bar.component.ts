import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-audio-input-bar',
  template: `
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button [class]="isRecording ? 'recording-btn' : 'start-btn'" (click)="toggleRecording()">
        {{
          isRecording
            ? (isMobile ? 'Stop' : 'Stop Recording')
            : (isMobile ? 'Record' : 'Start Recording')
        }}
        </ion-button>
      </ion-buttons>
      
      <div class="audio-container" *ngIf="audioSrc">
        <audio #audioPlayer [src]="audioSrc" controls></audio>
      </div>

      <ion-buttons slot="end">
        <ion-button (click)="sendAudioMessage()" [disabled]="!audioSrc || isRecording">
          Send
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  `,
  styles: [
    `
        ion-toolbar{
            display:flex;
           --background: #40cfa2;
            height:80px;
            border:3px solid #102921;
            border-radius:20px;
        }
      .recording-btn {
        border-radius: 10px;
        background-color: red;
        color:black;
      }

      .start-btn {
        border-radius: 10px;
        background-color: green;
        color:black;
      }

      .audio-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width:100%;
      }
      @media only screen and (max-width: 767px) { 
        ion-button {
          font-size: 14px; /* Adjust font size */
          padding: 1px 2px; /* Adjust padding */
        }
        .audio-container {
          width:70%;
          display:flex;
          margin-left:auto;
          margin-right:auto;
          padding: 1px;
          background-color: #f0f0f0;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .audio-container audio {
          width: 100%; 
        }
      }
    `,
  ],
})
export class AudioInputBarComponent {

  constructor(private cdr: ChangeDetectorRef) {}

  @Output() audioRecorded = new EventEmitter<Blob>();
  @ViewChild('audioPlayer') audioPlayer!: ElementRef;
  
  audioMessage: string = '';
  isRecording: boolean = false;
  mediaRecorder: any; 
  chunks: Blob[] = [];
  audioSrc: string = '';
  recordedBlob : any = '';
  isMobile = window.innerWidth <= 767;

  async toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      await this.startRecording();
    }
    this.isRecording = !this.isRecording;
  }

  async startRecording() {

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream);

    this.mediaRecorder.ondataavailable = (event: any) => {
      if (event.data.size > 0) {
        this.chunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      this.recordedBlob = new Blob(this.chunks, { type: 'audio/wav' });
      this.audioSrc = URL.createObjectURL(this.recordedBlob);
      this.cdr.detectChanges();
      this.chunks = [];
    };

    this.mediaRecorder.start();
  }

  stopRecording() {
    this.mediaRecorder.stop();
  }


  sendAudioMessage() {
    this.audioRecorded.emit(this.recordedBlob);
    this.chunks = [];
    this.audioSrc = '';
  }
}
