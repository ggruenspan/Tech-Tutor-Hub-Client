import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageRoutesService {
  baseUrl = "http://localhost:8080";

  constructor(private http: HttpClient) {}
  
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

  // Method for removing a users profile image
  removeProfileImage(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/remove-profile-image`);
  }
}