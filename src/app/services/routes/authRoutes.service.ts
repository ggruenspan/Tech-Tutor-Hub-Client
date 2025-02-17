import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HandleDataService } from '../../services/handleData.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthRoutesService {
  baseUrl = "https://localhost:8080";

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService, private dataService: HandleDataService) {}

  // Method for sending a sign-up request to the API
  signUp(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/sign-up`, data);
  }

  // Method for sending a sign-in request to the API
  signIn(data: any): Observable<any> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/sign-in`, data).pipe(
      map(response => {
        localStorage.setItem('jwt', response.token);
        localStorage.setItem('session', 'true');
        localStorage.setItem('role', this.dataService.getRoleFromData());
        return response;
      })
    );
  }

  // Method for sending a forgot-password request to the API
  forgotPassword(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/forgot-password`, data);
  }

  // Method for sending a reset-password request to the API
  resetPassword(token: any, data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/reset-password/${token}`, data);
  }

  // Method for getting the authenticate request from the API
  isAuthenticated() {
    const token = localStorage.getItem('jwt');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return this.http.get(`${this.baseUrl}/verify-user`).subscribe((response) => {
        return true;
      }, () => {
        this.dataService.clearData();
        return false;
      });
    }
    this.dataService.clearData();
    return false;
  }

  // Method for sending a verify request to the API
  verifyEmail(token: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/verify-email/${token}`);
  }
}