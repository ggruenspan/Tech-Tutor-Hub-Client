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
  decodedToken(token?: any): any {
    const data = token? token.token : this.getToken();
    const helper = new JwtHelperService();
    return data ? helper.decodeToken(data) : null;
  }

  getRoleFromData(): string {
    const data = this.decodedToken();
    // Determine the role based on the presence of 'Tutor' and 'Admin'
    return data?.role
    ? data.role.includes('Admin') && data.role.includes('Tutor')
        ? 'Admin/Tutor'
        : data.role.includes('Admin')
            ? 'Admin'
            : data.role.includes('Tutor')
                ? 'Tutor'
                : ''
    : 'User'; // Default case when data.role is null or undefined
  }

  // Clears all data from local storage
  clearData() {
    localStorage.clear();
  }
}
