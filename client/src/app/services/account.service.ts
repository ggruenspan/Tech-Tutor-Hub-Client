import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AccountService {
  baseUrl = "http://localhost:8080/userAPI";

  constructor(private http: HttpClient) {}

  // Method for sending a sign-up request to the API
  signUp(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/sign-up`, data);
  }

  // Method for sending a sign-in request to the API
  signIn(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/sign-in`, data);
  }

  // Method for getting the authenticate request from the API
  authenticate() {
    return this.http.get(`${this.baseUrl}/authenticate`);
  }

}
