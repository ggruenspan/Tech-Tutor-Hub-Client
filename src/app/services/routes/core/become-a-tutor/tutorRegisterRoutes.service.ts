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

  // Route for getting the languages
  getLanguages(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get-languages`);
  }

  // Route for uploading the verification video for the tutor
  upload(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/upload-verification-video`, data);
  }

  // Route for creating a new tutor profile for the user
  createNewTutor(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/create-new-tutor`, data);
  }

  // Route for getting the tutor testimonials
  getTestimonials(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get-testimonials`);
  }
}
 