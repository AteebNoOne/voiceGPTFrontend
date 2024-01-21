import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: 'register.page.html',
  styleUrls: ['register.page.scss'],
})
export class RegisterPage implements OnInit{
  username: string;
  email: string;
  password: string;
  reTypePassword: string;
  error: string;
  username_error: string;
  email_error: string;
  password_error: string;
  reTypePassword_error: string;


  ngOnInit(): void {
      if(localStorage.getItem("voiceGptAccessToken")){
        this.router.navigate(['/home']);
      }
  }

  constructor(private userService: UserService,private router : Router) {
    this.username = '';
    this.email = '';
    this.password = '';
    this.reTypePassword = '';
    this.error = '';
    this.username_error = '';
    this.email_error = '';
    this.password_error = '';
    this.reTypePassword_error = '';
  }

  resetErrors() {
    this.error = '';
    this.username_error = '';
    this.email_error = '';
    this.password_error = '';
    this.reTypePassword_error = '';
  }

  onRegisterClick() {
    this.resetErrors();

    if (!this.username && !this.email && !this.password) {
      this.error = 'All fields are required!';
    }
    else if (!this.username) {
      this.username_error = 'Username is required';
    }
    else if (!this.email) {
      this.email_error = 'Email is required.';
    }
    else if (!this.password) {
      this.password_error = 'Password is required.';
    } 
    else if (this.password.length < 6) {
      this.password_error = 'Password must be at least 6 characters long.';
    } 
    else if (this.password !== this.reTypePassword) {
      this.password_error = 'Password is not the same';
    } 
    else{
      this.registerUser();
    }


  }

  registerUser() {
    this.userService
      .register(this.username,this.email, this.password)
      .subscribe({
        next: (response) => {
          this.username = "";
          this.email = "";
          this.password = "";
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.error = error.error.message;
        },
      });
  }

}
