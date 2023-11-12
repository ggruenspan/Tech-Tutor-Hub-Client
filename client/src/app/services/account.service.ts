import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = "http://localhost:8080";

  constructor(private http: HttpClient) {}

  // Method for sending a sign-up request to the API
  signUp(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/sign-up`, data);
  }

  // Method for sending a sign-in request to the API
  signIn(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/sign-in`, data);
  }

  // Method for sending a sign-out request to the API
  signOut(): Observable<any> {
    return this.http.get(`${this.baseUrl}/sign-out`);
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
  authenticate() {
    return this.http.get(`${this.baseUrl}/authenticate`);
  }

}
