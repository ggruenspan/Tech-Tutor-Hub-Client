import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { HandleDataService } from '../services/handleData.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {

  constructor(private dataService: HandleDataService, private route: Router, private toastr: ToastrService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const requiredRole = route.data['requiredRole']; // Accessing route data
    const localStorageRole = localStorage.getItem('role');
    const tokenRole = this.getRoleFromToken(this.dataService.getDecodedToken());

    if (tokenRole.includes(requiredRole) && localStorageRole?.includes(requiredRole)) {
      return true; // Roles match, allow access
    } else {
      this.toastr.error('Access denied');
      setTimeout(() => {
        this.route.navigate(['/']);
      }, 1500);
      return false; // Roles do not match, deny access
    }
  }

  private getRoleFromToken(token: any): string {
    // Determine the role based on the presence of 'Tutor' and 'Admin'
    return token.role.includes('Admin') && token.role.includes('Tutor')
      ? 'Admin/Tutor'
      : token.role.includes('Admin')
      ? 'Admin'
      : token.role.includes('Tutor')
      ? 'Tutor'
      : 'User';
  }
}