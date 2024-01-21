// user-message.service.ts
import { Injectable } from '@angular/core';
import { UserService } from '../services/user.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserMessageService {
  private refreshSubject = new BehaviorSubject<boolean>(false);

  constructor(private userService: UserService) {}

  getUserMessages() {
    this.userService.getUserMessages().subscribe({
      next: (response: any[]) => {
        // Process the response as needed
        this.refreshSubject.next(true);
      },
      error: (error) => {
        this.refreshSubject.next(false);
      },
    });
  }

  getRefreshObservable() {
    return this.refreshSubject.asObservable();
  }
}
