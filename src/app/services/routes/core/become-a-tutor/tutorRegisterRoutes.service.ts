import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TutorRegisterRoutes {
  baseUrl = "https://localhost:8080";

  constructor(private http: HttpClient) {}

  // Method for checking if user exists by email before becoming a tutor
  checkUserByEmail(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/check-user-by-email`, data);
  }

  // Route for getting the subjects
  getSubjects(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get-subjects`);
  }

  getLanguages(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get-languages`);
  }
}
 