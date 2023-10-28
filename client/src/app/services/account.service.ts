import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AccountService {
  baseUrl = "http://localhost:8080/api";

  constructor(private http: HttpClient) {}

  signUp(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/sign-up`, data);
  }

  signIn(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/sign-in`, data);
  }
}
