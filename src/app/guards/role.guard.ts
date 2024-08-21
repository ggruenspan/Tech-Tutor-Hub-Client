import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { HandleDataService } from '../services/handleData.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {

  constructor(private dataService: HandleDataService, private route: Router, private toastr: ToastrService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRole = route.data['requiredRole']; // Accessing route data
    const localStorageRole = localStorage.getItem('role');
    const tokenRole = this.dataService.getRoleFromToken(this.dataService.getDecodedToken());

    console.log(localStorageRole);
    console.log(tokenRole);

    if (tokenRole.includes(requiredRole) && localStorageRole?.includes(requiredRole)) {
      return true; // Roles match, allow access
    } else {
      this.toastr.error('Access denied');
      this.route.navigate(['/']);
      return false; // Roles do not match, deny access
    }
  }
}