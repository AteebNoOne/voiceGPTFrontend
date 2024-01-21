import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://voicegpt-vfcj.onrender.com';

  constructor(private http: HttpClient, private router: Router) {}

  register(username: string, email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/register`;
    const body = { username, email, password };
    return this.http.post(url, body);
  }

  login(email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/login`;
    const body = { email, password };
    return this.http.post(url, body);
  }

  storeTokens(access_token: string, refresh_token: string, expires_in: number): void {
    const now = new Date();
    const expirationTime = now.getTime() + expires_in * 1000;

    localStorage.setItem('voiceGptAccessToken', access_token);
    localStorage.setItem('voiceGptRefreshToken', refresh_token);
    localStorage.setItem('voiceGptExpireTime', expirationTime.toString());
  }

  isAccessTokenExpired(): boolean {
    const expirationTime = localStorage.getItem('voiceGptExpireTime');
    if (!expirationTime) {
      return true; 
    }

    const now = new Date().getTime();
    return now > parseInt(expirationTime, 10);
  }

  refreshAccessToken(): Observable<any> {
    const refresh_token = localStorage.getItem('voiceGptRefreshToken');

    if (!refresh_token) {
      console.error('Refresh token not found.');
      this.router.navigate(['/login']);
      return new Observable(); 
    }

    const url = `${this.apiUrl}/refresh`;

    return this.http.post(url, { refresh_token });
  }

  getUserInfo(): Observable<any> {
    const url = `${this.apiUrl}/get_user_info`;
  
    const access_token = localStorage.getItem('voiceGptAccessToken');
    
    if (!access_token) {
      return throwError(() => new Error('Access token not found'));
    }

    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
  
    return this.http.get(url, { headers }).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  getResponse(filename: string): Observable<any> {
    const url = `${this.apiUrl}/generate_response?filename=${filename}`;
    
    const access_token = localStorage.getItem('voiceGptAccessToken');
    
    if (!access_token) {
      return throwError(() => new Error('Access token not found'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
    });
  
    return this.http.get(url, { headers }).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  uploadAudio(formData: FormData): Observable<any> {
    const url = `${this.apiUrl}/upload_audio`;
    return this.http.post(url, formData);
  }

  getUserMessages(): Observable<any> {
    const access_token = localStorage.getItem('voiceGptAccessToken');
  
    const url = `${this.apiUrl}/get_user_audio`;
  
    const headers = {
      'Authorization': `Bearer ${access_token}`
    };
  
    return this.http.get(url, { headers });
  }
  

  
  
}
