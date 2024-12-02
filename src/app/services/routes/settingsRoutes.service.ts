import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SettingsRoutesService {
  baseUrl = "https://localhost:8080";

  constructor(private http: HttpClient) {}

  // ----------------------------------------- Public Profile Page Start -------------------------------------------------------

  // Method for getting the users profile data from the API
  getPublicProfile(): Observable<any> {
    return this.http.get<{ token: string }>(`${this.baseUrl}/get-public-profile`)
  }

  // Method for updating the users profile
  updatePublicProfile(data: any): Observable<any> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/update-public-profile`, data)
  }

  // Method for removing a user projects
  removePublicProfileProject(projectId: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/remove-profile-project/${projectId}`);
  }

  // Method for getting the user profile image
  getProfileImage(): Observable<any> {
    return this.http.get<{ image: { data: string, contentType: string } }>(`${this.baseUrl}/get-profile-image`).pipe(
        map(response => {
          const profileImage = `data:${response.image.contentType};base64,${response.image.data}`;
          localStorage.setItem('profileImage', profileImage);
          return response;
        })
    );
  }

  // Method for updating the user's profile picture
  uploadProfilePicture(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/upload-profile-picture`, data);
  }

  // Method for removing a users profile image
  removeProfileImage(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/remove-profile-image`);
  }

  // ----------------------------------------- Public Profile Page End -------------------------------------------------------
}
