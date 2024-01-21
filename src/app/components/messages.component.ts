import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
import { UserMessageService } from './user-message.service';

@Component({
  selector: 'app-messages',
  template: `
    <div class="messages" #messagesContainer>
      <div
        *ngFor="let entry of chatData"
        [ngClass]="{
          'message-right': entry.type === 'message',
          'message-left': entry.type === 'response'
        }"
      >
        <div class="message-container">
          <div *ngIf="entry.type === 'message'" class="you-label">
            {{ username }}
          </div>
          <div *ngIf="entry.type === 'response'" class="gpt-label">
            VoiceGPT
          </div>
          <audio *ngIf="entry.audio" [src]="entry.audio" controls></audio>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .messages {
        display: flex;
        flex-direction: column-reverse;
        width: 100%; /* Adjust the maximum width as needed */
        margin: auto; /* Center the container */
        border: 1px solid #ccc;
        padding: 10px;
        overflow-y: auto; /* Add vertical scrollbar when needed */
        /* WebKit-specific CSS */
        scroll-snap-type: y mandatory;
        overflow-anchor: none;
      }

      .message-container {
        margin-top: 30px;
        position: relative;
      }

      .message-right {
        height: 100px;
        text-align: right;
        margin-left: auto;
        background-color: #e1ffe1;
        padding: -20px;
        margin-bottom: 5px;
        border-radius: 5px;
      }

      .message-left {
        text-align: left;
        margin-right: auto;
        background-color: #e1ffe1;
        padding: 5px;
        margin-bottom: 5px;
        border-radius: 5px;
      }

      .you-label {
        position: absolute;
        top: -20px;
        right: 5px;
        font-weight: bold;
      }

      .gpt-label {
        position: absolute;
        top: -20px;
        left: 5px;
        font-weight: bold;
      }
    `,
  ],
})
export class MessagesComponent implements OnInit {
  @Input() chatData: { type: string; audio: string; username?: string }[] = [];
  @Input() username: string = '';
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  constructor(private userService: UserService,private userMessageService : UserMessageService) {}

  ngOnInit() {
    this.getUserMessages();
    this.userMessageService.getRefreshObservable().subscribe((refreshed) => {
      if (refreshed) {
        this.getUserMessages();
      }
    });
  }


  getUserMessages() {
    this.userService.getUserMessages().subscribe({
      next: (response: any[]) => {
        this.chatData = response.map((item: any) => ({
          type: item.type,
          audio: item.audio,
          username: item.username,
          
        }));
      },
      error: (error) => {},
    });
  }

  
  
}

