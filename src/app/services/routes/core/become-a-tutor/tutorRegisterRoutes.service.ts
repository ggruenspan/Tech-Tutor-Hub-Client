import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TutorRegisterRoutes {
  baseUrl = "https://localhost:8080";

  constructor(private http: HttpClient) {}

  checkUserByEmail(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/check-user-by-email`, data);
  }
}
 