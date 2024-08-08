import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { APIRoutesService } from '../services/apiRoutes.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ProtectedRouteGuardService implements CanActivate {

  constructor(private accountService: APIRoutesService, private route: Router, private toastr: ToastrService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.accountService.isAuthenticated()) {
        return true;
    } else {
        this.toastr.error("You must be signed in to access that page");
        this.route.navigate(['/sign-in']);
        return false;
    }
  }
}