import { Injectable } from '@angular/core';
import { LocalStorageService } from './localStorage.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class HandleDataService {

  constructor(private storageService: LocalStorageService) { }

  // Helper method to set storage values
  setStorage(key: string, value: any) {
    this.storageService.set(key, value === undefined ? '' : value);
  }

  // Method to set user data in local storage based on the decoded JWT token
  setData () {
    try {
      const token = this.storageService.get('jwtToken');
      const helper = new JwtHelperService();
      if (token) {
        const decodedToken = helper.decodeToken(token);
          // Check if the token is not expired (within the next hour)
          if (decodedToken.exp * 1000 > (Date.now()+ (60 * 60 * 1000))) {
            this.setStorage('session', 'true');
            this.setStorage('id', decodedToken.id);
    
            // Set user roles
            const userRole = decodedToken.role.includes('Tutor') ? 'Tutor' : decodedToken.role[0];
            this.setStorage('role', userRole);
    
            // Set user information
            this.setStorage('userName', decodedToken.userName);
            this.setStorage('email', decodedToken.email);
            this.setStorage('firstName', decodedToken.firstName);
            this.setStorage('lastName', decodedToken.lastName);
            this.setStorage('phoneNumber', decodedToken.phoneNumber);
            this.setStorage('dateOfBirth', decodedToken.dateOfBirth);
            this.setStorage('country', decodedToken.country);
            this.setStorage('stateProvince', decodedToken.stateProvince);
            this.setStorage('city', decodedToken.city);
            this.setStorage('bio', decodedToken.bio);
            this.setStorage('pronouns', decodedToken.pronouns);
          } else {
            this.removeData ();
          }
      }
    } catch (error) {
        console.error('Error decoding token:', error);
    }
  }

  // Method to clear all data from local storage
  removeData () {
    localStorage.clear();
  }
}
