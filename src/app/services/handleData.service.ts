import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class HandleDataService {
  
  // Retrieves the JWT token from local storage
  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  // Decodes the JWT token using JwtHelperService
  getDecodedToken(): any {
    const token = this.getToken();
    const helper = new JwtHelperService();
    return token ? helper.decodeToken(token) : null;
  }

  // Retrieves the user profile information by decoding the JWT token
  getUserProfile(): any {
    return this.getDecodedToken();
  }

  getRoleFromToken(token: any): string {
    // Determine the role based on the presence of 'Tutor' and 'Admin'
    return token.role.includes('Admin') && token.role.includes('Tutor')
      ? 'Admin/Tutor'
      : token.role.includes('Admin')
      ? 'Admin'
      : token.role.includes('Tutor')
      ? 'Tutor'
      : 'User';
  }

  // Clears all data from local storage
  clearData() {
    localStorage.clear();
  }
}
