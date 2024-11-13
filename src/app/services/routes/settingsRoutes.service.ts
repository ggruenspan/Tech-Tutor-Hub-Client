import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SettingsRoutesService {
  baseUrl = "https://localhost:8080";
  private userProfileSubject: BehaviorSubject<any>;
  public userProfile: Observable<any>;

  constructor(private http: HttpClient) {
    this.userProfileSubject = new BehaviorSubject<any>(null);
    this.userProfile = this.userProfileSubject.asObservable();
  }

  // ----------------------------------------- Public Profile Page Start -------------------------------------------------------

  // Method for getting the users profile data from the API
  getPublicProfile(): Observable<any> {
    return this.http.get<{ token: string }>(`${this.baseUrl}/get-public-profile`)
  }

  // Method for updating the users profile
  updatePublicProfile(data: any): Observable<any> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/update-public-profile`, data)
  }

  // Method for updating the user's profile picture
  uploadProfilePicture(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/upload-profile-picture`, data);
  }

  // ----------------------------------------- Public Profile Page End -------------------------------------------------------
}
