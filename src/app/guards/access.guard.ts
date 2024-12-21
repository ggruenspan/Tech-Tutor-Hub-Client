import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AccessGuardService implements CanActivate {
  private isNavigatedProgrammatically = false;

  constructor(private route: Router, private toastr: ToastrService) {}

  allowNavigation(): void {
    this.isNavigatedProgrammatically = true;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.isNavigatedProgrammatically) {
      this.isNavigatedProgrammatically = false; // Reset the flag
      return true;
    }

    // Redirect to a safe page if navigation is not programmatic
    this.toastr.error('Access denied');
    this.route.navigate(['/']);
    return false;
  }
}
