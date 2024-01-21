import { Component ,OnInit} from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage implements OnInit{
  email: string;
  password: string;
  error: string;
  password_error: string;
  email_error: string;
  loading:boolean = false;

  ngOnInit() {
    this.validateToken();
  }

  
  constructor(private userService: UserService, private router: Router) {
    this.error = "";
    this.password_error = "";
    this.email_error = "";
    this.email = '';
    this.password = '';
  }


  onLoginClick() {
    this.error = "";
    this.password_error = "";
    this.email_error = "";

    if (!this.email && !this.password) {
      this.error = "All fields are required!";
    }
    else if (!this.email) {
      this.email_error = "Email is required.";
    }
    else if (!this.password) {
      this.password_error = "Password is required.";
    } 
    else if (this.password.length < 6) {
      this.password_error = "Password must be at least 6 characters long.";
    }
    else{
      this.loginUser();
    }
  }

  loginUser() {
    this.loading = true;
    this.userService
      .login(this.email, this.password)
      .subscribe({
        next: (response) => {
          this.userService.storeTokens(response.access_token,response.refresh_token,900);
          this.email = "";
          this.password = "";
          this.router.navigate(['/home']);
          this.loading = false;
        },
        error: (error) => {
          this.error = error.error.message;
          this.loading = false;
        },
      });
  }
  validateToken() {
    if (this.userService.isAccessTokenExpired()) {
      this.refreshToken();
    } else {
      this.router.navigate(['/home']);
    }
  }

  refreshToken() {
    this.userService.refreshAccessToken().subscribe({
      next: (response) => {
        this.router.navigate(['/home']);
      },
      error: (error) => {
      },
    });
  }

}
