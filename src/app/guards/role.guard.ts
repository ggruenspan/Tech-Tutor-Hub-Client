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
    const requiredRole = route.data['requiredRole'];
    const rolesNotAllowed = route.data?.['rolesNotAllowed'] || [];
    const tokenRole = this.dataService.getRoleFromData();

    if (tokenRole === requiredRole || !rolesNotAllowed.includes(tokenRole)) {
        return true; // Roles match, allow access
    } else {
        this.toastr.error('Access denied');
        this.route.navigate(['/']);
        return false; // Roles do not match, deny access
    }
}
}