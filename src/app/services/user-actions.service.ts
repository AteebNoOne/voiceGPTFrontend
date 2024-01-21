import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserActionsService {
  private userMessagesSubject = new BehaviorSubject<void>(undefined);

  userMessages$ = this.userMessagesSubject.asObservable();

  constructor(private userService: UserService) {}

  getUserMessages() {
    this.userService.getUserMessages().subscribe({
      next: (response: any[]) => {
        this.userMessagesSubject.next();
      },
      error: (error) => {},
    });
  }
}
