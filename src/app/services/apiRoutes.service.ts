import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HandleDataService } from '../services/handleData.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class APIRoutesService {
  baseUrl = "http://localhost:8080";
  private userProfileSubject: BehaviorSubject<any>;
  public userProfile: Observable<any>;

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService, private dataService: HandleDataService) {
    this.userProfileSubject = new BehaviorSubject<any>(null);
    this.userProfile = this.userProfileSubject.asObservable();
  }

  // Method for sending a sign-up request to the API
  signUp(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/sign-up`, data);
  }

  // Method for sending a sign-in request to the API
  signIn(data: any): Observable<any> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/sign-in`, data).pipe(
      map(response => {
        localStorage.setItem('jwt', response.token);
        localStorage.setItem('session', 'true');
        return response;
      })
    );
  }

  // Method for getting the users datafrom the API
  getUserData(): Observable<any> {
    return this.http.get<{ token: string }>(`${this.baseUrl}/get-user-profile`).pipe(
      map(response => {
        localStorage.setItem('jwt', response.token);
        this.userProfileSubject.next(response);
      })
    );
  }

  // Method for getting the authenticate request from the API
  isAuthenticated() {
    const token = localStorage.getItem('jwt');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }
    localStorage.removeItem('jwt');
    return false;
  }

  // Method for sending a forgot-password request to the API
  forgotPassword(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/forgot-password`, data);
  }

  // Method for sending a reset-password request to the API
  resetPassword(token: any, data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/reset-password/${token}`, data);
  }

  // Method for updating the users profile
  updateUserProfile(data: any): Observable<any> {
    // return this.http.post<any>(`${this.baseUrl}/update-user-profile`, data);
    return this.http.post<{ token: string }>(`${this.baseUrl}/update-user-profile`, data).pipe(
      map(response => {
        response.token && localStorage.setItem('jwt', response.token);
        return response;
      })
    );
  }

  // Method for updating the user's profile picture
  uploadProfilePicture(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/upload-profile-picture`, data);
  }
}
