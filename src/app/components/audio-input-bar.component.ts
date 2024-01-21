import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-audio-input-bar',
  template: `
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button [class]="isRecording ? 'recording-btn' : 'start-btn'" (click)="toggleRecording()">
          {{ isRecording ? 'Stop Recording' : 'Start Recording' }}
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
