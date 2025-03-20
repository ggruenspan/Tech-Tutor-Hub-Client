import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserProfileRoutesService {
  baseUrl = "https://localhost:8080";

  constructor(private http: HttpClient) {}

  getUserProfile(userName: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${userName}`);
  }
}
 