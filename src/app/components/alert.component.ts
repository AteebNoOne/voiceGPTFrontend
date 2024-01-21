import { Component, Input } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
@Component({
  selector: 'app-alert',
  template: `
    <div *ngIf="message" class="alert" [ngClass]="{'success': type === 'success', 'error': type === 'error'}">
      <span class="close-btn" (click)="closeAlert()">&times;</span>
      <p>{{ message }}</p>
    </div>
  `,
  styles: [
    `
      .alert {
        padding: 15px;
        margin-bottom: 20px;
        border: 1px solid;
        border-radius: 4px;
        cursor: pointer;
      }

      .success {
        background-color: #d4edda;
        color: #155724;
        border-color: #c3e6cb;
      }

      .error {
        background-color: #f8d7da;
        color: #721c24;
        border-color: #f5c6cb;
      }

      .close-btn {
        float: right;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  @Input() type: 'success' | 'error' = 'success';
  @Input() message: string = '';

  closeAlert() {
    this.message = '';
  }
}
