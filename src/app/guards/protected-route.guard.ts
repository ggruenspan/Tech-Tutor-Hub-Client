import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthRoutesService } from '../services/authRoutes.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ProtectedRouteGuardService implements CanActivate {

  constructor(private authService: AuthRoutesService, private route: Router, private toastr: ToastrService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
        return true;
    } else {
        this.toastr.error("You must be signed in to access that page");
        this.route.navigate(['/sign-in']);
        return false;
    }
  }
}