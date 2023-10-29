import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AccountService {
  baseUrl = "http://localhost:8080/api";

  constructor(private http: HttpClient) {}

  // Method for sending a sign-up request to the API
  signUp(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/sign-up`, data);
  }

  // Method for sending a sign-in request to the API
  signIn(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/sign-in`, data);
  }
}
