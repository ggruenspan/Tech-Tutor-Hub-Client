import { Injectable } from '@angular/core';
import { LocalStorageService } from './localStorage.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class HandleDataService {

  constructor(private storageService: LocalStorageService) { }

  // Method to set user data in local storage based on the decoded JWT token
  public setData () {
    try {
      const token = this.storageService.get('jwtToken');
      const helper = new JwtHelperService();
      if (token) {
        const decodedToken = helper.decodeToken(token);
          // Check if the token is not expired (within the next hour)
          if (decodedToken.exp * 1000 > (Date.now()+ (60 * 60 * 1000))) {
            this.storageService.set('session', 'true');
            // Checks for the user roles
            this.storageService.set('role', decodedToken.role[0]);
            if (decodedToken.role.includes('Tutor')) {
              // this.storageService.set('isTutor', 'true');
              this.storageService.set('role', "Tutor");
            }
            this.storageService.set('userName', decodedToken.userName);
            this.storageService.set('email', decodedToken.email);
            this.storageService.set('firstName', decodedToken.firstName);
            this.storageService.set('lastName', decodedToken.lastName);
            this.storageService.set('phone', decodedToken.phone);
            this.storageService.set('dof', decodedToken.dof);
          } else {
            this.removeData ();
          }
      }
    } catch (error) {
        console.error('Error decoding token:', error);
    }
  }

  // Method to clear all data from local storage
  public removeData () {
    localStorage.clear();
  }
}
