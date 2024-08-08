import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { APIRoutesService } from '../services/apiRoutes.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private accountService: APIRoutesService, private route: Router, private toastr: ToastrService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.accountService.isAuthenticated()) {
        this.toastr.error("You are already signed in");
        this.route.navigate(['/']);
        return false;
    } else {
        return true;
    }
  }
  
}